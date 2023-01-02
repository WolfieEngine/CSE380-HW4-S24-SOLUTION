import GoapStatus from "../../../../Wolfie2D/AI/Goap/GoapStatus";
import Actor from "../../../../Wolfie2D/DataTypes/Interfaces/Actor";
import NPCActor from "../NPCActor";

export default class LaserGunExists extends GoapStatus {

    public checkProceduralPreconditions(actor: NPCActor): boolean {
        return Array.from(actor.getScene().getLaserGuns()).length > 0;
    }

}