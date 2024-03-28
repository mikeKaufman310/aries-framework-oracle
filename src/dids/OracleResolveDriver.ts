import type {DidResolver, DidResolutionResult} from '@credo-ts/core'

/**
 * Class to implemented a DID Resolver Driver to be a part of DIF Universal Resolver 
 * @author Michael Kaufman
 * @summary Implements a DID Resolver Driver using previously implemented functions in 
 * Oracle codebase, as well as using functions from Open-Wallet Credo's typescript DID libraries
 */
export class OracleResolveDriver implements DidResolver{
    
    /**
     * Method to query user's config file, which contains ledger specific information
     * @param option number of which piece of information you need from config file
     * @summary 
     * Option 1: CHAINCODE string
     * Option 2: NETWORK string
     * Option 3: Channel string
     * Option 4: ENCODEDCRED string
     * @returns string of ledger endpoints to hit with REST API calls
     */
    private configQuery(option:number): string{
        //check that option is in range 1 to 4
        //open config file
        //read config file for headers based on option chosen: CHAINCODE, NETWORK, CHANNEL, ENCODEDCRED
        //store string for chosen option
        //close opened file
        //return sttring with config information

        return "";//NOT ACTUAL RETURN STATEMENT; NEEDS TO BE IMPLEMENTED
    }

    /**
     * Method to use queries config file information and make REST call to associated ledger to get DIDDoc for associated DID
     * @param did DID to be resolved as string type
     * @returns Promise of DIDDoc resolution or error type defined in Open-Wallet Credo library
     */
    public didResolve(did: string): Promise<DidResolutionResult>{
        //get did data with passed did and config ledger chaincode like OracleLedgerService line 131
        //hit axios post with network info like OracleLedgerSerivce line 137 and line 148
        //wrap axios post in promise data type and return it
        
        return Promise.resolve();//NOT ACTUAL RETURN STATEMENT; NEEDS TO BE IMPLEMENTED
    }
}