import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import NPCState from "./NPCState";

export default class Animating extends NPCState {

    onEnter(options: Record<string, any>): void {
        throw new Error("Method not implemented.");
    }
    handleInput(event: GameEvent): void {
        throw new Error("Method not implemented.");
    }
    update(deltaT: number): void {
        throw new Error("Method not implemented.");
    }
    onExit(): Record<string, any> {
        throw new Error("Method not implemented.");
    }

}