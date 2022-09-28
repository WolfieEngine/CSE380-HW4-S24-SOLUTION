import Item from "../../GameSystems/ItemSystem/Items/Item";
import HealthPack from "../../GameSystems/ItemSystem/ItemTypes/HealthPack";
import NPCAI from "../NPCGoapAI";
import NPCAction from "./NPCAction";

export default class HealSelf extends NPCAction {

    performAction(statuses: string[], actor: NPCAI, deltaT: number): string[] | null {
        if (this.checkPreconditions(statuses)) {
            actor.item = actor.inventory.find((item: Item) => item.type.constructor === HealthPack);
            if (actor.item === undefined) {
                return null;
            }
            actor.item.use(actor.owner);
            return this.effects;
        }

        return null;
    }

}