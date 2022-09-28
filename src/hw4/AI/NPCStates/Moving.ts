import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import NPCAI from "../NPCGoapAI";
import NPCState, { NPCStateType } from "./NPCState";

export default class Moving extends NPCState {

    /** The position the NPC should move to */
    protected _pos: Vec2;
    /** The range the NPC should be from the position to be "at" the position */
    protected _rng: number;

    constructor(parent: NPCAI) {
        super(parent);
        this.pos = Vec2.ZERO;
        this.rng = 0;
    }

    public get pos(): Vec2 { return this._pos; }
    public get rng(): number { return this._rng; }
    public set pos(pos: Vec2) { this._pos = pos; }
    public set rng(rng: number) { this._rng = rng; }
    
    onEnter(options: Record<string, any>): void {

    }

    handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
            }
        }
    }

    update(deltaT: number): void {
        if (this.parent.owner.position.distanceSqTo(this.pos) <= this.rng) {
            this.finished(NPCStateType.ANIMATING);
        }
    }

    onExit(): Record<string, any> {
        return {};
    }
    
}