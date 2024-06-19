import {
  GpgAlgorithm,
  GpgCapabilities,
  GpgPublicKey,
  GpgTrustLevel,
  ListKeysLineType,
  ListKeysValidity,
} from "./pgp.types";

export const parseListKeysOutput = (stdOut: string): GpgPublicKey[] => {
  const lines: ListKeysLine[] = stdOut.split("\n").map((line) => {
    const [
      lineType,
      validity,
      keyLength,
      algorithm,
      keyId,
      creationDate,
      expirationDate,
      field8,
      ownerTrust,
      userId,
      signatureClass,
      capabilities,
      issuerCertificateFingerprint,
      flagField,
      tokenSerialNumber,
      hashAlgorithm,
      curveName,
      complianceFlags,
      lastUpdated,
      origin,
      comment,
    ] = line.split(":").map((field) => (field === "" ? undefined : field));

    return {
      lineType: lineType as ListKeysLineType,
      validity: validity as ListKeysValidity,
      keyLength: keyLength ? parseInt(keyLength) : undefined,
      algorithm: algorithm as GpgAlgorithm,
      keyId,
      creationDate: creationDate
        ? new Date(parseInt(creationDate) * 1000)
        : undefined,
      expirationDate: expirationDate
        ? new Date(parseInt(expirationDate) * 1000)
        : undefined,
      certificateSerialNumber: lineType === "crt" ? field8 : undefined,
      uidHash:
        lineType && ["uid", "uat"].includes(lineType) ? field8 : undefined,
      trustSignatureInfo:
        lineType === "tru" ? (field8 as GpgTrustLevel) : undefined,
      ownerTrust: ownerTrust as GpgTrustLevel,
      userId,
      signatureClass,
      capabilities: capabilities as GpgCapabilities,
      issuerCertificateFingerprint,
      flagField,
      tokenSerialNumber,
      hashAlgorithm,
      curveName,
      complianceFlags: complianceFlags
        ? (parseInt(complianceFlags) as ListKeysLine["complianceFlags"])
        : undefined,
      lastUpdated: lastUpdated
        ? new Date(parseInt(lastUpdated) * 1000)
        : undefined,
      origin,
      comment,
    };
  });

  const keys: GpgPublicKey[] = [];
  let currentKey: GpgPublicKey;
  lines.forEach((line) => {
    if (line.lineType === "pub") {
      currentKey = {
        keyId: line.keyId!,
        publicKey: {
          keyId: line.keyId!,
          keyLength: line.keyLength!,
          capabilities: [line.capabilities!],
          algorithm: line.algorithm!,
          creationDate: line.creationDate!,
          expirationDate: line.expirationDate,
        },
        uids: [],
        subkeys: [],
      };
      keys.push(currentKey);
    } else if (currentKey) {
      if (line.lineType === "sub") {
        currentKey.subkeys.push({
          keyId: line.keyId!,
          keyLength: line.keyLength!,
          capabilities: [line.capabilities!],
          algorithm: line.algorithm!,
          creationDate: line.creationDate!,
          expirationDate: line.expirationDate,
        });
      } else if (["uid", "uat"].includes(line.lineType)) {
        currentKey.uids.push({
          uidHash: line.uidHash!,
          userId: line.userId!,
          validity: line.validity,
          origin: line.origin!,
        });
      }
    }
  });

  return keys;
};

/**
 * All types of `--list-keys --with-colons` entries
 * https://github.com/gpg/gnupg/blob/master/doc/DETAILS
 */
