import type {
  AgentContext,
  DidRegistrar,
  DidCreateOptions,
  DidDeactivateOptions,
  DidUpdateOptions,
  DidCreateResult,
  DidDeactivateResult,
  DidUpdateResult,
} from "@aries-framework/core";

import {
  DidDocument,
  DidDocumentRole,
  DidRecord,
  DidRepository,
  KeyType,
  Buffer,
  isValidPrivateKey,
  utils,
  TypedArrayEncoder,
  getKeyFromVerificationMethod,
  JsonTransformer,
  VerificationMethod,
} from "@aries-framework/core";

import { OracleLedgerService } from "../ledger";


export class OracleDidRegistrar implements DidRegistrar {
  public readonly supportedMethods = ["orcl"];

  public async create(
    agentContext: AgentContext,
    options: OracleDidCreateOptions
  ): Promise<DidCreateResult> {
    const didRepository = agentContext.dependencyManager.resolve(DidRepository);

    const oracleLedgerService = agentContext.dependencyManager.resolve(OracleLedgerService);

    // const verificationMethod = options.secret?.verificationMethod;

    const publicKeyPem = options.secret?.publicKeyPem;
    let didDocument: DidDocument;

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

      } else {
        return {
          didDocumentMetadata: {},
          didRegistrationMetadata: {},
          didState: {
            state: "failed",
            reason:
              "Provide a didDocument or at least one verificationMethod with seed in secret",
          },
        };
      }

      // Save the did so we know we created it and can issue with it
      const didRecord = new DidRecord({
        did: didDocument.id,
        role: DidDocumentRole.Created,
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
    } catch (error) {
      agentContext.config.logger.error(`Error registering DID`, error as Error);
      return {
        didDocumentMetadata: {},
        didRegistrationMetadata: {},
        didState: {
          state: "failed",
          reason: `unknownError: ${(error as Error).message}`,
        },
      };
    }
  }

  public async update(
    agentContext: AgentContext,
    options: OracleDidUpdateOptions
  ): Promise<DidUpdateResult> {
    const didRepository = agentContext.dependencyManager.resolve(DidRepository);
    const oracleLedgerService =
      agentContext.dependencyManager.resolve(OracleLedgerService);
    
    const verificationMethod = options.secret?.verificationMethod;
    let didDocument: DidDocument;
    let didRecord: DidRecord | null;

    try {
      if (options.didDocument) {
        didDocument = options.didDocument;
        const resolvedDocument = await oracleLedgerService.resolve(
          didDocument.id
        );
        didRecord = await didRepository.findCreatedDid(
          agentContext,
          didDocument.id
        );
        if (
          !resolvedDocument.didDocument ||
          resolvedDocument.didDocumentMetadata.deactivated ||
          !didRecord
        ) {
          return {
            didDocumentMetadata: {},
            didRegistrationMetadata: {},
            didState: {
              state: "failed",
              reason: "Did not found",
            },
          };
        }
        
      } else {
        return {
          didDocumentMetadata: {},
          didRegistrationMetadata: {},
          didState: {
            state: "failed",
            reason: "Provide a valid didDocument",
          },
        };
      }

      const response = await oracleLedgerService.update(didDocument, options.options.modification, options.options?.id);
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
    } catch (error) {
      agentContext.config.logger.error(`Error updating DID`, error as Error);
      return {
        didDocumentMetadata: {},
        didRegistrationMetadata: {},
        didState: {
          state: "failed",
          reason: `unknownError: ${(error as Error).message}`,
        },
      };
    }
  }

  public async deactivate(
    agentContext: AgentContext,
    options: OracleDidDeactivateOptions
  ): Promise<DidDeactivateResult> {
    const didRepository = agentContext.dependencyManager.resolve(DidRepository);
    const oracleLedgerService =
      agentContext.dependencyManager.resolve(OracleLedgerService);

    const did = options.did;

    try {
      const { didDocument, didDocumentMetadata } =
        await oracleLedgerService.resolve(did);

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
      const response = await oracleLedgerService.deactivate(
        didDocument
      );
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
          didDocument: JsonTransformer.fromJSON(didDocument, DidDocument),
          secret: options.secret,
        },
      };
    } catch (error) {
      agentContext.config.logger.error(`Error deactivating DID`, error as Error);
      return {
        didDocumentMetadata: {},
        didRegistrationMetadata: {},
        didState: {
          state: "failed",
          reason: `unknownError: ${(error as Error).message}`,
        },
      };
    }
  }
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
