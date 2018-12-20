require("dotenv").config();
const express = require("express");
const app = express();
const truffle_connect = require("./utils/connection");
const bodyParser = require("body-parser");
const log = require("./utils/log");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// logger
app.use((req, res, next) => {
  const now = new Date().toString().slice(4, 24);
  res.on("finish", () => {
    log.Logger(`${now} ${req.method} ${res.statusCode} ${req.url}`);
  });
  next();
});

app.use("/", express.static("public_static"));

app.get("/getAccounts", (req, res) => {
  truffle_connect
    .getAccounts()
    .then(answer => {
      res.status(200).send(answer);
    })
    .catch(err => {
      log.Error(`There was an error fetching your accounts.\n${err}`);
      res.status(400).send(err);
    });
});

app.get("/certificate/data/:id", (req, res) => {
  let certificateId = req.params.id;
  truffle_connect
    .getCertificateData(certificateId)
    .then(data => res.send(data))
    .catch(err => res.status(400).send({ err }));
});

app.post("/sendCoin", (req, res) => {
  log.Print("**** GET /sendCoin ****");
  log.Print(req.body);

  let amount = req.body.amount;
  let sender = req.body.sender;
  let receiver = req.body.receiver;

  truffle_connect.sendCoin(amount, sender, receiver, balance => {
    res.send(balance);
  });
});

const port = 3000 || process.env.PORT;
if (process.env.NODE_ENV === undefined) process.env.NODE_ENV = "development";

app.listen(port, () => {
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  truffle_connect.connectWeb3();
  log.Info(
    `This is a ${
      process.env.NODE_ENV
    } environment.\nServer is up on port ${port}`
  );
});

module.exports = { app };
