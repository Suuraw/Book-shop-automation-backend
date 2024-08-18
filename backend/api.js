import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const _dirname = dirname(fileURLToPath(import.meta.url));
const port = 5000;
const api = express();

api.use(express.static("public")); // Serves static files from the 'public' directory
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

api.get("/", (req, res) => {
  res.sendFile(_dirname + "/public/index.html");
});

api.post("/customer/submit", async (req, res) => {
  const { username, password } = req.body;

  try {
    const respond = await axios.post("http://localhost:3000/auth", {
      username,
    });
    if (respond.status === 200) {
      // If authentication is successful
      res.json({ success: true });
    } else {
      // If authentication fails
      res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error occurred while authenticating:", error.message);
    res.status(500).json({ success: false, message: "Authentication service error" });
  }
});

api.post("/clerk/submit", async (req, res) => {
  const { username, password } = req.body;

  try {
    const respond = await axios.post("http://localhost:3000/auth", {
      username,
    });
    if (respond.status === 200) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error occurred while authenticating:", error.message);
    res.status(500).json({ success: false, message: "Authentication service error" });
  }
});

api.post("/owner/submit", async (req, res) => {
  const { username, password } = req.body;

  try {
    const respond = await axios.post("http://localhost:3000/auth", {
      username,
    });
    if (respond.status === 200) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error occurred while authenticating:", error.message);
    res.status(500).json({ success: false, message: "Authentication service error" });
  }
});

api.listen(port, () => {
  console.log(`The API is running on port ${port}`);
});
