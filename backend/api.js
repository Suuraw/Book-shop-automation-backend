//not in use
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const _dirname = dirname(fileURLToPath(import.meta.url));
const port = 5000;
const app = express();

app.use(express.static("public")); // Serves static files from the 'public' directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(_dirname + "/public/index.html");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await axios.post("http://localhost:3000/login", {
      username,
      password,
    });
    if (response.status === 200) {
      res.render(_dirname + "/Dashboard.html");
    } else if (response.status === 409) {
      res.render(path.join(_dirname, "public", "login.html"), {
        error: response.data.message,
      }); //target: return false which fronted js will trap and display required mssg
    } else if (response.status === 401) {
      res.render(
        path.join(_dirname, "public", "login.html", {
          error: response.data.message,
        })
      );
    }
  } catch (error) {
    return res.status(500).send({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`The API is running on port ${port}`);
});
