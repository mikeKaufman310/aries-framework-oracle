import type { AgentContext, DidRegistrar, DidCreateOptions, DidDeactivateOptions, DidUpdateOptions, DidCreateResult, DidDeactivateResult, DidUpdateResult } from "@aries-framework/core";
import { DidDocument, VerificationMethod } from "@aries-framework/core";
export declare class OracleDidRegistrar implements DidRegistrar {
    readonly supportedMethods: string[];
    create(agentContext: AgentContext, options: OracleDidCreateOptions): Promise<DidCreateResult>;
    update(agentContext: AgentContext, options: OracleDidUpdateOptions): Promise<DidUpdateResult>;
    deactivate(agentContext: AgentContext, options: OracleDidDeactivateOptions): Promise<DidDeactivateResult>;
}
export interface OracleDidCreateOptions extends DidCreateOptions {
    method: "orcl";
    secret: {
        verificationMethod?: VerificationMethod;
        publicKeyPem?: string;
    };
}
export interface OracleDidUpdateOptions extends DidUpdateOptions {
    did: string;
    options: {
        modification: string;
        id?: string;
    };
    secret?: {
        verificationMethod: VerificationMethod;
    };
    didDocument: DidDocument;
}
export interface OracleDidDeactivateOptions extends DidDeactivateOptions {
    did: string;
}
