import GoapStatus from "../../../../Wolfie2D/AI/Goap/GoapStatus";
import Actor from "../../../../Wolfie2D/DataTypes/Interfaces/Actor";

export default class GoalReached extends GoapStatus {

    checkProceduralPreconditions(actor: Actor): boolean { return false; }
    
}