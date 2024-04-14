const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const forge = require('node-forge');
const { exec } = require('child_process');

const opensslPath = path.resolve(__dirname, '/tecnospeed/openssl/bin/openssl.exe');

contextBridge.exposeInMainWorld('electronAPI', {
    redirect: (page) => ipcRenderer.send('redirect', page),
    openssl: (arquivoPFXPath, opensslArgs, password) => {
        return new Promise((resolve, reject) => {
            fs.readFile(arquivoPFXPath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                const p12Asn1 = forge.asn1.fromDer(data.toString('binary'));
                const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

                const opensslCommand = `openssl ${opensslArgs.join(' ')} -password pass:${password} -nodes`;

                const child = exec(opensslCommand, { cwd: path.dirname(opensslPath) }, (err, stdout, stderr) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (stderr) {
                        reject(stderr);
                        return;
                    }

                    resolve(stdout);
                });

                // Terminar o processo após um período de tempo
                setTimeout(() => {
                    child.kill(); // Interrompe o processo
                    reject(new Error('Tempo limite excedido')); // Rejeita a Promise com um erro
                }, 5000); // Tempo em milissegundos
            });
        });
    }
});
