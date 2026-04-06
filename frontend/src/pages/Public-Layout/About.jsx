import * as React from "react";
import { Box, Card, CardMedia, Typography } from "@mui/material";

import booksImg from "../../assets/Rectangle 88.svg";
import teacherImg from "../../assets/Subtract.svg";
import classImg from "../../assets/Rectangle 90.svg";
import blueShapeImg from "../../assets/Rectangle 39432.svg";

export default function AlRowadPublishingSection() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "stretch",
        overflow: "hidden",
        position: "relative",
        fontFamily: "Arial, sans-serif",
        marginTop: { xs: 8, md: 15 },
        px: { xs: 3, md: 0 },
      }}
    >
      {/* القوس الأزرق */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: { xs: -5, md: -40 },
          width: { xs: 8, md: 60 },
          height: { xs: 140, md: 260 },
          bgcolor: "#1E4DB7",
          borderRadius: "0 100% 100% 0",
        }}
      />

      <Box
        sx={{
          width: "100%",
          maxWidth: 1280,
          py: { xs: 4, md: 4 },
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1.02fr 1.02fr 1.12fr",
          },
          columnGap: { xs: 0, md: 3.5 },
          rowGap: { xs: 4, md: 0 },
          alignItems: "start",
          marginLeft: { xs: 2, md: 10 },
        }}
      >
        {/* العمود الأول */}
        <Box>
          <Typography
            sx={{
              fontSize: { xs: "16px", md: "20px" },
              lineHeight: 1.15,
              fontWeight: 700,
              color: "#111111",
              mb: { xs: 4, md: 8 },
              letterSpacing: "-0.01em",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Al-Rowad for Publishing &amp; Distribution
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "16px", md: "20px" },
              lineHeight: 1.15,
              fontWeight: 700,
              color: "#202020",
              mb: { xs: 2, md: 3 },
              letterSpacing: "-0.02em",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Changing the Face of Education
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "14px", md: "16px" },
              lineHeight: 1.38,
              color: "#5d5d5d",
              fontWeight: 400,
              pr: { md: 1 },
              fontFamily: "Inter, sans-serif",
            }}
          >
            Al-Rowad is an enterprising publishing company specializing in the
            creation of educational resources in Arabic, English (ELL), and
            French (FL), serving learners of all ages. Our products range from
            textbooks tailored to standard ELT curricula to reference materials.
            We design and produce skills-based books in multiple disciplines and
            with a wide range of support products that provide students and
            teachers with skill-enhancing source materials and value-enrichment
            resources.
            <br />
            <br />
            Whether used in the classroom or at home for self study, our
            products are highly regarded by both teachers and students for their
            quality content,
          </Typography>
        </Box>

        {/* العمود الثاني */}
        <Box>
          <Typography
            sx={{
              fontSize: { xs: "14px", md: "16px" },
              lineHeight: 1.38,
              color: "#5d5d5d",
              fontWeight: 400,
              mb: { xs: 2, md: 3 },
              fontFamily: "Inter, sans-serif",
            }}
          >
            written with an emphasis on both skills acquisition and application.
            The creative approach and user-friendly design of our products has
            earned Al-Rowad a reputation for quality, usability, and results.
            <br />
            <br />
            We have a team of experienced and dedicated educational and language
            consultants, editors, and designers who strive to ensure that all of
            Al-Rowad&apos;s publications are of the highest caliber. Our
            state-of-the-art curricula provide relevant and practical materials
            that maximize teacher effectiveness and student motivation. In
            addition to our regular staff, we are grateful to work with a pool
            of talented, professional writers and teachers; and, to collaborate
            with co-publishers and booksellers in the U.K. and the U.S., with
            whom we have built mutually beneficial alliances.
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "16px", md: "20px" },
              lineHeight: 1.3,
              fontWeight: 700,
              color: "#202020",
              maxWidth: 440,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Al-Rowad is one of the leading book makers in the Middle East.
          </Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            display: { xs: "flex", md: "block" },
            flexDirection: { xs: "column", md: "initial" },
            alignItems: { xs: "center", md: "initial" },
            gap: { xs: 2, md: 0 },
            minHeight: { xs: "auto", md: 460 },
          }}
        >
          {/* TOP IMAGE */}
          <Card
            elevation={0}
            sx={{
              position: { xs: "relative", md: "absolute" },
              top: { md: 0 },
              right: { md: -100 },
              width: { xs: "90%", md: 375 },
              height: { xs: 140, md: 138 },
              borderRadius: "20px",
              overflow: "hidden",
              bgcolor: "transparent",
            }}
          >
            <CardMedia
              component="img"
              image={booksImg}
              alt="Books"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Card>

          {/* MIDDLE IMAGE */}
          <Card
            elevation={0}
            sx={{
              position: { xs: "relative", md: "absolute" },
              top: { md: 155 },
              right: { md: -100 },
              width: { xs: "90%", md: 375 },
              height: { xs: 180, md: 186 },
              borderRadius: "20px",
              overflow: "hidden",
              bgcolor: "transparent",
            }}
          >
            <CardMedia
              component="img"
              image={teacherImg}
              alt="Teacher"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Card>

          {/* SMALL IMAGE */}
          <Card
            elevation={0}
            sx={{
              position: { xs: "relative", md: "absolute" },
              top: { md: 236 },
              left: { md: 90 },
              width: { xs: "40%", md: "auto" },
              borderRadius: "18px",
              overflow: "hidden",
              bgcolor: "transparent",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              mt: { xs: -14, md: 0 },
              mr: { xs: 40, md: 0 },
              zIndex: 2,
              mx: "auto",
            }}
          >
            <CardMedia
              component="img"
              image={classImg}
              alt="Classroom"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Card>

          {/* BLUE SHAPE */}
          <Box
            component="img"
            src={blueShapeImg}
            alt="Blue shape"
            sx={{
              position: { xs: "relative", md: "absolute" },
              right: { md: 25 },
              top: { md: 285 },
              width: { xs: 100, md: 148 },
              height: "auto",
              zIndex: 3,
              alignSelf: { xs: "center", md: "auto" },
              mt: { xs: -14, md: 0 },
              mr: { xs: 1, md: 0 },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
