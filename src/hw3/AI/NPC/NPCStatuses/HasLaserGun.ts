import GoapStatus from "../../../../Wolfie2D/AI/Goap/GoapStatus";
import LaserGun from "../../../GameSystems/ItemSystem/Items/LaserGun";
import NPCActor from "../NPCActor";

export default class HasLaserGun extends GoapStatus {

    public checkProceduralPreconditions(actor: NPCActor): boolean {
        return actor.inventory.find(item => item.constructor === LaserGun) !== null;
    }
    
}