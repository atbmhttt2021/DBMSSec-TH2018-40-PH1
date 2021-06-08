const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require('express-async-errors');
const routes = require('./routes/index');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('assets'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const session = require('express-session');
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'mysecret0', 
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour session
  })
);

//use routes
app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).json({
    error_message: "Endpoint not found"
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error_message: "Something broke!",
    error: err.stack
  })
})

const PORT = 3000;
app.listen(PORT, function () {
  console.log(`App is running at http://localhost:${PORT}`);
})