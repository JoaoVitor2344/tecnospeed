$(".btnCancel").click(function() {
    window.location.href = "index.html";
});

const progresso = document.querySelector(".barra div");
const input = document.querySelector("input");
const progressoNumero = document.getElementById("progressoNumero");
const titulo = document.querySelector(".title");

// Inicializa o progresso em 0%
progresso.style.width = "0%";
progressoNumero.textContent = "0%";
titulo.textContent = "Convertendo...";

// Adiciona um evento de clique ao elemento de progresso
progresso.addEventListener("click", function() {
    // Verifica se o progresso atingiu 100%
    if (progresso.style.width === "100%") {
        // Chama a função para salvar os arquivos
        salvarArquivos();
    }
});

function alterarProgresso() {
    let valor = input.value.trim(); // Remove espaços em branco

    // Verifica se o valor não está vazio e é um número
    if (valor !== "" && !isNaN(valor)) {
        valor = parseInt(valor);

        // Limita o valor máximo a 100
        if (valor > 100) {
            valor = 100;
            input.value = 100; // Atualiza o valor exibido no input
        }

        progresso.style.width = valor + "%";
        progressoNumero.textContent = valor + "%";

        // Altera o texto para "Convertido" quando atingir 100%
        if (valor === 100) {
            titulo.textContent = "Convertido";
            // Chama a função para salvar os arquivos quando atingir 100%
            salvarArquivos();
        } else {
            titulo.textContent = "Convertendo...";
        }
    } else {
        // Se o valor estiver vazio ou não for um número, redefine o progresso para 0%
        progresso.style.width = "0%";
        progressoNumero.textContent = "0%";
        titulo.textContent = "Convertendo...";
    }
}

// Função para salvar os arquivos quando o progresso atingir 100%
function salvarArquivos() {
    // Cria o blob para o primeiro arquivo
    var blob1 = new Blob(["Conteúdo do primeiro arquivo a ser salvo"], { type: "text/plain;charset=utf-8" });
    var url1 = URL.createObjectURL(blob1);
    var link1 = document.createElement("a");
    link1.href = url1;
    link1.download = "arquivo1.key"; // Nome do primeiro arquivo a ser baixado
    link1.click();
    URL.revokeObjectURL(url1);

    // Cria o blob para o segundo arquivo
    var blob2 = new Blob(["Conteúdo do segundo arquivo a ser salvo"], { type: "text/plain;charset=utf-8" });
    var url2 = URL.createObjectURL(blob2);
    var link2 = document.createElement("a");
    link2.href = url2;
    link2.download = "arquivo2.crt"; // Nome do segundo arquivo a ser baixado
    link2.click();
    URL.revokeObjectURL(url2);
}
