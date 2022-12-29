import { GoapActionStatus } from "../../../../../Wolfie2D/AI/Goap/GoapAction";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Item from "../../../../GameSystems/ItemSystem/Items/Item";
import Weapon from "../../../../GameSystems/ItemSystem/Items/Weapon";
import NPCActor from "../../NPCActor";
import NPCAction from "../NPCAction";

export default abstract class UseItemAction extends NPCAction {

    protected item: Item | null;

    public constructor() {
        super();
        this.item = null;

    }

    public performAction(actor: NPCActor): GoapActionStatus {
        this.item.use();
        return GoapActionStatus.SUCCESS;
    }

    public abstract planAction(actor: NPCActor): void;

}