import GoapStatus from "../../../../Wolfie2D/AI/Goap/GoapStatus";
import NPCActor from "../NPCActor";

export default class Idling extends GoapStatus {

    checkProceduralPreconditions(actor: NPCActor): boolean { return true; }
    
}