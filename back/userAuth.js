// jwt
import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ success: false, message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.email_cookie = decoded.email;
    req.id_cookie = decoded.id;

    if (!decoded.email || !decoded.id) {
      return res.json({ success: false, message: "Access denied" });
    }

    if(decoded.id){
        req.body.userId = decoded.id;
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: "Invalid token" });
  }
};

export default userAuth;