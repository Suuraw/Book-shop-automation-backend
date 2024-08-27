import db from "../db/db.js";
import bcrypt from "bcrypt";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const clerkSignup = async (req, res) => {
  const { username, password,email } = req.body;
try{
    const result = await db.query("SELECT * FROM clerk WHERE username=$1", [username]);
    if (result.rows.length > 0) {
      return res.status(409).sendFile(path.join(__dirname, '../public/CustomerLogin.html'), {
        headers: { 'X-Error-Message': 'Username already exists' }
      });
    }
    const result1=await db.query("SELECT email FROM clerk WHERE email=$1", [email]);
    if(result.rows.length>0)
    return res.status(401).sendFile(path.join(__dirname,"../public/CustomerSignup.html"));
   
    const encryptedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO clerk (username, email, password) VALUES ($1, $2, $3)", [username, email, encryptedPassword]);

    // Set session after successful signup
    req.session.username = username;
    req.session.authenticated = true;

    res.sendFile(path.join(__dirname, '../public/CustomerLogin.html'), {
      headers: { 'X-Success-Message': 'Signup Successful' }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).sendFile(path.join(__dirname, '../public/CustomerSignup.html'), {
      headers: { 'X-Error-Message': 'Server not responding' }
    });
  }
};

export const clerkLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM clerk WHERE username=$1", [username]);
    if (result.rows.length === 0) {
      return res.sendFile(path.join(__dirname, '../public/CustomerSignup.html'));
    }
    const validPassword = await bcrypt.compare(password, result.rows[0].password);
    if (validPassword) {
      // Set session after successful login
      req.session.username = username;
      req.session.authenticated = true;

      return res.sendFile(path.join(__dirname,'../public/CustomerDashboard.html')); // Relative URL
    } else {
      return res.sendFile(path.join(__dirname,'../public/CustomerLogin.html'));
    }
  } catch (error) {
    console.log(error);
    return res.redirect(path.join(__dirname,'../public/CustomerLogin.html'));
  }
};
