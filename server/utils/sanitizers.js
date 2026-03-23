// server/utils/sanitizers.js

// Capitalize first letter of every word (Title Case)
const toTitleCase = (str) => {
  if (!str) return str;
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Force UpperCase (for IDs, Batches)
const toUpperCase = (str) => {
  if (!str) return str;
  return str.toUpperCase();
};

module.exports = { toTitleCase, toUpperCase };