import express from "express";
import mongoose from "mongoose";
import cors  from "cors";
import morgan from "morgan";
import router from "./routers/route.js";
const PORT = 3030

const app = express();

// ################## meddlwres
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.disable('x-powered-by')

// conect to the mongodb
mongoose.connect("mongodb://127.0.0.1:27017/stor-1")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });




  //######## api rout 

  app.use("/api",router)


  

//############# server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
