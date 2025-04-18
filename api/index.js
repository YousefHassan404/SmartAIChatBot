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
  "EAAN2h5lZBP9YBOZCgqyfrOrZCbQcwFfI5tHMRvcAzf4JpcPZB4dzXhAOcghzSyXHdDD4cEqZB63ADF141VtZBCcHVoj0YmWaEyqB7pNNeZCiKVUDZC6Gv2Vy8ykxUacNvoudTSpaa93YWT3KEdkJpzMb9u9fSOoHeNDDJ15Ev9fjJZBhzZC51rGSPBWSmaeu6FE6mm6AZDZD";

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

function receivedMessage(event) {
  var senderId = event.sender.id; // ID of the user who sent the message
  var messageText = event.message.text; // Text content of the message

  // Handle the message based on its content
  switch (
    messageText.toLowerCase() // Convert to lowercase for case-insensitive matching
  ) {
    case "hi":
      var msg = "You sent 'Hi'. How are you?";
      sendTextMessage(senderId, msg);
      break;
    case "help":
      var msg = "Sure, I'm here to help! What can I assist you with?";
      sendTextMessage(senderId, msg);
      break;
    default:
      var msg =
        "I'm not sure how to respond to that. Try saying 'Hi' or 'Help'.";
      sendTextMessage(senderId, msg);
      break;
  }
}

function receivedPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;

  switch (payload) {
    case "GET_STARTED_PAYLOAD":
      var msg = "Welcome in this chatbot! How can I help you?";
      sendTextMessage(senderId, msg);
      break;

    case "PAYLOAD1":
      var msg = "Talk to an agent";
      sendTextMessage(senderId, msg);
      break;

    case "PAYLOAD2":
      var msg = "Outfit suggestions";
      sendTextMessage(senderId, msg);
      break;

    default:
      var msg = "Handle this postback";
      sendTextMessage(senderId, msg);
      break;
  }
}

function sendTextMessage(recipientId, msg) {
  var data = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: msg,
    },
  };

  // Send the message using axios
  axios
    .post(
      `https://graph.facebook.com/v7.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log("Message sent successfully:", response.data);
    })
    .catch((error) => {
      console.error(
        "Error sending message:",
        error.response ? error.response.data : error.message
      );
    });
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
