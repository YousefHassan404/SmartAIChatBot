import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Message from "../models/message.js"; // تأكد من المسار الصحيح لنموذج الرسالة
dotenv.config(); // تحميل المتغيرات من .env

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_ACCESS_TOKEN =
  "EAAN2h5lZBP9YBO8dbkNYYML9b3oWiVANqsAOczSfDob1jKpZA000m7SCG4rVUpKYTxeZBZCuzj4SwsZCKZBLPA6ZB8f0pZCAeA9GWMcJjY7JLBWlb1Lx9yuq5AANmhAdLtzzAeZCpbzkArhl4yPARNtbHp7fKZCZANu5OLsstXnXYdTCqJMR3W9OvdheXsV8Yi8ZBp6rtTpL0G0O2CfZCf0MA4rkhMhkZD";

const graph_api = `https://graph.facebook.com/v7.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`;


mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/chatbot", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.send("Server Side of Agency Chatbot");
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

app.post("/webhook", function (req, res) {
  var data = req.body;

  // Check if the incoming data is related to a page
  if (data.object === "page") {
    data.entry.forEach(function (entry) {
      var pageID = entry.id;
      var timeStamp = entry.time;

      // Process each messaging event
      entry.messaging.forEach(function (event) {
        var senderID = event.sender.id; // Sender's ID
        var recipientID = event.recipient.id; // Recipient's ID (usually your page)

        // Handle message events
        if (event.message) {
          receivedMessage(event);
        }
        // Handle postback events
        else if (event.postback) {
          receivedPostback(event);
        }
      });
    });

    // Send a 200 OK response to acknowledge receipt of the request
    res.sendStatus(200);
  } else {
    // Handle other types of objects if necessary
    res.sendStatus(400); // Bad Request
  }
});

async function receivedMessage(event) {
  const senderId = event.sender.id;
  const messageText = event.message.text;

  // Save to DB
  const messageDoc = new Message({
    senderId,
    recipientId: event.recipient.id,
    messageType: "text",
    messageText,
  });
  await messageDoc.save();

  // Respond
  switch (messageText.toLowerCase()) {
    case "hi":
      sendTextMessage(senderId, "You sent 'Hi'. How are you?");
      break;
    case "help":
      sendTextMessage(senderId, "Sure, I'm here to help! What can I assist you with?");
      break;
    default:
      sendTextMessage(senderId, "I'm not sure how to respond to that. Try saying 'Hi' or 'Help'.");
      break;
  }
}

async function receivedPostback(event) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  // Save to DB
  const messageDoc = new Message({
    senderId,
    recipientId: event.recipient.id,
    messageType: "postback",
    postbackPayload: payload,
  });
  await messageDoc.save();

  // Respond
  switch (payload) {
    case "GET_STARTED_PAYLOAD":
      sendTextMessage(senderId, "Welcome in this chatbot! How can I help you?");
      break;
    case "PAYLOAD1":
      sendTextMessage(senderId, "Talk to an agent");
      break;
    case "PAYLOAD2":
      sendTextMessage(senderId, "Outfit suggestions");
      break;
    default:
      sendTextMessage(senderId, "Handle this postback");
      break;
  }
}


// Helpers
async function setuppersistent_menu() {
  const data = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "postback",
            title: "Talk to an agent",
            payload: "CARE_HELP",
          },
          {
            type: "postback",
            title: "Outfit suggestions",
            payload: "CURATION",
          },
          {
            type: "web_url",
            title: "Shop now",
            url: "https://q-life.netlify.app/",
            webview_height_ratio: "full",
          },
        ],
      },
    ],
  };
}

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
    await setuppersistent_menu();
    res.status(200).send("Setup completed successfully.");
  } catch (error) {
    console.error("❌ Error during setup:", error);
    res.status(500).send("Error during setup: " + error.message);
  }
});

// Run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
