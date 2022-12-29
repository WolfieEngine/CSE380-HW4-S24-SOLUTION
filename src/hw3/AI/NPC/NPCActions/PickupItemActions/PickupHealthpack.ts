import HealthPack from "../../../../GameSystems/ItemSystem/ItemTypes/HealthPack";
import NPCActor from "../../NPCActor";
import PickupItemAction from "./PickupAction";


export default class PickupHealthpack extends PickupItemAction {

    public planAction(actor: NPCActor): void {
        this.item = actor.getScene().getItems().findItem(item => item.type.constructor === HealthPack)
        this.target.copy(this.item.owner.position);
    }

}