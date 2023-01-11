import { TargetableEntity } from "./TargetableEntity";
import { TargetingEntity } from "./TargetingEntity";


export default class BasicTargeting implements TargetingEntity {
    private static NEXT_ID: number = 0;

    protected __id: number;
    protected _target: TargetableEntity | null;

    constructor() {
        this.__id = BasicTargeting.NEXT_ID;
        BasicTargeting.NEXT_ID += 1;

        this._target = null;
    }

    clearTarget(): void {
        if (this._target !== null) {
            this._target.removeTargeting(this);
        }
        this._target = null;
    }
    setTarget(targetable: TargetableEntity): void {
        if (this._target !== null) {
            this._target.removeTargeting(this);
        }
        this._target = targetable;
        this._target.addTargeting(this);
    }
    getTarget(): TargetableEntity {
        if (this._target === null) {
            throw new Error("Target not set!");
        }
        return this._target;
    }

    hasTarget(): boolean {
        return this._target !== null;
    }

    get id(): number { return this.__id; }
    
}