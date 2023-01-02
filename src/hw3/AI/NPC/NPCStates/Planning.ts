import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import NPCActor from "../NPCActor";
import NPCBehavior from "../NPCBehavior";
import NPCState from "../NPCState";

/**
 * The "Planning" state represents the state when the GOAP AI is creating a new plan. When the
 * planning is done, we immediatly switch to the "Moving" state.
 */
export default class Planning extends NPCState {

    public constructor(parent: NPCBehavior, owner: NPCActor) {
        super(parent, owner);
    }
    
    public onEnter(options: Record<string, any>): void {
        // Get the current plan
        let plan = this.parent.getPlan();

        // If the plan is empty, build a new plan!
        if (plan.isEmpty()) {
            this.parent.setPlan(this.parent.buildPlan());
        }

        // Switch to the move action
        this.finished("ACTING");
    }

    public handleInput(event: GameEvent): void { }

    public update(deltaT: number): void {}

    public onExit(): Record<string, any> { return {} }
    
}