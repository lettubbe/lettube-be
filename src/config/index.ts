import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV as string

const config =  {
  env,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  mailJet: {
    apiKey: process.env.MAILJET_API_KEY as string,
    apiSecret: process.env.MAILJET_API_SECRET as string,
  },
  mongodb: {
    mongoUri: process.env.MONGO_URI as string,
  },
  auth: {
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
    jwtSecret: process.env.JWT_SECRET as string
  }
};

export default config;
