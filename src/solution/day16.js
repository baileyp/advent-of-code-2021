const { sum, repeatFunction, product } = require("../lib/functions");
const { NotImplementedError } = require("../lib/exceptions");

const VERSION_OFFSET = 0;
const TYPE_OFFSET = 3;
const LENGTH_TYPE_OFFSET = 6
const LENGTH_VALUE_OFFSET = LENGTH_TYPE_OFFSET + 1
const FIXED_PAYLOAD_OFFSET = LENGTH_VALUE_OFFSET + 15;
const VARIABLE_PAYLOAD_OFFSET = LENGTH_VALUE_OFFSET + 11;

/**
 * Parse the puzzle into into a Packet
 * @param input
 * @returns {string}
 */
function parseInput(input) {
  return input.match(/../g)
    .map(hex => parseInt(hex, 16))
    .map(decimal => decimal.toString(2))
    .map(binary => binary.padStart(8, '0'))
    .join('');
}

/**
 * Given a string of input bits, create the correct type of packet, including all sub-packets, and return it
 *
 * @param {string}  bits
 * @returns {Packet}
 */
function packetFactory(bits) {
  if ('100' === bits.substring(TYPE_OFFSET, LENGTH_TYPE_OFFSET)) {
    return new LiteralPacket(bits);
  }

  const packet = new OperatorPacket(bits);
  if (packet.isFixedLength) {
    let subPacketTotalLength = 0;

    do {
      const subPacketBits = packet.payload.substring(subPacketTotalLength);
      const subPacket = packetFactory(subPacketBits);
      packet.addSubPacket(subPacket);
      subPacketTotalLength += subPacket.length;
    }
    while (subPacketTotalLength < packet.payloadLength);
  } else {
    let subPacketTotalLength = 0;
    repeatFunction(() => {
      const subPacketBits = packet.payload.substring(subPacketTotalLength);
      const subPacket = packetFactory(subPacketBits);
      packet.addSubPacket(subPacket);
      subPacketTotalLength += subPacket.length;
    }, packet.payloadLength);
  }

  return packet;
}

/**
 * Abstract packet class that maintains state of the version and provides getters for things like length and value
 */
class Packet {
  constructor(bits) {
    this.version = parseInt(bits.substring(VERSION_OFFSET, TYPE_OFFSET), 2);
  }

  /**
   * Calculate and retrieve the cumulative version number of this packet and all sub-packets
   *
   * @returns {number}
   */
  get cumulativeVersion() {
    throw new NotImplementedError('Packet.cumulativeVersion');
  }

  /**
   * Get the bit length of this packet, inclusive of sub-packets
   *
   * @returns {number}
   */
  get length() {
    throw new NotImplementedError('Packet.length');
  }

  /**
   * Calculate and retrieve the value number of this packet and all sub-packets
   *
   * @returns {number}
   */
  get value() {
    throw new NotImplementedError('Packet.value');
  }
}

/**
 * Implementation of Packet for operators
 */
class OperatorPacket extends Packet {
  constructor(bits) {
    super(bits);
    this.typeId = parseInt(bits.substring(TYPE_OFFSET, LENGTH_TYPE_OFFSET), 2);
    this.lengthTypeId = bits[LENGTH_TYPE_OFFSET];

    if (this.isFixedLength) {
      this.payloadLength = parseInt(bits.substring(LENGTH_VALUE_OFFSET, FIXED_PAYLOAD_OFFSET), 2);
      this.payload = bits.substring(FIXED_PAYLOAD_OFFSET, FIXED_PAYLOAD_OFFSET + this.payloadLength);
    } else {
      this.payloadLength = parseInt(bits.substring(LENGTH_VALUE_OFFSET, VARIABLE_PAYLOAD_OFFSET), 2);
      this.payload = bits.substring(VARIABLE_PAYLOAD_OFFSET);
    }

    this.subPackets = [];
  }

  /**
   * Add a sub packet
   *
   * @param {Packet} packet
   */
  addSubPacket(packet) {
    this.subPackets.push(packet);
  }

  /**
   * Determine if this is a fixed-length (width?) packet or not
   *
   * @returns {boolean}
   */
  get isFixedLength() {
    return this.lengthTypeId === '0';
  }

  /**
   * @inheritDoc
   */
  get cumulativeVersion() {
    return this.version + this.subPackets.map(subPacket => subPacket.cumulativeVersion).reduce(sum);
  }

  /**
   * @inheritDoc
   */
  get length() {
    if (this.isFixedLength) {
      return FIXED_PAYLOAD_OFFSET + this.payloadLength;
    }
    return VARIABLE_PAYLOAD_OFFSET + this.subPackets.map(subPacket => subPacket.length).reduce(sum);
  }

  /**
   * @inheritDoc
   */
  get value() {
    const subValues = this.subPackets.map(subPacket => subPacket.value);
    switch (this.typeId) {
      case 0: return subValues.reduce(sum);
      case 1: return subValues.reduce(product, 1);
      case 2: return Math.min(...subValues);
      case 3: return Math.max(...subValues);
      case 5: return subValues[0] > subValues[1] ? 1 : 0;
      case 6: return subValues[0] < subValues[1] ? 1 : 0;
      case 7: return subValues[0] === subValues[1] ? 1 : 0;
    }
  }
}

/**
 * Implementation of Packet for literal values
 */
class LiteralPacket extends Packet {
  constructor(bits) {
    super(bits);

    let overallLength = LENGTH_TYPE_OFFSET;
    let literalValue = '';
    let chunk;
    do {
      chunk = bits.substring(overallLength, overallLength + 5);
      literalValue += chunk.substring(1);
      overallLength += 5;
    }
    while (chunk[0] !== '0');

    this.literalValue = parseInt(literalValue, 2);
    this.overallLength = overallLength;
  }

  /**
   * @inheritDoc
   */
  get length() {
    return this.overallLength;
  }

  /**
   * @inheritDoc
   */
  get value() {
    return this.literalValue;
  }

  /**
   * @inheritDoc
   */
  get cumulativeVersion() {
    return this.version;
  }
}

module.exports = {
  /**
   * O(b * p) time and O(b + p) space, where b is the number of bits in the input and p is the number of packets
   * represented by those bits
   *
   * @param {string}  input The raw puzzle input where the bits are represented as hexadecimal pairs
   * @returns {number}      The cumulative version number of all packets
   */
  part1: function(input) {
    const bits = parseInput(input);
    const packet = packetFactory(bits);
    return packet.cumulativeVersion;
  },

  /**
   * O(b * p) time and O(b + p) space, where b is the number of bits in the input and p is the number of packets
   * represented by those bits
   *
   * @param {string}  input The raw puzzle input where the bits are represented as hexadecimal pairs
   * @returns {number}      The value of the input packet i.e., the BITS transmission
   */
  part2: function(input) {
    const bits = parseInput(input);
    const packet = packetFactory(bits);
    return packet.value;
  }
};
