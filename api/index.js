import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // تحميل المتغيرات من .env

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PAGE_ACCESS_TOKEN =
  "EAAN2h5lZBP9YBO8rpvOk6DmzpMIWqVZBPv3z7ZBmpGcfd6Fs7FpvCKXLrbEV0uC27L0ITv3ctlPX3SfNAi9rNPISevt7YzWBiw1ZB9BeFIeEZAhJtVHTnRckWXfjMlz5eXC7dJixpp4exB8yCxC2eQxcjfYWnq3uaT6KwkcpDZApuou962UvzsqGfYrimcKc1pywZDZD";

const graph_api = `https://graph.facebook.com/v7.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.send("No Risk No Fun Yaaa Maجdy 😂");
});

app.get("/privacy", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "privacy.html"));
});

app.get("/webhook", (req, res) => {
  const PAGE_VERIFICATION_TOKEN = "my_super_secret_token";
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (token === PAGE_VERIFICATION_TOKEN) {
    console.log("Token is valid, sending challenge back to Facebook.");
    res.status(200).send(challenge);
  } else {
    console.log("Token is invalid, not sending challenge back to Facebook.");
    res.status(403).send("Forbidden");
  }
});



// Helpers
async function setupGetStartedButton() {
  const data = {
    get_started: {
      payload: "GET_STARTED_PAYLOAD",
    },
  };

  await axios.post(graph_api, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function setupGreetingText() {
     // var data= {
    //     "get_started": {
    //         "payload": "GET_STARTED_PAYLOAD"
    //     },
    //     "greeting": [
    //         {
    //             "locale": "default",
    //             "text": "Hello {{user_first_name}}!"
    //         }
    //     ],
    //     "persistent_menu": [
    //         {
    //             "locale": "default",
    //             "composer_input_disabled": false,
    //             "call_to_actions": [
    //                 {
    //                     "title": "Start",
    //                     "type": "postback",
    //                     "payload": "START_PAYLOAD"
    //                 },
    //                 {
    //                     "title": "Help",
    //                     "type": "postback",
    //                     "payload": "HELP_PAYLOAD"
    //                 }
    //             ]
    //         }
    //     ]
    // }
  const data = {
    greeting: [
      {
        locale: "default",
        text: "Hello {{user_first_name}}!",
      },
      {
        locale: "ar_AR",
        text: "مرحبا {{user_first_name}}!",
      },
    ],
  };

  await axios.post(graph_api, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

app.use("/setup", async (req, res) => {
  try {
    await setupGetStartedButton();
    await setupGreetingText();
    res.status(200).send("Setup completed successfully.");
  } catch (error) {
    console.error("❌ Error during setup:", error);
    res.status(500).send("Error during setup: " + error.message);
  }
});

// Run server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

export default app;
