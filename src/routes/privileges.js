const express = require('express');
const router = express.Router();
const conn = require('../utils/db');

router.get('/', async function (req, res) {
  const data = {
    path: 'privileges',
    pageTitle: "Quyền",
  }
  try {
    const db = conn(req.session.user);
    data.list = await db.raw(`SELECT PRIVILEGE, OBJ_OWNER, OBJ_NAME,USERNAME, LISTAGG(GRANT_TARGET, ',') WITHIN GROUP (ORDER BY GRANT_TARGET) AS GRANT_SOURCES, 
          MAX(ADMIN_OR_GRANT_OPT) AS ADMIN_OR_GRANT_OPT, 
          MAX(HIERARCHY_OPT) AS HIERARCHY_OPT
      FROM (
          WITH ALL_ROLES_FOR_USER AS (
              SELECT DISTINCT CONNECT_BY_ROOT GRANTEE AS GRANTED_USER, GRANTED_ROLE
              FROM DBA_ROLE_PRIVS
              CONNECT BY GRANTEE = PRIOR GRANTED_ROLE
          )
          SELECT
              PRIVILEGE,OBJ_OWNER,OBJ_NAME,USERNAME,REPLACE(GRANT_TARGET, USERNAME, 'Direct to user') AS GRANT_TARGET,ADMIN_OR_GRANT_OPT,HIERARCHY_OPT
          FROM (
              SELECT PRIVILEGE, NULL AS OBJ_OWNER, NULL AS OBJ_NAME, GRANTEE AS USERNAME, GRANTEE AS GRANT_TARGET, ADMIN_OPTION AS ADMIN_OR_GRANT_OPT, NULL AS HIERARCHY_OPT
              FROM DBA_SYS_PRIVS
              WHERE GRANTEE IN (SELECT USERNAME FROM DBA_USERS)
              UNION ALL
              SELECT PRIVILEGE, NULL AS OBJ_OWNER, NULL AS OBJ_NAME, ALL_ROLES_FOR_USER.GRANTED_USER AS USERNAME, GRANTEE AS GRANT_TARGET, ADMIN_OPTION AS ADMIN_OR_GRANT_OPT, NULL AS HIERARCHY_OPT
              FROM DBA_SYS_PRIVS
              JOIN ALL_ROLES_FOR_USER ON ALL_ROLES_FOR_USER.GRANTED_ROLE = DBA_SYS_PRIVS.GRANTEE
              UNION ALL
              SELECT PRIVILEGE, OWNER AS OBJ_OWNER, TABLE_NAME AS OBJ_NAME, GRANTEE AS USERNAME, GRANTEE AS GRANT_TARGET, GRANTABLE, HIERARCHY
              FROM DBA_TAB_PRIVS
              WHERE GRANTEE IN (SELECT USERNAME FROM DBA_USERS)
              UNION ALL
              SELECT PRIVILEGE, OWNER AS OBJ_OWNER, TABLE_NAME AS OBJ_NAME, GRANTEE AS USERNAME, ALL_ROLES_FOR_USER.GRANTED_ROLE AS GRANT_TARGET, GRANTABLE, HIERARCHY
              FROM DBA_TAB_PRIVS
              JOIN ALL_ROLES_FOR_USER ON ALL_ROLES_FOR_USER.GRANTED_ROLE = DBA_TAB_PRIVS.GRANTEE
          ) ALL_USER_PRIVS
          WHERE USERNAME = '${req.session.user.username}'
      ) DISTINCT_USER_PRIVS
      GROUP BY PRIVILEGE,OBJ_OWNER,OBJ_NAME,USERNAME`
    );
  } catch (error) {
    console.log(error);
    data.error = {
      message: "Không có quyền xem danh sách quyền"
    };
  }
  finally {
    res.render('privileges', data);
  }
})

// List avalable system privileges to grant to user
router.get('/sys/vailable', async function (req, res) {
  const db = conn(req.session.user);
  const username = req.session.user.username;
  const search = req.query.q;
  const list = await db.raw(`SELECT privilege 
      FROM sys.dba_sys_privs
      WHERE grantee = '${username}' AND admin_option='YES'
    UNION
      SELECT privilege
      FROM sys.dba_role_privs rp JOIN sys.role_sys_privs rsp ON (rp.granted_role = rsp.role)
      WHERE rp.grantee = '${username}' AND rp.admin_option='YES'
    ${search ? `AND UPPER(privilege) LIKE UPPER('%${search}%')` : ''}`);
  res.json(list)
})
module.exports = router;