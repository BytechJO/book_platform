const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const MINUTE = 60 * 1000;

const getIpKey = (req) => ipKeyGenerator(req.ip);

const getUserKey = (req) =>
  req.user?.id ? `user:${req.user.id}` : `ip:${getIpKey(req)}`;

const formatRetryAfter = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const createLimiter = ({ windowMs, limit, message, keyGenerator }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator,
    handler: (req, res, _next, options) => {
      const resetTime = req.rateLimit?.resetTime?.getTime();
      const retryAfterSeconds = resetTime
        ? Math.max(1, Math.ceil((resetTime - Date.now()) / 1000))
        : Math.ceil(windowMs / 1000);

      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(options.statusCode).json({
        message: `${message} Try again in ${formatRetryAfter(retryAfterSeconds)} (minutes:seconds).`,
        code: "RATE_LIMIT_EXCEEDED",
        retry_after_seconds: retryAfterSeconds,
      });
    },
  });

const loginLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  limit: 5,
  message: "Too many login attempts.",
  keyGenerator: (req) => {
    const email = String(req.body?.email || "unknown")
      .trim()
      .toLowerCase();
    return `${getIpKey(req)}:${email}`;
  },
});

const bookActivationLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  limit: 10,
  message: "Too many book activation attempts.",
  keyGenerator: getUserKey,
});

const classCodeLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  limit: 10,
  message: "Too many class code attempts.",
  keyGenerator: getUserKey,
});

module.exports = {
  loginLimiter,
  bookActivationLimiter,
  classCodeLimiter,
};
