import GoapStatus from "../../../../Wolfie2D/AI/Goap/GoapStatus";
import NPCActor from "../NPCActor";

export default class HasHealth extends GoapStatus {

    public static readonly HEALTH = 0;

    protected _health: number;

    public constructor(key: string) {
        super(key);
        this.health = HasHealth.HEALTH;
    }

    public get health() { return this._health; }
    public set health(health: number) { this._health = health;}

    public checkProceduralPreconditions(actor: NPCActor): boolean {
        return actor.health > this.health;
    }

}

