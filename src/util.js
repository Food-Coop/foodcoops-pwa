/**
 * Clone an object recursively. Subsequent changes to the original will not be changed in the clone and vice versa.
 * Does not support functions and object cycles (among other things) because it relies on JSON (de)-serialization.
 *
 * @param o original object
 * @returns {any} cloned object
 */
const deepClone = o => JSON.parse(JSON.stringify(o));

/**
 * Assign a value to a key in the target object.
 * Key can be a combination of multiple object keys separated by dots.
 *
 * For example: `merge("a.b.c", {a:{b:{c:false}}}, true)` returns `{a:{b:{c:true}}}`.
 *
 * @param {string} key
 * @param {{}} obj
 * @param {*} value
 * @returns {{}} obj
 */
function deepAssign(key, obj, value) {
    const accessors = key.split('.');
    const accessor = accessors.pop();
    for (const accessor of accessors) {
        if (!obj.hasOwnProperty(accessor)) {
            obj[accessor] = {};
        }
        obj = obj[accessor];
    }

    obj[accessor] = value;

    return obj;
}

export {deepAssign, deepClone};
