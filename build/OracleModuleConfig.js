"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleModuleConfig = void 0;
class OracleModuleConfig {
    constructor(options) {
        this.options = options;
    }
    /** See {@link OracleModuleConfigOptions.network} */
    get networkConfig() {
        return this.options.networkConfig;
    }
}
exports.OracleModuleConfig = OracleModuleConfig;
//# sourceMappingURL=OracleModuleConfig.js.map