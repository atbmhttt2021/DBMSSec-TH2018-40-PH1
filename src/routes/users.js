const express = require('express');
const router = express.Router();
const conn = require('../utils/db');

// List all
router.get('/', async function (req, res) {
  const data = {
    path: 'users',
    pageTitle: "Người dùng"
  }
  try {
    const db = conn(req.session.user);
    const username = req.session.user.username;
    data.list = await db.raw(`SELECT username, user_id, account_status FROM dba_users WHERE username != '${username}' ORDER BY created DESC`);
  } catch (error) {
    console.log(error);
    data.error = {
      message: "Không có quyền xem danh sách người dùng"
    };
  }
  finally {
    res.render('users', data);
  }
})

// Add user
router.post('/', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.body.username;
  const password = req.body.password;
  await db.raw(`alter session set "_ORACLE_SCRIPT"=true` );
  await db.raw(`CREATE USER ${username} IDENTIFIED BY ${password}`);
  res.json({status: 'ok'})
})

// Edit user: change password
router.patch('/pw', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.body.username;
  const password = req.body.password;
  await db.raw(`ALTER USER ${username} IDENTIFIED BY ${password}`);
  res.json({status: 'ok'})
})
// Edit user: lock account
router.patch('/:username/lock', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.params.username;
  await db.raw(`ALTER USER ${username} ACCOUNT LOCK`);
  res.json({status: 'ok'})
})
// Edit user: unlock account
router.patch('/:username/unlock', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.params.username;
  await db.raw(`ALTER USER ${username} ACCOUNT UNLOCK`);
  res.json({status: 'ok'})
})

// Delete user
router.delete('/:username', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.params.username;
  await db.raw(`alter session set "_ORACLE_SCRIPT"=true` );
  await db.raw(` DROP USER ${username} CASCADE `);
  res.json({status: 'ok'})
})

// List roles by user
router.get('/:username/roles', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.params.username;
  const search = req.query.q;
  const list = await db.raw(`SELECT
      grantee, granted_role, admin_option, default_role
    FROM dba_role_privs
    WHERE grantee = '${username}' 
    ${search ? `AND UPPER(granted_role) LIKE UPPER('%${search}%')` : ''}`);
  res.json(list)
})

// Grant role to user
router.post('/:username/roles/grant/:role', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.params.username;
  const role = req.params.role;
  const option = req.query.option === 'true';
  await db.raw(`GRANT ${role} TO ${username} ${option ? 'WITH ADMIN OPTION' : ''}`);
  res.json({status: 'ok'})
})
// Rvoke role from user
router.post('/:username/roles/revoke/:role', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.params.username;
  const role = req.params.role;
  await db.raw(`REVOKE ${role} FROM ${username}`);
  res.json({status: 'ok'})
})

// List table privileges by user
router.get('/:username/privileges/tab', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.params.username;
  const search = req.query.q;
  const list = await db.raw( `SELECT grantee, owner, table_name, column_name, grantor, privilege, grantable FROM dba_col_privs WHERE grantee = '${username}' UNION SELECT grantee, owner, table_name, NULL AS column_name, grantor, privilege, grantable FROM dba_tab_privs WHERE grantee = '${username}'
${search ? `AND UPPER(privilege) LIKE UPPER('%${search}%')
AND UPPER(table_name) LIKE UPPER('%${search}%')
AND UPPER(column_name) LIKE UPPER('%${search}%')`
: ''}`);

//   `SELECT
//   grantee, owner, table_name, column_name, grantor, privilege, grantable
// FROM dba_col_privs
// WHERE grantee = '${username}'
// UNION 
// SELECT
// grantee, owner, table_name, NULL AS column_name, grantor, privilege, grantable
// FROM dba_tab_privs
// WHERE grantee = '${username}'
// ${search ? `AND UPPER(privilege) LIKE UPPER('%${search}%')
// AND UPPER(table_name) LIKE UPPER('%${search}%')
// AND UPPER(column_name) LIKE UPPER('%${search}%')`
// : ''}`
  res.json(list)
})

// Grant table privileges to user
router.post('/:username/privileges/tab/grant', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.params.username;
  const privilege = req.body.privilege;
  const table = req.body.table;
  const columns = req.body.columns;
  const option = req.query.option === 'true';
  if(privilege === 'UPDATE'){
    await db.raw(`GRANT ${privilege} ${columns ? `(${columns})` : ''} ON ${table} TO ${username} ${option ? 'WITH GRANT OPTION' : ''}`);
  }
  if(privilege === 'SELECT'){
    if(columns){
      await db.raw(`CREATE OR REPLACE VIEW ${table}_view
          AS
          SELECT
            ${columns}
          FROM
            ${table}`);
      await db.raw(`GRANT SELECT ON ${table} to ${username}`);
    } else {
      await db.raw(`GRANT ${privilege} ON ${table} TO ${username} ${option ? 'WITH GRANT OPTION' : ''}`);
    }
  }
  if(privilege === 'CREATE' || privilege === 'DELETE'|| privilege === 'INSERT'){
   
    await db.raw(`GRANT ${privilege} ON ${table} TO ${username} ${option ? 'WITH GRANT OPTION' : ''}`);
  }
  
  
  res.json({status: 'ok'})
})

// Revoke table privileges from user
router.post('/:username/privileges/tab/revoke', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.params.username;
  const privilege = req.body.privilege;
  const table = req.body.table;
  const owner=req.body.owner;
  await db.raw(`REVOKE ${privilege} ON ${owner}.${table} FROM ${username}`);
  res.json({status: 'ok'})
})

// List system privileges by user
router.get('/:username/privileges/sys', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.params.username;
  const search = req.query.q;
  const list = await db.raw(`SELECT grantee, privilege, admin_option
    FROM dba_sys_privs WHERE grantee = '${username}'
    ${search ? `AND UPPER(privilege) LIKE UPPER('%${search}%')` : ''}`);
  res.json(list)
})

// Grant system privileges to user
router.post('/:username/privileges/sys/grant/:privilege', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.params.username;
  const privilege = req.params.privilege;
  const option = req.query.option === 'true';
  await db.raw(`GRANT ${privilege} TO ${username} ${option ? 'WITH ADMIN OPTION' : ''}`);
  res.json({status: 'ok'})
})

// Revoke system privileges from user
router.post('/:username/privileges/sys/revoke/:privilege', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.params.username;
  const privilege = req.params.privilege;
  await db.raw(`REVOKE ${privilege} FROM ${username}`);
  res.json({status: 'ok'})
})


module.exports = router;