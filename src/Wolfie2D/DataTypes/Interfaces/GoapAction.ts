import GoapAI from "./GoapAI";

export default interface GoapAction {
    /** Cost it takes to complete this action */
    get cost(): number;

    /** Preconditions that have to be satisfied for an action to happen */
    get preconditions(): Array<string>;

    /** Resulting statuses after this action completes */
    get effects(): Array<string>;

    /** If the action fails, do we keep trying until we succeed */
    get loopAction(): boolean;

    /**
     * Attempt to perform an action, if successful, it will return an array of the expected effects, otherwise it will return null
     * @param statuses Current statuses of the actor
     * @param actor GameNode for the actor
     * @param deltaT The time sine the last update
     * @param target GameNode for a optional target
     */
    performAction(statuses: Array<string>, actor: GoapAI, deltaT: number): Array<string>;

    /** Check preconditions with current statuses to see if action can be performed */
    checkPreconditions(statuses: Array<string>): boolean;

}