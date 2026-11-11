/**
 * Pronunciation Matching Utility
 * Compares user speech to target vocabulary word with Levenshtein distance & similarity scoring
 */

export function cleanWord(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/['"“”‘’]/g, '')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates similarity ratio between 0.0 and 1.0 using Levenshtein distance
 */
export function calculateSimilarity(spoken, target) {
  const s1 = cleanWord(spoken);
  const s2 = cleanWord(target);

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  // Exact sub-phrase match (e.g. if speech engine returned "the word resilient" or "resilience")
  if (s1.includes(s2) || s2.includes(s1)) {
    const lenRatio = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
    if (lenRatio > 0.7) return 0.95;
    return 0.85;
  }

  // Levenshtein Matrix
  const matrix = Array(s2.length + 1).fill(null).map(() =>
    Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) {
    matrix[0][i] = i;
  }
  for (let j = 0; j <= s2.length; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = matrix[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return Math.max(0, 1 - distance / maxLen);
}

/**
 * Evaluates speech against target word and generates visual feedback payload
 */
export function evaluatePronunciation(spokenText, targetWord) {
  const target = cleanWord(targetWord);
  const spoken = cleanWord(spokenText);

  // Split into single words to catch exact word spoken within filler
  const spokenWords = spoken.split(' ');
  let bestSimilarity = calculateSimilarity(spoken, target);

  for (const word of spokenWords) {
    const sim = calculateSimilarity(word, target);
    if (sim > bestSimilarity) {
      bestSimilarity = sim;
    }
  }

  const percentage = Math.round(bestSimilarity * 100);

  if (bestSimilarity >= 0.85) {
    return {
      status: 'success',
      title: 'Great job!',
      feedback: 'Excellent pronunciation! Your speech matched the target word accurately.',
      percentage,
      badgeColor: 'bg-emerald-500 text-white',
      cardColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
    };
  }

  if (bestSimilarity >= 0.6) {
    return {
      status: 'close',
      title: 'Almost there!',
      feedback: `You said "${spokenText}". Good effort, focus on articulating all syllables clearly.`,
      percentage,
      badgeColor: 'bg-amber-500 text-white',
      cardColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
    };
  }

  return {
    status: 'retry',
    title: 'Try again!',
    feedback: `We heard "${spokenText || 'nothing'}". Listen to the native audio guide and speak clearly into the microphone.`,
    percentage,
    badgeColor: 'bg-rose-500 text-white',
    cardColor: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
  };
}

