import NPCActor from "../../NPCActor";
import PickupItemAction from "./PickupAction";

export default class PickupLaserGun extends PickupItemAction {

    public planAction(actor: NPCActor): void {
        let laserguns = Array.from(actor.getScene().getLaserGuns());
        let lasergun = laserguns.reduce((l1, l2) => {
            return l1.position.distanceSqTo(actor.position) < l2.position.distanceSqTo(actor.position) ? l1 : l2
        })
        this.target.copy(lasergun.position);
    }

}