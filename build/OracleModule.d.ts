import type { AgentContext, DependencyManager, Module } from "@aries-framework/core";
import { OracleModuleConfig, OracleModuleConfigOptions } from "./OracleModuleConfig";
export declare class OracleModule implements Module {
    readonly config: OracleModuleConfig;
    constructor(config: OracleModuleConfigOptions);
    register(dependencyManager: DependencyManager): void;
    initialize(agentContext: AgentContext): Promise<void>;
}
