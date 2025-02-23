import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    next(errorHandler(400, 'The email you entered isn’t connected to an account. '));
  }

    // Username Validation
    const usernameRegex = /^[a-zA-Z0-9._]{4,15}$/;
    if (!usernameRegex.test(username)) {
      return next(errorHandler(400, 'Username must be 4-15 characters long and can only contain letters, numbers, underscores, and periods.'));
    }

      // Email Validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email.length < 10 || email.length > 25 || !emailRegex.test(email)) {
    return next(errorHandler(400, 'Email must be 10-25 characters long and in a valid format (e.g., name@example.com).'));
  }
   // Password Validation
   if (password.length < 8 || password.length > 64) {
    return next(errorHandler(400, 'Password must be between 8 and 64 characters.'));
  }

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.json('Signup successful');
  } catch (error) {
    next(error);
  }
};


export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, 'The email you entered isn’t connected to an account. '));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "Sorry, we didn't recognize that email."));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'The password you’ve entered is incorrect.'));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // ✅ Set token expiry
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json({ ...rest, token }); // ✅ Send token in JSON response
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      user = new User({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // ✅ Set token expiry
    );

    const { password, ...rest } = user._doc;

    res
      .status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json({ ...rest, token }); // ✅ Send token in JSON response
  } catch (error) {
    next(error);
  }
};

// verifyUser.js// verifyUser.js
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error("🚨 No authorization header found.");
    return next(errorHandler(401, "No token provided"));
  }

  const token = authHeader.split(" ")[1]; // ✅ Parse Bearer token correctly
  console.log("🔍 Extracted Token:", token);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("🚨 Invalid token:", err.message);
      return next(errorHandler(403, "Invalid token"));
    }
    
    req.user = user; // ✅ Set req.user for access in route handlers
    console.log("✅ User authenticated:", req.user);
    next();
  });
};
