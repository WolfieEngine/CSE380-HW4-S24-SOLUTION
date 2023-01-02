import GoapStatus from "../../../../Wolfie2D/AI/Goap/GoapStatus";
import Healthpack from "../../../GameSystems/ItemSystem/Items/Healthpack";
import NPCActor from "../NPCActor";

/**
 * Checks if a healthpack exists among the items in the HW3Scene the NPCActor is in.
 */
export default class HealthpackExists extends GoapStatus {

    public checkProceduralPreconditions(actor: NPCActor): boolean {
        let scene = actor.getScene();
        let healthpacks = Array.from(scene.getHealthpacks());
        return healthpacks.length > 0;
    }

}