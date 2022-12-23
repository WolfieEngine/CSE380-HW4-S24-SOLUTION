import { GoapActionStatus } from "../../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Item from "../../../../GameSystems/ItemSystem/Items/Item";
import NPCActor from "../../NPCActor";
import NPCGoapAI from "../../NPCGoapAI";
import NPCAction from "../NPCAction";

export default abstract class PickupItem extends NPCAction {

    protected item: Item | null;

    protected target: Vec2;
    protected range: number;

    constructor() {
        super()
        this.item = null;
    }

    public performAction(actor: NPCActor): GoapActionStatus {
        if (this.item === null) { 
            return GoapActionStatus.FAILURE; 
        }
        return this.item.pickup(actor.inventory) !== null ? GoapActionStatus.SUCCESS : GoapActionStatus.FAILURE;
    }

    public getTarget(actor: NPCActor): Vec2 {
        return this.target
    }

    public getRange(actor: NPCActor): number {
        return 25;
    }

    abstract getItem(npc: NPCActor): Item | null;


}