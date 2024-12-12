import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);
    if(isConnected){
        console.log("MONGODB is already connected");
        return;
    }

    try{
        await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: "TherapyBot",
        })
        isConnected = true;
        console.log("MONGODB connected!");
    }
    catch(error){
        console.log("Error connecting to MongoDB: ", error);
    }
}