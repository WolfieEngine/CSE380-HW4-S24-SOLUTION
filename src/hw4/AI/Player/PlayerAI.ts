import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Battler from "../../GameSystems/BattleSystem/Battlers/Battler";
import Inventory from "../../GameSystems/ItemSystem/Inventory";
import Consumable from "../../GameSystems/ItemSystem/Items/Consumable";
import Item from "../../GameSystems/ItemSystem/Items/Item";
import Weapon from "../../GameSystems/ItemSystem/Items/Weapon";
import PlayerController from "./PlayerController";
import { Idle, Invincible, Moving, Dead, PlayerStateType } from "./PlayerStates/PlayerState";

/**
 * The AI that controls the player. The players AI has been configured as a Finite State Machine (FSM)
 * with 4 states; idle, moving, invincible, dead.
 * 
 */
export default class PlayerAI extends StateMachineAI implements AI {

    /** The GameNode that owns this AI */
    public owner: AnimatedSprite;
    /**  */
    public controller: PlayerController;
    /** The battler object associated with the player */
    public battler: Battler;
    /** The inventory object associated with the player */
    public inventory: Inventory;
    /** The players held item */
    public item: Item | null;
    
    public initializeAI(owner: AnimatedSprite, opts: Record<string, any>): void {
        this.owner = owner;
        this.controller = new PlayerController(owner);

        this.battler = opts.battler;
        this.inventory = opts.inventory;
        this.item = this.inventory[0] ? this.inventory[0] : null;

        this.addState(PlayerStateType.IDLE, new Idle(this));
        this.addState(PlayerStateType.INVINCIBLE, new Invincible(this));
        this.addState(PlayerStateType.MOVING, new Moving(this));
        this.addState(PlayerStateType.DEAD, new Dead(this));
        this.initialize(PlayerStateType.IDLE);
    }

    public activate(options: Record<string, any>): void { }

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    public handleEvent(event: GameEvent): void {
        super.handleEvent(event);
    }

    public destroy(): void {}

    public useItem(): void { 
        if (this.item === null) return;
        switch(this.item.constructor) {
            case Consumable: {
                this.item.use(this.owner);
                break;
            }
            case Weapon: {
                this.item.use(this.owner, this.controller.faceDir);
                break;
            }
            default: {
                throw new Error(`Player trying to use unknown item type with constructor ${this.item.constructor}`);
            }
        }
    }

}