import NPCActor from "../NPCActor";
import NPCBehavior from "../NPCBehavior";
import GoalReached from "../NPCStatuses/FalseStatus";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Idle from "../NPCActions/IdleAction";
import { TargetExists } from "../NPCStatuses/TargetExists";
import BasicFinder from "../../../GameSystems/Searching/BasicFinder";
import { ClosestPositioned } from "../../../GameSystems/Searching/HW3Reducers";
import { BattlerActiveFilter, BattlerGroupFilter, BattlerHealthFilter, ItemFilter, RangeFilter, VisibleItemFilter } from "../../../GameSystems/Searching/HW3Filters";
import { HasHealth } from "../NPCStatuses/HasHealth";
import PickupItem from "../NPCActions/PickupItem";
import UseHealthpack from "../NPCActions/UseHealthpack";
import GotoAction from "../NPCActions/GotoAction";
import Healthpack from "../../../GameSystems/ItemSystem/Items/Healthpack";
import Item from "../../../GameSystems/ItemSystem/Item";
import HW3Battler from "../../../GameSystems/BattleSystem/HW3Battler";
import { HasItem } from "../NPCStatuses/HasItem";
import TargetAction from "../NPCActions/TargetAction";
import FalseStatus from "../NPCStatuses/FalseStatus";

enum HealerStatuses {

    AT_HPACK = "at-hpack",

    AT_ALLY = "at-ally",

    HPACK_EXISTS = "hpack-exists",

    ALLY_EXISTS = "ally-exists",

    ALLY_TARGETED = "ally-targeted",

    HEALTHPACK_TARGETED = "healthpack-targeted",

    HAS_HPACK = "has-hpack",

    GOAL = "goal"

}

enum HealerActions {

    GOTO_HPACk = "goto-hpack",

    PICKUP_HPACK = "pickup-hpack",

    GOTO_ALLY = "goto-ally",

    USE_HPACK = "use-hpack",

    IDLE = "idle",

    TARGET_ALLY = "target-ally",

    TARGET_HEALTHPACK = "target-healthpack",
}


/**
 * When an NPC is acting as a healer, their goal is to try and heal it's teammates by running around, picking up healthpacks, 
 * bringing to the healthpacks to their allies and healing them.
 */
export default class HealerBehavior extends NPCBehavior  {

