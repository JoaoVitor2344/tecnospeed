const { contextBridge, ipcRenderer, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const opensslPath = path.resolve(__dirname, '/tecnospeed/openssl/bin/openssl.exe');
const userDownloadsPath = path.join(process.env.USERPROFILE, 'Downloads');

contextBridge.exposeInMainWorld('electronAPI', {
    redirect: (page) => ipcRenderer.send('redirect', page),
    openssl: (arquivoPFXPath, opensslArgs, nomeArquivo, password) => {
        return new Promise((resolve, reject) => {
            fs.readFile(arquivoPFXPath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                const opensslCommand = `openssl pkcs12 -in ${opensslArgs.join(' ')} -out ${userDownloadsPath}\\${nomeArquivo} -password pass:${password} -nodes`;

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

                setTimeout(() => {
                    child.kill(); 
                    reject(new Error('Tempo limite excedido')); 
                }, 5000); 
            });
        });
    },
    openPath: () => {
        exec('explorer.exe ' + userDownloadsPath);
    }
});
