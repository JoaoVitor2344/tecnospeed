function converterPFX(pfxPassword) {
    const fs = require('fs');
    const path = require('path');
    const openssl = require('openssl-nodejs');

    const pfxPath = path.join(__dirname, '..', 'certificado', 'certificado.pfx');

    const pemPath = path.join(__dirname, '..', 'certificado', 'certificado.pem');

    openssl('pkcs12', ['-in', pfxPath, '-out', pemPath, '-nodes', '-password', 'pass:' + pfxPassword], (err, buffer) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log('Certificado convertido com sucesso!');
    });
}

module.exports = converterPFX;