import { GoapActionStatus } from "../../../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import NPCGoapAI from "../../../NPCGoapAI";
import UseHealthPack from "./UseHealthPack";

export default class HealSelf extends UseHealthPack {

    useItem(npc: NPCGoapAI): GoapActionStatus {
        this.item.use(npc.owner);
        return GoapActionStatus.SUCCESS;
    }
    
}