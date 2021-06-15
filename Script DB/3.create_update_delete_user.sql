-- Create User
CREATE USER &USERNAME IDENTIFIED BY &PASSWORD;

-- Change password
alter user &username identified by &newpassword;

-- Lock user
ALTER USER &username ACCOUNT LOCK;

-- Unlock user
ALTER USER &username ACCOUNT UNLOCK;

-- Set quota
alter user &username quota 1G on users;
alter user &username quota unlimited on &tablespace_name;

-- Set failed login attempts
alter profile "DEFAULT" limit failed_login_attempts unlimited;

-- Delete User
DROP USER &USERNAME CASCADE;