const express = require('express');
const router = express.Router();
const conn = require('../utils/db');

router.get('/', async function (req, res) {
  const data = {
    path: 'objects',
    pageTitle: "Đối tượng",
  }
  try {
    const db = conn(req.session.user);
    data.list = await db.raw(`select OBJECT_NAME, OWNER, OBJECT_TYPE from all_objects where OBJECT_TYPE in ('TABLE', 'VIEW', 'SYNONYM', 'PROCEDURE', 'FUNCTION')`
    );
  } catch (error) {
    console.log(error);
    data.error = {
      message: "Không có quyền xem danh sách đối tượng"
    };
  }
  finally {
    res.render('objects', data);
  }
})
module.exports = router;