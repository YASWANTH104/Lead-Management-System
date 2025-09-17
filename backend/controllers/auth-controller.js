const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing Fields",
      });
    }
    const checkExistingUser = await User.findOne({ email });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: "User already Exisits",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newlyCreatedUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newlyCreatedUser.save();
    if (newlyCreatedUser) {
      return res.status(201).json({
        success: true,
        message: "User registered Successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register User! Please try again",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again Later!",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing Fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exist.Please register to continue",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "Lax",
      secure: false,
    });
    return res
      .status(200)
      .json({ id: user._id, name: user.name, email: user.email });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong! Please try again Later!",
    });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};

const currentUser = async (req, res) => {
  const token = req.cookies?.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    return res
      .status(200)
      .json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.log(false);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { registerUser, loginUser, logoutUser, currentUser };
