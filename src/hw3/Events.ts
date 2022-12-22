export enum BattlerEvent {
    BATTLER_CHANGE = "BATTLER_CHANGE",
    CONSUME = "CONSUME",
    HIT = "HIT",
}

export enum ItemEvent {
    WEAPON_USED = "WEAPON_USED",
    CONSUMABLE_USED = "CONSUMABLE_USED",
    INVENTORY_CHANGED = "INVENTORY_CHANGED",
}

export enum HudEvent {
    HEALTH_CHANGE = "HEALTH_CHANGE"
}

export enum NPCEvent {
    // An event that gets triggered when an NPC is killed. Has data: {id: number}
    NPC_KILLED = "NPC_KILLED"
}

export enum PlayerEvent {
    PLAYER_KILLED = "PLAYER_KILLED"
}