import * as nano from '../'

import {
  INVALID_HASHES,
  INVALID_THRESHOLDS,
  INVALID_WORKS,
} from './test-data/invalid'

import VALID_BLOCKS from './test-data/valid_blocks.json'
const RANDOM_VALID_BLOCK = VALID_BLOCKS[0]

const INVALID_WORK = {
  blockHash: '3ed191ec702f384514ba35e1f9081148df5a9ab48fe0f604b6e5b9f7177cee32',
  work: 'bb6737f2daf01a2c',
}

const INVALID_WORK_CUSTOM_THRESHOLD = {
  blockHash: 'b9cb6b51b8eb869af085c4c03e7dc539943d0bdde13b21436b687c9c7ea56cb0',
  work: '0000000000010600',
  threshold: 0xffffffff00000000n,
}

describe('validation', () => {
  test('validates correct work', () => {
    expect.assertions(VALID_BLOCKS.length)
    for (const block of VALID_BLOCKS) {
      let hash = block.block.data.previous
      // if it's an open block
      if (
        hash ===
        '0000000000000000000000000000000000000000000000000000000000000000'
      ) {
        hash = nano.derivePublicKey(block.block.data.account)
      }
      expect(
        nano.validateWork({ blockHash: hash, work: block.block.data.work })
      ).toBe(true)
    }
  })

  test('does not validate incorrect work', () => {
    expect(nano.validateWork(INVALID_WORK)).toBe(false)
  })

  test('does not validate incorrect work with custom threshold', () => {
    expect(nano.validateWork(INVALID_WORK_CUSTOM_THRESHOLD)).toBe(false)
  })

  test('throws with invalid hashes', () => {
    expect.assertions(INVALID_HASHES.length)
    for (const invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.validateWork({
          blockHash: invalidHash,
          work: RANDOM_VALID_BLOCK.block.data.work,
        })
      ).toThrowError('Hash is not valid')
    }
  })

  test('throws with invalid works', () => {
    expect.assertions(INVALID_WORKS.length)
    for (const invalidWork of INVALID_WORKS) {
      expect(() =>
        nano.validateWork({
          blockHash: RANDOM_VALID_BLOCK.block.hash,
          work: invalidWork,
        })
      ).toThrowError('Work is not valid')
    }
  })

  test('throws with invalid thresholds', () => {
    expect.assertions(INVALID_THRESHOLDS.length)
    for (const invalidThreshold of INVALID_THRESHOLDS) {
      expect(() =>
        nano.validateWork({
          blockHash: RANDOM_VALID_BLOCK.block.hash,
          work: RANDOM_VALID_BLOCK.block.data.work,
          threshold: invalidThreshold,
        })
      ).toThrowError('Threshold is not valid')
    }
  })
})
