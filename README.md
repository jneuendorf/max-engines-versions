# max-engines-versions

Find the maximum version for each engine (specified in package.json) among all dependencies.
:warning: It only works if `npm install` or `yarn install` have been successfully run before.

It is useful because not specifying the supported engines explicitly may result in some incompatible packages crashing at runtime instead when install your package. Dynamic imports/requires that require unnoticed incompatible packages may not be executed during testing or non-edge case usage.


## Installation

```bash
npm install -save-dev max-engines-versions
```

or

```bash
yarm add --dev max-engines-versions
```


## Usage

It looks for all `package.json` files in current working directories `node_modules` folder and parses the matched files's `.engines` property.

### cli

```bash
npx max-engines-versions
```

### Node

```javascript
const maxEnginesVersions = require('max-engines-versions')

async function f() {
    const [versions, reasons] = await main()
    // 'versions' is the object you're looking for, e.g.
    //  {node: '10.0.0'}
    // 'reasons' is an object with the package names for each type of engine,
    // e.g. {node: 'this-package-requires-node-10'}
}
```


## Example

Clone this repo, run `npm install` and then `npm test`.
