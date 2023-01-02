import GoapStatus from "../../../../Wolfie2D/AI/Goap/GoapStatus";
import Healthpack from "../../../GameSystems/ItemSystem/Items/Healthpack";
import NPCActor from "../NPCActor";

export default class HasHealthpack extends GoapStatus {

    public checkProceduralPreconditions(actor: NPCActor): boolean {
        return actor.inventory.find(item => item.constructor === Healthpack) !== null;
    }
    
}