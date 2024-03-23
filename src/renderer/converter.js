const { remote } = require('electron');
const fs = require('fs');

function convertPfxToCrtKey(pfxPath, pfxPassword, crtPath, keyPath) {
    const { exec } = remote.require('child_process');
    const opensslCommand = `openssl pkcs12 -in ${pfxPath} -passin pass:${pfxPassword} -out ${crtPath} -clcerts -nokeys && openssl pkcs12 -in ${pfxPath} -passin pass:${pfxPassword} -out ${keyPath} -nocerts -nodes`;

    exec(opensslCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao converter PFX para CRT e KEY: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Erro ao converter PFX para CRT e KEY: ${stderr}`);
            return;
        }
        console.log(`PFX convertido para CRT e KEY com sucesso: ${crtPath} ${keyPath}`);
    });
}

module.exports = convertPfxToCrtKey;

$(".btnCancel").click(function() {
    window.location.href = "index.html";
});

const progresso = document.querySelector(".barra div");
const input = document.querySelector("input")

function alterarProgresso() {
    if (input.value > 100) {
        input.value = 100;
    }
    progresso.style.width = input.value + "%";
    progressoNumero.textContent = input.value + "%";
}