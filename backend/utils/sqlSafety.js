const FORBIDDEN_KEYWORDS = [
  'DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'UPDATE',
  'INSERT', 'CREATE', 'GRANT', 'REVOKE', 'RENAME',
];

/**
 * Validates that a SQL query is strictly read-only (SELECT only).
 * Throws an error if any destructive keyword is detected.
 */
const enforceReadOnly = (sql) => {
  const upperSQL = sql.toUpperCase();

  const containsForbidden = FORBIDDEN_KEYWORDS.some((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`);
    return regex.test(upperSQL);
  });

  if (containsForbidden) {
    throw new Error('Blocked: Only read-only SELECT queries are permitted.');
  }

  if (!upperSQL.trim().startsWith('SELECT')) {
    throw new Error('Blocked: Only SELECT queries are permitted.');
  }

  return true;
};

module.exports = { enforceReadOnly };