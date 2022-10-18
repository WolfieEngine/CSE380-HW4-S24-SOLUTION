import Item from "../../../../GameSystems/ItemSystem/Items/Item";
import HealthPack from "../../../../GameSystems/ItemSystem/ItemTypes/HealthPack";
import NPCGoapAI from "../../NPCGoapAI";
import PickupItemAction from "./PickupAction";

export default class PickupHealthpack extends PickupItemAction {

    public override getItem(npc: NPCGoapAI): Item | null {
        return npc.world.items.getItem(npc.target.id);
    }

}