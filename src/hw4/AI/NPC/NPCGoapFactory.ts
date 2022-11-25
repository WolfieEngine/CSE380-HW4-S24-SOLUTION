import GoapActionSet from "../../GameSystems/GoapSystem/GoapActionSet";
import GoapObject from "../../GameSystems/GoapSystem/GoapObject";
import GoapStatusSet from "../../GameSystems/GoapSystem/GoapStatusSet";
import Item from "../../GameSystems/ItemSystem/Items/Item";
import Weapon from "../../GameSystems/ItemSystem/Items/Weapon";
import HealthPack from "../../GameSystems/ItemSystem/ItemTypes/HealthPack";
import LaserGun from "../../GameSystems/ItemSystem/ItemTypes/LaserGun";
import GotoCurrent from "./NPCActions/GotoActions/GotoCurrent";
import GotoFirstSeen from "./NPCActions/GotoActions/GotoFirstSeen";
import GotoLastSeen from "./NPCActions/GotoActions/GotoLastSeen";
import IdleAction from "./NPCActions/IdleAction";
import NPCAction from "./NPCActions/NPCAction";
import PickupHealthpack from "./NPCActions/PickupItemActions/PickupHealthpack";
import PickupLaserGun from "./NPCActions/PickupItemActions/PickupLaserGun";
import TargetAlly from "./NPCActions/TargetActions/TargetAlly/TargetAlly";
import { TargetFirstHealthpack, TargetClosestHealthpack } from "./NPCActions/TargetActions/TargetHealthpack";
import { TargetFirstLaserGun, TargetClosestLaserGun } from "./NPCActions/TargetActions/TargetLaserGun";
import TargetVisibleEnemy from "./NPCActions/TargetActions/TargetVisibleEnemy";
import HealTarget from "./NPCActions/UseItemActions/UseHealthpack/HealTarget";
import UseHealthPack from "./NPCActions/UseItemActions/UseHealthpack/UseHealthPack";
import UseProjectileWeapon from "./NPCActions/UseItemActions/UseLaserGun";
import TargetLowHealthAlly from "./NPCActions/TargetActions/TargetAlly/LowHealth";
import NPCGoapAI from "./NPCGoapAI";
import HealSelf from "./NPCActions/UseItemActions/UseHealthpack/HealSelf";
import { TargetClosestVisibleEnemy } from "./NPCActions/TargetActions/TargetEnemy";


export default class NPCFactory {

    public static buildNPCGoap(type: NPCGoapType): GoapObject<NPCGoapAI, NPCAction> {
        let status: GoapStatusSet<NPCGoapAI> = this.buildGoapStatuses(type);
        let actions: GoapActionSet<NPCGoapAI, NPCAction> = this.buildGoapActions(type);
        return new GoapObject("goal", status, actions);
    }

    private static buildGoapStatuses(type: NPCGoapType): GoapStatusSet<NPCGoapAI> {
        switch(type) {
            case NPCGoapType.DEFAULT: {
                return this.buildDefaultStatuses();
            }
            case NPCGoapType.HEALER: {
                return this.buildHealerStatuses();
            }
            default: {
                throw new Error(`Cannot construct statuses for unknown NPCGoapType "${type}"...`)
            }
        }
    }
    private static buildGoapActions(type: NPCGoapType): GoapActionSet<NPCGoapAI, NPCAction> {
        switch (type) {
            case NPCGoapType.DEFAULT: {
                return this.buildDefaultActions();
            }
            case NPCGoapType.HEALER: {
                return this.buildHealerActions();
            }
            default: {
                throw new Error(`Cannot construct actions for unknown NPCGoapType ${type}`);
            }
        }
    }

    private static buildDefaultStatuses(): GoapStatusSet<NPCGoapAI> {
        let status: GoapStatusSet<NPCGoapAI> = new GoapStatusSet();
        status.subscribe("has_hpack", (obj: NPCGoapAI) => obj.inventory.find((item: Item) => item.type.constructor === HealthPack) !== null);
        status.subscribe("low_health", (obj: NPCGoapAI) => obj.battler.health !== obj.battler.maxHealth);
        status.subscribe("has_weapon", (obj: NPCGoapAI) => obj.inventory.find((item: Item) => item.constructor === Weapon) !== null);
        status.subscribe("has_laser_gun", (obj: NPCGoapAI) => obj.inventory.find((item: Item) => item.type.constructor === LaserGun) !== null)
        status.subscribe("goal", (obj: NPCGoapAI) => false);
        status.subscribe("target_laser_gun", () => false);
        status.subscribe("at_laser_gun", () => false);
        status.subscribe("target_enemy", () => false);
        status.subscribe("at_enemy", () => false);
        return status;
    }
    private static buildDefaultActions(): GoapActionSet<NPCGoapAI, NPCAction> {
        let actions: GoapActionSet<NPCGoapAI, NPCAction> = new GoapActionSet();
        actions.add(new IdleAction(10, ["has_weapon"], ["goal"]));
        actions.add(new TargetClosestLaserGun(1, [], ["target_laser_gun"]));
        actions.add(new GotoFirstSeen(1, ["target_laser_gun"], ["at_laser_gun"]));
        actions.add(new PickupLaserGun(10, ["at_laser_gun", "target_laser_gun"], ["has_weapon", "has_laser_gun", "goal"]));
        actions.add(new TargetClosestVisibleEnemy(1, ["has_weapon"], ["target_enemy"]))
        actions.add(new GotoLastSeen(1, ["target_enemy", "has_laser_gun"], ["at_enemy"]))
        actions.add(new UseProjectileWeapon(1, ["has_laser_gun", "at_enemy"], ["goal"]))
        return actions;
    }

    private static buildHealerStatuses(): GoapStatusSet<NPCGoapAI> {
        let status: GoapStatusSet<NPCGoapAI> = new GoapStatusSet();
        status.subscribe("has_hpack", (obj: NPCGoapAI) => obj.inventory.find((item: Item) => item.type.constructor === HealthPack) !== null);
        status.subscribe("low_health", (obj: NPCGoapAI) => obj.battler.health !== obj.battler.maxHealth);
        status.subscribe("target_ally", () => false);
        status.subscribe("target_hpack", () => false);
        status.subscribe("at_hpack", () => false);
        status.subscribe("at_ally", () => false);
        status.subscribe("goal", () => false);
        return status;
    }
    private static buildHealerActions(): GoapActionSet<NPCGoapAI, NPCAction> {
        let actions: GoapActionSet<NPCGoapAI, NPCAction> = new GoapActionSet();
        actions.add(new IdleAction(20, [], ["goal"]));
        actions.add(new TargetClosestHealthpack(1, [], ["target_hpack"]));
        actions.add(new GotoCurrent(1, ["target_hpack"], ["at_hpack"]));
        actions.add(new PickupHealthpack(1, ["at_hpack"], ["has_hpack"]));
        actions.add(new HealSelf(4, ["has_hpack", "low_health"], ["goal"]));
        actions.add(new TargetLowHealthAlly(1, [], ["target_ally"]));
        actions.add(new GotoCurrent(1, ["target_ally"], ["at_ally"]));
        actions.add(new HealTarget(1, ["at_ally", "has_hpack"], ["goal"]));
        return actions;
    }
}

export enum NPCGoapType {
    DEFAULT,
    HEALER
}


