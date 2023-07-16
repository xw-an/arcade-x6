/**
 * Given a name and a list of names that are not equal to the name, return a
 * spelling suggestion if there is one that is close enough. Names less than
 * length 3 only check for case-insensitive equality, not Levenshtein distance.
 *
 * - If there is a candidate that's the same except for case, return that.
 * - If there is a candidate that's within one edit of the name, return that.
 * - Otherwise, return the candidate with the smallest Levenshtein distance,
 *     except for candidates:
 *       * With no name
 *       * Whose length differs from the target name by more than 0.34 of the
 *         length of the name.
 *       * Whose levenshtein distance is more than 0.4 of the length of the
 *         name (0.4 allows 1 substitution/transposition for every 5 characters,
 *         and 1 insertion/deletion at 3 characters)
 */
export declare function getSpellingSuggestion<T>(name: string, candidates: T[], getName: (candidate: T) => string | undefined): T | undefined;
