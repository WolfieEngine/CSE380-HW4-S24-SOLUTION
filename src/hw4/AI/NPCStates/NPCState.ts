import State from "../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { HudEvent, BattlerEvent } from "../../Events";
import NPCAI from "../NPCGoapAI";

export enum NPCStateType {
    ANIMATING = "ANIMATING",
    MOVING = "MOVING",
}

/**
 * An abstract state of an NPC AI. This class is meant to be extended. 
 */
export default abstract class NPCState extends State {

    protected parent: NPCAI;

    public constructor(parent: NPCAI) {
        super(parent);
    }

    public onEnter(options: Record<string, any>): void { }

    public update(deltaT: number): void {

    }

    public handleInput(event: GameEvent): void {
        switch(event.type) {
            case BattlerEvent.BATTLER_CHANGE: {
                this.emitter.fireEvent(HudEvent.HEALTH_CHANGE, {
                    id: this.parent.battler.owner.id,
                    curhp: this.parent.battler.health,
                    maxhp: this.parent.battler.maxHealth 
                });
                break;
            }
            case BattlerEvent.HIT: {
                this.parent.battler.handleEvent(event);
                break;
            }
            default: {
                throw new Error(`Unhandled event with type ${event.type} and data ${event.data} caught in NPCState`);
            }
        }
    }
    public onExit(): Record<string, any> {
        return {};
    }
    
}