# Homework 3 - CSE 380 - Spring 2023

- Professor Richard McKenna - richard@cs.stonybrook.edu
- Joe Weaver - hweaver@cs.stonybrook.edu
- Zachary Grandison - zgrandison@cs.stonybrook.edu
- Peter Walsh - peter.t.walsh@stonybrook.edu
- Kevin Cai - kevin.cai@stonybrook.edu

## Due Date: TBD

## Introduction
In this assignment, you will make a simple top-down game using the Typescript programming language and the Wolfie2D game engine. By completing this assignment, you should start to become familiar with the Wolfie2D game engine and develop an understanding of:

- How to create custom Tilemaps and Tilesets using the Tiled level editor
- Use Wolfie2d's pathfinding system
- How to create simple, state-machine AI
- How to create GOAP actions for GOAP AI in Wolfid2d


## Part 1 - Creating a Tileset
In this assignment you have to create your own custom tileset. You should have a few unique tiles

## Part 2 - Creating a Tilemap
For this assignment, you will create a custom tilemap using the [Tiled]() level editor and the custom tileset you made in part 1. Make sure your tilemap has a layer for the walls with the `Collidable` property.

## Part 3 - Pathfinding with A*
Inside of the hw4 codebase, there is a file called `AStarStrategy` where you will have to implement a version of A*. 

```typescript 
/**
 * This is where the students will be implementing their version of A* - in theory.
 * 
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system. 
 * 
 * This is the Strategy design pattern ;)
 * @author PeteyLumpkins
 */
export default class AstarStrategy extends NavPathStrat {

    /**
     * @see NavPathStrat.buildPath()
     */
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        return null;
    }
    
}
```

For this assigment, I have adpated Wolfie2d's navigation system to support different strategies for pathfinding, allowing you to swap out *how* pathfinding is performed. Inside the main scene class for the game, you'll have to set the navmesh to use A* pathfinding instead of the direct pathfinding strategy I've given you.

If you're looking to run a basic test to see whether or not your algorithm is working on a single bot, I have configured a scene to specifically test your implementation of A*. All you have to do is set the game's initial scene to be the A* test scene in the main method.

> As a final note; I have intentionally left out many details regarding the implementation of the algorithm. Things like what your heuristic should be, which data structures you use, and any helper methods you want to define are up to you :slightly_smiling_face: 
