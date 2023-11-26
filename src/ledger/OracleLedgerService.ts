import {
  AriesFrameworkError,
  DidDocument,
  injectable,
} from "@aries-framework/core";
import { OracleModuleConfig } from "../OracleModuleConfig";

const axios = require("axios");

export interface IOracleLedgerConfig {
  network: string;
  channel: string;
  chaincode: string;
  encodedCredential: string;
}

@injectable()
export class OracleLedgerService {
  private networkConfig: IOracleLedgerConfig;

  public constructor(oracleModuleConfig: OracleModuleConfig) {
    this.networkConfig = oracleModuleConfig.networkConfig;
    return this;
  }

  public async create(key: string) {
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
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async update(
    didPayload: DidDocument,
    modification: string,
    id?: string
  ) {
    // check if modification begins with AddNew, Add, or Remove
    let call = "";
    if (modification.startsWith("AddNew")) {
      call = "AddNewMethod";
    } else if (modification.startsWith("Add")) {
      call = "AddMethod";
    } else if (modification.startsWith("Remove")) {
      call = "RemoveMethod";
    } else {
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
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async deactivate(didPayload: DidDocument) {
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
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async resolve(did: string) {
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
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
