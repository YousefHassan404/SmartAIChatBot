import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Root route
app.get("/", (req, res) => {
  res.send("No Risk No Fun Yaaa Maجdy 😂");
});

// Static files
app.use(express.static(path.join(__dirname, "..", "public")));

// Privacy policy route
app.get("/privacy", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "privacy.html"));
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const PAGE_VERIFICATION_TOKEN = "my_super_secret_token";
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (token === PAGE_VERIFICATION_TOKEN) {
    console.log("Token is valid, sending challenge back to Facebook.");
    res.status(200).send(challenge);
  } else {
    console.log("Token is invalid, not sending challenge back to Facebook.");
    res.status(403).send("Forbidden");
  }
});


// app.listen(3000, () => {
//     console.log('Server running on port 3000');
//   });

export default app;
