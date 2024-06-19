export type ListKeysLineType =
  | "pub"
  | "crt"
  | "crs"
  | "sub"
  | "sec"
  | "ssb"
  | "uid"
  | "uat"
  | "sig"
  | "rev"
  | "rvs"
  | "fpr"
  | "fp2"
  | "pkd"
  | "grp"
  | "rvk"
  | "tfs"
  | "tru"
  | "spk"
  | "cfg";
export type ListKeysValidity =
  | "r" /** The key has been revoked */
  | "e" /** The key has expired */
  | "-" /** Unknown validity (i.e. no value assigned) */
  | "q" /** Undefined validity. ‘-’ and ‘q’ may safely be treated as the same value for most purposes */
  | "n" /** The key is not valid */
  | "m" /** The key is marginal valid. */
  | "f" /** The key is fully valid */
  | "u" /** The key is ultimately valid. This often means that the secret key is available, but any key may be marked as ultimately valid. */
  | "w" /** The key has a well known private part. */
  | "s"
  /** The key has special validity. This means that it might be self-signed and expected to be used in the STEED system.
   * If the validity information is given for a UID or UAT record, it describes the validity calculated based on this user ID. If given for a key record it describes the validity taken from the best rated user ID.
   *
   * For X.509 certificates a ‘u’ is used for a trusted root certificate (i.e. for the trust anchor) and an ‘f’ for all other valid certificates.
   *
   * In “sig” records, this field may have one of these values as first character:
   */
  | "!" /** Signature is good. */
  | "-" /** Signature is bad. */
  | "?" /** No public key to verify signature or public key is not usable. */
  | "%"; /**
Other error verifying a signature
More values may be added later. The field may also be empty if gpg has been invoked in a non-checking mode (–list-sigs) or in a fast checking mode. Since 2.2.7 ‘?’ will also be printed by the command –list-sigs if the key is not in the local keyring.
*/

export type GpgAlgorithm =
  | "RSA"
  | "RSA-E"
  | "RSA-S"
  | "ELG-E"
  | "DSA"
  | "ELG"
  | "ECDSA"
  | "ECDH"
  | "ECDSA"
  | "EdDSA";

export type GpgTrustLevel =
  | "o" /** Unknown */
  | "q" /** Undefined */
  | "n" /** Never */
  | "m" /** Marginal */
  | "f" /** Full */
  | "u" /** Ultimate */
  | "w" /** Well-known private part */
  | "s"; /** Special */

export type GpgCapabilities =
  | "e" /** Encrypt */
  | "s" /** Sign */
  | "c" /** Certify */
  | "a" /** Authentication */
  | "i" /** Import */
  | "l" /** List */
  | "d" /** Delete */
  | "k"; /** Generate */

export interface GpgSubkey {
  keyId: string;
  keyLength: number;
  capabilities: GpgCapabilities[];
  algorithm: GpgAlgorithm;
  creationDate: Date;
  expirationDate?: Date;
}

export interface GpgUid {
  uidHash: string;
  userId: string;
  validity: ListKeysValidity;
  origin: string;
}

export interface GpgPublicKey {
  /** Key fingerpring */
  keyId: string;
  /** Master key */
  publicKey: GpgSubkey;
  /** List of ids associated to this key */
  uids: GpgUid[];
  /** List of subkeys */
  subkeys: GpgSubkey[];
}
