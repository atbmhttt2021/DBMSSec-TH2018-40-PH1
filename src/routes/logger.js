const express = require('express');
const router = express.Router();
const { withAuth } = require('../middlewares/withAuth');
const conn = require('../utils/db');

router.get('/', withAuth, function (req, res) {
  res.render('logger', {
    path: 'logging',
    pageTitle: "Nhật ký",
    allow: false
  });
})

router.get('/1', withAuth, async function (req, res) {
  const data = {
    path: 'logging',
    pageTitle: "Nhật ký thao tác của người dùng với các đối tượng cơ sở dữ liệu"
  }
  try {
    const db = conn(req.session.user);
    data.list = await db.raw('SELECT USERNAME, OWNER, OBJ_NAME, ACTION_NAME, SQL_TEXT FROM DBA_AUDIT_TRAIL');
    console.log('data.list :>> ', data.list);
  } catch (error) {
    console.log(error);
    data.error = {
      message: "Không có quyền xem nhật ký"
    };
  }
  finally {
    res.render('logger-1', data);
  }
})


router.get('/2', withAuth, async function (req, res) {
  const data = {
    path: 'logging',
    pageTitle: "Nhật ký thêm, sửa thông tin lương nhân viên"
  }
  try {
    const db = conn(req.session.user);
    data.list = await db.raw('SELECT DBUID, LSQLTEXT, NTIMESTAMP# FROM SYS.FGA_LOG$');
  } catch (error) {
    console.log(error);
    data.error = {
      message: "Không có quyền xem nhật ký"
    };
  }
  finally {
    res.render('logger-2', data);
  }
})

module.exports = router;