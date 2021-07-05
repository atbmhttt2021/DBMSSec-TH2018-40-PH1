const express = require('express');
const router = express.Router();
const conn = require('../utils/db');

// List all
router.get('/', async function (req, res) {
  const data = {
    path: 'roles',
    pageTitle: "Vai trò",
  }
  try {
    const db = conn(req.session.user);
    data.list = await db.raw(`SELECT role, password_required, authentication_type FROM dba_roles`);
  } catch (error) {
    console.log(error);
    data.error = {
      message: "Không có quyền xem danh sách vai trò"
    };
  }
  finally {
    res.render('roles', data);
  }
})

// Get avalable roles to grant
router.get('/available', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.query.username;
  const role = req.query.role;
  const search = req.query.q;
  if(username){
    const list = await db.raw(`SELECT role, password_required, authentication_type FROM dba_roles
      WHERE ROLE NOT IN 
      (SELECT granted_role
      FROM dba_role_privs WHERE grantee = '${username}')
      ${search ? `AND UPPER(role) LIKE UPPER('%${search}%')` : ''}`);
    res.json(list);
  }
  if(role){
    const list = await db.raw(`SELECT role, password_required, authentication_type FROM dba_roles
      WHERE ROLE NOT IN 
      (SELECT granted_role
      FROM role_role_privs WHERE role = '${role}')
      AND role != '${role}'
      ${search ? `AND UPPER(role) LIKE UPPER('%${search}%')` : ''}`);
    res.json(list);
  }
  res.json([]);
})

// Add role
router.post('/', async function (req, res) {
  const db = conn(req.session.user);
  const role = req.body.role;
  await db.raw(`CREATE ROLE ${role}`);
  res.json({status: 'ok'})
})

// Delete role
router.delete('/:role', async function (req, res) {
  const db = conn(req.session.user);
  const role = req.params.role;
  await db.raw(`DROP ROLE ${role}`);
  res.json({status: 'ok'})
})

// List roles by role
router.get('/:role/roles', async function (req, res) {
  const db = conn(req.session.user);
  const role = req.params.role;
  const search = req.query.q;
  const list = await db.raw(`SELECT
      role, granted_role, admin_option
    FROM role_role_privs
    WHERE role = '${role}' 
    ${search ? `AND UPPER(granted_role) LIKE UPPER('%${search}%')` : ''}`);
  res.json(list)
})

// Grant role to role
router.post('/:role/roles/grant/:rolename', async function (req, res) {
  const db = conn(req.session.user);
  const rolename = req.params.rolename;
  const role = req.params.role;
  const option = req.query.option === 'true';
  await db.raw(`GRANT ${rolename} TO ${role} ${option ? 'WITH ADMIN OPTION' : ''}`);
  res.json({status: 'ok'})
})
// Revoke role from role
router.post('/:role/roles/revoke/:rolename', async function (req, res) {
  const db = conn(req.session.user);
  const rolename = req.params.rolename;
  const role = req.params.role;
  await db.raw(`REVOKE ${rolename} FROM ${role}`);
  res.json({status: 'ok'})
})

// List table privileges by role
router.get('/:role/privileges/tab', async function (req, res) {
  const db = conn(req.session.user);
  const role = req.params.role;
  const search = req.query.q;
  const list = await db.raw(`SELECT
        owner, table_name, column_name, privilege, grantable
      FROM role_tab_privs
      WHERE role = '${role}'
    ${search ? `AND UPPER(privilege) LIKE UPPER('%${search}%')
      AND UPPER(table_name) LIKE UPPER('%${search}%')
      AND UPPER(column_name) LIKE UPPER('%${search}%')`
      : ''}`);
  res.json(list);
})

// Grant table privileges to role
router.post('/:role/privileges/tab/grant', async function (req, res) {
  const db = conn(req.session.user);
  const role = req.params.role;
  const privilege = req.body.privilege;
  const table = req.body.table;
  const columns = req.body.columns;
  if(privilege){
      await db.raw(`GRANT ${privilege} ${columns ? `(${columns})` : ''} ON ${table} TO ${role}`);
  }
  // if(privilege === 'UPDATE'){
  //   await db.raw(`GRANT ${privilege} ${columns ? `(${columns})` : ''} ON ${table} TO ${role}`);
  // }
  // if(privilege === 'SELECT'){
  //   if(columns){
  //     await db.raw(`CREATE OR REPLACE VIEW ${table}_view
  //         AS
  //         SELECT
  //           ${columns}
  //         FROM
  //           ${table}`);
  //     await db.raw(`GRANT SELECT ON ${table} to ${username}`);
  //   } else {
  //     await db.raw(`GRANT ${privilege} ON ${table} TO ${role}`);
  //   }
  // }
  // if(privilege === 'CREATE' || privilege === 'DELETE'){
  //   await db.raw(`GRANT ${privilege} ON ${table} TO ${role}`);
  // }
  res.json({status: 'ok'})
})

// Revoke table privileges from role
router.post('/:role/privileges/tab/revoke', async function (req, res) {
  const db = conn(req.session.user);
  const role = req.params.role;
  const privilege = req.body.privilege;
  const table = req.body.table;
  await db.raw(`REVOKE ${privilege} ON ${table} FROM ${role}`);
  res.json({status: 'ok'})
})

// List system privileges by role
router.get('/:role/privileges/sys', async function (req, res) {
  const db = conn(req.session.user);
  const role = req.params.role;
  const search = req.query.q;
  const list = await db.raw(`SELECT
        role, privilege, admin_option
      FROM role_sys_privs
      WHERE role = '${role}'
    ${search ? `AND UPPER(privilege) LIKE UPPER('%${search}%')`
    : ''}`);
  res.json(list);
})

// Grant system privileges to role
router.post('/:role/privileges/sys/grant/:privilege', async function (req, res) {
  const db = conn(req.session.user);
  const role = req.params.role;
  const privilege = req.params.privilege;
  const option = req.query.option === 'true';
  await db.raw(`GRANT ${privilege} TO ${role} ${option ? 'WITH ADMIN OPTION' : ''}`);
  res.json({status: 'ok'})
})

// Revoke system privileges from role
router.post('/:role/privileges/sys/revoke/:privilege', async function (req, res) {
  const db = conn(req.session.user);
  const role = req.params.role;
  const privilege = req.params.privilege;
  await db.raw(`REVOKE ${privilege} FROM ${role}`);
  res.json({status: 'ok'})
})

module.exports = router;