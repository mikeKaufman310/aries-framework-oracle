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
export class OracleResolveDriver{
    
    /**
     * A helper method for @configQuery method to parse file contents into usable strings
     * @param option see the @summary for @configQuery
     * @param fileContents string contents of a config file
     * @returns desired contents base on @option param in form of string
     */
    public static parseConfig(option: number, fileContents: string):string{
        if(option > 4 || option < 1 || fileContents.length == 0){
            throw new Error("Invalid params passed to parseConfig function");
        }
        if(option == 1){
            var initialPos = fileContents.indexOf("CHAINCODE") + 9;
            var finalPos = fileContents.indexOf("NETWORK");
            var desiredVal = "";
            while(initialPos < finalPos){
                desiredVal += fileContents[initialPos];
                initialPos++;
            }
            return desiredVal;
        }else if(option == 2){
            var initialPos = fileContents.indexOf("NETWORK") + 7;
            var finalPos = fileContents.indexOf("CHANNEL");
            var desiredVal = "";
            while(initialPos < finalPos){
                desiredVal += fileContents[initialPos];
                initialPos++;
            }
            return desiredVal;
        }else if (option == 3){
            var initialPos = fileContents.indexOf("CHANNEL") + 7;
            var finalPos = fileContents.indexOf("ENCODEDCRED");
            var desiredVal = "";
            while(initialPos < finalPos){
                desiredVal += fileContents[initialPos];
                initialPos++;
            }
            return desiredVal;
        }else{// option 4
            var initialPos = fileContents.indexOf("CHAINCODE") + 9;
            var finalPos = fileContents.length;
            var desiredVal = "";
            while(initialPos < finalPos){
                desiredVal += fileContents[initialPos];
                initialPos++;
            }
            return desiredVal;
        }
    }

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
    public configQuery(option:number, configFileStr:string): string{
        //check that option is in range 1 to 4
        if(option < 1 || option > 4 || configFileStr.length == 0){
            throw new Error("Invalid params passed to configQuery function");
        }

        //test with mock output
        if(configFileStr == "TEST"){//give mock output
            const mockData: string = fs.readFileSync(process.cwd() + "/transcripts/testConfig.txt",'utf-8');
            return OracleResolveDriver.parseConfig(option, mockData);
        }

        //actual personal config file query
        const fileData: string = fs.readFileSync(process.cwd() + configFileStr, 'utf-8');
        return OracleResolveDriver.parseConfig(option, fileData);
    }

    /**
     * Method to use queries config file information and make REST call to associated ledger to get DIDDoc for associated DID
     * @param did DID to be resolved as string type
     * @returns Promise of DIDDoc resolution or error type defined in Open-Wallet Credo library
     */
    async didResolve(did: string, queryDirectory: string): Promise<any>{
        if(did.length <= 0 || queryDirectory.length <= 0){
                if(did.length <= 0){
                    return -1;
                }else{
                    return -1;
                }
        }
        //get did data with passed did and config ledger chaincode like OracleLedgerService line 131
        var chaincodeStr = this.configQuery(1,queryDirectory);
        var data1 = JSON.stringify({
            chaincode: chaincodeStr,
            args: ["GetDidDocumentById", did],
            sync: true,
        });
        //hit axios post with network info like OracleLedgerSerivce line 137 and line 148
        var networkStr = this.configQuery(2,queryDirectory);
        var channelStr = this.configQuery(3, queryDirectory);
        var credStr = this.configQuery(4, queryDirectory);
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
            return -1;
          }
    }
}

