import Item from "../../../../../GameSystems/ItemSystem/Items/Item";
import HealthPack from "../../../../../GameSystems/ItemSystem/ItemTypes/HealthPack";
import { GoapActionStatus } from "../../../../../GameSystems/GoapSystem/GoapAction";
import NPCGoapAI from "../../../NPCGoapAI";
import UseItemAction from "../UseItemAction";

export default abstract class UseHealthPack extends UseItemAction {

    getItem(npc: NPCGoapAI): Item {
        return npc.inventory.find((item: Item) => item.type.constructor === HealthPack);
    }

    abstract useItem(npc: NPCGoapAI): GoapActionStatus;

}

