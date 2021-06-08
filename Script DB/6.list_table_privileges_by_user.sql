-- List user's privileges on table
SELECT * FROM
(SELECT
    grantee, owner, table_name, column_name, grantor, privilege, grantable
    FROM dba_col_privs
UNION 
    SELECT
    grantee, owner, table_name, NULL AS column_name, grantor, privilege, grantable
    FROM dba_tab_privs
) WHERE grantee = '&username'