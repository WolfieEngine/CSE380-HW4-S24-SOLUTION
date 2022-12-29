import State from "../../../DataTypes/State/State";
import GameEvent from "../../../Events/GameEvent";
import GameNode from "../../../Nodes/GameNode";
import GoapAction from "../GoapAction";
import StateMachineGoapAI from "../StateMachineGoapAI";

export default class Planning extends State {
    
    protected parent: StateMachineGoapAI<GoapAction>;

    public constructor(parent: StateMachineGoapAI<GoapAction>) {
        super(parent);
    }
    
    public onEnter(options: Record<string, any>): void {
        let plan = this.parent.getPlan();
        // If the plan is empty or we've reached our goal, build a new plan!
        if (plan.isEmpty() || this.parent.goalReached()) {
            this.parent.setPlan(this.parent.buildPlan());
        }
        // Start moving on the first action
        this.finished("MOVING");
    }

    public handleInput(event: GameEvent): void {
        
    }

    public update(deltaT: number): void {
        
    }
    public onExit(): Record<string, any> {
        return {}
    }
    
}