"use strict";
// @see: https://github.com/microsoft/TypeScript/blob/master/src/compiler/checker.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpellingSuggestion = void 0;
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
function getSpellingSuggestion(name, candidates, getName) {
    var maximumLengthDifference = Math.min(2, Math.floor(name.length * 0.34));
    // If the best result isn't better than this, don't bother.
    var bestDistance = Math.floor(name.length * 0.4) + 1;
    var bestCandidate;
    var justCheckExactMatches = false;
    var nameLowerCase = name.toLowerCase();
    // eslint-disable-next-line
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var candidate = candidates_1[_i];
        var candidateName = getName(candidate);
        if (candidateName !== undefined &&
            Math.abs(candidateName.length - nameLowerCase.length) <=
                maximumLengthDifference) {
            var candidateNameLowerCase = candidateName.toLowerCase();
            if (candidateNameLowerCase === nameLowerCase) {
                if (candidateName === name) {
                    continue;
                }
                return candidate;
            }
            if (justCheckExactMatches) {
                continue;
            }
            if (candidateName.length < 3) {
                // Don't bother, user would have noticed a
                // 2-character name having an extra character.
                continue;
            }
            // Only care about a result better than the best so far.
            var distance = levenshteinWithMax(nameLowerCase, candidateNameLowerCase, bestDistance - 1);
            if (distance === undefined) {
                continue;
            }
            if (distance < 3) {
                justCheckExactMatches = true;
                bestCandidate = candidate;
            }
            else {
                // Debug.assert(distance < bestDistance)
                bestDistance = distance;
                bestCandidate = candidate;
            }
        }
    }
    return bestCandidate;
}
exports.getSpellingSuggestion = getSpellingSuggestion;
function levenshteinWithMax(s1, s2, max) {
    var previous = new Array(s2.length + 1); // eslint-disable-line
    var current = new Array(s2.length + 1); // eslint-disable-line
    /** Represents any value > max. We don't care about the particular value. */
    var big = max + 1;
    for (var i = 0; i <= s2.length; i += 1) {
        previous[i] = i;
    }
    for (var i = 1; i <= s1.length; i += 1) {
        var c1 = s1.charCodeAt(i - 1);
        var minJ = i > max ? i - max : 1;
        var maxJ = s2.length > max + i ? max + i : s2.length;
        current[0] = i;
        /** Smallest value of the matrix in the ith column. */
        var colMin = i;
        for (var j = 1; j < minJ; j += 1) {
            current[j] = big;
        }
        for (var j = minJ; j <= maxJ; j += 1) {
            var dist = c1 === s2.charCodeAt(j - 1)
                ? previous[j - 1]
                : Math.min(
                /* delete */ previous[j] + 1, 
                /* insert */ current[j - 1] + 1, 
                /* substitute */ previous[j - 1] + 2);
            current[j] = dist;
            colMin = Math.min(colMin, dist);
        }
        for (var j = maxJ + 1; j <= s2.length; j += 1) {
            current[j] = big;
        }
        if (colMin > max) {
            // Give up -- everything in this column is > max
            // and it can't get better in future columns.
            return undefined;
        }
        var temp = previous;
        previous = current;
        current = temp;
    }
    var res = previous[s2.length];
    return res > max ? undefined : res;
}
//# sourceMappingURL=suggestion.js.map