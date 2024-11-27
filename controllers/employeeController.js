const Employee = require("../models/employee");
const multer = require('multer');

const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

async function createEmployee(req, res) {
    const { f_name, f_email, f_mobile, f_designation, f_gender, f_course } = req.body;

    const existingEmailCheck = await Employee.findOne({ f_email });
    if (existingEmailCheck) {
        return res.status(400).json({ message: "Email already exists" });
    }

    try {
        const f_image = req.file ? req.file.path : '';
        const employee = new Employee({ f_name, f_email, f_mobile, f_designation, f_gender, f_course, f_image });
        await employee.save();
        console.log("New Employee created");
        res.status(201).json({ message: "New Employee created" });
    } catch (error) {
        console.error("Error creating employee:", error.message);
        res.status(500).json({ message: "Server error, please try again later" });
    }
}


async function getAllUsers(req, res){
    try {
        const employees = await Employee.find({});
        return res.status(200).json(employees);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function getEmployee(req, res){
    try {
        const employee = await Employee.findById(req.params.id);
        res.status(200).json(employee);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateEmployee(req, res) {
    const { f_name, f_email, f_mobile, f_designation, f_gender, f_course } = req.body;

    try {
        const f_image = req.file ? req.file.path : ''; // Cloudinary stores the URL in `path`
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { f_name, f_email, f_mobile, f_designation, f_gender, f_course, f_image },
            { new: true }
        );
        res.status(200).json({ message: "Employee details updated" });
    } catch (error) {
        console.error("Error updating employee:", error.message);
        res.status(500).json({ message: "Server error, please try again later" });
    }
}


async function deleteEmployee(req, res){
    try {
        const { id } = req.params;
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

module.exports = { createEmployee, getAllUsers, getEmployee, updateEmployee, deleteEmployee };