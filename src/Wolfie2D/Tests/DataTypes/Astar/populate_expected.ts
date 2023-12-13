import {generateRandomMeshes, createPath} from './Astar.utilities'
import * as fs from 'fs'

/**
 * Use this script to replace the expected results for the randomly generated meshes
 * using a different seed for distribution purposes.
 * 
 * Remember to set the path for Astar.utilities.ts to the absolute path for this script to work.
 * 
 * @author TZMCNALLY
 */

const filePath = './Astar.expected.json'

const cases = generateRandomMeshes();
let newExpected = []

console.log('populating...')

for(let c of cases) {
    let parent = createPath(c.mesh, c.to, c.from)

    if(parent == null)
        newExpected.push({length: null, path: null})

    else
        newExpected.push({length: parent.length, path: parent})
}

const expected = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
expected['randomlyGeneratedMeshResults'] = newExpected;

fs.writeFileSync(filePath, JSON.stringify(expected), 'utf-8')

console.log('done')

