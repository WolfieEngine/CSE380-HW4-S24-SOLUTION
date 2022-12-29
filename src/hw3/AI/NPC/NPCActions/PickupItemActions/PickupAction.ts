import { GoapActionStatus } from "../../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Item from "../../../../GameSystems/ItemSystem/Items/Item";
import NPCActor from "../../NPCActor";
import NPCGoapAI from "../../NPCGoapAI";
import NPCAction from "../NPCAction";

export default abstract class PickupItem extends NPCAction {

    public static readonly RANGE: number = 25;

    protected item: Item | null;

    constructor() {
        super()
        this.item = null;
        this._range = PickupItem.RANGE;
    }


    public performAction(actor: NPCActor): GoapActionStatus {
        if (this.item === null) { 
            return GoapActionStatus.FAILURE; 
        }
        return this.item.pickup(actor.inventory) !== null ? GoapActionStatus.SUCCESS : GoapActionStatus.FAILURE;
    }

    public abstract planAction(actor: NPCActor): void;


}