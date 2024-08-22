// controllers/authController.js
import bcrypt from "bcrypt";
import db from "../db/db.js";

export const checkExistingUser = async (username) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE username=$1", [
            username,
        ]);

        return res.rows.length > 0;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const signup = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userExists = await checkExistingUser(username);
        if (userExists) {
            return res.status(409).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (username,password) VALUES($1,$2)", [
            username,
            hashedPassword,
        ]);
        return res.status(201).json({ message: "Signed up Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query("SELECT * FROM users WHERE username=$1", [
            username,
        ]);
        if (result.rows.length === 0) {
            return res.status(409).json({ message: "Invalid Username" });
        }
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            return res.status(200).json({ message: "Login Successful" });
        } else {
            return res.status(401).json({ message: "Invalid Password" });
        }
    } catch (error) {
        return res.status(500).json("Server Not responding");
    }
};

