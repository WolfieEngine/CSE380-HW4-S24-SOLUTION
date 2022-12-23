import State from "../../../DataTypes/State/State";
import StateMachine from "../../../DataTypes/State/StateMachine";
import GameEvent from "../../../Events/GameEvent";
import GameNode from "../../../Nodes/GameNode";
import GoapAction, { GoapActionStatus } from "../GoapAction";
import StateMachineGoapAI from "../StateMachineGoapAI";

export default class Acting extends State {
    
    protected parent: StateMachineGoapAI<GoapAction>;
    protected action: GoapAction;

    public constructor(parent: StateMachineGoapAI<GoapAction>) {
        super(parent);
        this.action = null;
    }
    
    public onEnter(options: Record<string, any>): void {
        if (this.parent.getPlan().isEmpty()) {
            this.finished("PLAN");
        } else {
            // Get the action at the top of the plan and perform the action
            this.action = this.parent.getPlan().peek();
            this.performAction();
        }
    }
    public handleInput(event: GameEvent): void {
        
    }
    public update(deltaT: number): void {
        let owner = this.parent.getOwner();
        let target = this.action.getTarget(owner);
        if (target.distanceTo(owner.position) > this.action.getRange(owner)) {
            this.finished("MOVING");
        } else {
            this.performAction();
        }

    }
    public onExit(): Record<string, any> {
        return {}
    }

    private performAction(): void {
        let res = this.action.performAction(this.parent.getOwner());
        switch (res) {
            case GoapActionStatus.SUCCESS: {
                // Pop the action
                this.parent.getPlan().pop();
                // Go back to the planning state
                this.finished("PLAN");
                break;
            }
            case GoapActionStatus.FAILURE: {
                // Clear the plan -> go back and create a new plan
                this.parent.getPlan().clear();
                this.finished("PLAN");
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