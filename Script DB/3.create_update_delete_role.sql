-- Create Role
CREATE ROLE &rolename IDENTIFIED BY &passwordrole;

-- Change password
ALTER ROLE &rolename IDENTIFIED BY &passwordrole;

-- Delete Role
DROP ROLE &rolename;