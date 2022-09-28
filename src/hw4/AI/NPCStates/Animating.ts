import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { Debugger } from "../../Debugger";
import NPCState from "./NPCState";

export default class Animating extends NPCState {

    onEnter(options: Record<string, any>): void {
        Debugger.print("npc", `NPC entering animate state! Owner id: ${this.parent.owner.id}`);
    }
    handleInput(event: GameEvent): void {
        Debugger.print("npc", `NPC handling event! Id: ${this.parent.owner.id} EventType: ${event.type}`);
        switch(event.type) {
            default: {
                Debugger.print("npc", `NPC deffering handling of event to super class! Id: ${this.parent.owner.id}
                EventType: ${event.type} SuperClass: ${super.constructor}`);
                super.handleInput(event);
                break;
            }
        }
    }
    update(deltaT: number): void {
        super.update(deltaT);
    }
    onExit(): Record<string, any> {
        return {}
    }

}