import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import BattlerType from "../BattlerType";
import Battler from "./Battler";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";

export default class NPCBattler extends Battler {
    
    public constructor(owner: GameNode, type: BattlerType) {
        super(owner, type);
    }

    public override handleEvent(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }
}