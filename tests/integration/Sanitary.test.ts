import 'mocha';
import { expect } from 'chai';
import { Sanitary } from "../../lib";

describe('Sanitary certificate', () => {
    it('Sanitary constructor should throws error with malformed data', () => {
        expect(() => {
            new Sanitary("FR00000113371337B201FRF0CORRINE\u001dF1BERTHIER\u001dF206121965F3FF4000\u001dF5XF6200620131200\u001fWZR5Y3AIRAFBIMKWLHSYX4BXNMELEVA3AXVL5IKZDX444F3A44VWXY2FKEWS4JUEOWLTSZ2MSMVW3NZ3LWO5FZKNLKVOMQT37LHV4II");
        }).to.throw();
    });

    it('Verify signature for valid certificate should return true', () => {
        const sanitaryCertificate = new Sanitary("DC04FR00000113371337B201FRF0CORRINE\u001dF1BERTHIER\u001dF206121965F3FF4000\u001dF5XF6200620131200\u001fWZR5Y3AIRAFBIMKWLHSYX4BXNMELEVA3AXVL5IKZDX444F3A44VWXY2FKEWS4JUEOWLTSZ2MSMVW3NZ3LWO5FZKNLKVOMQT37LHV4II");
        const verifySignature = sanitaryCertificate.verifySignature("-----BEGIN PUBLIC KEY-----MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqY8NfM1igIiTvsTUNuedGDSh1uAB1w8cTNzNnZ4v4in3JAUU6N3AypjQx0QMnMSShJoPvac/w5L02grgf4TCPA==-----END PUBLIC KEY-----");
        expect(verifySignature).to.equal(true);
    });

    it('Verify signature with corrupted data should return false', () => {
        const sanitaryCertificate = new Sanitary("DC04FR00000113371337B201FRF0CORRINE\u001dF1DUPOND\u001dF206121965F3FF4000\u001dF5XF6200620131200\u001fWZR5Y3AIRAFBIMKWLHSYX4BXNMELEVA3AXVL5IKZDX444F3A44VWXY2FKEWS4JUEOWLTSZ2MSMVW3NZ3LWO5FZKNLKVOMQT37LHV4II");
        const verifySignature = sanitaryCertificate.verifySignature("-----BEGIN PUBLIC KEY-----MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqY8NfM1igIiTvsTUNuedGDSh1uAB1w8cTNzNnZ4v4in3JAUU6N3AypjQx0QMnMSShJoPvac/w5L02grgf4TCPA==-----END PUBLIC KEY-----");
        expect(verifySignature).to.equal(false);
    });

    it('Verify signature should throws error with malformed public key', () => {
        expect(() => {
            const sanitaryCertificate = new Sanitary("DC04FR00000113371337B201FRF0CORRINE\u001dF1BERTHIER\u001dF206121965F3FF4000\u001dF5XF6200620131200\u001fWZR5Y3AIRAFBIMKWLHSYX4BXNMELEVA3AXVL5IKZDX444F3A44VWXY2FKEWS4JUEOWLTSZ2MSMVW3NZ3LWO5FZKNLKVOMQT37LHV4II");
            sanitaryCertificate.verifySignature("MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqY8NfM1igIiTvsTUNuedGDSh1uAB1w8cTNzNnZ4v4in3JAUU6N3AypjQx0QMnMSShJoPvac/w5L02grgf4TCPA==");
        }).to.throw();
    });

    it('Try verify signature should not throws with malformed public key', () => {
        expect(() => {
            const sanitaryCertificate = new Sanitary("DC04FR00000113371337B201FRF0CORRINE\u001dF1BERTHIER\u001dF206121965F3FF4000\u001dF5XF6200620131200\u001fWZR5Y3AIRAFBIMKWLHSYX4BXNMELEVA3AXVL5IKZDX444F3A44VWXY2FKEWS4JUEOWLTSZ2MSMVW3NZ3LWO5FZKNLKVOMQT37LHV4II");
            sanitaryCertificate.tryVerifySignature("MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqY8NfM1igIiTvsTUNuedGDSh1uAB1w8cTNzNnZ4v4in3JAUU6N3AypjQx0QMnMSShJoPvac/w5L02grgf4TCPA==");
        }).to.not.throw();
    });

    it('Sanitary certificate should parse fields', () => {
        const sanitaryCertificate = new Sanitary("DC04FR00000113371337B201FRF0CORRINE\u001dF1BERTHIER\u001dF206121965F3FF4000\u001dF5XF6200620131200\u001fWZR5Y3AIRAFBIMKWLHSYX4BXNMELEVA3AXVL5IKZDX444F3A44VWXY2FKEWS4JUEOWLTSZ2MSMVW3NZ3LWO5FZKNLKVOMQT37LHV4II");
        expect(sanitaryCertificate.dcVersion).to.equal('04');
        expect(sanitaryCertificate.dcAuthorityId).to.equal('FR00');
        expect(sanitaryCertificate.dcCertificateId).to.equal('0001');
        expect(sanitaryCertificate.dcDocumentDate).to.equal('4/5/2013');
        expect(sanitaryCertificate.dcDocumentSignatureDate).to.equal('4/5/2013');
        expect(sanitaryCertificate.dcDocumentTypeId).to.equal('B2');
        expect(sanitaryCertificate.dcDocumentPerimeterId).to.equal('01');
        expect(sanitaryCertificate.dcDocumentCountry).to.equal('FR');

        expect(sanitaryCertificate.lastname).to.equal('CORRINE');
        expect(sanitaryCertificate.firstname).to.equal('BERTHIER');
        expect(sanitaryCertificate.birthdate).to.equal('06/12/1965');
        expect(sanitaryCertificate.gender).to.equal('F');
        expect(sanitaryCertificate.analysisCode).to.equal('000');
        expect(sanitaryCertificate.analysisResult).to.equal('X');
        expect(sanitaryCertificate.analysisDatetime).to.equal('20/06/2013 12:00');
    });
});