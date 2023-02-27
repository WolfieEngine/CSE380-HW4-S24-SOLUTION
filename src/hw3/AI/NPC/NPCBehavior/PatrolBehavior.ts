import GoapAction from "../../../../Wolfie2D/AI/Goap/GoapAction";
import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
import NPCActor from "../../../Actors/NPCActor";
import Item from "../../../GameSystems/ItemSystem/Item";
import LaserGun from "../../../GameSystems/ItemSystem/Items/LaserGun";
import BasicFinder from "../../../GameSystems/Searching/BasicFinder";
import { VisibleItemFilter, ItemFilter } from "../../../GameSystems/Searching/HW3Filters";
import { ClosestPositioned } from "../../../GameSystems/Searching/HW3Reducers";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import GotoAction from "../NPCActions/GotoAction";
import PickupItem from "../NPCActions/PickupItem";
import NPCBehavior from "../NPCBehavior";
import FalseStatus from "../NPCStatuses/FalseStatus";
import { HasItem } from "../NPCStatuses/HasItem";
import { TargetExists } from "../NPCStatuses/TargetExists";

export default class PatrolBehavior extends NPCBehavior {

    // The array of targets to visit/patrol
    protected _patrolRoute: TargetableEntity[];
    // The index of the next target to visit in the patrol route
    protected _next: number;
    // The range the actor should be from the next target in the route before moving to the next target
    protected _range: number;
    
    public initializeAI(owner: NPCActor, options: PatrolBehaviorOptions): void {
        super.initializeAI(owner, options);

        // Initialize options
        this.patrolRoute = options.patrolRoute;
        this.next = options.start;
        this.range = options.range;

        // Initialize statuses
        this.initializeStatuses();
        // Initialize actions
        this.initializeActions();
        
        // Set the guards goal
        this.goal = PatrolStatuses.GOAL;

        // Initialize the AI
        this.initialize();
    }

    public addStatus(statusName: PatrolStatus, status: GoapState): void {
        super.addStatus(statusName, status);
    }

    public addState(stateName: PatrolAction, state: GoapAction): void {
        super.addState(stateName, state);
    }

    public update(deltaT: number): void {
        super.update(deltaT);

        // If the owner has reached the next target in their patrol route, update the value of next
        if (this.owner.position.distanceSqTo(this.patrolRoute[this.next].position) < this.range) {
            this.next = (this.next + 1) % this.patrolRoute.length;
        }
    }

    public initializeStatuses(): void {
        let scene = this.owner.getScene();

        // Add a status to check if a lasergun exists in the scene and it's visible
        this.addStatus(PatrolStatuses.LASERGUN_EXISTS, new TargetExists(scene.getLaserGuns(), new BasicFinder<Item>(null, ItemFilter(LaserGun), VisibleItemFilter())));
        // Add a status to check if the guard has a lasergun
        this.addStatus(PatrolStatuses.HAS_WEAPON, new HasItem(this.owner, new BasicFinder(null, ItemFilter(LaserGun))));

        // Add the goal status 
        this.addStatus(PatrolStatuses.GOAL, new FalseStatus());
    }

    protected initializeActions(): void {
        let scene = this.owner.getScene();

        // An action for going to the next patrol target
        let patrol = new GotoAction(this, this.owner);
        patrol.targets = this.patrolRoute;
        patrol.targetFinder = new BasicFinder(NextPatrolTargetFilter(this));
        patrol.cost = 5;
        patrol.addPrecondition(PatrolStatuses.HAS_WEAPON);
        patrol.addEffect(PatrolStatuses.GOAL);
        this.addState(PatrolActions.PATROL, patrol);

        // An action for picking up a lasergun
        let pickupLaserGun = new PickupItem(this, this.owner);
        pickupLaserGun.targets = scene.getLaserGuns();
        pickupLaserGun.cost = 5;
        pickupLaserGun.targetFinder = new BasicFinder<Item>(ClosestPositioned(this.owner), VisibleItemFilter(), ItemFilter(LaserGun));
        pickupLaserGun.addPrecondition(PatrolStatuses.LASERGUN_EXISTS);
        pickupLaserGun.addEffect(PatrolStatuses.HAS_WEAPON);
        pickupLaserGun.cost = 5;
        this.addState(PatrolActions.PICKUP_LASERGUN, pickupLaserGun);

    }

    public get patrolRoute(): TargetableEntity[] { return this._patrolRoute; }
    public get next(): number { return this._next; }
    public get range(): number { return this._range; }

    protected set patrolRoute(value: TargetableEntity[]) { this._patrolRoute = value; }
    protected set next(next: number) { this._next = next; }
    protected set range(value: number) { this._range = value; }

}

interface PatrolBehaviorOptions {
    patrolRoute: TargetableEntity[],
    start: number;
    range: number;
}

type PatrolStatus = typeof PatrolStatuses[keyof typeof PatrolStatuses];

const PatrolStatuses = {

    LASERGUN_EXISTS: "lasergun-exists",

    HAS_WEAPON: "has-weapon",

    GOAL: "goal"

} as const;

type PatrolAction = typeof PatrolActions[keyof typeof PatrolActions];

const PatrolActions = {

    PATROL: "patrol",

    PICKUP_LASERGUN: "pickup-lasergun"

} as const;

function NextPatrolTargetFilter(behavior: PatrolBehavior): (t1: TargetableEntity, t2: TargetableEntity) => TargetableEntity {
    return (t1: TargetableEntity, t2: TargetableEntity) => { 
        return behavior.patrolRoute[behavior.next]
    };
}
