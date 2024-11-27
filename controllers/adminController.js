const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

async function signup(req, res) {
    const { userName, password } = req.body;

    try {
        const adminExists = await Admin.findOne({ userName });

        if (adminExists) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const admin = await Admin.create({ userName, password });

        if (admin) {
            console.log("Admin created");
            const token = jwt.sign({ name: admin._id }, "youcantdecodethis");
            console.log(admin.userName);
            return res.status(201).json({ message: "Admin created", token });
        } else {
            return res.status(400).json({ message: "Invalid admin data" });
        }
    } catch (error) {
        console.error("Error in signup:", error.message);
        return res.status(500).json({ message: "Server error, please try again later" });
    }
}

async function login(req, res) {
    const { userName, password } = req.body;

    try {
        console.log("Request Body:", req.body);

        const admin = await Admin.findOne({ userName });
        console.log("Admin Found:", admin);

        if (admin && (await admin.matchPassword(password))) {
            const token = jwt.sign({ name: admin._id }, "youcantdecodethis");
            console.log(admin.userName);
            console.log("Admin logged in");
            return res.json({ token });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error in login:", error.message);
        return res.status(500).json({ message: "Server error, please try again later" });
    }
}


module.exports = { signup, login };