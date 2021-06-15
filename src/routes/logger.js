const express = require('express');
const router = express.Router();
const { withAuth } = require('../middlewares/withAuth');
const conn = require('../utils/db');

router.get('/', withAuth, function (req, res) {
  res.render('logger', {
    path: 'logger',
    pageTitle: "Nhật ký",
    allow: false
  });
})

// Enable/disable logs
router.put('/toggle', async function (req, res) {
  const db = conn(req.session.user);
  const { enable } = req.body;

  console.log('enable :>> ', enable);
  // Add code here
  // await db.raw(`SELECT 1 from dual`);

  res.json({ status: 'ok' })
})

module.exports = router;