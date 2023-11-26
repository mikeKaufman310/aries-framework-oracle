import { DidDocument } from "@aries-framework/core";
import { OracleModuleConfig } from "../OracleModuleConfig";
export interface IOracleLedgerConfig {
    network: string;
    channel: string;
    chaincode: string;
    encodedCredential: string;
}
export declare class OracleLedgerService {
    private networkConfig;
    constructor(oracleModuleConfig: OracleModuleConfig);
    create(key: string): Promise<any>;
    update(didPayload: DidDocument, modification: string, id?: string): Promise<any>;
    deactivate(didPayload: DidDocument): Promise<any>;
    resolve(did: string): Promise<any>;
}
