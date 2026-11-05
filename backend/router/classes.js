const express = require("express");
const router = express.Router();

const {
  getTeacherClasses,
  getMyClassesByBook,
  getStudentClasses,
  getTeacherClassDetails,
  getStudentClassDetails,
  createClassNote,
  updateClassNote,
  deleteClassNote,
  setClassItemPinned,
} = require("../controller/classes");
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");
const uploadResourceFile = require("../middleware/resourceUpload");
const {
  createClassResource,
  updateClassResource,
  deleteClassResource,
  downloadClassResource,
} = require("../controller/classResources");

router.get(
  "/teacherClasses",
  authenticate,
  authorize("teacher"),
  getTeacherClasses,
);
router.get(
  "/teacherClasses/:classId",
  authenticate,
  authorize("teacher"),
  getTeacherClassDetails,
);
router.post(
  "/teacherClasses/:classId/notes",
  authenticate,
  authorize("teacher"),
  createClassNote,
);
router.put(
  "/teacherClasses/:classId/notes/:noteId",
  authenticate,
  authorize("teacher"),
  updateClassNote,
);
router.delete(
  "/teacherClasses/:classId/notes/:noteId",
  authenticate,
  authorize("teacher"),
  deleteClassNote,
);
router.patch(
  "/teacherClasses/:classId/items/:itemId/pin",
  authenticate,
  authorize("teacher"),
  setClassItemPinned,
);
router.post(
  "/teacherClasses/:classId/resources",
  authenticate,
  authorize("teacher"),
  uploadResourceFile,
  createClassResource,
);
router.put(
  "/teacherClasses/:classId/resources/:resourceId",
  authenticate,
  authorize("teacher"),
  uploadResourceFile,
  updateClassResource,
);
router.delete(
  "/teacherClasses/:classId/resources/:resourceId",
  authenticate,
  authorize("teacher"),
  deleteClassResource,
);
router.get(
  "/resources/:resourceId/download",
  authenticate,
  authorize("teacher", "student"),
  downloadClassResource,
);
router.get(
  "/myClassesByBook/:bookId",
  authenticate,
  authorize("teacher"),
  getMyClassesByBook,
);

router.get(
  "/student-classes",
  authenticate,
  authorize("student"),
  getStudentClasses,
);
router.get(
  "/student-classes/:classId",
  authenticate,
  authorize("student"),
  getStudentClassDetails,
);
module.exports = router;
