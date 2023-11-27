import mongoose from "mongoose";

export default class Database {
  private uri: string;

  constructor() {
    this.uri = process.env.MONGO_URI || "mongodb://localhost:27017/node";
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.uri);
      console.log("Connected to database");
    } catch (err) {
      console.error(err);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from database");
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}
