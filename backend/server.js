import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Users",
  password: "sujay123",
  port: "5432",
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const checkExistingUser = async (username) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);

    if (res.rows.length > 0)
      //user exist
      return true;
    else return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

app.post("/Signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const users = await checkExistingUser(username);
    if (users) {
      return res.status(409).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (username,password) VALUES($1,$2)", [
      username,
      hashedPassword,
    ]);
    return res.status(201).json({ message: "Signed up Successfull" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);
    if (result.rows.length == 0) {
      return res.status(409).json({message:"Invalid Username"})
    }
      const user = result.rows[0];
      const validPassword = await bcrypt.compare( password,user.password);
      if (validPassword) {
        return res.status(200).json({ message: "Login Successfull" });
      } else {
        return res.status(409).json({ message: "Invalid Password" });
      }
    }
   catch (error) {
    return res.status(500).json("Server Not responding")
  }
});

app.listen(port, () => {
  console.log(`The server is listening on port ${port}`);
});
