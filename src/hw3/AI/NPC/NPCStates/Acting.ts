import { GoapActionStatus } from "../../../../Wolfie2D/AI/Goap/GoapAction";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import NPCAction from "../NPCActions/NPCAction";
import NPCActor from "../NPCActor";
import NPCBehavior from "../NPCBehavior";
import NPCState from "../NPCState";

export default class Acting extends NPCState {
    
    protected action: NPCAction;

    public constructor(parent: NPCBehavior, actor: NPCActor) {
        super(parent, actor);
        this.action = null;
    }
    
    public onEnter(options: Record<string, any>): void {
        if (this.parent.getPlan().isEmpty()) {
            this.finished("PLANNING");
        } else {
            // Get the action at the top of the plan and perform the action
            this.action = this.parent.getPlan().peek();
            // Call the start method for the action
            this.action.onStart(this.actor);
        }
    }
    public handleInput(event: GameEvent): void {
        
    }

    public update(deltaT: number): void {
        let target = this.action.target;

        if (target.distanceTo(this.actor.position) > this.action.range) {
            this.finished("MOVING");
        } else {
            this.performAction();
        }

    }
    public onExit(): Record<string, any> {
        return {}
    }

    private performAction(): void {
        let res = this.action.performAction(this.actor);
        switch (res) {
            case GoapActionStatus.SUCCESS: {
                // Pop the action
                this.parent.getPlan().pop();
                // Go back to the planning state
                this.finished("PLANNING");
                break;
            }
            case GoapActionStatus.FAILURE: {
                // Clear the plan -> go back and create a new plan
                this.parent.getPlan().clear();
                this.finished("PLANNING");
                break;
            }
            case GoapActionStatus.RUNNING: {
                // Do nothing - keep trying to run the action
            }
            default: {
                throw new Error("Error while performing a goap action!");
            }
        }
    }
    
}