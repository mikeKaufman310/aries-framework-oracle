import type { AgentContext, DidResolutionResult, DidResolver, ParsedDid } from '@aries-framework/core'
import { orclIdentifierRegex , parseOracleDid } from "./identifiers";
import { DidDocument, AriesFrameworkError, utils, JsonTransformer } from '@aries-framework/core'

import { OracleLedgerService } from '../ledger';

export class OracleDidResolver implements DidResolver {
  public readonly supportedMethods = ['orcl']

  public async resolve(agentContext: AgentContext, did: string, parsed: ParsedDid): Promise<DidResolutionResult> {
    const didDocumentMetadata = {}

    try {
      const parsedDid = parseOracleDid(parsed.didUrl);
      if (!parsedDid) {
        throw new Error('OracleDIDResolver Parse Error: Invalid DID')
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
    } catch (error) {
      return {
        didDocument: null,
        didDocumentMetadata,
        didResolutionMetadata: {
          error: 'notFound',
          message: `OracleDIDResolver resolver_error: Unable to resolve did '${did}': ${error}`,
        },
      }
    }
  }

  private async resolveDidDoc(agentContext: AgentContext, did: string): Promise<DidResolutionResult> {
    
    const oracleLedgerService = agentContext.dependencyManager.resolve(OracleLedgerService);

    const didDocument = await oracleLedgerService.resolve(did);

    const didDocumentJson = JsonTransformer.fromJSON(didDocument, DidDocument)
    
    didDocumentJson.assertionMethod = [didDocument.verificationMethod[0].id];

    return {
      didDocument: didDocumentJson,
      didDocumentMetadata: {},
      didResolutionMetadata: {},
    };
  }
}