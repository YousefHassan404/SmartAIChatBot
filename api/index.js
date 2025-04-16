import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("No Risk No Fun Yaaa Maجdy 😂");
});

app.get("/webhook",(req,res)=>{
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

})


export default app;
