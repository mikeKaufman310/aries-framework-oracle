import type { ParsedDid } from "@aries-framework/core";
import { utils } from "@aries-framework/core";
import { isBase58 } from "class-validator";

const ID_CHAR = "[a-zA-Z]";
const IDENTIFIER = `(${ID_CHAR}+)`;

export const orclIdentifierRegex = new RegExp(`^did:orcl:${IDENTIFIER}$`);

export type ParsedOracleDid = ParsedDid;

export function parseOracleDid(didUrl: string): ParsedOracleDid | null {
  if (!didUrl) {
    return null;
  }

  const sections = didUrl.match(orclIdentifierRegex);

  console.log("sections", sections);

  if (sections) {
    const parts: ParsedOracleDid = {
      did: `did:orcl:${sections[1]}`,
      method: "orcl",
      id: sections[1],
      didUrl,
    };

    return parts;
  } else {
    console.log("Not a valid Uuid");
  }

  return null;
}