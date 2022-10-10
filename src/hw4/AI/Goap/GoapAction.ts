import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";

export default interface GoapAction<T extends Record<string, any>> {

    get cost(): number;

    get preconditions(): string[];

    get effects(): string[];

    init(options: T): void;

    start(ai: AI): void;

    run(ai: AI): GoapActionStatus;

    stop(ai: AI): void;

    checkProceduralPreconditions(ai: AI): boolean;

    checkPreconditions(ai: AI, statuses: string[]): boolean;

}

export enum GoapActionStatus {
    SUCCESS = 0,
    RUNNING = 1,
    FAILURE = 2
}