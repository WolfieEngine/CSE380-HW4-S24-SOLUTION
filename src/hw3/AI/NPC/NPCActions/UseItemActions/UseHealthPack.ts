import { GoapActionStatus } from "../../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import Healthpack from "../../../../GameSystems/ItemSystem/Items/Healthpack";
import NPCActor from "../../NPCActor";
import NPCAction from "../NPCAction";

export default abstract class UseHealthpack extends NPCAction {

    protected item: Healthpack | null;

    public constructor(key: string) {
        super(key);
        this.item = null;
    }

    public abstract performAction(actor: NPCActor): GoapActionStatus;

    public planAction(actor: NPCActor): void {
        let item = actor.inventory.find(item => item.constructor === Healthpack);
        if (item !== null && item.constructor === Healthpack) {
            this.item = item;
        } else {
            this.item = null;
        }
    }

}