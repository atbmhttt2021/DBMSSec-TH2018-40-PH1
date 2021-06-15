-- List role's system privileges
SELECT
  role, privilege, admin_option
FROM role_sys_privs
WHERE role = '&rolename';