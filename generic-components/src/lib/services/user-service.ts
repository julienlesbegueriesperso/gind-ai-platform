'use server'
import  User, { UserDocument }  from "../models/user"
import mongoose from "mongoose";

const { MONGODB_URI } = process.env;
export const connectDB = async () => {

  try {
    const { connection } = await mongoose.connect(MONGODB_URI as string);
    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};


export async function getUsers() {
  await connectDB();
  let users = await User.find<UserDocument>();
  users = [...users.map(u => JSON.parse(JSON.stringify(u)))]
  return users;
}

export async function addUser(newUser:UserDocument) {
  await connectDB();
  const added = await User.insertMany([newUser])
  console.log(added)
  return
}


