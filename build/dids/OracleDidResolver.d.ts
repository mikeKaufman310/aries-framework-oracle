import type { AgentContext, DidResolutionResult, DidResolver, ParsedDid } from '@aries-framework/core';
export declare class OracleDidResolver implements DidResolver {
    readonly supportedMethods: string[];
    resolve(agentContext: AgentContext, did: string, parsed: ParsedDid): Promise<DidResolutionResult>;
    private resolveDidDoc;
}
