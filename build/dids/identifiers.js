"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOracleDid = exports.orclIdentifierRegex = void 0;
const ID_CHAR = "[a-zA-Z]";
const IDENTIFIER = `(${ID_CHAR}+)`;
exports.orclIdentifierRegex = new RegExp(`^did:orcl:${IDENTIFIER}$`);
function parseOracleDid(didUrl) {
    if (!didUrl) {
        return null;
    }
    const sections = didUrl.match(exports.orclIdentifierRegex);
    console.log("sections", sections);
    if (sections) {
        const parts = {
            did: `did:orcl:${sections[1]}`,
            method: "orcl",
            id: sections[1],
            didUrl,
        };
        return parts;
    }
    else {
        console.log("Not a valid Uuid");
    }
    return null;
}
exports.parseOracleDid = parseOracleDid;
//# sourceMappingURL=identifiers.js.map