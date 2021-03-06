"use strict";

import { Certificate } from "./Certificate";

export class Vaccination extends Certificate {
    private readonly _lastname: string = "";
    private readonly _firstname: string = "";
    private readonly _birthdate: string = "";
    private readonly _disease: string = "";
    private readonly _preventiveAgent: string = "";
    private readonly _vaccine: string = "";
    private readonly _vaccineMaker: string = "";
    private readonly _nbDoseTaken: string = "";
    private readonly _nbDoseExpected: string = "";
    private readonly _lastDoseDate: string = "";
    private readonly _state: string = "";

    /**
     * @param {string} data Raw 2D-DOC data.
     */
    public constructor(data: string) {
        super(data);

        let bodyRegex = "^L0([A-Z\\s\\./-]{0,80})\u001d?"; // Firstname
        bodyRegex += "L1([A-Z\\s\\./-]{0,80})\u001d?"; // Lastname
        bodyRegex += "L2(\\d{8})\u001d?"; // Birthdate (lunar date is allowed, NOT handled actually)
        bodyRegex += "L3([A-Z\\s\\d\\./-]{0,30})\u001d?"; // Disease
        bodyRegex += "L4([A-Z\\s\\d\\./-]{5,15})\u001d?"; // Preventive agent
        bodyRegex += "L5([A-Z\\s\\d\\./-]{5,30})\u001d?"; // Vaccine
        bodyRegex += "L6([A-Z\\s\\d\\./-]{5,30})\u001d?"; // Vaccine maker
        bodyRegex += "L7(\\d{1})\u001d?"; // Sum of injections
        bodyRegex += "L8(\\d{1})\u001d?"; // Required sum of injections for a valid vaccine cycle
        bodyRegex += "L9(\\d{8})\u001d?"; // Last injection date
        bodyRegex += "LA([A-Z]{2})\u001d?"; // Current vaccine cycle state

        const bodyFields = this.body.match(new RegExp(bodyRegex, 'i'));
        if (bodyFields === null) {
            throw new Error("Malformed body, unable to parse data.");
        }

        this._lastname = bodyFields[1];
        this._firstname = bodyFields[2];
        this._birthdate = this.parseDDMMYYYYDate(bodyFields[3]);
        this._disease = bodyFields[4];
        this._preventiveAgent = bodyFields[5];
        this._vaccine = bodyFields[6];
        this._vaccineMaker = bodyFields[7];
        this._nbDoseTaken = bodyFields[8];
        this._nbDoseExpected = bodyFields[9];
        this._lastDoseDate = this.parseDDMMYYYYDate(bodyFields[10]);
        this._state = bodyFields[11];
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
     * @return {string} Patient birth date.
     */
    get birthdate(): string {
        return this._birthdate;
    }

    /**
     * @return {string} Disease name.
     */
    get disease(): string {
        return this._disease;
    }

    /**
     * @return {string} Preventive agent.
     */
    get preventiveAgent(): string {
        return this._preventiveAgent;
    }

    /**
     * @return {string} Vaccine name.
     */
    get vaccine(): string {
        return this._vaccine;
    }

    /**
     * @return {string} Vaccine maker name.
     */
    get vaccineMaker(): string {
        return this._vaccineMaker;
    }

    /**
     * @return {string} Current number of injections.
     */
    get nbDoseTaken(): string {
        return this._nbDoseTaken;
    }

    /**
     * @return {string} Required number of injections.
     */
    get nbDoseExpected(): string {
        return this._nbDoseExpected;
    }

    /**
     * @return {string} Last date of injection.
     */
    get lastDoseDate(): string {
        return this._lastDoseDate;
    }

    /**
     * @return {string} Current vaccination cycle state.
     */
    get state(): string {
        return this._state;
    }
}
