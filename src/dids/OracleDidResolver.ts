import type { AgentContext, DidResolutionResult, DidResolver, ParsedDid } from '@credo-ts/core'
import { orclIdentifierRegex , parseOracleDid } from "./identifiers";
import { DidDocument, utils, JsonTransformer } from '@credo-ts/core'

import { OracleLedgerService } from '../ledger';
import { OracleResolveDriver } from './OracleResolveDriver';
import { DidDocMetadata } from './DidDocMetadata';

export class OracleDidResolver implements DidResolver {
  public readonly supportedMethods = ['orcl']
  allowsCaching: boolean = false;
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
    
    //const oracleLedgerService = agentContext.dependencyManager.resolve(OracleLedgerService);
//
    //const didDocument = await oracleLedgerService.resolve(did);
//
    //// TEMP : add assertion here
    //const didDocumentJson = JsonTransformer.fromJSON(didDocument, DidDocument);
    //didDocumentJson.context = Array.isArray(didDocumentJson.context) ? didDocumentJson.context : [didDocumentJson.context];
    //didDocumentJson.context.push("https://w3id.org/security/suites/ed25519-2018/v1");
    //didDocumentJson.context = Array.isArray(didDocumentJson.context) ? didDocumentJson.context : [didDocumentJson.context];
    //didDocumentJson.assertionMethod = [didDocument.verificationMethod[0].id];
    //didDocumentJson.authentication = [didDocument.verificationMethod[0].id];

    const resolver: OracleResolveDriver = new OracleResolveDriver();
    const didResolutionJson = await resolver.Resolve(did, '/transcripts/ledgerConfig.txt', agentContext);

    return {
      didDocument:  JsonTransformer.fromJSON(didResolutionJson.didDoc, DidDocument),
      didDocumentMetadata: JsonTransformer.fromJSON(didResolutionJson.metaData1, DidDocMetadata),
      didResolutionMetadata: JsonTransformer.fromJSON(didResolutionJson.metaData2, DidDocMetadata),
    };
  }
}