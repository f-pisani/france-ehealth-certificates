import 'mocha';
import { expect } from 'chai';
import { Vaccination } from "../../lib";

describe('Vaccination certificate', () => {
    it('Vaccination constructor should throws error with malformed data', () => {
        expect(() => {
            new Vaccination("FR0000011E6D1E6DL101FRL0THEOULE SUR MER\u001dL1JEAN PAUL\u001dL231051962L3COVID-19\u001dL4J07BX03\u001dL5COMIRNATY PFIZER/BIONTECH\u001dL6COMIRNATY PFIZER/BIONTECH\u001dL71L82L901032021LACO\u001f32T2SI2RUMPDLBHAFSBDF2CUE7GI4NR5WC3NSBEU6AZ7QZJZCPMCTXTVIDZAKEYO7237SQ2ZPOCMZKG7U3Q2LIMPPVJMA7TQAAKC5DY");
        }).to.throw();
    });

    it('Verify signature for valid certificate should return true', () => {
        const vaccinationCertificate = new Vaccination("DC04FR0000011E6D1E6DL101FRL0THEOULE SUR MER\u001dL1JEAN PAUL\u001dL231051962L3COVID-19\u001dL4J07BX03\u001dL5COMIRNATY PFIZER/BIONTECH\u001dL6COMIRNATY PFIZER/BIONTECH\u001dL71L82L901032021LACO\u001f32T2SI2RUMPDLBHAFSBDF2CUE7GI4NR5WC3NSBEU6AZ7QZJZCPMCTXTVIDZAKEYO7237SQ2ZPOCMZKG7U3Q2LIMPPVJMA7TQAAKC5DY");
        const verifySignature = vaccinationCertificate.verifySignature("-----BEGIN PUBLIC KEY-----MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqY8NfM1igIiTvsTUNuedGDSh1uAB1w8cTNzNnZ4v4in3JAUU6N3AypjQx0QMnMSShJoPvac/w5L02grgf4TCPA==-----END PUBLIC KEY-----");
        expect(verifySignature).to.equal(true);
    });

    it('Verify signature with corrupted data should return false', () => {
        const vaccinationCertificate = new Vaccination("DC04FR0000011E6D1E6DL101FRL0THEOULE SUR MER\u001dL1PAUL\u001dL231051962L3COVID-19\u001dL4J07BX03\u001dL5COMIRNATY PFIZER/BIONTECH\u001dL6COMIRNATY PFIZER/BIONTECH\u001dL71L82L901032021LACO\u001f32T2SI2RUMPDLBHAFSBDF2CUE7GI4NR5WC3NSBEU6AZ7QZJZCPMCTXTVIDZAKEYO7237SQ2ZPOCMZKG7U3Q2LIMPPVJMA7TQAAKC5DY");
        const verifySignature = vaccinationCertificate.verifySignature("-----BEGIN PUBLIC KEY-----MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqY8NfM1igIiTvsTUNuedGDSh1uAB1w8cTNzNnZ4v4in3JAUU6N3AypjQx0QMnMSShJoPvac/w5L02grgf4TCPA==-----END PUBLIC KEY-----");
        expect(verifySignature).to.equal(false);
    });

    it('Verify signature should throws error with malformed public key', () => {
        expect(() => {
            const vaccinationCertificate = new Vaccination("DC04FR0000011E6D1E6DL101FRL0THEOULE SUR MER\u001dL1JEAN PAUL\u001dL231051962L3COVID-19\u001dL4J07BX03\u001dL5COMIRNATY PFIZER/BIONTECH\u001dL6COMIRNATY PFIZER/BIONTECH\u001dL71L82L901032021LACO\u001f32T2SI2RUMPDLBHAFSBDF2CUE7GI4NR5WC3NSBEU6AZ7QZJZCPMCTXTVIDZAKEYO7237SQ2ZPOCMZKG7U3Q2LIMPPVJMA7TQAAKC5DY");
            vaccinationCertificate.verifySignature("MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqY8NfM1igIiTvsTUNuedGDSh1uAB1w8cTNzNnZ4v4in3JAUU6N3AypjQx0QMnMSShJoPvac/w5L02grgf4TCPA==");
        }).to.throw();
    });

    it('Try verify signature should not throws with malformed public key', () => {
        expect(() => {
            const vaccinationCertificate = new Vaccination("DC04FR0000011E6D1E6DL101FRL0THEOULE SUR MER\u001dL1JEAN PAUL\u001dL231051962L3COVID-19\u001dL4J07BX03\u001dL5COMIRNATY PFIZER/BIONTECH\u001dL6COMIRNATY PFIZER/BIONTECH\u001dL71L82L901032021LACO\u001f32T2SI2RUMPDLBHAFSBDF2CUE7GI4NR5WC3NSBEU6AZ7QZJZCPMCTXTVIDZAKEYO7237SQ2ZPOCMZKG7U3Q2LIMPPVJMA7TQAAKC5DY");
            vaccinationCertificate.tryVerifySignature("MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqY8NfM1igIiTvsTUNuedGDSh1uAB1w8cTNzNnZ4v4in3JAUU6N3AypjQx0QMnMSShJoPvac/w5L02grgf4TCPA==");
        }).to.not.throw();
    });

    it('Vaccination certificate should parse fields', () => {
        const vaccinationCertificate = new Vaccination("DC04FR0000011E6D1E6DL101FRL0THEOULE SUR MER\u001dL1JEAN PAUL\u001dL231051962L3COVID-19\u001dL4J07BX03\u001dL5COMIRNATY PFIZER/BIONTECH\u001dL6COMIRNATY PFIZER/BIONTECH\u001dL71L82L901032021LACO\u001f32T2SI2RUMPDLBHAFSBDF2CUE7GI4NR5WC3NSBEU6AZ7QZJZCPMCTXTVIDZAKEYO7237SQ2ZPOCMZKG7U3Q2LIMPPVJMA7TQAAKC5DY");
        expect(vaccinationCertificate.dcVersion).to.equal('04');
        expect(vaccinationCertificate.dcAuthorityId).to.equal('FR00');
        expect(vaccinationCertificate.dcCertificateId).to.equal('0001');
        expect(vaccinationCertificate.dcDocumentDate).to.equal('4/3/2021');
        expect(vaccinationCertificate.dcDocumentSignatureDate).to.equal('4/3/2021');
        expect(vaccinationCertificate.dcDocumentTypeId).to.equal('L1');
        expect(vaccinationCertificate.dcDocumentPerimeterId).to.equal('01');
        expect(vaccinationCertificate.dcDocumentCountry).to.equal('FR');

        expect(vaccinationCertificate.lastname).to.equal('THEOULE SUR MER');
        expect(vaccinationCertificate.firstname).to.equal('JEAN PAUL');
        expect(vaccinationCertificate.birthdate).to.equal('31/05/1962');
        expect(vaccinationCertificate.disease).to.equal('COVID-19');
        expect(vaccinationCertificate.preventiveAgent).to.equal('J07BX03');
        expect(vaccinationCertificate.vaccine).to.equal('COMIRNATY PFIZER/BIONTECH');
        expect(vaccinationCertificate.vaccineMaker).to.equal('COMIRNATY PFIZER/BIONTECH');
        expect(vaccinationCertificate.nbDoseTaken).to.equal('1');
        expect(vaccinationCertificate.nbDoseExpected).to.equal('2');
        expect(vaccinationCertificate.lastDoseDate).to.equal('01/03/2021');
        expect(vaccinationCertificate.state).to.equal('CO');
    });
});