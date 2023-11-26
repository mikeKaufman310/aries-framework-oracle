/**
 * OracleModuleConfigOptions defines the interface for the options of the OracleModuleConfig class.
 */
export interface OracleModuleConfigOptions {
    networkConfig: NetworkConfig;
}
export interface NetworkConfig {
    encodedCredential: string;
    chaincode: string;
    channel: string;
    network: string;
}
export declare class OracleModuleConfig {
    private options;
    constructor(options: OracleModuleConfigOptions);
    /** See {@link OracleModuleConfigOptions.network} */
    get networkConfig(): NetworkConfig;
}
