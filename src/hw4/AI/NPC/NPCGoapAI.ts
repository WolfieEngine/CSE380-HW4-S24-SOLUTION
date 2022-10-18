import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import Battler from "../../GameSystems/BattleSystem/Battlers/Battler";
import Inventory from "../../GameSystems/ItemSystem/Inventory";
import GoapObject from "../../GameSystems/GoapSystem/GoapObject";
import NPCAction from "./NPCActions/NPCAction";
import HW3WorldState from "../../GameSystems/WorldState";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";

import { NPCStateType, Active, Dead } from "./NPCStates/NPCState";

export default class NPCGoapAI extends StateMachineAI implements AI {

    /** The GameNode that owns this NPCGoapAI */
    protected _owner: GameNode;
    /** The GameNode this NPC is targeting */
    protected _target: GameNode;
    /** The last known location of the GameNode the NPC is targeting */
    protected _location: Vec2;
    /** A key to the navigation mesh this NPC should use to navigate the scene */
    protected _navkey: string;
    /** The Battler object associated with this NPC */
    protected _battler: Battler;
    /** The Inventory object associated with this NPC */
    protected _inventory: Inventory;
    /** The GoapObject that kind of owns this NPCGoapAI - it does the heavy lifting */
    protected _goap: GoapObject<NPCGoapAI, NPCAction>;
    /** The state of the world */
    protected _world: HW3WorldState;

    initializeAI(owner: GameNode, opts: Record<string, any>): void {
        this._owner = owner;
        this._navkey = opts.navkey;
        this._battler = opts.battler;
        this._inventory = opts.inventory;

        this._goap = opts.goap;
        this._goap.initialize(this);

        this._world = opts.world;

        this.addState(NPCStateType.ACTIVE, new Active(this))
        this.addState(NPCStateType.DEAD, new Dead(this));
        this.initialize(NPCStateType.ACTIVE);
    }

    destroy(): void {}

    activate(options: Record<string, any>): void {}

    /**
     * First, the update method makes a call to super.update(). Calling the super.update() method will
     * trigger the current state of the AIs StateMachine to update.
     * 
     * Next, the update method attempts to perform the next action in the Goap AIs plan. If the plan is 
     * empty, a new plan is created.
     * 
     * If the action the AI attempts to perform is successful, the AI will add the effects of successfully
     * performing the action to the AIs current statuses and pop the action from it's current action plan.
     * 
     * @param deltaT the amount of time elapsed since the last update cycle
     */
    public update(deltaT: number): void {
        super.update(deltaT);
    }

    public handleEvent(event: GameEvent): void {
        super.handleEvent(event);
    }

    public set target(target: GameNode) { this._target = target; }
    public get target(): GameNode { return this._target; }
    public set location(location: Vec2) { this._location = location; }
    public get location(): Vec2 { return this._location; }

    /** GameNode interface */
    public get owner(): GameNode { return this._owner; }
    public get position(): Vec2 { return this._owner.position; }
    public get id(): number { return this._owner.id; }
    public getPath(to: Vec2): NavigationPath { return this._owner.getScene().getNavigationManager().getPath(this._navkey, this.owner.position, to, false); }
    public moveOnPath(speed: number, path: NavigationPath): void { this._owner.moveOnPath(speed, path); }

    /** Battler Interface */
    public get battler(): Battler { return this._battler; }
    
    /** Inventory Interface */
    public get inventory(): Inventory { return this._inventory; }

    /** Goap Interface */
    get goap(): GoapObject<NPCGoapAI, NPCAction> { return this._goap; }
    get goal(): string { return this._goap.goal; }
    get actions(): NPCAction[] { return Array.from(this._goap.actions()); }
    get status(): string[] { return Array.from(this._goap.statuses()); }

    /** World State */
    get world(): HW3WorldState { return this._world; }

    /** Checks if the NPC can see a target */
    isTargetVisible(pos: Vec2): boolean { 

        // Get the new player location
        let start = this.owner.position.clone();
        let delta = pos.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, pos.x);
        let maxX = Math.max(start.x, pos.x);
        let minY = Math.min(start.y, pos.y);
        let maxY = Math.max(start.y, pos.y);

        // Get the wall tilemap
        let walls = this.world.walls;

        let minIndex = walls.getTilemapPosition(minX, minY);
        let maxIndex = walls.getTilemapPosition(maxX, maxY);

        let tileSize = walls.getScaledTileSize();

        for (let col = minIndex.x; col <= maxIndex.x; col++) {
            for (let row = minIndex.y; row <= maxIndex.y; row++) {
                if (walls.isTileCollidable(col, row)) {
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x / 2, row * tileSize.y + tileSize.y / 2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1 / 2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if (hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(pos)) {
                        // We hit a wall, we can't see the player
                        return false;
                    }
                }
            }
        }
        return true;
    }


}