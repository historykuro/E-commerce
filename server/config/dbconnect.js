import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    if (conn.connection.readyState === 1)
      console.log("DB connection is successully!");
    else console.log("DB connectioon is failed");
  } catch (error) {
    console.log("DB connectioon is failed");
    throw new Error(error);
  }
};
export default dbConnect;
