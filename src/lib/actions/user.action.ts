"use server";

import { connect } from "@/lib/db";
import User from "../models/user.model";

export async function createUser(user: any) {
  try {
    await connect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      console.log("User already exists");
      return existingUser;
    }

    // Create a new user if the user doesn't exist
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}
