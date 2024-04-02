/**
 * Overrides the tsconfig used for the app.
 * In the test environment we need some tweaks.
 * 
 * NB: taken from medium article about ts testing: https://medium.com/swlh/how-to-setting-up-unit-tests-with-typescript-871c0f4f1609
 */

const tsNode = require('ts-node');
const testTSConfig = require('./test/tsconfig.json');

tsNode.register({
  files: true,
  transpileOnly: true,
  project: './test/tsconfig.json'
});