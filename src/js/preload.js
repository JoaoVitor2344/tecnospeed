const { contextBridge, ipcRenderer, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const opensslFolder = '../../openssl/bin/';
const opensslExe = process.platform === 'win32' ? 'openssl.exe' : 'openssl';
const opensslPath = path.resolve(__dirname, opensslFolder, opensslExe);

const userDownloadsPath = path.join(process.env.USERPROFILE, 'Downloads');

contextBridge.exposeInMainWorld('electronAPI', {
    redirect: (page) => ipcRenderer.send('redirect', page),
    opensslPFX: (arquivoPFXPath, nomeArquivo, password) => {
        return new Promise((resolve, reject) => {
            fs.readFile(arquivoPFXPath, (err, data) => {
                if (err) {
                    reject('Erro ao ler o arquivo PFX');
                    return;
                }

                const opensslCommand = `openssl pkcs12 -in ${arquivoPFXPath} -clcerts -nokeys -out ${userDownloadsPath}\\${nomeArquivo} -password pass:${password}`;

                const child = exec(opensslCommand, { cwd: path.dirname(opensslPath) }, (err, stdout, stderr) => {
                    if (err || stderr) {
                        if (stderr.includes('Mac verify error: invalid password?')) {
                            reject('Erro: Senha incorreta');
                        } else {
                            reject('Erro ao executar o comando OpenSSL');
                        }
                        return;
                    }

                    resolve(stdout);
                });

                setTimeout(() => {
                    child.kill(); 
                    reject('Tempo limite excedido'); 
                }, 5000); 
            });
        });
    },
    opensslCRTKEY: (arquivoCRTPath, arquivoKEYPath, nomeArquivo, password) => {
        return new Promise((resolve, reject) => {
            fs.readFile(arquivoCRTPath, (errCRT, data) => {
                if (errCRT) {
                    reject('Erro ao ler o arquivo CRT');
                    return;
                }

                fs.readFile(arquivoKEYPath, (errKEY, data) => {
                    if (errKEY) {
                        reject('Erro ao ler o arquivo KEY');
                        return;
                    }

                    const opensslCommand = `openssl pkcs12 -export -out ${userDownloadsPath}\\${nomeArquivo} -inkey ${arquivoKEYPath} -in ${arquivoCRTPath} -password pass:${password} -passin pass:${password}`;
    
                    const child = exec(opensslCommand, { cwd: path.dirname(opensslPath) }, (err, stdout, stderr) => {
                        if (err || stderr) {
                            if (stderr.includes('Mac verify error: invalid password?')) {
                                reject('Erro: Senha incorreta');
                            } else {
                                reject('Erro ao executar o comando OpenSSL');
                            }
                            return;
                        }
    
                        resolve(stdout);
                    });
    
                    setTimeout(() => {
                        child.kill(); 
                        reject('Tempo limite excedido'); 
                    }, 5000); 
                });
            });
        });
    },
    openPath: () => {
        exec('explorer.exe ' + userDownloadsPath);
    }
});
