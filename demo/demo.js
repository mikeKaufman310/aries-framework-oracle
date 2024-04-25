"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OracleResolveDriver_1 = require("../src/dids/OracleResolveDriver");
async function res() {
    const driver = new OracleResolveDriver_1.OracleResolveDriver();
    const inBox = document.getElementById('didInput');
    if (typeof inBox !== null && typeof (inBox === null || inBox === void 0 ? void 0 : inBox.outerHTML) !== "undefined") {
        //const res = await driver.didResolve(inBox?.outerHTML,process.cwd()+"/src/transcripts/ledgerConfig.txt");
        //document.write(res);//commented out for testing purposes
        document.write("works");
    }
}
//# sourceMappingURL=demo.js.map