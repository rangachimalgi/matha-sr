import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const hashPassword = async (password) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.log(error);
    }
  };

  export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  };

  export const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role: role }, process.env.TOKEN_SECRET, { expiresIn: '30d' });
};

export const authenticate = (req, res, next) => {
    const token = req.header('auth-token');
    
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

export const checkRole = (role) => {
  return (req, res, next) => {
      if (req.user.role !== role) {
          return res.status(403).send('Access Denied');
      }
      next();
  };
};