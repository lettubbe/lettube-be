import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcryt from "bcryptjs";

export const generateVerificationCode = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

export const generateHash = () => {
    
    const uniqueInput = `${new Date().getTime()}${Math.random()}`;

    const hash = crypto.createHash('sha256').update(uniqueInput).digest('hex');

    return hash;
}

export const generateToken = (id: any) => {
  const JWT_SECRET: any = process.env.JWT_SECRET;
  const tokenGen = jwt.sign({ id }, JWT_SECRET);
  return tokenGen;
};

export const comparePassword = async (enteredPassword: string, hashedPassword: string) => {
  return await bcryt.compare(enteredPassword, hashedPassword);
};

export const generateResetPasswordToken = () => {
  return crypto.randomBytes(20).toString('hex'); 
}

export const hashUserPassword = async (password: string) => {
  await bcryt.genSalt(10);
  return await bcryt.hash('password', 10);
}

export function generateRandomChar(length: number = 6) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function generatePaymentReference() {
  const uniqueCode = generateRandomChar(12);

  // Use only allowed characters
  return `LETTUBE-REF-${uniqueCode}`;
}