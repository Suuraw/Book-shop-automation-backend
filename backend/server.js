import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// Set up the database connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Users",
  password: "sujay123",
  port: "5432",
});

// Connect to the database
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize an empty array to hold user data
let Data = [];

// Function to fetch user data from the database
const fetchUserData = async () => {
  try {
    const res = await db.query("SELECT * FROM users");
    Data = res.rows;
    console.log("User Data:", Data);
  } catch (err) {
    console.error("Error executing the query:", err.stack);
    // Set Data to an empty array if an error occurs to avoid further issues
    Data = [];
  }
  db.end()
};

// Fetch user data on server startup
fetchUserData();

app.get("/", (req, res) => {
  return res.json({ message: "Server is running fine" });
});

app.post("/auth", (req, res) => {
  const { username } = req.body;

  const find = Data.find((user) => user.name === username);

  if (find) {
    return res.status(200).json({ message: "User exists" });
  } else {
    return res.status(404).json({ message: "User doesn't exist" });
  }
});

// Close the database connection when the server is shut down
  


app.listen(port, () => {
  console.log(`The server is listening on port ${port}`);
});
