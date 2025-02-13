import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

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

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'You are not allowed to update this user' });
    }

    // ✅ Ensure request body exists
    if (!req.body) {
      return res.status(400).json({ message: 'Invalid request: No data provided' });
    }

    // ✅ Validate and Hash Password
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // ✅ Username Validation (Prevents duplicate errors)
    if (req.body.username) {
      const username = req.body.username.trim();
      const lowerCaseUsername = username.toLowerCase();

      if (username.length < 4 || username.length > 20) {
        return res.status(400).json({ message: 'Username must be between 7 and 20 characters' });
      }
      if (username.includes(' ')) {
        return res.status(400).json({ message: 'Username cannot contain spaces' });
      }
      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return res.status(400).json({ message: 'Username can only contain letters and numbers' });
      }

      // ✅ Check for prohibited words
      for (const badWord of prohibitedWords) {
        if (lowerCaseUsername.includes(badWord)) {
          return res.status(400).json({ message: 'Username contains inappropriate language' });
        }
      }
    }

    // ✅ Update User in Database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    console.log("✅ User Updated Successfully:", updatedUser);

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.error("🔥 Server Error:", error);
    res.status(500).json({ message: 'Internal server error' });
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
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    const { password, ...rest } = user._doc; // ✅ Hide password
    res.status(200).json(rest);
  } catch (error) {
    console.error("🔥 Server Error:", error);
    next(error);
  }
};
