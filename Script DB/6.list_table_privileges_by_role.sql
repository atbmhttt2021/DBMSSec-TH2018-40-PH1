-- List role's privileges on table
SELECT
    owner, table_name, column_name, privilege, grantable
FROM role_tab_privs
WHERE role = '&rolename'