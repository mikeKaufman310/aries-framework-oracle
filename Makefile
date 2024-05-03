destroy:
#	rm -r demo/
	rm src/**/*.js
	rm src/**/*.d.ts
	rm src/**/*.js.map
	rm src/*.js
	rm src/*.d.ts
	rm src/*.js.map
	rm *.js.map
	rm demo.js
	rm *.d.ts
	rm index.mjs

demo:
	tsc src/ledger/OracleLedgerService.ts
	tsc src/dids/OracleResolveDriver.ts
	tsc demo.ts
	http-server
