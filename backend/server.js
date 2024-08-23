// index.js
import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";//. as it a current directory
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(session({
    secret: process.env.SESSION_SECRET, // The secret key you generated and stored in your .env file
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Do not create session until something stored
    cookie: { secure: false } // Set secure to true if using https
  }));
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/auth", authRoutes);

app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});
