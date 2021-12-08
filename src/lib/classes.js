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

module.exports = {
  DefaultMap
}
