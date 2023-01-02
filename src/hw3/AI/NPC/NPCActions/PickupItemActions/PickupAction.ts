import { GoapActionStatus } from "../../../../../Wolfie2D/AI/Goap/GoapAction";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Item from "../../../../GameSystems/ItemSystem/Item";
import NPCActor from "../../NPCActor";
import NPCGoapAI from "../../NPCBehavior/HealerBehavior";
import NPCAction from "../NPCAction";

export default abstract class PickupItem extends NPCAction {

    public static readonly RANGE: number = 25;

    protected item: Item | null;

    constructor(key: string) {
        super(key)
        this.item = null;
        this._range = PickupItem.RANGE;
    }

    public performAction(actor: NPCActor): GoapActionStatus {
        if (this.item === null || this.item.inventory !== null) { 
            return GoapActionStatus.FAILURE; 
        }
        return actor.inventory.add(this.item) !== null ? GoapActionStatus.SUCCESS : GoapActionStatus.FAILURE;
    }

    public abstract planAction(actor: NPCActor): void;


}