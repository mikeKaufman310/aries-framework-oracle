import { DidCommV1Service, DidDocument, DidDocumentService, IndyAgentService, JsonTransformer, VerificationMethod } from '@credo-ts/core';
import {OracleResolveDriver} from '../../src/dids/OracleResolveDriver';
import axios from 'axios';
import * as fs from 'fs';
declare function assert(value: unknown): asserts value;


/**
 * File to test methods in oracle Resolve Driver class
 * @author Michael Kaufman
 * Date Last Modified: Apr 14, 2024
 */



//fields for mock resoution calls
const mockDidText = "mockDid";
const mockQueryText = "mockDirectoryForQuery";
const mockDid = "did:oracle:test";
const mockDirectory = "TEST";
const validDidDocumentInstance = JsonTransformer.fromJSON(JSON.parse(fs.readFileSync(process.cwd() + "/test/dids/constants/validDid.json", 'utf-8')), DidDocument);
const invalidDidDocumentInstance = JsonTransformer.fromJSON(JSON.parse(fs.readFileSync(process.cwd() + "/test/dids/constants/invalidDid.json", 'utf-8')), DidDocument);



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


//didResolveMetaData function
test('Test 12: Invalid DID passed', ()=>{
    const driver = new OracleResolveDriver();
    expect(()=>{driver.didResolveMetaData("")}).toThrow();
});

test('Test 13: Valid Params passed and REST call made, success', ()=>{
    const driver = new OracleResolveDriver();
    const mockDidDoc: DidDocument = new DidDocument({
        id: "did:test:123"
    });
    expect(()=>{driver.didResolveMetaData(JSON.stringify(mockDidDoc))}).not.toThrow();
});

test('Test 14: Valid Params passed and REST call not made, failure ', ()=>{
    const driver = new OracleResolveDriver();
    expect(()=>{driver.didResolveMetaData('test')}).toThrow();
});

test('Test 15: Valid Params passed and REST call made, failure UNIMPLEMENTED', ()=>{
    expect(false);//TO BE IMPLEMENTED
});


//didContextPush function
test('Test 16: Invalid Option with Valid Diddoc passed, error thrown', ()=>{
    const driver = new OracleResolveDriver();
    expect(()=>{driver.didContextPush(new DidDocument({id: "1"}), 5)}).toThrow();
});

test('Test 17: Valid (Test) Option with Valid Diddoc passed, boolean returned', ()=>{
    const driver = new OracleResolveDriver();
    const result = driver.didContextPush(validDidDocumentInstance, 2);
    expect(()=>{driver.didContextPush(validDidDocumentInstance, 2)}).not.toThrow();
    expect(result == true);
});


test('Test 18: Valid (Test) Option with Invalid Diddoc passed, boolean returned', ()=>{
    const driver = new OracleResolveDriver();
    const result = driver.didContextPush(invalidDidDocumentInstance, 2);
    expect(()=>{driver.didContextPush(invalidDidDocumentInstance, 2)}).not.toThrow();
    //console.log(result);
    expect(result).toBe(false);
});