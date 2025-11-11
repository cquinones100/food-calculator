export function isSimilar(string1: string, string2: string, threshold = 0.5) {
  const stringOneSplit = string1
    .split(" ")
    .map((word) => word.toLocaleLowerCase());
  const stringTwoSplit = string2
    .split(" ")
    .map((word) => word.toLocaleLowerCase());
  const numWords = stringOneSplit.length;

  const stringOneSet = new Set(stringOneSplit);

  const numSimilarWords = stringTwoSplit.reduce((acc, word) => {
    if (stringOneSet.has(word)) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const similarityRatio = numSimilarWords / numWords;

  return similarityRatio > threshold;
}
