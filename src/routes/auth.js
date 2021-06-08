const express = require('express');
const router = express.Router();
const {withNoAuth} = require('../middlewares/withAuth');
const db = require('../utils/db');

// Load login page
router.get('/login', withNoAuth, function (req, res) {
  res.render('login', {
    path: 'login',
    pageTitle: "Đăng nhập"
  });
})

// Login action
router.post('/login', withNoAuth, async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const conn = db({username, password});
  // Test connection
  await conn.raw('SELECT 1 FROM DUAL');
  
  req.session.user = {
    username: username.toUpperCase(),
    password
  }
  res.json({username});
})

// Logout action
router.get('/logout', function (req, res) {
  req.session.destroy(function(err) {
    return res.status(200).json({status: 'ok'})
  })
})
module.exports = router;