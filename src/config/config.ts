import "dotenv/config";

const config = {
  PORT: process.env.PORT || 3000,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

export const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
export const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

export default Object.freeze(config);
