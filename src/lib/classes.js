class DefaultMap extends Map {
  /**
   * Map that allows the specification of a factory function to create default values when getting keys that
   * don't yet exist in the map. Modeled after Python's defaultdict
   *
   * @param {function}  factory   The return value of this function will be used to set values of un-set keys
   */
  constructor(factory) {
    super();
    this.factory = factory;
  }

  /**
   * @inheritDoc
   */
  get(key) {
    if (!this.has(key)) {
      super.set(key, this.factory());
    }
    return super.get(key);
  }
}

/**
 * Implementation of Set that can include common set-comparison operations such as union, difference, intersection, etc.
 */
class ComparableSet extends Set {
  /**
   * Determine if this set is a superset of the provided set
   *
   * @param {Set} set
   * @returns {boolean}
   */
  isSupersetOf(set) {
    for (const elem of set) {
      if (!this.has(elem)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Determine if this set is equal to the provide set
   *
   * @param {Set} set
   * @returns {boolean}
   */
  isEqualTo(set) {
    return this.symmetricDifference(set).size === 0;
  }

  /**
   * Calcluate the intersection of this set and a provided set and return a new ComparableSet with those values
   *
   * @param {Set} set
   * @returns {ComparableSet}
   */
  intersection(set) {
    const intersectedSet = new ComparableSet();
    for (const elem of set) {
      if (this.has(elem)) {
        intersectedSet.add(elem);
      }
    }
    return intersectedSet;
  }

  /**
   * Calcluate the symmetric difference of this set and a provided set and return a new ComparableSet with those values
   *
   * @param {Set} set
   * @returns {ComparableSet}
   */
  symmetricDifference(set) {
    const diffedSet = new ComparableSet(this);
    for (const elem of set) {
      if (diffedSet.has(elem)) {
        diffedSet.delete(elem);
      } else {
        diffedSet.add(elem);
      }
    }
    return diffedSet
  }
}

module.exports = {
  DefaultMap,
  ComparableSet
}
