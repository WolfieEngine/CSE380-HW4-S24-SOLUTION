import { GoapActionStatus } from "../../../../../../Wolfie2D/AI/Goap/GoapAction";
import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";
import Battler from "../../../../Battler";
import NPCActor from "../../../NPCActor";
import UseHealthPack from "../UseHealthPack";

export default class HealSelf extends UseHealthPack {

    protected ally: Battler | null;

    public constructor(key: string) {
        super(key);
        this.ally = null;
        this._range = 25;
    }
    
    public override performAction(actor: NPCActor): GoapActionStatus {
        // If the item is null or not in the actor's inventory - return FAILURE
        if (this.item === null || !actor.inventory.has(this.item.id)) { 
            return GoapActionStatus.FAILURE; 
        }
        // If the ally is null or the ally is not on the actors team - return FAILURE
        if (this.ally === null || this.ally.battleGroup !== actor.battleGroup) {
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

        let scene = actor.getScene();

        // Get the ally with less than half health that's closest to the actor
        this.ally = scene.getBattlers().filter((battler) => {
            return battler.battleGroup === actor.battleGroup && battler.health < battler.maxHealth / 2
        }).reduce((b1, b2) => {
            return b1.position.distanceSqTo(actor.position) < b2.position.distanceSqTo(actor.position) ? b1 : b2;
        });
        
    }

    public override get target(): Vec2 {
        return this.ally !== null ? this.ally.position : super.target;
    }
}