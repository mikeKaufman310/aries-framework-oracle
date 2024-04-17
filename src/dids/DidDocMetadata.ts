/**
 * Class to implement credo temporary type DidDocMetadata and ResolutionResultMetadata interface in an instiable class
 * @author Michael Kaufman
 * Date Last Modified: April 17, 2024
 */
export declare class DidDocMetadata{
    message?: string
    constructor(message?:string);
    toJSON(): Record<string, any>;
}