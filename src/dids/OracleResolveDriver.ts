import type {DidResolver, DidResolutionResult} from '@credo-ts/core'
import * as fs from 'fs';

const axios = require("axios");

/**
 * Class to implemented a DID Resolver Driver to be a part of DIF Universal Resolver 
 * @author Michael Kaufman
 * @summary Implements a DID Resolver Driver using previously implemented functions in 
 * Oracle codebase, as well as using functions from Open-Wallet Credo's typescript DID libraries
 * Date Last Modified: Apr 1, 2024
 */
export class OracleResolveDriver implements DidResolver{
    
    /**
     * Method to query user's config file, which contains ledger specific information
     * @param option number of which piece of information you need from config file
     * @summary 
     * Option 1: CHAINCODE string
     * Option 2: NETWORK string
     * Option 3: CHANNEL string
     * Option 4: ENCODEDCRED string
     * @returns string of ledger endpoints to hit with REST API calls
     */
    private configQuery(option:number, configFileStr:string): string{
        //check that option is in range 1 to 4
        if(option < 1 || option > 4){
            return "";//error handling
        }
        //open config file
        //const configFile = readFileSync('../transcripts/ledgerConfig.txt', 'utf-8');
        var configData = new String("");
        //fs.readFile(configFileStr, 'utf-8', function (err, optionData) => {
        //    if(err){
        //        //handle error
        //        return;
        //    }
//
        //    configData = optionData;
        //});

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
    public async didResolve(did: string, queryDirectory: string): Promise<any>{
        if(did.length <= 0 || queryDirectory.length <= 0){
            return Promise.resolve();
        }
        //get did data with passed did and config ledger chaincode like OracleLedgerService line 131
        var chaincodeStr = this.configQuery(1,'${queryDirectory}');
        var data1 = JSON.stringify({
            chaincode: chaincodeStr,
            args: ["GetDidDocumentById", did],
            sync: true,
        });
        //hit axios post with network info like OracleLedgerSerivce line 137 and line 148
        var networkStr = this.configQuery(2,'${queryDirectory}');
        var channelStr = this.configQuery(3, '${queryDirectory}');
        var credStr = this.configQuery(4, '${queryDirectory}');
        let configPost = {
            url: `${networkStr}/api/v2/channels/${channelStr}/transactions`,
            method: "post",
            headers: {
              Authorization: `Basic ${credStr}`,
              "Content-Type": "application/json",
            },
            data: data1,
        }
        //wrap axios post in promise data type and return it
        try {
            let res = await axios(configPost);
            return res.data.result.payload;
          } catch (err) {
            console.log(err);
            return Promise.resolve();
          }
        
        //return Promise.resolve();//NOT ACTUAL RETURN STATEMENT; NEEDS TO BE IMPLEMENTED
    }
}

