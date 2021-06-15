-- List role's privileges
SELECT
 role, owner, table_name, column_name, privilege, grantable
FROM role_tab_privs
WHERE role = &role;