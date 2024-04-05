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
    //can also check if the correct axios address was hit with code:
    //expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1');
});

//static async testValidParamsWithBadPost() also do this test for the suite
test('Test 4: Invalid Credentials Passed', async () =>{
    expect(true);//NB : to be implemented
});

//parseConfig function
test('Test 5: Invalid Option Passed', () => {
    expect(true);//NB : to be implemented
});

test('Test 6: Invalid File Contents Passed', () => {
    expect(true);//NB : to be implemented
});

test('Test 7: Valid Option Passed and Invalid File Contents Passed', () => {
    expect(true);//NB : to be implemented
});

test('Test 8: Invalid Option Passed and Valid File Contents Passed', () => {
    expect(true);//NB : to be implemented
});

test('Test 9: Valid Params Passed', () => {
    expect(true);//NB : to be implemented
});

//configQuery function
test('Test 10: Invalid Option Passed', () => {
    expect(true);//NB : to be implemented
});

test('Test 11: Invalid Config File Passed', () => {
    expect(true);//NB : to be implemented
});

test('Test 12: Valid Option Passed and Invalid Config File Passed', () => {
    expect(true);//NB : to be implemented
});

test('Test 13: Invalid Option Passed and Valid Config File Passed', () => {
    expect(true);//NB : to be implemented
});

test('Test 14: Valid Params Passed', () => {
    expect(true);//NB : to be implemented
});
