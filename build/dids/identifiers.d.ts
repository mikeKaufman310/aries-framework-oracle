import type { ParsedDid } from "@aries-framework/core";
export declare const orclIdentifierRegex: RegExp;
export type ParsedOracleDid = ParsedDid;
export declare function parseOracleDid(didUrl: string): ParsedOracleDid | null;
