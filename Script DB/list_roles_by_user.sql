-- List user's roles
SELECT
   grantee, granted_role, admin_option, default_role
FROM dba_role_privs
WHERE grantee = '&username';