    /** The GameNode that owns this NPCGoapAI */
    protected override owner: NPCActor;
    
    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, opts: Record<string, any>): void {
        this.owner = owner;

        let scene = owner.getScene();

        /* ######### Add all healer statuses ######## */

        this.addStatus(HealerStatuses.GOAL, new FalseStatus());

        // Checks if the npc is close to an active ally
        let atally = new BasicFinder<HW3Battler>(null, BattlerActiveFilter(), BattlerGroupFilter([owner.battleGroup]), RangeFilter(owner, 0, 625));
        this.addStatus(HealerStatuses.AT_ALLY, new TargetExists(scene.getBattlers(), atally));

        // Checks if the npc is close to a visible healthpack
        let athpack = new BasicFinder<Healthpack>(null, VisibleItemFilter(), ItemFilter(Healthpack), RangeFilter(owner, 0, 625));
        this.addStatus(HealerStatuses.AT_HPACK, new TargetExists(scene.getHealthpacks(), athpack));

        // Check if a healthpack exists in the scene and it's visible
        this.addStatus(HealerStatuses.HPACK_EXISTS, new TargetExists(scene.getHealthpacks(), new BasicFinder<Item>(null, ItemFilter(Healthpack), VisibleItemFilter())));

        // Check if a healthpack exists in the actors inventory
        this.addStatus(HealerStatuses.HAS_HPACK, new HasItem(owner, new BasicFinder<Item>(null, ItemFilter(Healthpack))));

        // Check if a lowhealth ally exists in the scene
        let lowhealthAlly = new BasicFinder<HW3Battler>(null, BattlerActiveFilter(), BattlerGroupFilter([owner.battleGroup]));
        this.addStatus(HealerStatuses.ALLY_EXISTS, new TargetExists(scene.getBattlers(), lowhealthAlly));

        this.addStatus(HealerStatuses.HEALTHPACK_TARGETED, new FalseStatus());
        this.addStatus(HealerStatuses.ALLY_TARGETED, new FalseStatus());
        
        /* ######### Add all healer actions ######## */

        // An action for targeting the closest healthpack
        let findClosestHealthpack = new BasicFinder<Item>(ClosestPositioned(owner), ItemFilter(Healthpack), VisibleItemFilter());
        let targetClosestHealthpack = new TargetAction(this, this.owner, scene.getHealthpacks(), findClosestHealthpack);
        targetClosestHealthpack.cost = 5;
        targetClosestHealthpack.addPrecondition(HealerStatuses.HPACK_EXISTS);
        targetClosestHealthpack.addEffect(HealerStatuses.HEALTHPACK_TARGETED);
        this.addState(HealerActions.TARGET_HEALTHPACK, targetClosestHealthpack);

        // An action for going to the closest healthpack
        let gotoClosestHealthpack = new GotoAction(this, owner);
        gotoClosestHealthpack.cost = 5;
        gotoClosestHealthpack.addPrecondition(HealerStatuses.HEALTHPACK_TARGETED);
        gotoClosestHealthpack.addEffect(HealerStatuses.AT_HPACK);
        this.addState(HealerActions.GOTO_HPACk, gotoClosestHealthpack);

        // An action for picking up a healthpack
        let pickupHealthpack = new PickupItem(this, this.owner);
        pickupHealthpack.addPrecondition(HealerStatuses.AT_HPACK);
        pickupHealthpack.addPrecondition(HealerStatuses.HEALTHPACK_TARGETED);
        pickupHealthpack.addEffect(HealerStatuses.HAS_HPACK);
        pickupHealthpack.cost = 5;
        this.addState(HealerActions.PICKUP_HPACK, pickupHealthpack);

        // An action to target the closest low-health ally
        let closestLowHealthAlly = new BasicFinder<HW3Battler>(ClosestPositioned(owner), BattlerActiveFilter(), BattlerGroupFilter([owner.battleGroup]), BattlerHealthFilter(0, 5));
        let targetClosestLowHealthAlly = new TargetAction(this, this.owner, scene.getBattlers(), closestLowHealthAlly);
        targetClosestLowHealthAlly.addPrecondition(HealerStatuses.ALLY_EXISTS);
        targetClosestLowHealthAlly.addEffect(HealerStatuses.ALLY_TARGETED);
        this.addState(HealerActions.TARGET_ALLY, targetClosestLowHealthAlly);

        // An action to go to the closest lowhealth ally
        let gotoClosestLowHealthAlly = new GotoAction(this, owner);
        gotoClosestLowHealthAlly.cost = 5;
        gotoClosestLowHealthAlly.addPrecondition(HealerStatuses.ALLY_TARGETED);
        gotoClosestLowHealthAlly.addEffect(HealerStatuses.AT_ALLY);
        this.addState(HealerActions.GOTO_ALLY, gotoClosestLowHealthAlly);

        // An action for using a healthpack on an ally
        let healAlly = new UseHealthpack(this, this.owner);
        healAlly.addPrecondition(HealerStatuses.HAS_HPACK);
        healAlly.addPrecondition(HealerStatuses.AT_ALLY);
        healAlly.addPrecondition(HealerStatuses.ALLY_TARGETED);
        healAlly.addEffect(HealerStatuses.GOAL);
        healAlly.cost = 5;
        this.addState(HealerActions.USE_HPACK, healAlly);

        // Idle
        let idle = new Idle(this, this.owner);
        idle.addEffect(HealerStatuses.GOAL);
        idle.cost = 100;
        this.addState(HealerActions.IDLE, idle);

        /* ######### Set the healers goal ######## */

        this.goal = HealerStatuses.GOAL;
        this.initialize();
    }

    public override handleEvent(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }

    public override update(deltaT: number): void {
        super.update(deltaT);
    }

}

