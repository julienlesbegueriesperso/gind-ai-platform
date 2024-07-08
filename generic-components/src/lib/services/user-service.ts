'use server'
import  User, { UserDocument }  from "../models/user"
import { connectDB } from "./connection-service";

export async function getUsers() {
  const connection = await connectDB();
  let users;
  if (connection) {
    users = await User.find<UserDocument>();
    users = [...users.map(u => JSON.parse(JSON.stringify(u)))]
    // connection.close()
  }
  return users;
}

export async function getUser(name:string) {
  const connection = await connectDB();
  let user
  if (connection) {
    console.log("find user ", name)
    user = await User.findOne<UserDocument>({name: name});
    console.log("found user", user)
    if (user) {
      user = JSON.parse(JSON.stringify(user))
    }
    // connection.close()
  }
  console.log(user)
  return user;
}

export async function updateUser(user:UserDocument) {
  console.log("update user ", user.name)
  const connection = await connectDB();
  if (connection) {

    const foundUser = await User.findOneAndUpdate<UserDocument>({email: user.email},
                 {currentProject:user.currentProject},
                {new:true}
    );
    console.log("update", foundUser)
    return JSON.parse(JSON.stringify(foundUser));

  }
  return undefined

}


export async function getUserByEmail(email:string) {
  const connection = await connectDB();
  let user
  if (connection) {
    console.log("find user ", email)
    user = await User.findOne<UserDocument>({email});
    console.log("found user", user)
    if (user) {
      user = JSON.parse(JSON.stringify(user))
    }
    // connection.close()
  }
  console.log(user)
  return user;
}

export async function addUser(newUser:UserDocument) {
  console.log("add user", newUser.name)
  const connection = await connectDB();
  if (connection) {
    const foundUser = await getUserByEmail(newUser.email)
    console.log("found add user ?", foundUser)
    if (!foundUser) {
      const added = await User.insertMany([newUser])
      console.log(added)
    }
    // connection.close()
  }
}


