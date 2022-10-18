import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";

export default interface GoapAction {

    get cost(): number;

    get preconditions(): string[];

    get effects(): string[];

    performAction(ai: AI): GoapActionStatus;

    reset(ai: AI): void;

    update(ai: AI): void;

    checkPreconditions(ai: AI, statuses: string[]): boolean;

}

export enum GoapActionStatus {
    SUCCESS = 0,
    RUNNING = 1,
    FAILURE = 2
}