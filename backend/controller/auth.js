const bcrypt = require("bcrypt");
const pool = require("../database/connection");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
const register = async (req, res) => {
  const client = await pool.connect();

  try {
    const { email, password, full_name, code } = req.body;

    // 1️⃣ Validation
    if (!email || !password || !full_name || !code) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await client.query("BEGIN");

    // 2️⃣ Check existing user
    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Email already exists" });
    }

    // 3️⃣ Lock and check activation code
    const codeResult = await client.query(
      "SELECT * FROM book_codes WHERE code = $1 FOR UPDATE",
      [code],
    );

    if (codeResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Invalid code" });
    }

    const bookCode = codeResult.rows[0];

    if (bookCode.is_used) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Code already used" });
    }

    if (!bookCode.allowed_role) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Invalid code role" });
    }

    const role = bookCode.allowed_role;

    // 4️⃣ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 5️⃣ Create user with role from code
    const insertedUser = await client.query(
      `INSERT INTO users (email, password, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role`,
      [email, passwordHash, full_name, role],
    );

    const user = insertedUser.rows[0];

    // 6️⃣ Insert user_books record
    await client.query(
      `
      INSERT INTO user_books
      (user_id, book_id, code_id, activated_at, expires_at)
      VALUES (
        $1,
        $2,
        $3,
        NOW(),
        NOW() + ($4 || ' months')::interval
      )
      `,
      [user.id, bookCode.book_id, bookCode.id, bookCode.validity_months],
    );

    // 7️⃣ Mark code as used
    await client.query(
      `
      UPDATE book_codes
      SET is_used = true,
          used_by = $1,
          used_at = NOW()
      WHERE id = $2
      `,
      [user.id, bookCode.id],
    );

    await client.query("COMMIT");
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2) Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // 3) Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4) Create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const me = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, email } = req.body;

    const existingUser = await pool.query("SELECT * FROM users WHERE id=$1", [
      userId,
    ]);

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        errors: { general: "User not found" },
      });
    }

    const user = existingUser.rows[0];

    // check duplicate email
    if (email) {
      const emailCheck = await pool.query(
        `SELECT id FROM users 
         WHERE email=$1 AND id != $2`,
        [email, userId],
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          errors: {
            email: "This email is already used",
          },
        });
      }
    }

    let avatarUrl = user.avatar_url;
    let avatarPublicId = user.avatar_public_id;

    if (req.file) {
      try {
        if (avatarPublicId) {
          await cloudinary.uploader.destroy(avatarPublicId);
        }

        const uploaded = await uploadToCloudinary(
          req.file.buffer,
          "users/avatar",
        );

        avatarUrl = uploaded.secure_url;
        avatarPublicId = uploaded.public_id;
      } catch (cloudinaryError) {
        if (cloudinaryError.message?.includes("File size")) {
          return res.status(400).json({
            errors: {
              avatar: "Image must be smaller than 10MB",
            },
          });
        }

        throw cloudinaryError;
      }
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        full_name = COALESCE($1, full_name),
        email = COALESCE($2, email),
        avatar_url = COALESCE($3, avatar_url),
        avatar_public_id = COALESCE($4, avatar_public_id),
        updated_at = NOW()
      WHERE id = $5
      RETURNING id,email,full_name,role,status,avatar_url
      `,
      [full_name, email, avatarUrl, avatarPublicId, userId],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      errors: {
        general: "Internal server error",
      },
    });
  }
};
module.exports = { register, login, me, updateProfile };
