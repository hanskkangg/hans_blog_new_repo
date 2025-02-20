import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true, // Ensure all usernames are stored in lowercase
      trim: true

    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Use schema.index for unique case-insensitive username
userSchema.index({ username: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const User = mongoose.model('User', userSchema);

export default User;
