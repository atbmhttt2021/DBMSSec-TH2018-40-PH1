-- Connect to sysdba user (via sqlplus with username:  / as sysdba
-- or via sql developer, etc ...)
conn / as sysdba;

-- grant role to admin user
-- CREATE USER SYSADMIN IDENTIFIED BY ADMIN QUOTA 100M ON USERS;
grant CONNECT, RESOURCE, DBA, SYSDBA to SYSADMIN WITH ADMIN OPTION;


-- -- Grant some privileges to admin user
-- GRANT 
--     CREATE SESSION,
--     CREATE USER,
--     ALTER USER, -- change pw, pw expire, account status
--     DROP USER,
--     CREATE ROLE,
--     DROP ANY ROLE,
--     CREATE TABLE,
--     CREATE VIEW
-- TO SYSTEM WITH ADMIN OPTION;
-- GRANT select on dba_users
--     TO SYSTEM WITH GRANT OPTION;
-- GRANT select on dba_roles
--     TO SYSTEM WITH GRANT OPTION;
-- GRANT select on dba_sys_privs
--     TO SYSTEM WITH GRANT OPTION;
-- GRANT select on dba_tab_privs
--     TO SYSTEM WITH GRANT OPTION;
-- GRANT select on dba_col_privs
--     TO SYSTEM WITH GRANT OPTION;
-- GRANT select on dba_role_privs
--     TO SYSTEM WITH GRANT OPTION;
-- GRANT select on role_sys_privs
--     TO SYSTEM WITH GRANT OPTION;
-- GRANT select on role_tab_privs
--     TO SYSTEM WITH GRANT OPTION;
-- GRANT select on role_role_privs
--     TO SYSTEM WITH GRANT OPTION;
-- /

-- OR Create your admin user and grant admin privileges
-- DEFINE uname = &your_username;
-- DEFINE pw = &your_password;
-- CREATE USER &uname IDENTIFIED BY &pw DEFAULT TABLESPACE USERS;
-- ALTER USER &uname
--     QUOTA UNLIMITED ON USERS;

-- GRANT 
--     CREATE SESSION,
--     CREATE USER,
--     ALTER USER, -- change pw, pw expire, account status
--     DROP USER,
--     CREATE ROLE,
--     DROP ANY ROLE,
--     CREATE TABLE,
--     CREATE VIEW
-- TO &uname WITH ADMIN OPTION;

-- GRANT select on dba_users
--     TO &uname WITH GRANT OPTION;
-- GRANT select on dba_roles
--     TO &uname WITH GRANT OPTION;
-- GRANT select on dba_sys_privs
--     TO &uname WITH GRANT OPTION;
-- GRANT select on dba_tab_privs
--     TO &uname WITH GRANT OPTION;
-- GRANT select on dba_col_privs
--     TO &uname WITH GRANT OPTION;
-- GRANT select on dba_role_privs
--     TO &uname WITH GRANT OPTION;
-- GRANT select on role_sys_privs
--     TO &uname WITH GRANT OPTION;
-- GRANT select on role_tab_privs
--     TO &uname WITH GRANT OPTION;
-- GRANT select on role_role_privs
--     TO &uname WITH GRANT OPTION;
-- /
