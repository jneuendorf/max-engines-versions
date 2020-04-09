const path = require('path')

const semver = require('semver')
const glob = require('glob')


const getMinVersion = version => {
    try {
        return semver.minVersion(version).version
    }
    catch (error) {
        if (
            error instanceof TypeError
            && error.message.includes('Invalid comparator')
        ) {
            return error
        }
        else {
            throw error
        }
    }
}

const type = function(obj) {
    // "[object Array]".slice(8, -1)
    return Object.prototype.toString.call(obj).slice(8, -1)
}

// async -> node >= 7.6.0
async function main() {
    // await -> node >= 7.6.0, Promise -> node >= 0.12
    const matches = await new Promise(function(resolve, reject) {
        glob(
            'node_modules/**/package.json',
            {absolute: true},
            (error, files) => {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(files)
                }
            }
        )
    })

    const maxVersions = {}
    const maxVersionsReasons = {}
    for (const match of matches) {
        const pkg = require(match)
        const {engines} = pkg
        if (!engines) {
            continue
        }

        // Object.entries -> node >= 7.0.0
        for (const [engine, version] of Object.entries(engines)) {
            const minVersion = getMinVersion(version)
            if (minVersion instanceof Error) {
                console.warn(
                    `IGNORING ERROR while parsing '${version}' `
                    + `(${type(version)}) of ${engines} (${type(engines)}) in ${match}`
                )
                console.warn(minVersion)
                continue
            }

            if (!maxVersions[engine]) {
                maxVersions[engine] = minVersion
                maxVersionsReasons[engine] = `initial: ${match}`
            }
            else {
                if (semver.gt(minVersion, maxVersions[engine])) {
                    maxVersions[engine] = minVersion
                    maxVersionsReasons[engine] = path.basename(path.dirname(match))
                }
            }
        }
    }

    return [maxVersions, maxVersionsReasons]
}

module.exports = main
