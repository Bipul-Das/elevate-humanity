// server/utils/urgencyAlgo.js

// 1. Define the Dictionary of Distress
// Higher score = Higher priority
const KEYWORD_WEIGHTS = {
  // Critical Survival
  'starvation': 50,
  'starving': 50,
  'homeless': 40,
  'eviction': 45,
  'evict': 40,
  'emergency': 30,
  'critical': 25,
  
  // Medical
  'surgery': 35,
  'operation': 35,
  'cancer': 30,
  'pregnant': 25,
  'infant': 30,
  'baby': 20,
  
  // Vulnerability
  'widow': 15,
  'orphan': 20,
  'disabled': 20
};

// 2. The Algorithm
exports.calculateUrgency = (text) => {
  if (!text) return 0;
  
  let score = 0;
  const lowerText = text.toLowerCase();

  // Scan text for every keyword
  for (const [word, weight] of Object.entries(KEYWORD_WEIGHTS)) {
    if (lowerText.includes(word)) {
      score += weight;
    }
  }

  // Cap the score at 100
  return Math.min(score, 100);
};