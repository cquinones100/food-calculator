import { describe, expect, it } from "vitest";
import { isSimilar, similarityScore } from "../isSimilar";

describe("isSimilar", () => {
  it("captures a string that has every word from another", () => {
    const string1 = "food";
    const string2 = "food 2";

    expect(isSimilar(string1, string2, 0.5)).toBe(true);
  });

  it("captures a string which has similar words greater than a threshold", () => {
    const threshold = 0.6;

    expect(isSimilar("food i love", "food love", threshold)).toBe(true);
    expect(
      isSimilar(
        "food i love it really yum yummy",
        "food it really yum",
        threshold
      )
    ).toBe(false);
  });

  it("captures a string that is exactly the same", () => {
    expect(isSimilar("my food 2", "my food 2")).toBe(true);
  });
});

describe("similarityScore", () => {
  it("accurately provides the score", () => {
    expect(similarityScore("my food 2", "my food 2")).toEqual(1);
    expect(similarityScore("my food 2", "no matches")).toEqual(0);
    expect(similarityScore("food i love", "food love")).toEqual(0.67);
    expect(similarityScore("food love", "food")).toEqual(0.5);
  });
});
