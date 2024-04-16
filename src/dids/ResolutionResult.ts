import { DidDocument } from "@credo-ts/core";
import { DidDocumentMetadata } from "./DidDocumentMetadata";

interface ResolutionResultOptions{
    didDoc: DidDocument,
    metaData1? : DidDocumentMetadata,
    metaData2? : DidDocumentMetadata
}
export declare class ResolutionResult{
    created?: string;
    update?: string;
    method?: string | string[];
    didDoc: DidDocument;
    metaData1? : DidDocumentMetadata;
    metaData2? : DidDocumentMetadata;
    constructor(options:ResolutionResultOptions);
    toJSON(): Record<string, any>;
}