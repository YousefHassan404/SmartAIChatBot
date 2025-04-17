import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();


const PAGE_ACCESS_TOKEN =
  "EAAN2h5lZBP9YBO8rpvOk6DmzpMIWqVZBPv3z7ZBmpGcfd6Fs7FpvCKXLrbEV0uC27L0ITv3ctlPX3SfNAi9rNPISevt7YzWBiw1ZB9BeFIeEZAhJtVHTnRckWXfjMlz5eXC7dJixpp4exB8yCxC2eQxcjfYWnq3uaT6KwkcpDZApuou962UvzsqGfYrimcKc1pywZDZD";

  const graph_api =
  `https://graph.facebook.com/v7.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`;
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

app.use("/setup" , (req ,res)=>{
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

    var data = {
        "greeting":[
            {
                "locale":"default",
                "text":"Hello {{user_first_name}}!"
            },{
                "locale":"ar_AR",
                "text":"مرحبا {{user_first_name}}!"
            }
        ]
    }

    request(
        {
            url : graph_api,
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            form:data
        },
        (err, response, body) => {
            if (!err && response.statusCode === 200) {
                console.log("Setup completed successfully.");
                res.status(200).send("Setup completed successfully.");
            } else {
                console.error("Error setting up Messenger profile:", err || body);
                res.status(500).send("Error setting up Messenger profile.");
            }
        }
    )

})

// app.listen(3000, () => {
//     console.log('Server running on port 3000');
//   });

export default app;
