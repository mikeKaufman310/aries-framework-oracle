import {OracleResolveDriver} from '../../src/dids/OracleResolveDriver';
//import * as assert from 'assert';
declare function assert(value: unknown): asserts value;




var mockDidText = "mockDid";
var mockQueryText = "mockDirectoryForQuery";
var mockDid;
var mockDirectory;

/**
 * Class to test methods in oracle Resolve Driver class
 * @author Michael Kaufman
 * Date Last Modified: Apr 1, 2024
 */
export class OracleResolveDriverTests {

    /**
     * Method to run all tests for OracleResolveDriver class
     */
    public static runTests(){
        this.testEmptyPromiseOnZeroLengthDid();
        this.testEmptyPromiseOnZeroLengthDirectory();
    }

    //tests for didResolve method
    static async testEmptyPromiseOnZeroLengthDid(){
        var driver = new OracleResolveDriver();
        const result =  await driver.didResolve("",mockQueryText);
        const bool = result == -1;
        console.log("Test 1: " + bool);
    }

    static async testEmptyPromiseOnZeroLengthDirectory(){
        var driver = new OracleResolveDriver();
        const result = await driver.didResolve(mockDidText,"");
        const bool = result == -1;
        console.log("Test 2: " + bool);
    }

    static async testValidParamsWithSuccess(){

    }

    static async testValidParamsWithBadPost(){
        
    }

}

