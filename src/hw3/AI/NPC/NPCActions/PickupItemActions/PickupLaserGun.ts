import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Item from "../../../../GameSystems/ItemSystem/Items/Item";
import LaserGun from "../../../../GameSystems/ItemSystem/ItemTypes/LaserGun";
import NPCActor from "../../NPCActor";
import NPCGoapAI from "../../NPCGoapAI";
import PickupItemAction from "./PickupAction";

export default class PickupLaserGun extends PickupItemAction {

    public override getItem(npc: NPCActor): Item | null {
        return npc.getScene().getItems().findItem(item => item.type.constructor === LaserGun)
    }
    
}