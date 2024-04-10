/**
 * Class to model the json that represents the data received in the metadata of a did resolution result
 * @author Michael Kaufman
 * Date Last Modified: Apr 10, 2024
 */
interface MetadataOption{
    created?: string;
    update?: string;
    method?: string | string[];
}
export declare class DidDocumentMetadata{
    created?: string;
    update?: string;
    method?: string | string[];
    constructor(options:MetadataOption);
    toJSON(): Record<string, any>;
}