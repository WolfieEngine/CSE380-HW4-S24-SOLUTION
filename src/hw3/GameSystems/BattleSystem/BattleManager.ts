import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Battler from "./Battlers/Battler";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import BattlerType from "./BattlerType";
import { ItemEvent, BattlerEvent } from "../../Events";


export default class BattleManager implements Updateable {
    protected battlers: Map<number, Battler>;

    protected receiver: Receiver;
    protected emitter: Emitter;

    public constructor() {
        this.battlers = new Map<number, Battler>();
        this.emitter = new Emitter();
        this.receiver = new Receiver();
        this.receiver.subscribe([ItemEvent.WEAPON_USED, ItemEvent.CONSUMABLE_USED]);
    }
    public get(id: number): Battler {
        if (!this.has(id)) {
            return null;
        }
        return this.battlers.get(id);
    }
    public has(id: number): boolean {
        return this.battlers.has(id);
    }

    /** 
     * @see Updateable.update() 
     */
    public update(deltaT: number): void {
        while(this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }

        // Clean up the dirty battlers
        this.battlers.forEach((battler: Battler) => {
            if (battler.dirty) {
                battler.clean();
            }
        });
    }
    public find(pred: (battler: Battler) => boolean): Battler | null {
        for (let b of this.battlers.values()) {
            if (pred(b)) return b;
        }
        return null;
    }
    /** 
     * Finds and returns an Array of BattlerAI that meet the given criteria
     * @return an array of BattlerAI
     */
    public findAll(pred: (battler: Battler) => boolean): Array<Battler> {
        return Array.from(this.battlers.keys()).filter((k: number) => { 
            return pred(this.battlers.get(k));
        }).map((k: number) => { 
            return this.battlers.get(k);
        });
    }
    /**
     * Registers a BattlerAI with this BattleManager
     * @param battler the BattlerAI to register
     */
    public register(constr: new (owner: GameNode, type: BattlerType) => Battler, owner: GameNode, type: BattlerType): Battler | null { 
        if (this.battlers.has(owner.id)) {
            return null;
        }
        let battler: Battler = new constr(owner, type);
        this.battlers.set(owner.id, battler);
        return battler;
    } 
    public unregister(id: number): Battler | null {
        let battler: Battler = this.battlers.get(id);
        this.battlers.delete(id);
        return battler === undefined ? null : battler
    }
    /**
     * Delegates handling a BattleEvent to an instance of BattleAI
     * @param event the BattleEvent that occured
     */
    protected handleEvent(event: GameEvent): void {
        switch(event.type) {
            case ItemEvent.WEAPON_USED: {
                this.handleWeaponUsedEvent(event);
                break;
            }
            case ItemEvent.CONSUMABLE_USED: {
                this.handleItemConsumedEvent(event);
                break;
            }
            default: {
                throw new Error(`Unhandled event type ${event.type} in BattleManager event handler.`);
                break;
            }
        }
    }
    protected handleItemConsumedEvent(event: GameEvent): void {
        let consumerId: number = event.data.get("consumerId");
        if (this.battlers.has(consumerId) && this.battlers.get(consumerId).owner.aiActive) {
            this.battlers.get(consumerId).owner._ai.handleEvent(event);
        } else {
            console.warn(`Error! Node with id ${consumerId} is not a registered battler!`);
        }
    }
    protected handleWeaponUsedEvent(event: GameEvent): void {
        let hits: Array<GameNode> = event.data.get("hits");

        for (let hit of hits) {
            if (this.battlers.has(hit.id) && this.battlers.get(hit.id).owner.aiActive) {
                this.battlers.get(hit.id).owner._ai.handleEvent(new GameEvent(BattlerEvent.HIT, {
                    userId: event.data.get("userId"), 
                    battler: this.battlers.get(event.data.get("userId")),
                    item: event.data.get("item"), 
                    type: event.data.get("type")
                }));
            } else {
                console.warn(`
                    Error! Node with id ${hit.id} is not a registered battler.
                `);
            }
        }
    }
}