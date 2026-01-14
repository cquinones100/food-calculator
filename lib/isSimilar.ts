export function isSimilar(base: string, comparison: string, threshold = 0.4) {
  return similarityScore(base, comparison) >= threshold;
}

export function similarityScore(base: string, comparison: string) {
  const stringOneSplit = base
    .split(" ")
    .map((word) => word.toLocaleLowerCase());
  const stringTwoSplit = comparison
    .split(" ")
    .map((word) => word.toLocaleLowerCase());
  const numWords = Math.max(stringOneSplit.length, stringTwoSplit.length);

  const stringOneSet = new Set(stringOneSplit);

  const numSimilarWords = stringTwoSplit.reduce((acc, word) => {
    if (stringOneSet.has(word)) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return Number((numSimilarWords / numWords).toFixed(2));
}
