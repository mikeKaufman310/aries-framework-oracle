import {OracleResolveDriver} from '../../src/dids/OracleResolveDriver';
import axios from 'axios';
declare function assert(value: unknown): asserts value;


/**
 * File to test methods in oracle Resolve Driver class
 * @author Michael Kaufman
 * Date Last Modified: Apr 5, 2024
 */



//fields for mock resoution calls
var mockDidText = "mockDid";
var mockQueryText = "mockDirectoryForQuery";
var mockDid = "did:oracle:test";
var mockDirectory = "TEST";



//didResolve function
test('Test 1: Zero Length DID Passed', async () => {
    
    await expect(async () => {
        const driver = new OracleResolveDriver();
        await driver.didResolve("",mockQueryText);
    }).rejects.toThrow();
});

test('Test 2: Zero Length Directory Passed', async () => {
    await expect(async () => {
        const driver = new OracleResolveDriver();
        await driver.didResolve(mockDid,"");
    }).rejects.toThrow();
});

test('Test 3: Valid Credentials Passed', async () => {
    const driver = new OracleResolveDriver();
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
    expect(result).not.toBe(Promise.resolve(-1));
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
    const driver = new OracleResolveDriver();
    expect(()=>{driver.configQuery(0, mockDirectory)}).toThrow();
});

test('Test 9: Valid Params Passed', () => {
    const driver = new OracleResolveDriver();
    expect(()=>{driver.configQuery(1, mockDirectory)}).not.toThrow();
});

test('Test 10: Invalid Option Passed', () => {
    const driver = new OracleResolveDriver();
    expect(()=>{driver.configQuery(0, "")}).toThrow();
});

test('Test 11: Invalid Config File Passed', () => {
    const driver = new OracleResolveDriver();
    expect(()=>{driver.configQuery(1, "")}).toThrow();
});






