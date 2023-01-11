import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { TargetableEntity } from "./TargetableEntity";
import { TargetingEntity } from "./TargetingEntity";


export default class BasicTargetable implements TargetableEntity {
    private static NEXT_ID: number = 0;

    protected __id: number;
    protected __position: Vec2;
    protected __targeting: Map<number, TargetingEntity>;

    constructor(position: Vec2) {
        this.__id = BasicTargetable.NEXT_ID;
        BasicTargetable.NEXT_ID += 1;

        this.__position = position;
        this.__targeting = new Map<number, TargetingEntity>();
    }

    getTargeting(): TargetingEntity[] { 
        return Array.from(this.__targeting.values()); 
    }

    addTargeting(targeting: TargetingEntity): void {
        this.__targeting.set(targeting.id, targeting);
    }
    
    removeTargeting(targeting: TargetingEntity): void {
        this.__targeting.delete(targeting.id);
    }

    get id(): number { return this.__id; }
    get position(): Vec2 { return this.__position; }
    get relativePosition(): Vec2 { throw new Error("Method not supported."); }

}