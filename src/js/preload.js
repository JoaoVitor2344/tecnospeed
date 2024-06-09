const { contextBridge, ipcRenderer, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const forge = require('node-forge');
const { exec } = require('child_process');

const userDownloadsPath = path.join(process.env.USERPROFILE, 'Downloads');

contextBridge.exposeInMainWorld('electronAPI', {
    redirect: (page) => ipcRenderer.send('redirect', page),

    opensslPFX: (arquivoPFXPath, nomeArquivo, password) => {
        return new Promise((resolve, reject) => {
            fs.readFile(arquivoPFXPath, (err, pfxData) => {
                if (err) {
                    reject('Erro ao ler o arquivo PFX');
                    return;
                }

                try {
                    const p12Asn1 = forge.asn1.fromDer(pfxData.toString('binary'));
                    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

                    let certPem = '';
                    let keyPem = '';

                    p12.safeContents.forEach(safeContents => {
                        safeContents.safeBags.forEach(safeBag => {
                            if (safeBag.cert) {
                                certPem += forge.pki.certificateToPem(safeBag.cert);
                            } else if (safeBag.key) {
                                keyPem += forge.pki.privateKeyToPem(safeBag.key);
                            }
                        });
                    });

                    const certPath = path.join(userDownloadsPath, `${nomeArquivo}.crt`);
                    const keyPath = path.join(userDownloadsPath, `${nomeArquivo}.key`);

                    fs.writeFile(certPath, certPem, (err) => {
                        if (err) {
                            reject('Erro ao escrever o arquivo CRT');
                            return;
                        }

                        fs.writeFile(keyPath, keyPem, (err) => {
                            if (err) {
                                reject('Erro ao escrever o arquivo KEY');
                                return;
                            }
                            resolve('Certificado e chave privada convertidos com sucesso');
                        });
                    });
                } catch (err) {
                    if (err.message.includes('Invalid password?')) {
                        reject('Erro: Senha incorreta');
                    } else {
                        reject(`Erro ao converter PFX: ${err.message}`);
                    }
                }
            });
        });
    },

    opensslCRTKEY: (arquivoCRTPath, arquivoKEYPath, nomeArquivo, password) => {
        return new Promise((resolve, reject) => {
            fs.readFile(arquivoCRTPath, (errCRT, crtData) => {
                if (errCRT) {
                    reject('Erro ao ler o arquivo CRT');
                    return;
                }

                fs.readFile(arquivoKEYPath, (errKEY, keyData) => {
                    if (errKEY) {
                        reject('Erro ao ler o arquivo KEY');
                        return;
                    }

                    try {
                        const cert = forge.pki.certificateFromPem(crtData.toString());

                        let key;
                        const keyPem = keyData.toString();
                        if (keyPem.includes('PRIVATE KEY')) {
                            key = forge.pki.privateKeyFromPem(keyPem);
                        } else if (keyPem.includes('ENCRYPTED PRIVATE KEY')) {
                            key = forge.pki.decryptRsaPrivateKey(keyPem, password);
                        } else {
                            reject('Formato de chave privada não suportado');
                            return;
                        }

                        const p12Asn1 = forge.pkcs12.toPkcs12Asn1(key, [cert], password);
                        const p12Der = forge.asn1.toDer(p12Asn1).getBytes();

                        const outputPath = path.join(userDownloadsPath, `${nomeArquivo}.pfx`);
                        fs.writeFile(outputPath, p12Der, 'binary', (err) => {
                            if (err) {
                                reject('Erro ao escrever o arquivo PFX');
                                return;
                            }
                            resolve('Certificado e chave exportados com sucesso');
                        });
                    } catch (err) {
                        reject(`Erro ao converter CRT/KEY: ${err.message}`);
                    }
                });
            });
        });
    },

    openPath: () => {
        exec(`explorer.exe "${userDownloadsPath}"`);
    }
});
