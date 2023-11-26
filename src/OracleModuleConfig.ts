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

export class OracleModuleConfig {
  private options: OracleModuleConfigOptions;

  public constructor(options: OracleModuleConfigOptions) {
    this.options = options;
  }

  /** See {@link OracleModuleConfigOptions.network} */
  public get networkConfig() {
    return this.options.networkConfig;
  }
}
