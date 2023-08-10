const express = require("express");
const morgan = require("morgan");
const { WebSocketServer } = require("ws");
const { engine } = require("express-handlebars");
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const cors = require("cors");
const messagingClient = require("./app/mqtt/mqtt");
const initial = require("./initial");
const changeStreams = require("./changeStreams");
changeStreams();
require("dotenv").config();
const http = require("http");
const app = express();
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });
const { connect, WebSocketHandle } = require("./app/webSocket/connect");
connect(wsServer);
// Connect to database
db.connect(initial);

const path = require("path");
app.use(cookieParser());

// Kết nối tới MQTT broker
messagingClient.connectWithPromise();
messagingClient.subscribe(
  "messages/dc9d5717-2522-4f39-a899-cce286152284/attributets"
);

messagingClient.registerMessageHandler(WebSocketHandle.broadcastMessagetoUser);
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const route = require("./routes");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("combined"));

// template engine
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

// Route init
route(app);

server.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
