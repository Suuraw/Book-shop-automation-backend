// index.js
import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";//. as it a current directory
import session from "express-session";//allows to use the middleware to set a session
import dotenv from "dotenv";//allows us to read enviormental variable like from .env file where i inilialized secret session variable
import getRoutes from "./routes/getRoutes.js"
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
app.use("/",getRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});
