import {OracleResolveDriver} from '../../src/dids/OracleResolveDriver';
import axios from 'axios';
declare function assert(value: unknown): asserts value;



//fields for mock resoution calls
var mockDidText = "mockDid";
var mockQueryText = "mockDirectoryForQuery";
var mockDid = "did:oracle:test";
var mockDirectory = "TEST";

/**
 * File to test methods in oracle Resolve Driver class
 * @author Michael Kaufman
 * Date Last Modified: Apr 1, 2024
 */

//didResolve function
test('Test 1: Zero Length DID Passed', async () => {
    var driver = new OracleResolveDriver();
    const result1 =  await driver.didResolve("",mockQueryText);
    const bool1 = result1 == -1;
    expect(bool1 == true);
});

test('Test 2: Zero Length Directory Passed', async () => {
    var driver = new OracleResolveDriver();
    const result1 =  await driver.didResolve(mockDidText,"");
    const bool1 = result1 == -1;
    expect(bool1 == true);
});

test('Test 3: Valid Credentials Passed', async () => {
    var driver = new OracleResolveDriver();
    jest.spyOn(axios, 'post').mockResolvedValue({
        data:{
            "@context":[
                "https://www.w3.org/"
            ],
            "id":"did:oracle:test",
            "authentication":[{
                "id":"test",
                "type":"test",
                "controller":"test",
                "pubKey":"test"
            }],
            "verificationMethod":[{
                "id":"did:oracle:test",
                "type":"test",
                "controller":"test",
                "pubKey":"test"
            }]
        }
    });
    const result = await driver.didResolve(mockDid, mockDirectory);
    const bool = result != -1;
    expect(bool == true);
});


//parseConfig function
test('Test 4: Invalid File Contents Passed and Invalid Option Passed', () => {
    expect(()=>{OracleResolveDriver.parseConfig(0, "");}).toThrow();
});

test('Test 5: Valid Option Passed and Invalid File Contents Passed', () => {
    expect(()=>{OracleResolveDriver.parseConfig(1, "");}).toThrow();
});

test('Test 6: Invalid Option Passed and Valid File Contents Passed', () => {
    expect(()=>{OracleResolveDriver.parseConfig(0, mockDirectory);}).toThrow();
});

test('Test 7: Valid Params Passed', () => {
    expect(()=>{OracleResolveDriver.parseConfig(1, mockDirectory);}).not.toThrow();
});


//configQuery function
test('Test 8: Invalid Option Passed and Valid Config File Passed', () => {
    var driver = new OracleResolveDriver();
    expect(()=>{driver.configQuery(0, mockDirectory)}).toThrow();
});

test('Test 9: Valid Params Passed', () => {
    var driver = new OracleResolveDriver();
    expect(()=>{driver.configQuery(1, mockDirectory)}).not.toThrow();
});

test('Test 10: Invalid Option Passed', () => {
    var driver = new OracleResolveDriver();
    expect(()=>{driver.configQuery(0, "")}).toThrow();
});

test('Test 11: Invalid Config File Passed', () => {
    var driver = new OracleResolveDriver();
    expect(()=>{driver.configQuery(1, "")}).toThrow();
});






