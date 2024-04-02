

import { mock, instance } from 'ts-mockito';
import {OracleResolveDriver} from '../../src/dids/OracleResolveDriver';
import * as assert from 'assert';



var mockDidText = "mockDid";
var mockQueryText = "mockDirectoryForQuery";
var mockDid;
var mockDirectory;

/**
 * Class to test methods in oracle Resolve Driver class
 * @author Michael Kaufman
 * Date Last Modified: Apr 1, 2024
 */
class OracleResolveDriverTests {

    /**
     * Method to run all tests for OracleResolveDriver class
     */
    public static runTests(){
        this.testEmptyPromiseOnZeroLengthDid();
        this.testEmptyPromiseOnZeroLengthDirectory();
    }

    //tests for didResolve method
    public static testEmptyPromiseOnZeroLengthDid(){
        var driver = new OracleResolveDriver();
        assert.equal(driver.didResolve("",mockQueryText),Promise.resolve());
    }

    public static testEmptyPromiseOnZeroLengthDirectory(){
        var driver = new OracleResolveDriver();
        assert.equal(driver.didResolve(mockDidText,""), Promise.resolve());
    }

}

OracleResolveDriverTests.runTests();