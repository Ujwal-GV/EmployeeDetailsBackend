const express = require("express");
const multer = require('multer');
const path = require("path");
const { checkAuthorization } = require("../middleware/authMiddleware");
const { createEmployee, getAllUsers, getEmployee, updateEmployee, deleteEmployee } = require("../controllers/employeeController");
const { storage } = require('../config/cloudinary'); // Correctly import the Cloudinary storage configuration

const upload = multer({ storage: storage }); // Use Cloudinary storage for file upload

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

const router = express.Router();

// Routes
router.route("/", checkAuthorization).get(getAllUsers);

// Create employee (with image upload to Cloudinary)
router.post("/create", upload.single("f_image"), createEmployee);

router.route("/:id", checkAuthorization)
    .get(getEmployee) // Get a single employee by ID
    .put(upload.single("f_image"), updateEmployee) // Update employee details with optional image upload
    .delete(deleteEmployee); // Delete an employee

module.exports = router;
