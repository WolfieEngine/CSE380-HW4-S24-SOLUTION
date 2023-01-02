import Healthpack from "../../../../GameSystems/ItemSystem/Items/Healthpack";
import NPCActor from "../../NPCActor";
import PickupItemAction from "./PickupAction";

export default class PickupHealthpack extends PickupItemAction {

    protected item: Healthpack | null

    public planAction(actor: NPCActor): void {
        // Get the healthpack closest to the actor's position
        let healthpacks = Array.from(actor.getScene().getHealthpacks());
        let healthpack = healthpacks.filter((hpack) => {
            return hpack.inventory === null && hpack.visible
        }).reduce((h1, h2) => {
            return h1.position.distanceSqTo(actor.position) < h2.position.distanceSqTo(actor.position) ? h1 : h2;
        });

        // Set the item to be the healthpack
        this.item = healthpack;
        // Set targets position to the healthpack
        this.target.copy(healthpack.position);
    }

}