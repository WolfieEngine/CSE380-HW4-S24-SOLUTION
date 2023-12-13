import Stack from "../../../DataTypes/Collections/Stack";
import PositionGraph from "../../../DataTypes/Graphs/PositionGraph";
import Vec2 from "../../../DataTypes/Vec2";
import Navmesh from "../../../Pathfinding/Navmesh";
import GraphUtils from "../../../Utils/GraphUtils";
import { generateRandomMeshes, createPath } from "./Astar.utilities";
import 'jest-expect-message'

/**
 * These are the test cases used to test Astar.ts.
 * 
 * The fundamental structure of each test is creating the start and goal, creating the path using astar, and 
 * checking if the path is satisfactory.
 * 
 * We assume that a path is satisfactory if the start was expected to reach the goal, and the path's length is
 * within certain range of the expected length. Further error checking specific to the optimization of astar is
 * also implemented.
 * 
 * These tests are using the default heuristic to test positional graphs (Manhattan distance)
 * 
 * @author TZMCNALLY
 */

describe("Astar", () => {

    /*
     * The most basic cases that the astar implementation must pass in order for it to be considered
     * functional at all.
     * 
     * For each test, we check to see if the path exists and, if so, if the goal was supposed to be
     * reached. Further specified error checking is done such as path length, the existence of cycles, etc.
     */

    describe("Basic Cases", () => {

        let graph: PositionGraph
        let mesh: Navmesh;

        // Create a new wall-less, 10 x 10 mesh before each test 
        beforeEach(() => {
            graph = new PositionGraph()
            
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    graph.addPositionedNode(new Vec2(i, j));
                }
            }
            
            for (let i = 0; i < 100; i++) {
                // Check if an edge should be connected to the node in the next column
                if ((i + 1) % 10 !== 0)
                    graph.addEdge(i, i + 1);
                // Create edge below
                if (i + 10 < graph.numVertices)
                    graph.addEdge(i, i + 10);
            }

            mesh = new Navmesh(graph)
        })

        it("Should find a path to the start node", () => {

            // Create the start and the goal
            let to = new Vec2(0, 0)
            let from = new Vec2(0, 0)

            // Run astar using those coordinates
            let parent = createPath(mesh, to, from);

            // Check if the path should exist
            expect(parent).not.toBeNull()

            // Check path length
            expect(parent.length).toBe(1)

            // Check if the goal was reached (we assume the bottom of the stack is the goal)
            expect(parent.at(0)).toBe(0)

            // Further error checking
            testPathValidity(mesh, parent)

            // Print a message for a tester to know which cases passed.
            console.log("Test passed: astar found a path to the start node.")
        });

        it("Should find a path to an adjacent node", () => {
            let to = new Vec2(0, 0)
            let from = new Vec2(0, 1)
            let parent = createPath(mesh, to, from)
            expect(parent).not.toBeNull()
            expect(parent.length).toBe(2)
            expect(parent.at(0)).toBe(0)
            testPathValidity(mesh, parent) 
            console.log("Test passed: astar found a path to a node adjacent to the start node.")
        });

        it("Should find a straight, uninterrupted path", () => {
            let to = new Vec2(0, 0)
            let from = new Vec2(0, 9)
            let parent = createPath(mesh, to, from)
            expect(parent).not.toBeNull()
            expect(parent.length).toBe(10)
            let goal = graph.positions[parent.at(0)]
            expect(goal.x).toEqual(0)
            expect(goal.y).toBe(0)
            testPathValidity(mesh, parent)
            console.log("Test passed: astar found a straight, uninterrupted path to the goal.")
        })

        it("Should find a path around a single obstacle", () => {
            let graph = new PositionGraph()
            
            /*
                We are essentially doing the same thing as createPath, except manually adding an obstacle
                for the path to navigate around at node 34 (3, 4)
            */
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    graph.addPositionedNode(new Vec2(i, j));
                }
            }
            
            for (let i = 0; i < 100; i++) {

                // Extra conditional to add a long wall between the start and the goal at (3, 4)
                if(i != 34) {
                    // Check if an edge should be connected to the node in the next column
                    if ((i + 1) % 10 !== 0)
                        graph.addEdge(i, i + 1);
                    // Create edge below
                    if (i + 10 < graph.numVertices)
                        graph.addEdge(i, i + 10);
                }
            }

            let mesh = new Navmesh(graph)
            let to = new Vec2(0,4)
            let from = new Vec2(5, 4)
            let parent = createPath(mesh, to, from)
            
            expect(parent).not.toBeNull()
            expect(parent.length).toBe(8)
            let goal = graph.positions[parent.at(0)]
            expect(goal.x).toEqual(0)
            expect(goal.y).toBe(4)
            testPathValidity(mesh, parent)
            console.log("Test passed: astar found a path around a single obstacle.")
        })
    })

    /*
     * These test cases help to ensure the robustness of astar. Here, we are giving many different randomized meshes for astar
     * to traverse. Astar is expected to generate the same results as predefined results. For the sake of differences in 
     * implementation, we now assume that the path is satisfactory if it's within a certain percentage of the path length.
     */

    describe("Obstacle Variation Cases", () => {
        test.each(generateRandomMeshes())('Should find paths among various randomly generated meshes', ({mesh, to, from, expected}) => {
            let parent = createPath(mesh, to, from)

            if(parent == null)
                expect(parent).toEqual(expected.path)

            else {
                let goal = mesh.graph.positions[parent.at(0)]
                let expectedGoal = mesh.graph.positions[expected.path.at(0)]

                expect(goal.x).toBe(expectedGoal.x)
                expect(goal.y).toBe(expectedGoal.y)
                let upperBound = expected.length + (expected.length * .1)
                let lowerBound = expected.length - (expected.length * .1)
                expect(parent.length).toBeLessThanOrEqual(upperBound)
                expect(parent.length).toBeGreaterThanOrEqual(lowerBound)
                testPathValidity(mesh, parent)
            }
        })

        console.log("Tests passed: astar was tested on multiple generated meshes, and was found to be acceptable.")
    })

    /*
     * Edge cases that astar has the possibility of running into. Further edge cases will be implemented in the future
     * as astar is more frequently used.
     */

    describe("Edge Cases", () => {
        it("Should fail to find a path to an walled-off goal", () => {
            let graph = new PositionGraph()
            
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    graph.addPositionedNode(new Vec2(i, j));
                }
            }
            
            for (let i = 0; i < 100; i++) {

                // Extra conditional to add a long wall between the start and the goal
                if(i > 60 || i < 50) {
                    // Check if an edge should be connected to the node in the next column
                    if ((i + 1) % 10 !== 0)
                        graph.addEdge(i, i + 1);
                    // Create edge below
                    if (i + 10 < graph.numVertices)
                        graph.addEdge(i, i + 10);
                }
            }

            let mesh = new Navmesh(graph)

            let to = new Vec2(0, 0)
            let start = mesh.graph.snap(to);
            let from = new Vec2(9, 5)
            let end = mesh.graph.snap(from);

            let pathStack = new Stack<Vec2>(mesh.graph.numVertices);
            
            // Push the final position in the graph
            pathStack.push(mesh.graph.positions[end]);

            // Use A* on the mesh's PositionGraph to find a path from start to end
            let parent: number[] | null = GraphUtils.astarPositional(mesh.graph, start, end);
            
            expect(parent).toBeNull()

            console.log("Test passed: astar couldn't find a path to the goal when a wall blocked it off.")
        })
    })
})

