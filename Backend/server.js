import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js"
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
  connectDB();
});
app.use("/api",chatRoutes)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected with database");
    
  } catch (error) {
    console.log( "Failed to connect with the Database",error); 
  }
}

// app.post("/test", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "developer",
//           content: "You are a helpful assistant.",
//         },
//       ],
//     }),
//   };

//   try {
//     const response = await fetch(
//       "https://api.openai.com/v1/chat/completions",
//       options
//     );
//     const data = await response.json();
//     console.log(data);
//     res.send(data.choices[0].messages.content);
//   } catch (error) {
//     console.log(error);
//   }
// });
