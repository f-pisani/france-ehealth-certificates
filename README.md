**[DEPRECATED] This library was designed for the first version of the French digital pass, France use European eHealth format since mid July 2021. Check [https://github.com/ehn-dcc-development](https://github.com/ehn-dcc-development) for more informations.**

# france-ehealth-certificates
This library provides a quick and easy interface to verify COVID-19 certificates generated in France.

Your bugfix and pull request contribution are always welcomed.

# Installation and Usage
You can install france-ehealth-certificates using npm:
```shell
$ npm install france-ehealth-certificates
```

## Vaccination certificates
**Signature verification**
```javascript
const fhc = require('france-ehealth-certificaces');

let vaccination = new fhc.Vaccination("DC04FR0000011E6D1E6DL101FRL0THEOULE SUR MER\u001dL1JEAN PAUL\u001dL231051962L3COVID-19\u001dL4J07BX03\u001dL5COMIRNATY PFIZER/BIONTECH\u001dL6COMIRNATY PFIZER/BIONTECH\u001dL71L82L901032021LACO\u001f32T2SI2RUMPDLBHAFSBDF2CUE7GI4NR5WC3NSBEU6AZ7QZJZCPMCTXTVIDZAKEYO7237SQ2ZPOCMZKG7U3Q2LIMPPVJMA7TQAAKC5DY");
let isVerified = false;
// This method will throw an error if you use an invalid key.
isVerified = vaccination.verifySignature("-----BEGIN PUBLIC KEY-----MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqY8NfM1igIiTvsTUNuedGDSh1uAB1w8cTNzNnZ4v4in3JAUU6N3AypjQx0QMnMSShJoPvac/w5L02grgf4TCPA==-----END PUBLIC KEY-----");
// This method will always return a boolean without throwing.
isVerified = vaccination.tryVerifySignature("-----BEGIN PUBLIC KEY-----MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqY8NfM1igIiTvsTUNuedGDSh1uAB1w8cTNzNnZ4v4in3JAUU6N3AypjQx0QMnMSShJoPvac/w5L02grgf4TCPA==-----END PUBLIC KEY-----");
```
2D-DOC is signed using ECDSA keys.

**Read certificate fields**

Field id                   | Field content                   | Object property | Example
---------------------------|---------------------------------|-----------------|----------------
L0                         | Patient last name               | lastname        | THEOULE SUR MER
L1                         | Patient first name              | firstname       | JEAN PAUL
L2                         | Patient birth date              | birthdate       | 31/05/1962
L3                         | Disease name                    | disease         | COVID-19
L4                         | Preventive agent                | preventiveAgent | J07BX03
L5                         | Vaccine name                    | vaccine         | COMIRNATY PFIZER/BIONTECH
L6                         | Vaccine maker name              | vaccineMaker    | COMIRNATY PFIZER/BIONTECH
L7                         | Current number of injections    | nbDoseTaken     | 1
L8                         | Required number of injections   | nbDoseExpected  | 2
L9                         | Last date of injection          | lastDoseDate    | 01/03/2021
[LA](#vaccination-la-enum) | Current vaccination cycle state | state           | CO

<a name="vaccination-la-enum"></a>**LA** field values :
* CO : Incomplete vaccination cycle
* TE : Full vaccination cycle

Data used in this example is a sample available on [ANTS website][1].

## Sanitary certificates
**Signature verification**
```javascript
const fhc = require('france-ehealth-certificaces');

let sanitary = new fhc.Sanitary("DC04FR00000113371337B201FRF0CORRINE\u001dF1BERTHIER\u001dF206121965F3FF4000\u001dF5XF6200620131200\u001fWZR5Y3AIRAFBIMKWLHSYX4BXNMELEVA3AXVL5IKZDX444F3A44VWXY2FKEWS4JUEOWLTSZ2MSMVW3NZ3LWO5FZKNLKVOMQT37LHV4II");
let isVerified = false;
// This method will throw an error if you use an invalid key.
isVerified = sanitary.verifySignature("-----BEGIN PUBLIC KEY-----MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqY8NfM1igIiTvsTUNuedGDSh1uAB1w8cTNzNnZ4v4in3JAUU6N3AypjQx0QMnMSShJoPvac/w5L02grgf4TCPA==-----END PUBLIC KEY-----");
// This method will always return a boolean without throwing.
isVerified = sanitary.tryVerifySignature("-----BEGIN PUBLIC KEY-----MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqY8NfM1igIiTvsTUNuedGDSh1uAB1w8cTNzNnZ4v4in3JAUU6N3AypjQx0QMnMSShJoPvac/w5L02grgf4TCPA==-----END PUBLIC KEY-----");
```
2D-DOC is signed using ECDSA keys.

**Read certificate fields**

Field id                  | Field content                   | Object property  | Example
--------------------------|---------------------------------|------------------|----------------
F0                        | Patient first name              | firstname        | CORRINE
F1                        | Patient last name               | lastname         | BERTHIER
F2                        | Patient birth date              | birthdate        | 31/05/1962
[F3](#sanitary-f3-enum)   | Patient gender                  | gender           | F
[F4](#sanitary-f4-source) | Analysis code                   | analysisCode     | 000
[F5](#sanitary-f5-enum)   | Analysis result                 | analysisResult   | X
F6                        | Analysis datetime               | analysisDatetime | 20/06/2013 12:00

<a name="sanitary-f3-enum"></a>**F3** field values :
* M : Male
* F : Female
* U : Unknown

<a name="sanitary-f4-source"></a>**F4** codes are available on [LOINC website][2].

<a name="sanitary-f5-enum"></a>**F5** field values :
* P : Positive
* N : Negative
* I : Undetermined
* X : Non-compliant sample

Data used in this example is a sample available on [ANTS website][1].

## 2D-DOC Header fields

Field                                   | Object property         | Example
----------------------------------------|-------------------------|---------
2D-DOC implementation version           | dcVersion               | 04
Certification authority id              | dcAuthorityId           | FR00
Certificate id                          | dcCertificateId         | 0001
Document issue date                     | dcDocumentDate          | 4/5/2013
Signature creation date                 | dcDocumentSignatureDate | 4/5/2013
Document type id                        | dcDocumentTypeId        | B2
Document perimeter id                   | dcDocumentPerimeterId   | 01
Document country ([ISO-3166-Alpha2][3]) | dcDocumentCountry       | FR

## 2D-DOC Message

Field     | Object property | Value
----------|-----------------|---------
Message   | message         | Header + Body - Signature
Header    | header          | Header
Body      | body            | Body
Signature | signature       | Signature

Signature is the raw value from the 2D-DOC. This value is still base32 ([RFC 4648][4]) encoded.

# F.A.Q
## Does this library validate the French regulations for events access ?
No. This library only provides features to read and verify a COVID-19 certificates (Vaccination & Sanitary (RT-PCR)).

You need to implement [French regulations][5] on your side.

## Do it work with European certificates ?
No. European certificates use another format of certificates.

You can find more information [here][6].

## Where can I find the public keys for signature verification?
Almost a challenge, but you can find them inside ["TousAntiCovid" app source code][7].

# Links
- [ANTS 2D-DOC documentation][1]
- [LOINC website (analysis code)][2]
- [ISO 3166 COUNTRY CODES][3]
- [Base32 RFC 4648][4]
- [Pass sanitaire][5]
- [European eHealth network][6]
- [TousAntiCovid GitLab][7]

[1]: https://ants.gouv.fr/Les-solutions/2D-Doc
[2]: https://loinc.org/
[3]: https://www.iso.org/iso-3166-country-codes.html
[4]: https://datatracker.ietf.org/doc/html/rfc4648
[5]: https://www.gouvernement.fr/info-coronavirus/pass-sanitaire
[6]: https://github.com/ehn-dcc-development
[7]: https://gitlab.inria.fr/stopcovid19/stopcovid-android/-/blob/master/stopcovid/src/main/assets/Config/config.json

# Licence
> MIT License
>
> Copyright (c) 2021 Florian Pisani
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
