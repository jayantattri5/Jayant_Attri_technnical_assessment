// utils/validationHelpers.js
// Connection validation utilities
// --------------------------------------------------

export const isValidConnection = (connection) => {
  if (connection.source === connection.target) return false;
  return true;
};