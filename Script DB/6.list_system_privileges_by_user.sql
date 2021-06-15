-- List user's system privileges
SELECT
 grantee, privilege, admin_option
FROM dba_sys_privs
WHERE grantee = '&username';