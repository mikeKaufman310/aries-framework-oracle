import type {
  AgentContext,
  DependencyManager,
  Module,
} from "@aries-framework/core";

import { AgentConfig, Buffer } from "@aries-framework/core";

import { OracleModuleConfig , OracleModuleConfigOptions } from "./OracleModuleConfig"; // Import OracleModuleConfig
import { OracleLedgerService } from "./ledger"; // Import OracleLedgerService

export class OracleModule implements Module {
  public readonly config: OracleModuleConfig;

  public constructor(config: OracleModuleConfigOptions) {
    this.config = new OracleModuleConfig(config);
  }

  public register(dependencyManager: DependencyManager) {
    // Warn about experimental module
    dependencyManager
      .resolve(AgentConfig)
      .logger.warn(
        "The '@aries-framework/oracle' module is experimental and could have unexpected breaking changes. When using this module, make sure to use strict versions for all @aries-framework packages."
      );

    // Register config
    dependencyManager.registerInstance(OracleModuleConfig, this.config);

    dependencyManager.registerSingleton(OracleLedgerService); // Register OracleLedgerService

    // Oracle module needs Buffer to be available globally
    // If it is not available yet, we overwrite it with the
    // Buffer implementation from AFJ
    global.Buffer = global.Buffer || Buffer;
  }

  public async initialize(agentContext: AgentContext): Promise<void> {
    // not required
    const oracleLedgerService =
      agentContext.dependencyManager.resolve(OracleLedgerService);
  }
}
