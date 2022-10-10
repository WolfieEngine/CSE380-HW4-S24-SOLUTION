import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import ItemManager from "../../GameSystems/ItemSystem/ItemManager";
import Item from "../../GameSystems/ItemSystem/Items/Item";
import HealthPack from "../../GameSystems/ItemSystem/ItemTypes/HealthPack";
import { GoapActionStatus } from "../Goap/GoapAction";
import NPCGoapAI from "../NPCGoapAI";
import NPCAction from "./NPCAction";

export default class PickupHealthpack extends NPCAction<PickupHealthpackOptions> {

    protected items: ItemManager;
    protected healthpack: Item | null;
    protected path: NavigationPath | null;

    constructor(init: PickupHealthpackOptions, cost?: number, preconditions?: string[], effects?: string[]) {
        super(cost, preconditions, effects);
        this.items = init.items;
    }

    init(init: PickupHealthpackOptions): void {
        this.items = init.items;
        this.healthpack = null;
        this.path = null;
    }
   
    start(npc: NPCGoapAI): void {

    }
    run(npc: NPCGoapAI): GoapActionStatus {
        if (this.path.isDone()) {
            return this.healthpack.pickup(npc.inventory) !== null ? GoapActionStatus.SUCCESS : GoapActionStatus.FAILURE;
        }
        npc.moveOnPath(npc.speed, this.path);
    }
    stop(npc: NPCGoapAI): void { }
    
    checkProceduralPreconditions(npc: NPCGoapAI): boolean {
        this.healthpack = this.items.findItem((item: Item) => item.type.constructor === HealthPack && item.inv === null);
        this.path = this.healthpack !== null ? npc.getPath(this.healthpack.owner.position) : null;
        return this.healthpack !== null && npc.health < npc.maxHealth;
    }
}

interface PickupHealthpackOptions {
    items: ItemManager;
}