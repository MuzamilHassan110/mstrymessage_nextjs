// import mongoose from "mongoose";

// type connectionObject = {
//   isconnected?: number;
// };

// const connection: connectionObject = {};

// const dbConnection = async (): Promise<void> => {
//   if (connection.isconnected) {
//     console.log("Database is already connected");
//     return;
//   }
//   try {
//     const dbConnectionInstance = await mongoose.connect(
//       process.env.MONGODB_URL || "",
//       {}
//     );
//     connection.isconnected = dbConnectionInstance.connections[0].readyState;
//     console.log("Database connected successfully");
//   } catch (error) {
//     console.error("Error connecting to database:", error);
//     process.exit(1);
//   }
// };

// export default dbConnection;


// this is another method which is user to check based on the ready state of the database
import mongoose from "mongoose";

const dbConnection = async(): Promise<void> => {
        const isConnected = await mongoose.connection.readyState;
      
        
        if (isConnected === 1) {
            console.log("Database is already connected");
            return;
        }
        if(isConnected === 2) {
            console.log("Database is connecting");
            return;
        }

        try {
             await mongoose.connect(process.env.MONGODB_URL || '', {
                dbName: "mongodb",
                bufferCommands: true
            });
            console.log("Database connected successfully");
        } catch (error) {
            console.error("Error connecting to Mongon database", error);
            process.exit(1);
        }
}

export default dbConnection;
