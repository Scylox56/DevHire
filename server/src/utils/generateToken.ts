import jwt, { SignOptions } from 'jsonwebtoken';

const generateToken = (id: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign({ id }, process.env.JWT_SECRET!, options);
};

export default generateToken;
