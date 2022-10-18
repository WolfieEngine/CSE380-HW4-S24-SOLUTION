import { GoapActionStatus } from "../../../../../GameSystems/GoapSystem/GoapAction";
import NPCGoapAI from "../../../NPCGoapAI";
import UseHealthPack from "./UseHealthPack";

export default class HealTarget extends UseHealthPack {

    useItem(npc: NPCGoapAI): GoapActionStatus {
        this.item.use(npc.target);
        return GoapActionStatus.SUCCESS;
    }
    
}