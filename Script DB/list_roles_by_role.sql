-- List role's roles
SELECT
  role, granted_role, admin_option
FROM role_role_privs
WHERE role = '&username';