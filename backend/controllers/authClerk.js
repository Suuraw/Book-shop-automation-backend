import db from "../db/db.js";
import bcrypt from "bcrypt";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const clerkSignup = async (req, res) => {
  const { username, password,email } = req.body;
try{
    const result = await db.query("SELECT * FROM clerk WHERE clerk_name=$1", [username]);
    if (result.rows.length > 0) {
      return res.status(409).sendFile(path.join(__dirname, '../public/login.html'), {
        headers: { 'X-Error-Message': 'Username already exists' }
      });
    }
    const result1=await db.query("SELECT email FROM clerk WHERE email=$1", [email]);
    if(result.rows.length>0)
    return res.status(401).sendFile(path.join(__dirname,"../public/signupClerk.html"));
   
    const encryptedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO clerk (clerk_name, email, password) VALUES ($1, $2, $3)", [username, email, encryptedPassword]);

    // Set session after successful signup
    req.session.username = username;
    req.session.authenticated = true;

    res.sendFile(path.join(__dirname, '../public/ClerkAuthentication.html'), {
      headers: { 'X-Success-Message': 'Signup Successful' }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).sendFile(path.join(__dirname, '../public/login.html'), {
      headers: { 'X-Error-Message': 'Server not responding' }
    });
  }
};

export const clerkLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM clerk WHERE clerk_name=$1", [username]);
    if (result.rows.length === 0) {
      return res.redirect('/login.html');
    }

    const user = result.rows[0];
    if (user.token !== token) {
      return res.redirect('/login.html');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      // Set session after successful login
      req.session.username = username;
      req.session.authenticated = true;

      return res.redirect('/index.html'); // Relative URL
    } else {
      return res.redirect('/login.html');
    }
  } catch (error) {
    console.log(error);
    return res.redirect('/login.html');
  }
};
