$(".btnSelect").on("click", function () {
    $(this).parent().find(".inputFile").click();
});

$("#inputFileCRTKEY").on("change", function () {
    if ($(this)[0].files.length == 2) {
        // Verificar se os arquivos são CRT e KEY
        if (!($(this)[0].files[0].name.toLowerCase().endsWith('.crt') && $(this)[0].files[1].name.toLowerCase().endsWith('.key'))) {
            alert("Selecione um arquivo CRT e um arquivo KEY.");
            $(this).val("");
            return;
        }

        const files = this.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileSize = file.size;

            if (file.name.toLowerCase().endsWith('.crt')) {
                console.log("CRT");

                $("#nomeArquivoCRT").html(file.name.toLowerCase());

                var tamanho = fileSize;
                if (tamanho < 1024) tamanho = tamanho + " bytes";
                if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " KB";
                if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " MB";

                $("#tamanhoArquivoCRT").text(tamanho);
            } else if (file.name.toLowerCase().endsWith('.key')) {
                console.log("KEY");

                $("#nomeArquivoKEY").html(file.name.toLowerCase());

                var tamanho = fileSize;
                if (tamanho < 1024) tamanho = tamanho + " bytes";
                if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " KB";
                if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " MB";

                $("#tamanhoArquivoKEY").text(tamanho);
            }

            $("#arquivoCRTKEY").css("display", "flex");
        }
    }
    else if ($(this)[0].files.length == 1) {
        const file = this.files[0];

        if (file.name.toLowerCase().endsWith('.crt') && $("#nomeArquivoCRT").html() != "") {
            alert("Selecione um arquivo KEY.");
            $(this).val("");
            return;
        } else if (file.name.toLowerCase().endsWith('.key') && $("#nomeArquivoKEY").html() != "") {
            alert("Selecione um arquivo CRT.");
            $(this).val("");
            return;
        }

        if (file.name.toLowerCase().endsWith('.crt')) {
            const fileSize = file.size;

            var tamanho = fileSize;
            if (tamanho < 1024) tamanho = tamanho + " bytes";
            if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " KB";
            if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " MB";

            $("#nomeArquivoCRT").html(file.name.toLowerCase());
            $("#tamanhoArquivoCRT").text(tamanho);
            $("#removerArquivoCRT").css("display", "inline");

            $("#arquivoCRTKEY").css("display", "flex");
        } else if (file.name.toLowerCase().endsWith('.key')) {
            const fileSize = file.size;

            var tamanho = fileSize;
            if (tamanho < 1024) tamanho = tamanho + " bytes";
            if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " KB";
            if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " MB";

            $("#nomeArquivoKEY").html(file.name.toLowerCase());
            $("#tamanhoArquivoKEY").text(tamanho);
            $("#removerArquivoKEY").css("display", "inline");

            $("#arquivoCRTKEY").css("display", "flex");
        }

    } else {
        alert("Selecione um arquivo CRT e um arquivo KEY.");
        $(this).val("");
    }
});

$("#inputFilePFX").on("change", function () {
    var file = this.files[0];
    var fileSize = file.size;

    if (!file.name.toLowerCase().endsWith('.pfx')) {
        alert("Selecione um arquivo PFX.");
        $(this).val("");
        return;
    }

    var tamanho = fileSize;
    if (tamanho < 1024) tamanho = tamanho + " bytes";
    if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " KB";
    if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " MB";

    $("#nomeArquivoPFX").html(file.name.toLowerCase());
    $("#tamanhoArquivoPFX").text(tamanho);
    $("#removerArquivoPFX").css("display", "inline");

    $("#arquivoPFX").css("display", "flex");
});

$(".removerArquivo").on("click", function () {
    $("#arquivoPFX").css("display", "none");
    $("#arquivoCRTKEY").css("display", "none");

    $("#removerArquivoCRT").css("display", "none");
    $("#removerArquivoKEY").css("display", "none");

    $(".nomeArquivo").text("");
    $(".tamanhoArquivo").text("");
    $(".inputFile").val("");
});

$(document).ready(function () {
    const progresso = $(".barra div");
    const input = $("input");
    const progressoNumero = $("#progressoNumero");
    const titulo = $(".title");

    // Inicializa o progresso em 0%
    progresso.css("width", "0%");
    progressoNumero.text("0%");
    titulo.text("Convertendo...");

    // Adiciona um evento de clique ao elemento de progresso
    progresso.on("click", function () {
        // Verifica se o progresso atingiu 100%
        if (progresso.css("width") === "100%") {
            // Chama a função para salvar os arquivos
            salvarArquivos();
        }
    });

    $("input").on("input", function () {
        let valor = input.val().trim(); // Remove espaços em branco

        // Verifica se o valor não está vazio e é um número
        if (valor !== "" && !isNaN(valor)) {
            valor = parseInt(valor);

            // Limita o valor máximo a 100
            if (valor > 100) {
                valor = 100;
                input.val(100); // Atualiza o valor exibido no input
            }

            progresso.css("width", valor + "%");
            progressoNumero.text(valor + "%");

            // Altera o texto para "Convertido" quando atingir 100%
            if (valor === 100) {
                titulo.text("Convertido");
                // Chama a função para salvar os arquivos quando atingir 100%
                salvarArquivos();
            } else {
                titulo.text("Convertendo...");
            }
        } else {
            // Se o valor estiver vazio ou não for um número, redefine o progresso para 0%
            progresso.css("width", "0%");
            progressoNumero.text("0%");
            titulo.text("Convertendo...");
        }
    });
});

// REMOVER APOS TESTAR
function alterarProgresso() {
    const progresso = $(".barra div");
    const input = $("input");
    const progressoNumero = $("#progressoNumero");
    const titulo = $(".title");
    
    let valor = input.val().trim(); // Remove espaços em branco

    // Verifica se o valor não está vazio e é um número
    if (valor !== "" && !isNaN(valor)) {
        valor = parseInt(valor);

        // Limita o valor máximo a 100
        if (valor > 100) {
            valor = 100;
            input.val(100); // Atualiza o valor exibido no input
        }

        progresso.css("width", valor + "%");
        progressoNumero.text(valor + "%");

        // Altera o texto para "Convertido" quando atingir 100%
        if (valor === 100) {
            titulo.text("Convertido");
            // Chama a função para salvar os arquivos quando atingir 100%
            salvarArquivos();
        } else {
            titulo.text("Convertendo...");
        }
    } else {
        // Se o valor estiver vazio ou não for um número, redefine o progresso para 0%
        progresso.css("width", "0%");
        progressoNumero.text("0%");
        titulo.text("Convertendo...");
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