
import { AgentContext } from '@credo-ts/core';
import {OracleResolveDriver} from './src/dids/OracleResolveDriver';
async function res(){
    const driver = new OracleResolveDriver();
    const inBox = document.getElementById('didInput');
    if(typeof inBox !== null && typeof inBox?.outerHTML !== "undefined"){
        const res = await driver.didResolve(inBox?.outerHTML,process.cwd()+"/src/transcripts/ledgerConfig.txt").then(response =>{
            document.write(response);
        });
        //document.write(res);//commented out for testing purposes
        //document.write("works");//did:orcl:wnVwpENoPYSytIVmOVbARXXxniYySLRstdzRXVtkJAvbQgXVBY
    }
}