import Item from "../../../../GameSystems/ItemSystem/Items/Item";
import LaserGun from "../../../../GameSystems/ItemSystem/ItemTypes/LaserGun";
import NPCGoapAI from "../../NPCGoapAI";
import PickupItemAction from "./PickupAction";

export default class PickupLaserGun extends PickupItemAction {

    public override getItem(npc: NPCGoapAI): Item | null {
        return npc.world.items.getItem(npc.target.id);
    }
    
}