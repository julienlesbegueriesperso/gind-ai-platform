
'use server'
import mongoose from "mongoose";

const {   MONGODB_URI } = process.env;
console.log("MONGOOSE URI : ", MONGODB_URI)
export const connectDB = async () => {

  try {
    const { connection } = await mongoose.connect(MONGODB_URI as string);
    if (connection.readyState === 1) {
      return Promise.resolve(connection);
    }

  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

