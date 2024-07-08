'use server'
import  User, { UserDocument }  from "../models/user"
import mongoose from "mongoose";

const { MONGODB_URI } = process.env;
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


export async function getUsers() {
  const connection = await connectDB();
  let users;
  if (connection) {
    users = await User.find<UserDocument>();
    users = [...users.map(u => JSON.parse(JSON.stringify(u)))]
    connection.close()
  }
  return users;
}

export async function addUser(newUser:UserDocument) {
  const connection = await connectDB();
  if (connection) {
    const added = await User.insertMany([newUser])
    console.log(added)
    connection.close()
  }
}


