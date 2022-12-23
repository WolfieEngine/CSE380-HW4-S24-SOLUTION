import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import Battler from "../../GameSystems/BattleSystem/Battlers/Battler";
import Inventory from "../../GameSystems/ItemSystem/Inventory";
import StateMachineGoapAI from "../../../Wolfie2D/AI/Goap/StateMachineGoapAI";
import NPCAction from "./NPCActions/NPCAction";
import HW3WorldState from "../../GameSystems/WorldState";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";

import { NPCStateType, Active, Dead } from "./NPCStates/NPCState";
import NPCActor from "./NPCActor";

export default class NPCStateMachineAI extends StateMachineGoapAI  {

    /** The GameNode that owns this NPCGoapAI */
    protected _owner: NPCActor;
    

    /** Initialize the NPC AI */
    initializeAI(owner: NPCActor, opts: Record<string, any>): void {
        this._owner = owner;
        
    }



    /** GameNode interface */
    public get owner(): GameNode { return this._owner; }
    public get position(): Vec2 { return this._owner.position; }
    public get id(): number { return this._owner.id; }
    public getPath(to: Vec2): NavigationPath { return this._owner.getScene().getNavigationManager().getPath(this._navkey, this.owner.position, to); }
    public moveOnPath(speed: number, path: NavigationPath): void { this._owner.moveOnPath(speed, path); }

    /** Battler Interface */
    public get battler(): Battler { return this._battler; }
    




}