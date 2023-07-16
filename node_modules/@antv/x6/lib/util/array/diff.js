"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diff = void 0;
function diff(oldList, newList, key) {
    var oldMap = makeKeyIndexAndFree(oldList, key);
    var newMap = makeKeyIndexAndFree(newList, key);
    var newFree = newMap.free;
    var oldKeyIndex = oldMap.keyIndex;
    var newKeyIndex = newMap.keyIndex;
    var moves = [];
    var children = [];
    var i = 0;
    var item;
    var itemKey;
    var freeIndex = 0;
    while (i < oldList.length) {
        item = oldList[i];
        itemKey = item[key];
        if (itemKey) {
            // eslint-disable-next-line
            if (!newKeyIndex.hasOwnProperty(itemKey)) {
                children.push(null);
            }
            else {
                var newItemIndex = newKeyIndex[itemKey];
                children.push(newList[newItemIndex]);
            }
        }
        else {
            freeIndex += 1;
            var freeItem = newFree[freeIndex];
            children.push(freeItem || null);
        }
        i += 1;
    }
    var simulateList = children.slice(0);
    i = 0;
    while (i < simulateList.length) {
        if (simulateList[i] === null) {
            remove(i);
            removeSimulate(i);
        }
        else {
            i += 1;
        }
    }
    var j = (i = 0);
    while (i < newList.length) {
        item = newList[i];
        itemKey = item[key];
        var simulateItem = simulateList[j];
        if (simulateItem) {
            var simulateItemKey = simulateItem[key];
            if (itemKey === simulateItemKey) {
                j += 1;
            }
            else {
                // eslint-disable-next-line
                if (!oldKeyIndex.hasOwnProperty(itemKey)) {
                    insert(i, item);
                }
                else {
                    var nextSimulateItem = simulateList[j + 1];
                    if (nextSimulateItem) {
                        var nextItemKey = nextSimulateItem[key];
                        if (nextItemKey === itemKey) {
                            remove(i);
                            removeSimulate(j);
                            j += 1;
                        }
                        else {
                            insert(i, item);
                        }
                    }
                }
            }
        }
        else {
            insert(i, item);
        }
        i += 1;
    }
    var k = simulateList.length - j;
    while ((j += 1) < simulateList.length) {
        k -= 1;
        remove(k + i);
    }
    function remove(index) {
        var move = { index: index, type: 0, item: null };
        moves.push(move);
    }
    function insert(index, item) {
        var move = { index: index, item: item, type: 1 };
        moves.push(move);
    }
    function removeSimulate(index) {
        simulateList.splice(index, 1);
    }
    return {
        moves: moves,
    };
}
exports.diff = diff;
function makeKeyIndexAndFree(list, key) {
    var keyIndex = {};
    var free = [];
    for (var i = 0, len = list.length; i < len; i += 1) {
        var item = list[i];
        var itemKey = item[key];
        if (itemKey) {
            keyIndex[itemKey] = i;
        }
        else {
            free.push(item);
        }
    }
    return {
        keyIndex: keyIndex,
        free: free,
    };
}
//# sourceMappingURL=diff.js.map