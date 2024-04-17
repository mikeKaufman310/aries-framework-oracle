import { DidDocument, DidResolutionResult } from "@credo-ts/core";
import { DidDocMetadata } from "./DidDocMetadata";

/**
 * Class to implement credo did resolution result interface in an instiable class
 * @author Michael Kaufman
 * Date Last Modified: April 17, 2024
 */
export declare class ResolutionResult{
    created?: string;
    update?: string;
    method?: string | string[];
    didDoc: DidDocument;
    metaData1? : DidDocMetadata;
    metaData2? : DidDocMetadata;
    constructor(options:DidResolutionResult);
    toJSON(): Record<string, any>;
}