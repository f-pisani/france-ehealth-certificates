"use strict";

import { Certificate } from "./Certificate";

/**
 * Sanitary certificate
 */
export class Sanitary extends Certificate {
    private readonly _lastname: string = "";
    private readonly _firstname: string = "";
    private readonly _birthdate: string = "";
    private readonly _gender: string = "";
    private readonly _analysisCode: string = "";
    private readonly _analysisResult: string = "";
    private readonly _analysisDatetime: string = "";

    /**
     * @param {string} data Raw 2D-DOC data.
     */
    public constructor(data: string) {
        super(data);

        let bodyRegex = "^F0([A-Z\\s\\./-]{0,60})\u001d?"; // Firstname
        bodyRegex += "F1([A-Z\\s\\./-]{0,38})\u001d?"; // Lastname
        bodyRegex += "F2(\\d{8})\u001d?"; // Birthdate
        bodyRegex += "F3([M|F|U]{1})\u001d?"; // Gender (M: male; F: female; U: unknown)
        bodyRegex += "F4([A-Z\\s\\d\\./-]{3,7})\u001d?"; // Analysis code
        bodyRegex += "F5([P|N|I|X]{1})\u001d?"; // Analysis result (P: Positive; N: Negative; I: Undetermined; X: non-compliant sample)
        bodyRegex += "F6(\\d{12})\u001d?"; // Analysis datetime (DDMMYYYYHHmm)

        const bodyFields = this.body.match(new RegExp(bodyRegex, 'i'));
        if (bodyFields === null) {
            throw new Error("Malformed body, unable to parse data.");
        }

        this._lastname = bodyFields[1];
        this._firstname = bodyFields[2];
        this._birthdate = this.parseDDMMYYYYDate(bodyFields[3]);
        this._gender = bodyFields[4];
        this._analysisCode = bodyFields[5];
        this._analysisResult = bodyFields[6];
        this._analysisDatetime = this.parseDDMMYYYYHHmmDate(bodyFields[7]);
    }

    /**
     * @return {string} Patient last name.
     */
    get lastname(): string {
        return this._lastname;
    }

    /**
     * @return {string} Patient first name.
     */
    get firstname(): string {
        return this._firstname;
    }

    /**
     * @return {string} PPatient birth date.
     */
    get birthdate(): string {
        return this._birthdate;
    }

    /**
     * @return {string} Patient gender.
     */
    get gender(): string {
        return this._gender;
    }

    /**
     * @return {string} Analysis code.
     */
    get analysisCode(): string {
        return this._analysisCode;
    }

    /**
     * @return {string} Analysis result.
     */
    get analysisResult(): string {
        return this._analysisResult;
    }

    /**
     * @return {string} Analysis datetime.
     */
    get analysisDatetime(): string {
        return this._analysisDatetime;
    }
}
