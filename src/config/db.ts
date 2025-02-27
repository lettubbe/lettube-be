import { connect } from "mongoose";
import config from ".";

const connectDB = async ( ) => {
    try {
        const conn = await connect(config.mongodb.mongoUri);

        console.log(`MongoDB connected ` + conn.connection.host);
        
    } catch (error) {
        console.log("Connecting to DB error " + error)
    }
}

export default connectDB;