interface ListKeysLine {
  /**
   * Field 1.
   * Tyoe of record.
   * - pub: Public key
   * - crt: X.509 certificate
   * - crs: X.509 certificate and private key available
   * - sub: Subkey (secondary key)
   * - sec: Secret key
   * - ssb: Secret subkey (secondary key)
   * - uid: User id
   * - uat: User attribute (same as user id except for field 10).
   * - sig: Signature
   * - rev: Revocation signature
   * - rvs: Revocation signature (standalone) [since 2.2.9]
   * - fpr: Fingerprint (fingerprint is in field 10)
   * - fp2: SHA-256 fingerprint (fingerprint is in field 10)
   * - pkd: Public key data [*]
   * - grp: Keygrip
   * - rvk: Revocation key
   * - tfs: TOFU statistics [*]
   * - tru: Trust database information [*]
   * - spk: Signature subpacket [*]
   * - cfg: Configuration data [*]
   */
  lineType: ListKeysLineType;
  /**
   * Field 2.
   * This is a letter describing the computed validity of a key. Currently this
   * is a single letter, but be prepared that additional information may follow
   * in some future versions. Note that GnuPG < 2.1 does not set this field for
   * secret key listings.
   *
   * - r: The key has been revoked
   * - e: The key has expired
   * - -: Unknown validity (i.e. no value assigned)
   * - q: Undefined validity. ‘-’ and ‘q’ may safely be treated as the same value for most purposes
   * - n: The key is not valid
   * - m: The key is marginal valid.
   * - f: The key is fully valid
   * - u: The key is ultimately valid. This often means that the secret key is available, but any key may be marked as ultimately valid.
   * - w: The key has a well known private part.
   * - s: The key has special validity. This means that it might be
   *      self-signed and expected to be used in the STEED system.
   *      If the validity information is given for a UID or UAT record, it
   *      describes the validity calculated based on this user ID. If given
   *      for a key record it describes the validity taken from the best rated
   *      user ID.
   *
   *      For X.509 certificates a ‘u’ is used for a trusted root certificate
   *      (i.e. for the trust anchor) and an ‘f’ for all other valid certificates.
   *
   *      In “sig” records, this field may have one of these values as first character:
   * - !: Signature is good.
   * - -: Signature is bad.
   * - ?: No public key to verify signature or public key is not usable.
   * - %: Other error verifying a signature
   *      More values may be added later. The field may also be empty if
   *      gpg has been invoked in a non-checking mode (–list-sigs) or in a
   *      fast checking mode. Since 2.2.7 ‘?’ will also be printed by the
   *      command –list-sigs if the key is not in the local keyring.
   */
  validity: ListKeysValidity;
  /**
   * Field 3.
   * Key length in bits.
   */
  keyLength?: number;
  /**
   * Field 4.
   * The values here are those from the OpenPGP specs or if they are greater
   * than 255 the algorithm ids as used by Libgcrypt.
   */
  algorithm?: GpgAlgorithm;
  /**
   * Field 5.
   *
   * This is the 64 bit keyid as specified by OpenPGP and the last 64 bit of
   * the SHA-1 fingerprint of an X.509 certificate.
   */
  keyId?: string;
  /**
   * Field 6.
   * The creation date of the key is given in UTC. For UID and UAT records,
   * this is used for the self-signature date. Note that the date is usually
   * printed in seconds since epoch, however, we are migrating to an ISO 8601
   * format (e.g. “19660205T091500”). This is currently only relevant for X.509.
   * A simple way to detect the new format is to scan for the ‘T’. Note that
   * old versions of gpg without using the --fixed-list-mode option used a
   * “yyyy-mm-tt” format.
   */
  creationDate?: Date;
  /**
   * Field 7.
   * Key or UID/UAT expiration date or empty if it does not expire.
   */
  expirationDate?: Date;
  /**
   * X.509 certificate serial number.
   * Field 8, Only for `crt` records
   */
  certificateSerialNumber?: string;
  /**
   * Hash of the user ID contents used to represent that exact user ID.
   * Field 8, For UID and UAT records
   */
  uidHash?: string;
  /**
   * For trust signatures, this is the trust depth separated by the trust value
   * by a space.
   * Field 8, Only for `tru` records
   */
  trustSignatureInfo?: GpgTrustLevel;
  /**
   * Field 9.
   * This is only used on primary keys. This is a single letter, but be
   * prepared that additional information may follow in future versions. For
   * trust signatures with a regular expression, this is the regular expression
   * value, quoted as in field 10.
   */
  ownerTrust?: GpgTrustLevel;
  /**
   * Field 10.
   * The value is quoted like a C string to avoid control characters (the colon
   * is quoted \x3a). For a “pub” record this field is not used on
   * –fixed-list-mode. A “uat” record puts the attribute subpacket count here, a
   * space, and then the total attribute subpacket size. In gpgsm the issuer
   * name comes here. The FPR and FP2 records store the fingerprints here. The
   * fingerprint of a revocation key is also stored here. A “grp” records puts
   * the keygrip here; for combined algorithms the keygrips are delimited by
   * comma.
   */
  userId?: string;
  /**
   * Field 11.
   * Signature class as per RFC-4880. This is a 2 digit hexnumber followed by
   * either the letter ‘x’ for an exportable signature or the letter ‘l’ for a
   * local-only signature. The class byte of an revocation key is also given
   * here, by a 2 digit hexnumber and optionally followed by the letter ‘s’ for
   * the “sensitive” flag. This field is not used for X.509.
   *
   * “rev” and “rvs” may be followed by a comma and a 2 digit hexnumber with
   * the revocation reason.
   */
  signatureClass?: string;
  /**
   * Field 12.
   * A key may have any combination of them in any order. In addition to these
   * letters, the primary key has uppercase versions of the letters to denote
   * the usable capabilities of the entire key, and a potential letter ‘D’ to
   * indicate a disabled key.
   */
  capabilities?: GpgCapabilities;
  /**
   * Field 13.
   * Issuer certificate fingerprint or other info
   * Used in FPR records for S/MIME keys to store the fingerprint of the issuer
   * certificate. This is useful to build the certificate path based on
   * certificates stored in the local key database it is only filled if the
   * issuer certificate is available. The root has been reached if this is the
   * same string as the fingerprint. The advantage of using this value is
   * that it is guaranteed to have been built by the same lookup algorithm as
   * gpgsm uses.
   *
   * For “uid” records this field lists the preferences in the same way gpg’s –edit-key menu does.
   *
   * For “sig”, “rev” and “rvs” records, this is the fingerprint of the key that
   * issued the signature. Note that this may only be filled if the signature
   * verified correctly. Note also that for various technical reasons, this
   * fingerprint is only available if –no-sig-cache is used. Since 2.2.7 this
   * field will also be set if the key is missing but the signature carries
   * an issuer fingerprint as meta data.
   */
  issuerCertificateFingerprint?: string;
  /**
   * Field 14.
   * Flag field used in the –edit-key menu outputs
   */
  flagField?: string;
  /**
   * Field 15.
   * Used in sec/ssb to print the serial number of a token (internal protect
   * mode 1002) or a ‘#’ if that key is a simple stub (internal protect mode
   * 1001). If the option –with-secret is used and a secret key is available
   * for the public key, a ‘+’ indicates this.
   */
  tokenSerialNumber?: string;
  /**
   * Field 16.
   * For sig records, this is the used hash algorithm. For example: 2 = SHA-1, 8 = SHA-256.
   */
  hashAlgorithm?: string;
  /**
   * Field 17.
   * For pub, sub, sec, ssb, crt, and crs records this field is used for the
   * ECC curve name. For combined algorithms the first and the second algorithm
   * name, delimited by an underscore are put here.
   */
  curveName?: string;
  /**
   * Field 18.
   * Space separated list of asserted compliance modes and screening result for this key.
   *
   * Valid values are:
   * - 8 The key is compliant with RFC4880bis
   * - 23 The key is compliant with compliance mode “de-vs”.
   * - 6001 Screening hit on the ROCA vulnerability.
   */
  complianceFlags?: 8 | 23 | 6001;
  /**
   * Field 19.
   * The timestamp of the last update of a key or user ID. The update time of a
   * key is defined a lookup of the key via its unique identifier
   * (fingerprint); the field is empty if not known. The update time of a user
   * ID is defined by a lookup of the key using a trusted mapping from mail
   * address to key.
   */
  lastUpdated?: Date;
  /**
   * Field 20.
   * The origin of the key or the user ID. This is an integer optionally
   * followed by a space and an URL. This goes along with the previous field.
   * The URL is quoted in C style.
   */
  origin?: string;
  /**
   * Field 21.
   * This is currently only used in “rev” and “rvs” records to carry the the
   * comment field of the recocation reason. The value is quoted in C style.
   */
  comment?: string;
}
