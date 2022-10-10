import Item from "../../GameSystems/ItemSystem/Items/Item";
import HealthPack from "../../GameSystems/ItemSystem/ItemTypes/HealthPack";
import { GoapActionStatus } from "../Goap/GoapAction";
import NPCGoapAI from "../NPCGoapAI";
import NPCAction from "./NPCAction";

export default class UseHealthPack extends NPCAction<Record<string, any>>{

    protected healthpack: Item | null;

    init(options: Record<string, any>): void {}

    start(ai: NPCGoapAI): void {}

    run(ai: NPCGoapAI): GoapActionStatus {
        ai.item = this.healthpack;
        ai.item.use(ai.owner);
        return GoapActionStatus.SUCCESS;
    }

    stop(ai: NPCGoapAI): void {
        this.healthpack = null;
    }

    checkProceduralPreconditions(npc: NPCGoapAI): boolean {
        this.healthpack = npc.inventory.find((item: Item) => item.type.constructor === HealthPack);
        return npc.health < npc.maxHealth && this.healthpack !== null;
    }

}

