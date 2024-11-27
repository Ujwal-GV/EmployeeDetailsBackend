const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { connectMongoDB } = require("./configuration/connection");
const employeeRouter = require("./routes/employeeRoute");
const adminRouter = require("./routes/adminRoute");

dotenv.config();
const PORT = process.env.PORT || 3001;

connectMongoDB();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/employees", employeeRouter);
app.use("/api/admin", adminRouter);

const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
// app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));