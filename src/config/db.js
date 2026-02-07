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

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
