const express = require('express')
const morgan = require('morgan')
const {engine} = require('express-handlebars');
const cookieParser = require("cookie-parser");
const db = require('./config/db')
const cors = require("cors");

require('dotenv').config();

const Role = require('./app/models/Role')
// Connect to database
db.connect(initial);

const path = require('path');
const app = express()
app.use(cookieParser());

const port = process.env.PORT || 5000;
app.use(cors());
;
const route = require('./routes');


app.use(express.static(path.join(__dirname,'public')))

app.use (express.urlencoded())
app.use (express.json())
app.use(require('express-session')({
  secret: 'test',
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));




// http logger
app.use(morgan('combined'))

// template engine
app.engine('hbs', engine({
  extname: '.hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'resources/views'))

const http = require('http');
const server = http.createServer(app);
// Route init
route(app);

async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await new Role({
        name: "user",
      }).save();
      console.log("added 'user' to roles collection");

      await new Role({
        name: "adminA",
      }).save();
      console.log("added 'admin A' to roles collection");

      await new Role({
        name: "adminB",
      }).save();
      console.log("added 'admin B' to roles collection");
    }
  } catch (err) {
    console.log("error", err);
  }
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
});