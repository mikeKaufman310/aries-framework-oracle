"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleModule = void 0;
const core_1 = require("@aries-framework/core");
const OracleModuleConfig_1 = require("./OracleModuleConfig"); // Import OracleModuleConfig
const ledger_1 = require("./ledger"); // Import OracleLedgerService
class OracleModule {
    constructor(config) {
        this.config = new OracleModuleConfig_1.OracleModuleConfig(config);
    }
    register(dependencyManager) {
        // Warn about experimental module
        dependencyManager
            .resolve(core_1.AgentConfig)
            .logger.warn("The '@aries-framework/oracle' module is experimental and could have unexpected breaking changes. When using this module, make sure to use strict versions for all @aries-framework packages.");
        // Register config
        dependencyManager.registerInstance(OracleModuleConfig_1.OracleModuleConfig, this.config);
        dependencyManager.registerSingleton(ledger_1.OracleLedgerService); // Register OracleLedgerService
        // Oracle module needs Buffer to be available globally
        // If it is not available yet, we overwrite it with the
        // Buffer implementation from AFJ
        global.Buffer = global.Buffer || core_1.Buffer;
    }
    async initialize(agentContext) {
        // not required
        const oracleLedgerService = agentContext.dependencyManager.resolve(ledger_1.OracleLedgerService);
    }
}
exports.OracleModule = OracleModule;
//# sourceMappingURL=OracleModule.js.map