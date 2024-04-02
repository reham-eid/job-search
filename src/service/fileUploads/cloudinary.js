import { v2 as cloudinary } from "cloudinary";
import path from 'path'
import {config} from "dotenv";
config({ path: path.resolve("/config/dev.config.env")});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
export default cloudinary;
