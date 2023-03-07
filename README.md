# Homework 4 - CSE 380 - Spring 2023

- Professor Richard McKenna - richard@cs.stonybrook.edu
- Joe Weaver - hweaver@cs.stonybrook.edu
- Zachary Grandison - zgrandison@cs.stonybrook.edu
- Peter Walsh - peter.t.walsh@stonybrook.edu
- Kevin Cai - kevin.cai@stonybrook.edu

### Due Date: Friday, March 24, 2023

## Introduction
In this assignment, you will make a simple top-down game using the Typescript programming language and the Wolfie2D game engine. By completing this assignment, you should start to become familiar with the Wolfie2D game engine and develop an understanding of:

- How to create custom Tilemaps and Tilesets using the Tiled level editor
- Use Wolfie2d's pathfinding system
- How to create simple, state-machine AI
- How to create GOAP actions for GOAP AI in Wolfid2d

## How To Play
There is not much of a "game" to be played in this assignment. When you hit the "play" button, you will assume control of the player in the top-left corner of the map. You can move the player around with WASD, but that's about it. 

> Something worth pointing out about this game is that it's only running at around 30 frames per second. Rendering the complete tilemap I have made with all 20 enemies running around on screen doing pathfinding and GOAP is expensive.

## Part 1 - Creating a Tileset
In this assignment you have to create your own custom tileset for a custom tilemap. You can use whatever image editing software you'd like to create the tileset png (I used [Piskel](https://www.piskelapp.com/p/create/sprite)). Creating beautiful tilesets is not the point of this assignment, but you should create at least two custom tiles to distinguish between the wall and floor tiles of your tilemap.

> In case you're worried about scaling, my tiles are 8x8 (pixels). 

## Part 2 - Creating a Tilemap
For this assignment, you will create a custom tilemap using the [Tiled](https://www.mapeditor.org/) level editor and the custom tileset you made in part 1. The tilemap I created for the assignment is 64x64 tiles where each tile is 8x8 pixels. 

The only constraint on the tilemap is that you should have at least two tile layers called "Floor" and "Wall". The wall layer must have a boolean property called `Collidable` set to `true`. The collidable property tells Wolfie2d's physics system that objects in the game world should collide with this layer of the tilemap.

## Part 3 - Pathfinding with A*
In this homework assignment, you will have to use A* to construct paths for your AI. The paths you construct for your AI should be returned from the `buildPath(to: Vec2, from: Vec2)` method of the `AstarStrategy` class (shown below).

```typescript
// TODO Construct a NavigationPath object using A*

/**
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system. 
 * 
 * - Peter
 */
export default class AstarStrategy extends NavPathStrat {

    /**
     * @see NavPathStrat.buildPath()
     */
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        return new NavigationPath(new Stack());
    }
    
}
```
In Wolfie2d, the current pathfinding system uses a `NavigationPath` object that wraps around a stack of positions. Every time the actor/AI gets close to the position at the top of the navigation path stack, the position gets popped from the stack and the AI will then start moving toward the next position.

### Configuring A* Pathfinding
For this assigment, I have adpated Wolfie2d's navigation system to support different strategies for pathfinding, allowing you to swap out how pathfinding is performed. Inside the main scene class for the game, you'll have to set the navmesh to use A* pathfinding instead of the direct pathfinding strategy I've given you.

You can swap the strategy you use for pathfinding out in the `initializeNavmesh()` method.

```typescript
export default class MainHW3Scene extends HW3Scene {

    protected initializeNavmesh(): void {
        // Create the graph
        this.graph = new PositionGraph();
        
        // Implementation details not shown...

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.graph);
        
        // Add different strategies to use for this navmesh
        navmesh.registerStrategy("direct", new DirectStrategy(navmesh));
        navmesh.registerStrategy("astar", new AstarStrategy(navmesh));

        // TODO set the strategy to use A* pathfinding
        navmesh.setStrategy("direct");

        // Add this navmesh to the navigation manager
        this.navManager.addNavigableEntity("navmesh", navmesh);
    }
    
}
```

If you're looking to run a basic test to see whether or not your algorithm is working on a single bot, I have configured a scene to try and help you test whether your algorithm is working (approximately). You should be able to switch to the A* demo scene from the main menu.

> As a final note; I have intentionally left out many details regarding the implementation of the algorithm. Things like what your heuristic should be, which data structures you use, and any helper methods you want to define are up to you.

## Part 4 - Goal-Oriented-Action-Planning and Healers

For this part of the assignment, you'll need to implement some functionality to get the `HealerBehavior` to work. The

