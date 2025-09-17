require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const authRoutes = require("./routes/auth-routes");
const leadRoutes=require("./routes/lead-routes")
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

connectToDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/leads",leadRoutes)

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`Server is now running on the port ${port}`);
});
