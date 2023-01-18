import GoapAction from "../../../../Wolfie2D/AI/Goap/GoapAction";
import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
import NPCActor from "../../../Actors/NPCActor";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import NPCBehavior from "../NPCBehavior";

export default class PatrolBehavior extends NPCBehavior {

    // The array of targets to visit/patrol
    protected _route: TargetableEntity[];
    // The index of the next target to visit in the patrol route
    protected _next: number;
    // The range the actor should be from the next target in the route before moving to the next target
    protected _range: number;
    
    public initializeAI(owner: NPCActor, options: Record<string, any>): void {
        super.initializeAI(owner, options);
    }

    public addStatus(statusName: PatrolStatus, status: GoapState): void {
        super.addStatus(statusName, status);
    }

    public addState(stateName: PatrolAction, state: GoapAction): void {
        super.addState(stateName, state);
    }

    public update(deltaT: number): void {
        super.update(deltaT);
        // If
        if (this.owner.position.distanceSqTo(this.route[this.next].position) < this.range) {
            this.next = (this.next + 1) % this.route.length;
        }
    }

    public get route(): TargetableEntity[] { return this._route; }
    public get next(): number { return this._next; }
    public get range(): number { return this._range; }
    protected set next(next: number) { this._next = next; }

}

type PatrolStatus = typeof PatrolStatuses[keyof typeof PatrolStatuses];

const PatrolStatuses = {

    HAS_WEAPON: "has-weapon",

    GOAL: "goal"

} as const;

type PatrolAction = typeof PatrolActions[keyof typeof PatrolActions];

const PatrolActions = {

    PATROL: "patrol",

    PICKUP_LASERGUN: "pickup-lasergun"

} as const;

function NextPatrolTargetFilter(behavior: PatrolBehavior): (target: TargetableEntity) => boolean {
    return (target: TargetableEntity) => { 
        return target.id === behavior.route[behavior.next].id; 
    };
}
