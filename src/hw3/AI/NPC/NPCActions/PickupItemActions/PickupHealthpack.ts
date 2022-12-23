import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Item from "../../../../GameSystems/ItemSystem/Items/Item";
import HealthPack from "../../../../GameSystems/ItemSystem/ItemTypes/HealthPack";
import NPCActor from "../../NPCActor";
import NPCGoapAI from "../../NPCGoapAI";
import PickupItemAction from "./PickupAction";


export default class PickupHealthpack extends PickupItemAction {

    public getItem(actor: NPCActor): Item | null {
        return actor.getScene().getItems().findItem(item => item.type.constructor === HealthPack)
    }

}