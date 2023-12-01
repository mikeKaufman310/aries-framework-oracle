# aries-framework-oracle - Aries JavaScript Framework Oracle Verifiable Data Registry Module (Oracle-VDR)

Aries Framework JavaScript Oracle Verifiable Data Registry Module (Oracle-VDR) provides an optional addon to Aries Framework JavaScript to use the Oracle Blockchain Platform (OBP) as the Verifiable Data Registry (VDR).

The Oracle Blockchain Platform is a permissioned blockchain system with enhanced efficiency and streamlined agreements between multiple parties through smart contracts. Based on the open-source Hyperledger Fabric, the system offers a pre-configured platform for executing smart contracts and maintaining a secure ledger.

## Features

- **DID Creation:** Create decentralized identifiers on the Oracle ledger.
- **DID Resolution:** Resolve decentralized identifiers using the Oracle ledger service.
- **DID Update:** Update information associated with a decentralized identifier.
- **DID Deactivation:** Deactivate a decentralized identifier on the Oracle ledger.

## Installation

To install the Oracle Module, use the following command:

```bash
yarn install @lehigh-oracle-did23/aries-framework-oracle
```

## Usage

Add the Oracle-VDR Module to your agent:

```typescript
import { OracleModule, OracleModuleConfig, OracleDidRegistrar, OracleDidResolver, OracleLedgerService } from '@lehigh-oracle-did23/aries-framework-oracle';

const initializeAgent = async () => {
  const config: InitConfig = {
    // ...
  };

  const agent = new Agent({
    config,
    modules: {
      // ...
      dids: new DidsModule({
        registrars: [new OracleDidRegistrar()],
        resolvers: [new OracleDidResolver()],
      }),
      // ...
      oracle: new OracleModule(
        new OracleModuleConfig({
          networkConfig: {
            network: 'your-network',
            channel: 'your-channel',
            chaincode: 'your-chaincode',
            encodedCredential: 'your-encoded-credential',
          },
        })
      ),
      // ...
    },
    dependencies: agentDependencies,
  });

  // Initialize the agent
  await agent.initialize();

  return agent;
};
```