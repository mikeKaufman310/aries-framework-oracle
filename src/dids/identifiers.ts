import type { ParsedDid } from "@aries-framework/core";
import { utils } from "@aries-framework/core";
import { isBase58 } from "class-validator";

const ID_CHAR = "[a-zA-Z]";
const IDENTIFIER = `(${ID_CHAR}+)`;
const PATH = `(/[^#?]*)?`;
const QUERY_PARAM = `([^#&=?]+=[^#&=?]+)`;
const QUERY = `([?](?:${QUERY_PARAM}&)*)?`;
const FRAGMENT = `(#([^?]*))?`;

export const orclIdentifierRegex = new RegExp(
  `^did:orcl:${IDENTIFIER}${PATH}${QUERY}${FRAGMENT}$`
);

export type ParsedOracleDid = ParsedDid & {
  path?: string;
  params?: Record<string, string>;
  fragment?: string;
};

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

    if (sections[2]) {
      parts.path = sections[2];
    }

    if (sections[3]) {
      const params = sections[3].slice(1).split("&");
      parts.params = {};

      for (const param of params) {
        const [key, value] = param.split("=");
        parts.params[key] = value;
      }
    }

    if (sections[4]) {
      parts.fragment = sections[4].slice(1);
    }

    return parts;
  } else {
    console.error(
      "Not a valid Oracle DID. Check the format and components of the DID."
    );
  }

  return null;
}
