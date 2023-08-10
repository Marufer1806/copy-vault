import { config } from "dotenv"

config();


export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT
export const PAYPAL_API_SECRET= process.env.PAYPAL_API_SECRET
export const PAYPAL_API = process.env.PAYPAL_API





// IMPORTANT: need to create a file .env with the credentials. Example: 

//PAYPAL_API= https://api-m.sandbox.paypal.com
//PAYPAL_API_CLIENT=xxxxxxxxxxxxxxxx
//PAYPAL_API_SECRET=xxxxxxxxxxxxxx