import GoapAction from "../../../../Wolfie2D/AI/Goap/GoapAction";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Healthpack from "../../../GameSystems/ItemSystem/Items/Healthpack";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";

/**
 * An abstract GoapAction for an NPC.
 */
export default abstract class NPCAction extends GoapAction {

    protected parent: NPCBehavior;
    protected actor: NPCActor;

    constructor(parent: NPCBehavior, actor: NPCActor) {
        super(parent, actor);
    }

    public handleInput(event: GameEvent): void {
        switch (event.type) {
            case "use-hpack": {
                let id: number = event.data.get('targetId');
                if (id === this.actor.id) {
                    let hpack: Healthpack = event.data.get("hpack");
                    this.actor.health += hpack.health;
                }
                break;
            }
            default: {
                throw new Error(`Unhandled event caught in NPCAction! Event type: ${event.type}`);
            }
        }
    }

}
