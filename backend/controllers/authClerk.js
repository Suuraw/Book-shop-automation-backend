import db from "../db/db.js";
import bcrypt from "bcrypt";

export const clerkSignup = async (req, res) => {
  const { username, password } = req.body;
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log(token);
  } else {
    return res.status(401).json({ messgae: "Null token" });
  }

  try {
    const authToken = await db.query(
      "SELECT * FROM registered WHERE token=$1",
      [token]
    );
    if (authToken.rows.length === 0) {
      return res
        .status(401)
        .json({ messgae: "Unregistered Clerk or wrong token ! Contact owner" });
    }
    const result = await db.query("SELECT * FROM clerk WHERE clerk_name=$1", [
      username,
    ]);
    if (result.rows.length > 0)
      return res.status(409).json({ messgae: "Username already exist" });
    const encrptPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO clerk (clerk_name,token,password) VALUES ($1,$2,$3)",
      [username, token, encrptPassword]
    );

    return res.status(200).json({ messgae: "Signup Successfull" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ messgae: "Server not responding" });
  }
};


//login
export const clerkLogin = async (req, res) => {
  const { username, password } = req.body;
  const authHeader=req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log(token);
  } else {
    return res.status(401).json({ messgae: "Null token" });
  }

  try {
    const result = await db.query("SELECT * FROM clerk WHERE clerk_name=$1", [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(409).json({ message: "Invalid Username" });
    }
    const user = result.rows[0];
    if(user.token!==token)
    {
        return res.status(409).json({message:"Invalid Token"})
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      return res.status(200).json({ message: "Login Successful" });
    } else {
      return res.status(401).json({ message: "Invalid Password" });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json("Server Not responding");
  }
};
