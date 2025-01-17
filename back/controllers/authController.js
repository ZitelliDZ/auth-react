// Importing user model
import userModel from "../models/userModel.js";

// bcrypt
import bcrypt from "bcryptjs";

// jsonwebtoken
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";


export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 60 * 60 * 1000,
    });

    const emailOptions = {
      from: process.env.SMTP_SENDER,
      to: email,
      subject: "Account Verification",
      text:
        "Welcome to AuthMern. Yout account has been created successfully with email: " +
        email,
    };

    await transporter.sendMail(emailOptions);

    return res.json({ success: true, message: "User Registered" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Login Successful" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      httpOnly: true,
    });

    return res.json({ success: true, message: "Logout Successful" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Server Error" });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "Invalid User" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    const emailOptions = {
      from: process.env.SMTP_SENDER,
      to: user.email,
      subject: "Account Verification",
      //text: "Your OTP is: " + otp,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),
    };

    await transporter.sendMail(emailOptions);

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Server Error" });
  }
};

export const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "Invalid User" });
    }

    if(user.verifyOtp === "" || user.verifyOtp !== otp) {
        return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    } 

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Server Error" });
  }
};


export const isAuthenticated = async (req, res) => {
    try { 
        return res.json({ success: true, message: "Access granted" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Invalid token" });
    }
}

export const sendResetOtp = async (req, res) => {
    
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    try {
 
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid User" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

        await user.save();

        const emailOptions = {
            from: process.env.SMTP_SENDER,
            to: user.email,
            subject: "Reset Password",
            //text: "Your OTP is: " + otp,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),
        };

        await transporter.sendMail(emailOptions);

        return res.json({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Server Error" });
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid User" });
        }

        if(user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Server Error" });
    }
}