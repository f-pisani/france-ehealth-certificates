"use strict";

import base32_decode = require('base32-decode');
import rs = require('jsrsasign');

export abstract class Certificate {
    private readonly _data: string = "";
    private readonly _message: string = "";
    private readonly _header: string = "";
    private readonly _body: string = "";
    private readonly _signature: string = "";

    private readonly _dcVersion: string = "";
    private readonly _authorityId: string = "";
    private readonly _authorityCertificateId: string = "";
    private readonly _documentDate: string = "";
    private readonly _documentSignatureDate: string = "";
    private readonly _documentTypeId: string = "";
    private readonly _documentPerimeterId: string = "";
    private readonly _documentCountry: string = "";

    protected constructor(data: string) {
        if (this.checkDataIsWellFormed(data) === false) {
            throw new Error("Malformed data, unable to split message and signature.");
        }

        const headers = this.parseHeaderFields(data);
        this._dcVersion = headers[1];
        this._authorityId = headers[2];
        this._authorityCertificateId = headers[3];
        this._documentDate = this.parseHeaderDate(headers[4]);
        this._documentSignatureDate = this.parseHeaderDate(headers[5]);
        this._documentTypeId = headers[6];
        this._documentPerimeterId = headers[7];
        this._documentCountry = headers[8];

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

    private checkDataIsWellFormed(data: string): boolean {
        const matches = data.match(/^DC[\d]{2}[A-Z\d]{4}[A-Z\d]{4}[A-F\d]{4}[A-F\d]{4}[A-Z\d]{2}[A-Z\d]{2}[A-Z]{2}(?:.+)\u001f([\w]+)$/i)

        if (matches === null) {
            return false;
        }

        return true;
    }

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

    protected parseHeaderDate(hex: string): string {
        const nbDays = parseInt("0x" + hex);
        if (hex.length === 0 || nbDays === 0) {
            return hex;
        }

        const timestamp = (Date.parse("2000-01-01 00:00:00") / 1000) + (nbDays * 24 * 3600);
        const date = new Date(timestamp * 1000);

        return date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
    }

    protected parseDDMMYYYYDate(date: string): string {
        if (date.length === 0 || date.length !== 8) {
            return date;
        }

        return date.substring(0, 2) + "/" + date.substring(2, 4) + "/" + date.substring(4, 8);
    }

    protected parseDDMMYYYYHHmmDate(date: string): string {
        if (date.length === 0 || date.length !== 12) {
            return date;
        }

        return date.substring(0, 2) + "/" + date.substring(2, 4) + "/" + date.substring(4, 8) +
            " " + date.substring(8, 10) + ":" + date.substring(10, 12);
    }

    public tryVerifySignature(publicKey: string): boolean {
        try {
            return this.verifySignature(publicKey);
        } catch (err) {
            return false;
        }

        return false;
    }

    public verifySignature(publicKey: string): boolean {
        const pub = rs.KEYUTIL.getKey(rs.KEYUTIL.getKey(publicKey));
        const verify = new rs.KJUR.crypto.Signature({alg: "SHA256withECDSA"});
        verify.init(pub);
        verify.updateString(this._message);
        return verify.verify(this.getAsn1SignatureFromBase32Signature(this._signature));
    }

    private getAsn1SignatureFromBase32Signature(signature: string): string {
        return rs.KJUR.crypto.ECDSA.concatSigToASN1Sig(
            rs.ArrayBuffertohex(base32_decode(signature, 'RFC4648'))
        );
    }

    get data(): string {
        return this._data;
    }

    get message(): string {
        return this._message;
    }

    get header(): string {
        return this._header;
    }

    get body(): string {
        return this._body;
    }

    get signature(): string {
        return this._signature;
    }

    get dcVersion(): string {
        return this._dcVersion;
    }

    get authorityId(): string {
        return this._authorityId;
    }

    get authorityCertificateId(): string {
        return this._authorityCertificateId;
    }

    get documentDate(): string {
        return this._documentDate;
    }

    get documentSignatureDate(): string {
        return this._documentSignatureDate;
    }

    get documentTypeId(): string {
        return this._documentTypeId;
    }

    get documentPerimeterId(): string {
        return this._documentPerimeterId;
    }

    get documentCountry(): string {
        return this._documentCountry;
    }
}
