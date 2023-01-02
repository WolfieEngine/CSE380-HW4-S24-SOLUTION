import Physical from "../../Wolfie2D/DataTypes/Interfaces/Physical";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Inventory from "../GameSystems/ItemSystem/Inventory";

/**
 * An interface for a Battler
 */
export default interface Battler extends Physical {

    /** The Battlers group number */
    get battleGroup(): number;
    set battleGroup(value: number);

    /** The maximum health of the battler */
    get maxHealth(): number;
    set maxHealth(value: number);

    /** The battlers current health */
    get health(): number;
    set health(value: number);

    /** The battlers current speed */
    get speed(): number;
    set speed(value: number);

    /** The battlers inventory of items */
    get inventory(): Inventory;

    /** The battlers position */
    get position(): Vec2;

}