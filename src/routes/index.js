const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const roleRoutes = require('./roles');
const privilegeRoutes = require('./privileges');
const loggerRoutes = require('./logger');
const otherRoutes = require('./others');
const {withAuth} = require('../middlewares/withAuth');

router
.use('/auth', authRoutes)
.use('/users', withAuth, userRoutes)
.use('/roles', withAuth, roleRoutes)
.use('/privileges', withAuth, privilegeRoutes)
.use('/others', withAuth, otherRoutes)
.use('/logger', withAuth, loggerRoutes)
.get('/', function (req, res) {
  res.redirect('/users');
})

module.exports = router;