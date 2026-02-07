import mongoose from 'mongoose';

export default async function connectDb() {
    try {
        // MongoDB connection URL
        const dbUrl = process.env.MONGODB_URI;

        if (!dbUrl) {
            console.error('Database URL is not defined in the environment variables');
            process.exit(1);
        }

        // Connect to MongoDB
        await mongoose.connect(dbUrl);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
