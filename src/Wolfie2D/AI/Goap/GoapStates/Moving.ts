import State from "../../../DataTypes/State/State";
import StateMachine from "../../../DataTypes/State/StateMachine";
import Vec2 from "../../../DataTypes/Vec2";
import GameEvent from "../../../Events/GameEvent";
import GameNode from "../../../Nodes/GameNode";
import GoapAction from "../GoapAction";
import StateMachineGoapAI from "../StateMachineGoapAI";

export default class Moving extends State {
    
    protected parent: StateMachineGoapAI<GoapAction>;
    protected action: GoapAction;

    public constructor(parent: StateMachineGoapAI<GoapAction>) {
        super(parent);
        this.action = null;
    }
    
    public onEnter(options: Record<string, any>): void {
        // If the plan is empty that's bad -> should get a new plan
        if (this.parent.getPlan().isEmpty()) {
            this.finished("PLAN");
        } 

        // Otherwise, get the next action we should perform
        else {
            this.action = this.parent.getPlan().peek();
        }
    }

    public handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                
            }
        }
    }

    public update(deltaT: number): void {
        let owner = this.parent.getOwner();

         // Get the target location we're moving to
        let target = this.action.getTarget(owner);
        if (target.distanceTo(owner.position) <= this.action.getRange(owner)) {
            this.finished("ACTING");
        } else {
            owner.move(target.scaled(deltaT));
        }
    }

    public onExit(): Record<string, any> {
        return {}
    }
    
}