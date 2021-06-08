-- Revoke privileges from user
REVOKE CREATE SESSION FROM &username;
REVOKE SELECT ON &tablename FROM &username;
REVOKE CREATE ON &tablename FROM &username;
REVOKE UPDATE(&rowname) ON &tablename FROM &username;
REVOKE DELETE ON &tablename FROM &username;

-- Revoke privileges from role
REVOKE CREATE SESSION FROM &rolename;
REVOKE SELECT ON &tablename FROM &rolename;
REVOKE CREATE ON &tablename FROM &rolename;
REVOKE UPDATE(&rowname) ON &tablename FROM &rolename;
REVOKE DELETE ON &tablename FROM &rolename;

-- Revoke role
REVOKE &rolename FROM &username;
REVOKE &rolename FROM PUBLIC;
REVOKE &rolename FROM &rolename;