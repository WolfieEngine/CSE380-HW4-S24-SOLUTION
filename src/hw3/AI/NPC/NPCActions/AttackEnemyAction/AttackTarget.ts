import { GoapActionStatus } from "../../../../../Wolfie2D/AI/Goap/GoapAction";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Weapon from "../../../../GameSystems/ItemSystem/Items/Weapon";
import NPCActor from "../../NPCActor";
import NPCAction from "../NPCAction";

export default abstract class AttackTargetAction extends NPCAction {

    protected weapon: Weapon;

    public constructor() {
        super();

    }

    public performAction(actor: NPCActor): GoapActionStatus {
        this.weapon
    }

    public abstract getWeapon(): Weapon; 
  
    public abstract getTarget(actor: NPCActor): Vec2;

    public abstract getRange(actor: NPCActor): number;

}