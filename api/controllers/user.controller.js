import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

// List of prohibited words
const prohibitedWords = [
    'nigger', 'fuck', 'shit', 'bitch', 'asshole', 'racist', 'niger', 'nig3r', 'nigg3r',
    'chink', 'ching', 'bastard', 'damn', 'crap', 'dick', 'pussy', 'cunt', 'twat',
    'bollocks', 'prick', 'wanker', 'douche', 'motherfucker', 'idiot', 'moron', 
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


    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
      }

      
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 4 || req.body.username.length > 20) {
      return next(
        errorHandler(400, 'Username must be between 4 and 20 characters')
      );
    }
}
if (req.body.username.includes(' ')) {
    return next(errorHandler(400, 'Username cannot contain spaces'));
  }
  if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
    return next(
      errorHandler(400, 'Username can only contain letters and numbers')
    );  
  }

if (req.body.username) {
  const lowerCaseUsername = req.body.username.toLowerCase(); // ✅ Convert once for efficiency
  for (const badWord of prohibitedWords) {
    if (lowerCaseUsername.includes(badWord)) {
      return next(errorHandler(400, 'Username contains inappropriate language'));
    }
  }
}
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  if (!req.user.id !== req.params.userId) {
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