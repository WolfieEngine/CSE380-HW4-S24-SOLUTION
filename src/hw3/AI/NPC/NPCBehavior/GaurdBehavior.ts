import IdleAction from "../NPCActions/IdleAction";
import PickupHealthpack from "../NPCActions/PickupItem";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import GoalReached from "../NPCStatuses/FalseStatus";
import Idle from "../NPCActions/IdleAction";
import ShootLaserGun from "../NPCActions/ShootLaserGun";
import GotoAction from "../NPCActions/GotoAction";
import BasicFinder from "../../../GameSystems/Searching/BasicFinder";
import { BattlerActiveFilter, BattlerGroupFilter, ItemFilter, RangeFilter, VisibleItemFilter } from "../../../GameSystems/Searching/HW3Filters";
import Item from "../../../GameSystems/ItemSystem/Item";
import PickupItem from "../NPCActions/PickupItem";
import { ClosestPositioned } from "../../../GameSystems/Searching/HW3Reducers";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import LaserGun from "../../../GameSystems/ItemSystem/Items/LaserGun";
import HW3Battler from "../../../GameSystems/BattleSystem/HW3Battler";
import { TargetExists } from "../NPCStatuses/TargetExists";
import TargetAction from "../NPCActions/TargetAction";
import { HasItem } from "../NPCStatuses/HasItem";
import FalseStatus from "../NPCStatuses/FalseStatus";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";

enum GuardStatuses {

    AT_GUARD_POSITION = "at-guard-position",

    TARGETED_GUARD_POSITION = "targeted-guard-position",

    ENEMY_IN_GUARD_POSITION = "enemy-at-guard-position",

    ENEMY_TARGETED = "enemy-targeted",

    AT_ENEMY = "at-enemy",

    HAS_LASERGUN = "has-laser-gun",

    LASERGUN_TARGETED = "lasergun-targeted",

    LASERGUN_EXISTS = "laser-gun-exists",

    AT_LASERGUN = "at-laser-gun",

    GOAL = "goal"
}

enum GuardActions {

    GOTO_GUARD_POSITION = "goto-guard-position",

    GOTO_LASER_GUN = "goto-lasergun",

    GOTO_ENEMY = "goto-enemy",

    TARGET_LASERGUN = "target-lasergun",

    TARGET_ENEMY = "target-enemy",

    TARGET_GUARD_POSITION = "target-guard position",

    PICKUP_LASER_GUN = "pickup-lasergun",

    SHOOT_ENEMY = "shoot-enemy",

    GUARD = "guard",

}

interface GuardOptions {

    target: TargetableEntity

    range: number;

}


export default class GuardBehavior extends NPCBehavior {

    /** The GameNode that owns this NPCGoapAI */
    protected override owner: NPCActor;

