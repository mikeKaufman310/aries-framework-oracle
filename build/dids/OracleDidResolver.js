"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleDidResolver = void 0;
const identifiers_1 = require("./identifiers");
const core_1 = require("@aries-framework/core");
const ledger_1 = require("../ledger");
class OracleDidResolver {
    constructor() {
        this.supportedMethods = ['orcl'];
    }
    async resolve(agentContext, did, parsed) {
        const didDocumentMetadata = {};
        try {
            const parsedDid = (0, identifiers_1.parseOracleDid)(parsed.didUrl);
            if (!parsedDid) {
                throw new Error('OracleDIDResolver Parse Error: Invalid DID');
            }
            return await this.resolveDidDoc(agentContext, parsedDid.did);
            // switch (did) {
            //   case did.match(orclIdentifierRegex)?.input: // Why are we doing this twice?
            //     return await this.resolveDidDoc(agentContext, parsedDid.did);
            //   default:
            //     return {
            //       didDocument: null,
            //       didDocumentMetadata,
            //       didResolutionMetadata: {
            //         error: "Invalid request",
            //         message: `Unsupported did Url: '${did}'`,
            //       },
            //     };
            // }
        }
        catch (error) {
            return {
                didDocument: null,
                didDocumentMetadata,
                didResolutionMetadata: {
                    error: 'notFound',
                    message: `OracleDIDResolver resolver_error: Unable to resolve did '${did}': ${error}`,
                },
            };
        }
    }
    async resolveDidDoc(agentContext, did) {
        const oracleLedgerService = agentContext.dependencyManager.resolve(ledger_1.OracleLedgerService);
        const didDocument = await oracleLedgerService.resolve(did);
        return {
            didDocument: core_1.JsonTransformer.fromJSON(didDocument, core_1.DidDocument),
            didDocumentMetadata: {},
            didResolutionMetadata: {},
        };
    }
}
exports.OracleDidResolver = OracleDidResolver;
//# sourceMappingURL=OracleDidResolver.js.map