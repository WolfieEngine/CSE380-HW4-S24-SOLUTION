import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Battler from "../../../GameSystems/BattleSystem/Battler";
import Healthpack from "../../../GameSystems/ItemSystem/Items/Healthpack";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import NPCAction from "./NPCAction";


export default class UseHealthpack extends NPCAction {

    protected healthpack: Healthpack | null;
    protected target: TargetableEntity | null

    public constructor(parent: NPCBehavior, actor: NPCActor) { 
        super(parent, actor);
        this.healthpack = null;
        this.target = null;
    }

    public onEnter(options: Record<string, any>): void {
        // Get a healthpack from the actor's inventory
        let healthpack = this.actor.inventory.find(item => item.constructor === Healthpack);

        // If we found a healthpack, set the healthpack we're going to use
        if (healthpack !== null && healthpack.constructor === Healthpack) {
            this.healthpack = healthpack;
        }
        // If the actor has a target - set the target
        if (this.actor.hasTarget()) {
            this.target = this.actor.getTarget();
        } 
    }

    public update(deltaT: number): void {
        // Get the current state of the behavior
        // let preconditions = this.checkPreconditions(this.parent.currentStatus());
        
        // If we have a healthpack and it's in the actor's inventory and we have a target and the actor is at the target -> use the healthpack on the target
        if (this.healthpack !== null && 
            this.healthpack.inventory !== null && 
            this.healthpack.inventory.id === this.actor.inventory.id && 
            this.actor.hasTarget() &&
            this.actor.atTarget()
            ) 
        {
            // Remove the healthpack from the actor's inventory
            this.actor.inventory.remove(this.healthpack.id);
            // Use the healthpack on the target
            this.emitter.fireEvent("usee-hpack", {hpack: this.healthpack, actorId: this.actor.id, targetId: this.target.id});
        } 

        // Finish the action
        this.finished();
    }

    public onExit(): Record<string, any> { 
        this.target = null;
        this.healthpack = null;
        return {}; 
    }

}