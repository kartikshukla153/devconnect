require("dotenv").config();

// 👇 ADD THIS LINE HERE
console.log("MONGO_URI:", process.env.MONGO_URI);

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("MongoDB Connection Failed ❌", err));