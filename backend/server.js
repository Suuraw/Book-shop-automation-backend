// index.js
import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";//. as it a current directory

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/auth", authRoutes);

app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});
