import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME; // optional

  if (!uri) {
    console.error("MONGO_URI not set");
    process.exit(1);
  }

  try {
    const options = dbName ? { dbName } : {};
    await mongoose.connect(uri, options);
    console.log(`MongoDB connected — DB: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
