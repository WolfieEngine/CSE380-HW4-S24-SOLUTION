import { GoapActionStatus } from "../../../../../GameSystems/GoapSystem/GoapAction";
import NPCGoapAI from "../../../NPCGoapAI";
import UseHealthPack from "./UseHealthPack";

export default class HealSelf extends UseHealthPack {

    useItem(npc: NPCGoapAI): GoapActionStatus {
        this.item.use(npc.owner);
        return GoapActionStatus.SUCCESS;
    }
    
}