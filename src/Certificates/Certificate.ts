"use strict";

import base32_decode = require('base32-decode');
import rs = require('jsrsasign');

/**
 * Abstract Certificate class.
 */
export abstract class Certificate {
    private readonly _data: string = "";
    private readonly _message: string = "";
    private readonly _header: string = "";
    private readonly _body: string = "";
    private readonly _signature: string = "";

    private readonly _dcVersion: string = "";
    private readonly _dcAuthorityId: string = "";
    private readonly _dcCertificateId: string = "";
    private readonly _dcDocumentDate: string = "";
    private readonly _dcDocumentSignatureDate: string = "";
    private readonly _dcDocumentTypeId: string = "";
    private readonly _dcDocumentPerimeterId: string = "";
    private readonly _dcDocumentCountry: string = "";

    /**
     * @protected
     * @param {string} data Raw 2D-DOC data.
     */
    protected constructor(data: string) {
        if (this.checkDataIsWellFormed(data) === false) {
            throw new Error("Malformed data, unable to split message and signature.");
        }

        const headers = this.parseHeaderFields(data);
        this._dcVersion = headers[1];
        this._dcAuthorityId = headers[2];
        this._dcCertificateId = headers[3];
        this._dcDocumentDate = this.parseHeaderDate(headers[4]);
        this._dcDocumentSignatureDate = this.parseHeaderDate(headers[5]);
        this._dcDocumentTypeId = headers[6];
        this._dcDocumentPerimeterId = headers[7];
        this._dcDocumentCountry = headers[8];

        const messageAndSignature = data.split("\u001f");
        if (messageAndSignature.length !== 2) {
            throw new Error("Malformed data, unable to split message and signature.");
        }
        this._message = messageAndSignature[0];
        this._signature = messageAndSignature[1];

        this._data = data;
        this._header = headers[0];
        this._body = this._message.slice(this._header.length);
    }

    /**
     * @private
     * @param {string} data Raw 2D-DOC data.
     * @return {boolean} True if provided data is a valid 2D-DOC format, false otherwise.
     */
    private checkDataIsWellFormed(data: string): boolean {
        const matches = data.match(/^DC[\d]{2}[A-Z\d]{4}[A-Z\d]{4}[A-F\d]{4}[A-F\d]{4}[A-Z\d]{2}[A-Z\d]{2}[A-Z]{2}(?:.+)\u001f([\w]+)$/i)

        if (matches === null) {
            return false;
        }

        return true;
    }

    /**
     * @private
     * @param {string} data Raw 2D-DOC data.
     * @return {string[]} Parsed header fields.
     */
    private parseHeaderFields(data: string): string[] {
        let headerRegex = "^DC([\\d]{2})"; // DC followed by version used
        headerRegex += "([A-Z\\d]{4})"; // Authority ID
        headerRegex += "([A-Z\\d]{4})"; // Authority certificate ID
        headerRegex += "([A-F\\d]{4})"; // Document issue date
        headerRegex += "([A-F\\d]{4})"; // Document signature date
        headerRegex += "([A-Z\\d]{2})"; // Document type ID
        headerRegex += "([A-Z\\d]{2})"; // Document perimeter ID
        headerRegex += "([A-Z]{2})"; // Document country (ISO-3166-Alpha2 format)

        const headerFields = data.match(new RegExp(headerRegex, 'i'));
        if (headerFields === null) {
            throw new Error("Malformed header, unable to parse data.");
        }

        return headerFields;
    }

    /**
     * Convert an hexadecimal number into a readable date.
     *
     * 2D-DOC header fields uses an hexadecimal value to store the number of days since 2000-01-01 to represent
     * a date.
     *
     * @protected
     * @param {string} hex An hexadecimal string.
     * @return {string} DD/MM/YYYY formatted string.
     */
    protected parseHeaderDate(hex: string): string {
        const nbDays = parseInt("0x" + hex);
        if (hex.length === 0 || nbDays === 0) {
            return hex;
        }

        const timestamp = (Date.parse("2000-01-01 00:00:00") / 1000) + (nbDays * 24 * 3600);
        const date = new Date(timestamp * 1000);

        return date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
    }

