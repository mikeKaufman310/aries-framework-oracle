"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleDidRegistrar = void 0;
const core_1 = require("@aries-framework/core");
const ledger_1 = require("../ledger");
class OracleDidRegistrar {
    constructor() {
        this.supportedMethods = ["orcl"];
    }
    async create(agentContext, options) {
        var _a;
        const didRepository = agentContext.dependencyManager.resolve(core_1.DidRepository);
        const oracleLedgerService = agentContext.dependencyManager.resolve(ledger_1.OracleLedgerService);
        // const verificationMethod = options.secret?.verificationMethod;
        const publicKeyPem = (_a = options.secret) === null || _a === void 0 ? void 0 : _a.publicKeyPem;
        let didDocument;
        try {
            if (options.didDocument) {
                didDocument = options.didDocument;
            }
            // else if (verificationMethod) {
            //   const key = getKeyFromVerificationMethod(verificationMethod);
            //   // console.log(key.publicKey.toString());
            //   const l_publicKeyPem = verificationMethod.publicKeyPem?.toString()
            //   if (!l_publicKeyPem) {
            //     throw new Error("Public key PEM is undefined");
            //   }
            //   didDocument = await oracleLedgerService.create(l_publicKeyPem);
            //   const contextMapping = {
            //     Ed25519VerificationKey2018:
            //       "https://w3id.org/security/suites/ed25519-2018/v1",
            //     Ed25519VerificationKey2020:
            //       "https://w3id.org/security/suites/ed25519-2020/v1",
            //     JsonWebKey2020: "https://w3id.org/security/suites/jws-2020/v1",
            //   };
            //   const contextUrl = contextMapping[verificationMethod.type as keyof typeof contextMapping];
            // } 
            else if (publicKeyPem) {
                didDocument = await oracleLedgerService.create(publicKeyPem);
            }
            else {
                return {
                    didDocumentMetadata: {},
                    didRegistrationMetadata: {},
                    didState: {
                        state: "failed",
                        reason: "Provide a didDocument or at least one verificationMethod with seed in secret",
                    },
                };
            }
            // Save the did so we know we created it and can issue with it
            const didRecord = new core_1.DidRecord({
                did: didDocument.id,
                role: core_1.DidDocumentRole.Created,
                didDocument,
            });
            await didRepository.save(agentContext, didRecord);
            // options.secret.verificationMethod = {
            //   id: "key-1",
            //   type: "Ed25519VerificationKey2020",
            //   controller: "#id",
            // };
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: "finished",
                    did: didDocument.id,
                    didDocument,
                    secret: options.secret,
                },
            };
        }
        catch (error) {
            agentContext.config.logger.error(`Error registering DID`, error);
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: "failed",
                    reason: `unknownError: ${error.message}`,
                },
            };
        }
    }
    async update(agentContext, options) {
        var _a, _b;
        const didRepository = agentContext.dependencyManager.resolve(core_1.DidRepository);
        const oracleLedgerService = agentContext.dependencyManager.resolve(ledger_1.OracleLedgerService);
        const verificationMethod = (_a = options.secret) === null || _a === void 0 ? void 0 : _a.verificationMethod;
        let didDocument;
        let didRecord;
        try {
            if (options.didDocument) {
                didDocument = options.didDocument;
                const resolvedDocument = await oracleLedgerService.resolve(didDocument.id);
                didRecord = await didRepository.findCreatedDid(agentContext, didDocument.id);
                if (!resolvedDocument.didDocument ||
                    resolvedDocument.didDocumentMetadata.deactivated ||
                    !didRecord) {
                    return {
                        didDocumentMetadata: {},
                        didRegistrationMetadata: {},
                        didState: {
                            state: "failed",
                            reason: "Did not found",
                        },
                    };
                }
            }
            else {
                return {
                    didDocumentMetadata: {},
                    didRegistrationMetadata: {},
                    didState: {
                        state: "failed",
                        reason: "Provide a valid didDocument",
                    },
                };
            }
            const response = await oracleLedgerService.update(didDocument, options.options.modification, (_b = options.options) === null || _b === void 0 ? void 0 : _b.id);
            if (response.code !== 0) {
                throw new Error(`${response.rawLog}`);
            }
            // Save the did so we know we created it and can issue with it
            didRecord.didDocument = didDocument;
            await didRepository.update(agentContext, didRecord);
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: "finished",
                    did: didDocument.id,
                    didDocument,
                    secret: options.secret,
                },
            };
        }
        catch (error) {
            agentContext.config.logger.error(`Error updating DID`, error);
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: "failed",
                    reason: `unknownError: ${error.message}`,
                },
            };
        }
    }
    async deactivate(agentContext, options) {
        const didRepository = agentContext.dependencyManager.resolve(core_1.DidRepository);
        const oracleLedgerService = agentContext.dependencyManager.resolve(ledger_1.OracleLedgerService);
        const did = options.did;
        try {
            const { didDocument, didDocumentMetadata } = await oracleLedgerService.resolve(did);
            const didRecord = await didRepository.findCreatedDid(agentContext, did);
            if (!didDocument || didDocumentMetadata.deactivated || !didRecord) {
                return {
                    didDocumentMetadata: {},
                    didRegistrationMetadata: {},
                    didState: {
                        state: "failed",
                        reason: "Did not found",
                    },
                };
            }
            const response = await oracleLedgerService.deactivate(didDocument);
            if (response.code !== 0) {
                throw new Error(`${response.rawLog}`);
            }
            await didRepository.update(agentContext, didRecord);
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: "finished",
                    did: didDocument.id,
                    didDocument: core_1.JsonTransformer.fromJSON(didDocument, core_1.DidDocument),
                    secret: options.secret,
                },
            };
        }
        catch (error) {
            agentContext.config.logger.error(`Error deactivating DID`, error);
            return {
                didDocumentMetadata: {},
                didRegistrationMetadata: {},
                didState: {
                    state: "failed",
                    reason: `unknownError: ${error.message}`,
                },
            };
        }
    }
}
exports.OracleDidRegistrar = OracleDidRegistrar;
//# sourceMappingURL=OracleDidRegistrar.js.map