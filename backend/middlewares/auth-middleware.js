const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized! Invalid Token!",
    });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({
      success: false,
      message: "Unauthorized! Invalid Token!",
    });
  }
};


module.exports=authMiddleware;