    /**
     * @protected
     * @param {string} date A DDMMYYYY formatted string.
     * @return {string} DD/MM/YYYY formatted string.
     */
    protected parseDDMMYYYYDate(date: string): string {
        if (date.length === 0 || date.length !== 8) {
            return date;
        }

        return date.substring(0, 2) + "/" + date.substring(2, 4) + "/" + date.substring(4, 8);
    }

    /**
     * @protected
     * @param {string} date A DDMMYYYYHHmm formatted string.
     * @return {string} DD/MM/YYYY HH:mm formatted string.
     */
    protected parseDDMMYYYYHHmmDate(date: string): string {
        if (date.length === 0 || date.length !== 12) {
            return date;
        }

        return date.substring(0, 2) + "/" + date.substring(2, 4) + "/" + date.substring(4, 8) +
            " " + date.substring(8, 10) + ":" + date.substring(10, 12);
    }

    /**
     * Verify the certificate signature using the provided public key.
     * This method will never throws even if an invalid public key is provided.
     *
     * @param {string} publicKey A valid public key starting with "-----BEGIN PUBLIC KEY..." or "-----BEGIN X509 CERTIFICATE...".
     * @return {boolean} True if the signature is verified using the provided certificate, false otherwise.
     */
    public tryVerifySignature(publicKey: string): boolean {
        try {
            return this.verifySignature(publicKey);
        } catch (err) {
            return false;
        }

        return false;
    }

    /**
     * Verify the certificate signature using the provided public key.
     *
     * @param {string} publicKey A valid public key starting with "-----BEGIN PUBLIC KEY..." or "-----BEGIN X509 CERTIFICATE...".
     * @return {boolean} True if the signature is verified using the provided certificate, false otherwise.
     *
     * @throws Error If an invalid public key is provided
     */
    public verifySignature(publicKey: string): boolean {
        const pub = rs.KEYUTIL.getKey(rs.KEYUTIL.getKey(publicKey));
        const verify = new rs.KJUR.crypto.Signature({alg: "SHA256withECDSA"});
        verify.init(pub);
        verify.updateString(this._message);

        return verify.verify(this.getAsn1SignatureFromBase32Signature(this._signature));
    }

    /**
     * Convert a certificate concatenated ECDSA signature (R & S) to an ASN.1 signature.
     *
     * @private
     * @param {string} signature Base32 encoded signature to convert.
     * @return {string} Hexadecimal string of ASN.1 encoded ECDSA signature value
     */
    private getAsn1SignatureFromBase32Signature(signature: string): string {
        return rs.KJUR.crypto.ECDSA.concatSigToASN1Sig(
            rs.ArrayBuffertohex(base32_decode(signature, 'RFC4648'))
        );
    }

    /**
     * @return {string} Raw 2D-DOC data.
     */
    get data(): string {
        return this._data;
    }

    /**
     * @return {string} Raw 2D-DOC data without the signature.
     */
    get message(): string {
        return this._message;
    }

    /**
     * @return {string} Raw 2D-DOC header.
     */
    get header(): string {
        return this._header;
    }

    /**
     * @return {string} Raw 2D-DOC body.
     */
    get body(): string {
        return this._body;
    }

    /**
     * @return {string} Raw 2D-DOC signature, it's still base32 encoded.
     */
    get signature(): string {
        return this._signature;
    }

    /**
     * @return {string} 2D-DOC implementation version.
     */
    get dcVersion(): string {
        return this._dcVersion;
    }

    /**
     * @return {string} Certification authority id.
     */
    get dcAuthorityId(): string {
        return this._dcAuthorityId;
    }

    /**
     * @return {string} Certificate id.
     */
    get dcCertificateId(): string {
        return this._dcCertificateId;
    }

    /**
     * @return {string} Document issue date.
     */
    get dcDocumentDate(): string {
        return this._dcDocumentDate;
    }

    /**
     * @return {string} Signature creation date.
     */
    get dcDocumentSignatureDate(): string {
        return this._dcDocumentSignatureDate;
    }

    /**
     * @return {string} Document type id.
     */
    get dcDocumentTypeId(): string {
        return this._dcDocumentTypeId;
    }

    /**
     * @return {string} Document perimeter id.
     */
    get dcDocumentPerimeterId(): string {
        return this._dcDocumentPerimeterId;
    }

    /**
     * @return {string} Document country (ISO-3166-Alpha2).
     */
    get dcDocumentCountry(): string {
        return this._dcDocumentCountry;
    }
}
