import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  //Check both cookies and headers
  let token = req.cookies.access_token || req.headers.authorization?.split(" ")[1]; 
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized'));
    }

    if (!user.id) {
      return next(errorHandler(401, 'Invalid token: No user ID found'));
    }

    req.user = user;
    next();
  });
};
