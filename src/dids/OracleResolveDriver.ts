import {type DidResolver, type DidResolutionResult, DidDocument} from '@credo-ts/core';
import * as fs from 'fs';
import axios from 'axios';
import { JsonTransformer } from '@credo-ts/core';

/**
 * Class to implemented a DID Resolver Driver to be a part of DIF Universal Resolver 
 * @author Michael Kaufman
 * @summary Implements a DID Resolver Driver using previously implemented functions in 
 * Oracle codebase, as well as using functions from Open-Wallet Credo's typescript DID libraries
 * Date Last Modified: Apr 9, 2024
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
            let initialPos = fileContents.indexOf("CHAINCODE") + 9;
            const finalPos = fileContents.indexOf("NETWORK");
            let desiredVal = "";
            while(initialPos < finalPos){
                desiredVal += fileContents[initialPos];
                initialPos++;
            }
            return desiredVal;
        }else if(option == 2){
            let initialPos = fileContents.indexOf("NETWORK") + 7;
            const finalPos = fileContents.indexOf("CHANNEL");
            let desiredVal = "";
            while(initialPos < finalPos){
                desiredVal += fileContents[initialPos];
                initialPos++;
            }
            return desiredVal;
        }else if (option == 3){
            let initialPos = fileContents.indexOf("CHANNEL") + 7;
            const finalPos = fileContents.indexOf("ENCODEDCRED");
            let desiredVal = "";
            while(initialPos < finalPos){
                desiredVal += fileContents[initialPos];
                initialPos++;
            }
            return desiredVal;
        }else{// option 4
            let initialPos = fileContents.indexOf("CHAINCODE") + 9;
            const finalPos = fileContents.length;
            let desiredVal = "";
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
                    throw new Error("Invalid DID passed to didResolve method");
                }else{
                    throw new Error("Invalid Query Directory passed to didResolve method");
                }
        }
        //get did data with passed did and config ledger chaincode like OracleLedgerService line 131
        const chaincodeStr = this.configQuery(1,queryDirectory);
        let didDoc = JSON.stringify({
            chaincode: chaincodeStr,
            args: ["GetDidDocumentById", did],
            sync: true,
        });
        //hit axios post with network info like OracleLedgerSerivce line 137 and line 148
        const networkStr = this.configQuery(2,queryDirectory);
        const channelStr = this.configQuery(3, queryDirectory);
        const credStr = this.configQuery(4, queryDirectory);
        let configPost = {
            url: `${networkStr}/api/v2/channels/${channelStr}/transactions`,
            method: "post",
            headers: {
              Authorization: `Basic ${credStr}`,
              "Content-Type": "application/json",
            },
            data: didDoc,
        }
        //wrap axios post in promise data type and return it
        try {
            let res = await axios(configPost);
            return res.data.result.payload;
          } catch (err) {
            return Promise.resolve(-1);
          }
    }

    /**
     * Method to resolve a DIDDoc's metadata and use/verify any of its elements before next stage of resolution
     * @param diddoc DIDDoc metadata to be resolved and have verified metadata after resolution
     * @returns Promise of DIDDoc metadata (string) after manipulated metadata for verification or error type
     */
    public didResolveMetaData(diddocMetadata: string): Promise<any>{
        if(diddocMetadata.length <= 0){
            throw new Error("Invalid params passed to didResolveMetaData method");
        }
        try{
            const diddocMetadataObject = JsonTransformer.fromJSON(JSON.parse(diddocMetadata), DidDocument);
            //hit rest api endpoint to verify resolution of metadata elements
            //NB: this will be implemented in a later issue
            return Promise.resolve(JSON.stringify(diddocMetadataObject));
        }catch(err){
            throw new Error("Unable to parse DIDDoc into JSON in didResolveMetaData method");
        }
    }

    /**
     * Method to execute a diddoc's verification method, if applicable, and returning verfication result
     * @param diddoc string of resolved diddoc
     * @returns promise of diddoc resolution (string) or throws an error
     */
    public didWrapVerificationMethod(diddoc: string): Promise<any>{
        //check validitty of passed params
        if(diddoc.length <= 0){
            throw new Error("Invalid params passed to didWrapVerificationMethod method");
        }
        try{
            const diddocObject = JsonTransformer.fromJSON(JSON.parse(diddoc),DidDocument);
        }catch(err){
            throw new Error("Unable to parse DIDDoc into JSON in didWrapVerificationMethod method");
        }
        //check if diddoc contains a verification method, if so continue, if not return passed diddoc
        //carry out diddocs verifcation method
        //check result of verifcation method
        //return based on verification method result
        return Promise.resolve();//not actual return sttatement
    }
}

