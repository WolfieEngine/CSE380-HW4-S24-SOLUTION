import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { PlayerAnimationType, PlayerStateType } from "./PlayerState";
import PlayerState from "./PlayerState";
import { Debugger } from "../../Debugger";

export default class Idle extends PlayerState {

    public override onEnter(options: Record<string, any>): void {
        Debugger.print("player", `Entering idle state with options ${options}`);
        this.parent.owner.animation.playIfNotAlready(PlayerAnimationType.IDLE, true);
    }

    public override handleInput(event: GameEvent): void {
        Debugger.print("player", `Handling event with type ${event.type} in idle state`)
        switch(event.type) {
            default: {
                Debugger.print("player", `Deffering handling of event with type ${event.type} to super class ${super.constructor}`);
                super.handleInput(event);
                break;
            }
        }
    }

    public override update(deltaT: number): void {
        super.update(deltaT);
        if (!this.parent.controller.moveDir.equals(Vec2.ZERO)) {
            Debugger.print("player", "Finishing idle state!");
            this.finished(PlayerStateType.MOVING);
        }
    }

    public override onExit(): Record<string, any> { 
        Debugger.print("player", `Exiting idle state!`);
        return {}; 
    }
    
}