    /** The target the guard should guard */
    protected target: TargetableEntity;
    /** The range the guard should be from the target they're guarding to be considered guarding the target */
    protected range: number;

    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, options: GuardOptions): void {
        super.initializeAI(owner, options);

        // Initialize the targetable entity the guard should try to protect
        this.target = options.target
        this.range = options.range;

        // Initialize guard statuses
        this.initializeStatuses();
        // Initialize guard actions
        this.initializeActions();

        // Set the guards goal
        this.goal = GuardStatuses.GOAL;

        this.initialize();
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    protected initializeStatuses(): void {

        let scene = this.owner.getScene();

        // A status checking if the guard is within range of the target it's supposed to be guarding
        let atGuardPosition = new TargetExists([this.target], new BasicFinder(null, RangeFilter(this.owner, 0, 625)));
        this.addStatus(GuardStatuses.AT_GUARD_POSITION, atGuardPosition);

        // A status checking if there are any enemies at target the guard is guarding
        let enemyBattlerFinder = new BasicFinder<HW3Battler>(null, BattlerActiveFilter(), BattlerGroupFilter([this.owner.battleGroup], false), RangeFilter(this.target, 0, this.range*this.range))
        let enemyAtGuardPosition = new TargetExists(scene.getBattlers(), enemyBattlerFinder)
        this.addStatus(GuardStatuses.ENEMY_IN_GUARD_POSITION, enemyAtGuardPosition);

        // Add a status to check if a lasergun exists in the scene and it's visible
        this.addStatus(GuardStatuses.LASERGUN_EXISTS, new TargetExists(scene.getLaserGuns(), new BasicFinder<Item>(null, ItemFilter(LaserGun), VisibleItemFilter())));
        // Add a status to check if the guard has a lasergun
        this.addStatus(GuardStatuses.HAS_LASERGUN, new HasItem(this.owner, new BasicFinder(null, ItemFilter(LaserGun))));

        // Add a status to check if the npc is near a lasergun
        let findNearbyLasergun = new BasicFinder(null, VisibleItemFilter(), ItemFilter(LaserGun), RangeFilter(this.owner, 0, 625))
        this.addStatus(GuardStatuses.AT_LASERGUN, new TargetExists(scene.getLaserGuns(), findNearbyLasergun));

        // Add a status to check if the npc is near an enemy
        let findNearbyEnemy = new BasicFinder<HW3Battler>(null, BattlerActiveFilter(), BattlerGroupFilter([this.owner.battleGroup], false), RangeFilter(this.owner, 0, 625));
        this.addStatus(GuardStatuses.AT_ENEMY, new TargetExists(scene.getBattlers(), findNearbyEnemy));

        // Add the targeting statuses
        this.addStatus(GuardStatuses.TARGETED_GUARD_POSITION, new FalseStatus());
        this.addStatus(GuardStatuses.ENEMY_TARGETED, new FalseStatus());
        this.addStatus(GuardStatuses.LASERGUN_TARGETED, new FalseStatus());
        // Add the goal status 
        this.addStatus(GuardStatuses.GOAL, new FalseStatus());
    }

    protected initializeActions(): void {
        let scene = this.owner.getScene();
        let owner = this.owner;

        // An action for targeting an enemy in the guard's guard area
        let findEnemyInGuardArea = new BasicFinder<HW3Battler>(ClosestPositioned(owner), BattlerGroupFilter([owner.battleGroup], false), RangeFilter(this.target, 0, this.range*this.range));
        let targetEnemyInGuardArea = new TargetAction(this, this.owner, scene.getBattlers(), findEnemyInGuardArea);
        targetEnemyInGuardArea.cost = 5;
        targetEnemyInGuardArea.addPrecondition(GuardStatuses.ENEMY_IN_GUARD_POSITION);
        targetEnemyInGuardArea.addEffect(GuardStatuses.ENEMY_TARGETED);
        this.addState(GuardActions.TARGET_ENEMY, targetEnemyInGuardArea)

        // An action for going to an enemy
        let gotoEnemy = new GotoAction(this, this.owner);
        gotoEnemy.cost = 2;
        gotoEnemy.addPrecondition(GuardStatuses.ENEMY_TARGETED);
        gotoEnemy.addEffect(GuardStatuses.AT_ENEMY);
        this.addState(GuardActions.GOTO_ENEMY, gotoEnemy);

        // An action for shooting an enemy
        let shootEnemy = new ShootLaserGun(this, this.owner);
        shootEnemy.addPrecondition(GuardStatuses.HAS_LASERGUN);
        shootEnemy.addPrecondition(GuardStatuses.AT_ENEMY);
        shootEnemy.addPrecondition(GuardStatuses.ENEMY_TARGETED);
        shootEnemy.addEffect(GuardStatuses.GOAL);
        shootEnemy.cost = 2;
        this.addState(GuardActions.SHOOT_ENEMY, shootEnemy);

        // An action for targeting a lasergun - target the closest visible lasergun
        let lasergunFinder = new BasicFinder<Item>(ClosestPositioned(owner), VisibleItemFilter(), ItemFilter(LaserGun));
        let targetLasergun = new TargetAction(this, this.owner, scene.getLaserGuns(), lasergunFinder);
        targetLasergun.addPrecondition(GuardStatuses.LASERGUN_EXISTS)
        targetLasergun.addEffect(GuardStatuses.LASERGUN_TARGETED);
        targetLasergun.cost = 5;
        this.addState(GuardActions.TARGET_LASERGUN, targetLasergun)

        // An action for going to a lasergun
        let goToLaserGun = new GotoAction(this, owner);
        goToLaserGun.cost = 5;
        goToLaserGun.addPrecondition(GuardStatuses.LASERGUN_TARGETED);
        goToLaserGun.addEffect(GuardStatuses.AT_LASERGUN);
        this.addState(GuardActions.GOTO_LASER_GUN, goToLaserGun);

        // An action for picking up a lasergun
        let pickupLaserGun = new PickupItem(this, this.owner);
        pickupLaserGun.addPrecondition(GuardStatuses.LASERGUN_TARGETED);
        pickupLaserGun.addPrecondition(GuardStatuses.AT_LASERGUN);
        pickupLaserGun.addEffect(GuardStatuses.HAS_LASERGUN);
        pickupLaserGun.cost = 5;
        this.addState(GuardActions.PICKUP_LASER_GUN, pickupLaserGun);

        // An action for targeting the guards guard position
        let targetGuardPosition = new TargetAction(this, this.owner, [this.target], new BasicFinder(null));
        targetGuardPosition.addEffect(GuardStatuses.TARGETED_GUARD_POSITION);
        targetGuardPosition.cost = 1;
        this.addState(GuardActions.TARGET_GUARD_POSITION, targetGuardPosition)

        // An action for going to the guards guard position
        let gotoGuardPosition = new GotoAction(this, this.owner);
        gotoGuardPosition.addPrecondition(GuardStatuses.TARGETED_GUARD_POSITION);
        gotoGuardPosition.addEffect(GuardStatuses.AT_GUARD_POSITION);
        gotoGuardPosition.cost = 5;
        this.addState(GuardActions.GOTO_GUARD_POSITION, gotoGuardPosition);

        // An action for guarding the guard's guard location
        let guard = new Idle(this, this.owner);
        guard.addPrecondition(GuardStatuses.AT_GUARD_POSITION);
        guard.addPrecondition(GuardStatuses.HAS_LASERGUN);
        guard.addEffect(GuardStatuses.GOAL);
        guard.cost = 5;
        this.addState(GuardActions.GUARD, guard);
    }
}
