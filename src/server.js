import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./config/db.js";

// set the port
const PORT = process.env.PORT || 5000;


// Load environment variables
dotenv.config();

// Connect to the database
connectDb();

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
