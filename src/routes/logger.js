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
    pageTitle: "Nhật ký thao tác người dùng DBA"
  }
  try {
    const db = conn(req.session.user);
    data.list = await db.raw(`select username, owner, obj_name, action_name, sql_text,
    to_char(timestamp,'MM-DD-YYYY HH24:MI:SS') as time
      from dba_audit_trail where rownum <= 100`);
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
    pageTitle: "Nhật ký đăng nhập thất bại"
  }
  try {
    const db = conn(req.session.user);
    data.list = await db.raw(`select 
        os_username,
        username,
        terminal,
        to_char(timestamp,'MM-DD-YYYY HH24:MI:SS') as time
    from dba_audit_trail where rownum <= 100`);
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



router.get('/3', withAuth, async function (req, res) {
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
    res.render('logger-3', data);
  }
})

module.exports = router;