"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleLedgerService = void 0;
const core_1 = require("@aries-framework/core");
const OracleModuleConfig_1 = require("../OracleModuleConfig");
const axios = require("axios");
let OracleLedgerService = class OracleLedgerService {
    constructor(oracleModuleConfig) {
        this.networkConfig = oracleModuleConfig.networkConfig;
        return this;
    }
    async create(key) {
        var data = JSON.stringify({
            chaincode: this.networkConfig.chaincode,
            args: ["CreateDIDDocument", key],
            sync: true,
        });
        let config = {
            url: `${this.networkConfig.network}/api/v2/channels/${this.networkConfig.channel}/transactions`,
            method: "post",
            headers: {
                Authorization: `Basic ${this.networkConfig.encodedCredential}`,
                "Content-Type": "application/json",
            },
            data: data,
        };
        try {
            let res = await axios(config);
            return res.data.result.payload;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
    async update(didPayload, modification, id) {
        // check if modification begins with AddNew, Add, or Remove
        let call = "";
        if (modification.startsWith("AddNew")) {
            call = "AddNewMethod";
        }
        else if (modification.startsWith("Add")) {
            call = "AddMethod";
        }
        else if (modification.startsWith("Remove")) {
            call = "RemoveMethod";
        }
        else {
            console.log("Invalid modification");
            return null;
        }
        var data = JSON.stringify({
            chaincode: this.networkConfig.chaincode,
            args: [call, didPayload.id, didPayload.controller, modification],
            sync: true,
        });
        if (call !== "AddNewMethod" && id) {
            // Parse data into an object
            const parsedData = JSON.parse(data);
            // Push method_id to the args array
            parsedData.args.push(id);
            // Stringify the object back into a string
            data = JSON.stringify(parsedData);
        }
        let config = {
            url: `${this.networkConfig.network}/api/v2/channels/${this.networkConfig.channel}/transactions`,
            method: "post",
            headers: {
                Authorization: `Basic ${this.networkConfig.encodedCredential}`,
                "Content-Type": "application/json",
            },
            data: data,
        };
        try {
            let res = await axios(config);
            return res.data.result.payload;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
    async deactivate(didPayload) {
        var data = JSON.stringify({
            chaincode: this.networkConfig.chaincode,
            args: ["DeleteDidDocument", didPayload.id],
            sync: true,
        });
        let config = {
            url: `${this.networkConfig.network}/api/v2/channels/${this.networkConfig.channel}/transactions`,
            method: "post",
            headers: {
                Authorization: `Basic ${this.networkConfig.encodedCredential}`,
                "Content-Type": "application/json",
            },
            data: data,
        };
        try {
            let res = await axios(config);
            return res.data.result.payload;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
    async resolve(did) {
        var data = JSON.stringify({
            chaincode: this.networkConfig.chaincode,
            args: ["GetDidDocumentById", did],
            sync: true,
        });
        let config = {
            url: `${this.networkConfig.network}/api/v2/channels/${this.networkConfig.channel}/transactions`,
            method: "post",
            headers: {
                Authorization: `Basic ${this.networkConfig.encodedCredential}`,
                "Content-Type": "application/json",
            },
            data: data,
        };
        try {
            let res = await axios(config);
            return res.data.result.payload;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
};
exports.OracleLedgerService = OracleLedgerService;
exports.OracleLedgerService = OracleLedgerService = __decorate([
    (0, core_1.injectable)(),
    __metadata("design:paramtypes", [OracleModuleConfig_1.OracleModuleConfig])
], OracleLedgerService);
//# sourceMappingURL=OracleLedgerService.js.map