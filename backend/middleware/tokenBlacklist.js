// In-memory token blacklist (for logout)
// In production, use Redis or a database
const blacklistedTokens = new Set();

const addToBlacklist = (token) => {
  blacklistedTokens.add(token);
};

const isBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

module.exports = {
  addToBlacklist,
  isBlacklisted,
};
