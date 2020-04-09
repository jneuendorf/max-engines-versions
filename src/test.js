const main = require("./main")


test('main', async () => {
    const [versions, reasons] = await main()
    expect(versions.node).toBe('10.0.0')
    expect(reasons.node).toBe('semver')
})
