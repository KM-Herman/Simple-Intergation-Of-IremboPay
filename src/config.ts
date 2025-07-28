import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {
   IPAY_SECRET_KEY: process.env.IPAY_SECRET_KEY || "sk_live_02a15ca2e0c44e859da6d30ad95b65f0",
  IPAY_ENVIRONMENT: process.env.IPAY_ENVIRONMENT || "sandbox",
};