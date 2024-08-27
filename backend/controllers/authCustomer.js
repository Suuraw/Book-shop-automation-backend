import bcrypt from "bcrypt";
import db from "../db/db.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const usernameResult = await db.query(
      "SELECT username FROM users WHERE username=$1",
      [username]
    );
    if (usernameResult.rows.length > 0) {
      return res
        .status(401)
        .sendFile(path.join(__dirname, "../public/CustomerLogin.html"));
    }

    const emailResult = await db.query(
      "SELECT email FROM users WHERE email=$1",
      [email]
    );
    if (emailResult.rows.length > 0) {
      return res
        .status(401)
        .sendFile(path.join(__dirname, "../public/CustomerLogin.html"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, email, password) VALUES($1, $2, $3)",
      [username, email, hashedPassword]
    );
    req.session.username = username;
    req.session.authenticated = true;
    return res.sendFile(path.join(__dirname, "../public/CustomerLogin.html"));
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0) {
      return res
        .status(401) // Unauthorized
        .sendFile(path.join(__dirname, "../public/CustomerLogin.html"));
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      req.session.username = user.email; // or user.username
      req.session.authenticated = true;
      return res.redirect("/CustomerDashboard.html"); // Redirection
    } else {
      return res
        .status(401) // Unauthorized
        .sendFile(path.join(__dirname, "../public/CustomerLogin.html"));
    }
  } catch (error) {
    console.error(error); // Log error for debugging
    return res.status(500).json({ message: "Server not responding", error: error.message });
  }
};