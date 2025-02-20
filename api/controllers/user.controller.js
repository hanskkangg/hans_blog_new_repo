import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// List of prohibited words
const prohibitedWords = [
    'nigger', 'fuck', 'shit', 'bitch', 'asshole', 'racist', 'niger', 'nig3r', 'nigg3r',
    'chink', 'ching', 'bastard', 'damn', 'crap', 'dick', 'pussy', 'cunt', 'twat',
    'bollocks', 'prick', 'wanker', 'douche', 'motherfucker', 'moron', 
    'hoe','nigga', 'faggot', 'homo', 'tranny','retard', 'cripple', 'spaz', 'mongoloid','whore', 'slut', 'cum', 'jizz', 'fap', 'porn', 'dildo', 'nude', 'boobs', 
    'tits', 'vagina', 'penis', 'orgy', 'rape', 'molest', 'incest', 'blowjob',
    'kill', 'murder', 'terrorist', 'bomb', 'explode', 'genocide', 'massacre', 
    'lynch', 'assassinate', 'stab', 'behead', 'shoot', 'abuse', 'pedophile',
    'hitler', 'nazi','whitepower', 'supremacy', 'zionist', 'jihadi',
    'suicide', 'selfharm', 'cutting', 'die', 'hang', 'overdose', 'depress', 'killself'];


export const test = (req,res) =>  {

    res.json({message:'working'});

    
};


export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
      return next(errorHandler(400, 'All fields are required.'));
  }

  // Check for prohibited words in username and email
  const containsProhibitedWords = (text) => {
      const lowerText = text.toLowerCase();
      return prohibitedWords.some((word) => lowerText.includes(word));
  };

  if (containsProhibitedWords(username)) {
      return next(errorHandler(400, 'Your username contains inappropriate content. Please choose a different username.'));
  }

  if (containsProhibitedWords(email)) {
      return next(errorHandler(400, 'Your email address contains inappropriate content. Please use a valid email address.'));
  }


  // Always store username and email in lowercase
  username = username.toLowerCase();
  email = email.toLowerCase();

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
      const newUser = new User({
          username,
          email,
          password: hashedPassword,
      });

      await newUser.save();
      res.json({ success: true, message: 'Signup successful' });
  } catch (error) {
      next(error);
  }
};


export const updateUser = async (req, res, next) => {
  try {
    console.log("🛠 Incoming Update Request:", req.body); // ✅ Log request body

    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: "❌ You are not allowed to update this user" });
    }

    if (!req.body) {
      return res.status(400).json({ message: "❌ Invalid request: No data provided" });
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: "❌ Password must be at least 6 characters" });
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }


    // Check for existing username case-insensitively
    if (req.body.username) {
      req.body.username = req.body.username.toLowerCase().trim();
      const existingUser = await User.findOne({
        username: req.body.username,
        _id: { $ne: req.params.userId } // Exclude the current user from the check
      }).collation({ locale: 'en', strength: 2 });

      if (existingUser) {
        return res.status(409).json({ message: "❌ Username already taken" });
      }
    }

    
   const existingUser = await User.findOne({ username: req.body.username.toLowerCase() });
    if (existingUser && existingUser._id.toString() !== req.params.userId) {
      return res.status(409).json({ message: "❌ Username already taken" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      console.log("❌ User not found!");
      return res.status(404).json({ message: "User not found!" });
    }

    console.log("✅ User Updated Successfully:", updatedUser);

    const token = jwt.sign(
      { id: updatedUser._id, isAdmin: updatedUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password, ...rest } = updatedUser._doc;
    
    res.status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({ ...rest, token });

  } catch (error) {
    console.error("🔥 Server Error in updateUser:", error); // ✅ Log full error
    res.status(500).json({ message: "❌The username is already taken.", error: error.message });
  }
};



export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId && !req.user.isAdmin) { // ✅ Fixed condition
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }

  
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};


export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('username profilePicture');
    
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("🔥 Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
