/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global NanoCurrency */

import { promises as fs } from 'fs'
import puppeteer, { Browser, Page } from 'puppeteer'

let browser: Browser
let page: Page
let umdScript: string
beforeAll(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
  umdScript = await fs.readFile('./dist/bundles/nanocurrency.umd.js', 'utf8')
})

afterAll(() => browser.close())

describe('browser', () => {
  test('works in browser', async () => {
    // load NanoCurrency
    await page.evaluate(umdScript)

    const generatedSeeds = await page.evaluate(async function() {
      // @ts-expect-error in global browser scope
      const a = await NanoCurrency.generateSeed()
      // @ts-expect-error in global browser scope
      const b = await NanoCurrency.generateSeed()
      return { a, b }
    })
    expect(generatedSeeds.a).not.toBe(generatedSeeds.b)

    const foundWork = await page.evaluate(async function() {
      // @ts-expect-error in global browser scope
      return NanoCurrency.computeWork(
        'b9cb6b51b8eb869af085c4c03e7dc539943d0bdde13b21436b687c9c7ea56cb0'
      )
    })
    expect(foundWork).toBe('0000000000010600')
  })
})