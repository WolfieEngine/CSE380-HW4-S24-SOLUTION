import { GoapActionStatus } from "../../../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";
import NPCActor from "../../../NPCActor";
import UseHealthPack from "../UseHealthPack";

export default class HealSelf extends UseHealthPack {
    
    public override performAction(actor: NPCActor): GoapActionStatus {
        // If the item is null or not in the actor's inventory - return FAILURE
        if (this.item === null || !actor.inventory.has(this.item.id)) { 
            return GoapActionStatus.FAILURE; 
        }

        // Heal the actor (self)
        actor.health += this.item.health;
        // Remove the healthpack from the actor's inventory
        actor.inventory.remove(this.item.id);

        return GoapActionStatus.SUCCESS;
    }

    public override planAction(actor: NPCActor): void {
        super.planAction(actor);
        this.target = actor.position;
    }
}