/**
 * Does further error checking on a path to ensure a path's validity.
 * @param mesh The mesh being navigated on
 * @param path The path generated from astar on this mesh
*/
export function testPathValidity(mesh: Navmesh, path: number[]) {
    // Check the path for nonexistent nodes
    for(let i = 0; i < path.length; i++) {
        expect(mesh.graph.getNodePosition(path[i]), 
            "The generated path contains a node that doesn't exist: Node " + path[i] 
            + "\nMesh:\n" + mesh.graph.toString(), { showPrefix: false }).toBeDefined()
    }

    // The same nodes must not be retraversed in a given path.
    let duplicates = path.filter((num, index) => path.indexOf(num) !== index)
    expect(duplicates.length, 
        'The generated path is not optimal! Duplicate nodes in the path detected: ' + 
        duplicates.map(node => (mesh.graph.getNodePosition(node))) + "\nMesh:\n" + 
        mesh.graph.toString(), { showPrefix: false }).toBe(0)

    // The path must not make a transition between two nodes that don't have an edge
    for(let i = 0; i < path.length - 1; i++) {
        if(!mesh.graph.edgeExists(path[i], path[i+1])) {
            expect(mesh.graph.edgeExists(path[i], path[i+1]), 
                "The generated path made a nonexistent transition between node " + path[i] + 
                " (" + mesh.graph.getNodePosition(path[i]) + ") and node " + path[i+1] + 
                " (" + mesh.graph.getNodePosition(path[i+1]) + ")!\n" +
                "This is most likely due to phasing through a wall or discovering edges incorrectly."
                + "\nMesh:\n" + mesh.graph.toString(), { showPrefix: false }).toBeTruthy();
        }
    }
}

// function displayMesh(mesh: Navmesh, dims: Vec2) {
//     const graph = mesh.graph;
//     let meshString = ''
//     let rightEdges = ''
//     let bottomEdges = ''
//     for(let i = 0; i < graph.numVertices - 1; i++) {

//         if(i % dims.x == 0) {
//             meshString += rightEdges + '*\n' + bottomEdges + '\n'
//             rightEdges = ''
//             bottomEdges = ''
//         }

//         rightEdges += '*'

//         let rightEdge = graph.getEdges(i)

//         // console.log(rightEdge)
//         // console.log(i)

//         if(rightEdge && i % dims.x != 0)
//             rightEdges += '-'

//         let bottomEdge = rightEdge.next

//         if(bottomEdge && i )
//             bottomEdges += '| '

//         else
//             bottomEdges += ' '
//     }

//     return meshString
// }