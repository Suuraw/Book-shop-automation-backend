import db from "../db/db.js";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
// export const clerkSignup = async (req, res) => {
//   const { username, password } = req.body;
//   const authHeader = req.headers.authorization;
//   let token = null;
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     token = authHeader.split(" ")[1];
//     console.log(token);
//   } else {
//     // return res.status(401).json({ messgae: "Null token" });
//     res.send({messgae:"Invalid Token"})
//   }

//   try {
//     const authToken = await db.query(
//       "SELECT * FROM registered WHERE token=$1",
//       [token]
//     );
//     if (authToken.rows.length === 0) {
//       // return res
//       //   .status(401)
//       //   .json({ messgae: "Unregistered Clerk or wrong token ! Contact owner" });
//       return res.send({message:"Unregistered Clerk or wrong token ! Contact owneR"})
//     }
    
//     const result = await db.query("SELECT * FROM clerk WHERE clerk_name=$1", [
//       username,
//     ]);
//     if (result.rows.length > 0)
//       // return res.status(409).json({ messgae: "Username already exist" });
//     return res.send({message:"Username Already exist"})
//     const encrptPassword = await bcrypt.hash(password, 10);
//     await db.query(
//       "INSERT INTO clerk (clerk_name,token,password) VALUES ($1,$2,$3)",
//       [username, token, encrptPassword]
//     );

//     res.render("login.html",{
//       message:"Signup Successfull"
//     });
//   } catch (error) {
//     console.log(error);
//     // return res.status(500).json({ messgae: "Server not responding" });
//     return res.send({message:"Server not responding"})
//   }
// };

//login
// export const clerkLogin = async (req, res) => {
//   const { username, password } = req.body;
//   const authHeader=req.headers.authorization;
//   let token = null;
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     token = authHeader.split(" ")[1];
//     console.log(token);
//   } else {
//     // return res.status(401).json({ messgae: "Null token" });
//     res.redirect("login.html");
//   }

//   try {
//     const result = await db.query("SELECT * FROM clerk WHERE clerk_name=$1", [
//       username,
//     ]);
//     if (result.rows.length === 0) {
//       // return res.status(409).json({ message: "Invalid Username" });
//       res.redirect("login.html")
//     }
//     const user = result.rows[0];
//     if(user.token!==token)
//     {
//         // return res.status(409).json({message:"Invalid Token"})
//         res.redirect("login.html")
//     }
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (validPassword) {
//       // return res.status(200).json({ message: "Login Successful" });
//       res.redirect("index.html");
//     } else {
//       // return res.status(401).json({ message: "Invalid Password" });
//       res.redirect("login.html");
//     }
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json("Server Not responding");
//   }
// };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const clerkSignup = async (req, res) => {
  const { username, password } = req.body;
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    return res.status(401).sendFile(path.join(__dirname, '../public/login.html'), {
      headers: { 'X-Error-Message': 'Invalid Token' }
    });
  }

  try {
    const authToken = await db.query("SELECT * FROM registered WHERE token=$1", [token]);
    if (authToken.rows.length === 0) {
      return res.status(401).sendFile(path.join(__dirname, '../public/login.html'), {
        headers: { 'X-Error-Message': 'Unregistered Clerk or wrong token! Contact owner' }
      });
    }

    const result = await db.query("SELECT * FROM clerk WHERE clerk_name=$1", [username]);
    if (result.rows.length > 0) {
      return res.status(409).sendFile(path.join(__dirname, '../public/login.html'), {
        headers: { 'X-Error-Message': 'Username already exists' }
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO clerk (clerk_name, token, password) VALUES ($1, $2, $3)", [username, token, encryptedPassword]);

    // Set session after successful signup
    req.session.username = username;
    req.session.authenticated = true;

    res.sendFile(path.join(__dirname, '../public/login.html'), {
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
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    return res.redirect('/login.html'); // Relative URL
  }

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
