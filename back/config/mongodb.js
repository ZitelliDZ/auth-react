// mongoose
import mongoose from 'mongoose';

// mongodb connection
const connectDB = async () => {
    try {

        mongoose.connection.on('connected', () => {
            console.log('Mongoose is connected');
        });

        const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);

    
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;