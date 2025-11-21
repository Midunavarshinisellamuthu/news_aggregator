import mongoose from "mongoose";

const uri = "mongodb+srv://midunavarshini342_db_user:Xr9UZc7OfDqvqJQ5@cluster0.doppz3y.mongodb.net/newshub?appName=Cluster0";

async function testConnection() {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

testConnection();
