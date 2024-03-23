$(".btnSelect").on("click", function() {
    if ($(".inputFile").val().includes("C:\\fakepath\\")) {
        alert("Um arquivo já foi selecionado. Para selecionar outro, remova o arquivo atual.");
        return;
    } else $(this).parent().find(".inputFile").click();
});

$("#inputFileCRTKEY").on("change", function() {
    if ($(this)[0].files.length == 2) {
        // Verifica se os arquivos são CRT e KEY
        var ext1 = $(this)[0].files[0].name.split('.').pop();
        var ext2 = $(this)[0].files[1].name.split('.').pop();

        if (ext1 != "crt" || ext2 != "key") {
            alert("Selecione um arquivo CRT e um arquivo KEY.");
            $(this).val("");
            return;
        }

        // Verifica se os arquivos são do mesmo certificado
        var crt = $(this)[0].files[0];
        var key = $(this)[0].files[1];

        var reader = new FileReader();

        reader.onload = function(e) {
            var crtContent = e.target.result;
            var crtLines = crtContent.split("\n");

            var keyContent = e.target.result;
            var keyLines = keyContent.split("\n");

            var crtSerial = "";
            var keySerial = "";

            for (var i = 0; i < crtLines.length; i++) {
                if (crtLines[i].includes("Serial Number")) {
                    crtSerial = crtLines[i].split(":")[1].trim();
                    break;
                }
            }

            for (var i = 0; i < keyLines.length; i++) {
                if (keyLines[i].includes("Serial Number")) {
                    keySerial = keyLines[i].split(":")[1].trim();
                    break;
                }
            }

            if (crtSerial != keySerial) {
                alert("Os arquivos selecionados não pertencem ao mesmo certificado.");
                $("#inputFileCRTKEY").val("");
                return;
            } else {
                if (crt.name.split('.').pop() == "crt") {
                    $(".nomeArquivoCRT").text(crt.name);
                    
                    var tamanhoCRT = crt.size;
                    if (tamanhoCRT < 1024) tamanhoCRT = tamanhoCRT + " bytes";
                    if (tamanhoCRT > 1024) tamanhoCRT = (tamanhoCRT / 1024).toFixed(2) + " KB";
                    if (tamanhoCRT > 1024) tamanhoCRT = (tamanhoCRT / 1024).toFixed(2) + " MB";
                    $(".tamanhoArquivoCRT").text(tamanhoCRT);
                } else if (key.name.split('.').pop() == "key") {
                    $(".nomeArquivoKEY").text(key.name);

                    var tamanhoKEY = key.size;
                    if (tamanhoKEY < 1024) tamanhoKEY = tamanhoKEY + " bytes";
                    if (tamanhoKEY > 1024) tamanhoKEY = (tamanhoKEY / 1024).toFixed(2) + " KB";
                    if (tamanhoKEY > 1024) tamanhoKEY = (tamanhoKEY / 1024).toFixed(2) + " MB";
                    $(".tamanhoArquivoKEY").text(tamanhoKEY);
                }   

                $("#arquivoCRTKEY").css("display", "flex");
            }
        };
    } else if ($(this)[0].files.length == 1) {
        // Se o arquivo for CRT
        if ($(this)[0].files.length == 1) {
            var file = $(this)[0].files[0];

            if (file.name.split('.').pop() == "crt") {
                $(".nomeArquivoCRT").text(file.name);

                var tamanhoCRT = file.size;
                if (tamanhoCRT < 1024) tamanhoCRT = tamanhoCRT + " bytes";
                if (tamanhoCRT > 1024) tamanhoCRT = (tamanhoCRT / 1024).toFixed(2) + " KB";
                if (tamanhoCRT > 1024) tamanhoCRT = (tamanhoCRT / 1024).toFixed(2) + " MB";
                $(".tamanhoArquivoCRT").text(tamanhoCRT);

                $("#arquivoCRTKEY").css("display", "flex");
            } else if (file.name.split('.').pop() == "key") {
                $(".nomeArquivoKEY").text(file.name);

                var tamanhoKEY = file.size;
                if (tamanhoKEY < 1024) tamanhoKEY = tamanhoKEY + " bytes";
                if (tamanhoKEY > 1024) tamanhoKEY = (tamanhoKEY / 1024).toFixed(2) + " KB";
                if (tamanhoKEY > 1024) tamanhoKEY = (tamanhoKEY / 1024).toFixed(2) + " MB";
                $(".tamanhoArquivoKEY").text(tamanhoKEY);

                $("#arquivoCRTKEY").css("display", "flex");
            } else {
                alert("Selecione um arquivo CRT ou um arquivo KEY.");
                $(this).val("");
                return;
            }
        }
    } else {
        alert("Selecione um arquivo CRT e um arquivo KEY.");
        $(this).val("");
    }
});

$("#inputFilePFX").on("change", function() {
    var fileName = $(this).val().split("\\").pop();

    // Caso for apenas um arquivo
    if($(this)[0].files.length == 1) {
        var fileSize = $(this)[0].files[0].size;

        // Se o arquivo ultrapassar 10MB
        if (fileSize > 10485760) {
            alert("O arquivo selecionado ultrapassa o limite de 10MB.");
            return;
        }

        $(".nomeArquivo").text(fileName);
        
        var tamanho = fileSize;
        if (tamanho < 1024) tamanho = tamanho + " bytes";
        if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " KB";
        if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " MB";
        $(".tamanhoArquivo").text(tamanho);

        $("#arquivoPFX").css("display", "flex");
    } else {
        alert("Selecione apenas um arquivo.");
        $(this).val("");
    }
});

$(".removerArquivo").on("click", function() {
    $("#arquivoPFX").css("display", "none");
    $("#arquivoCRTKEY").css("display", "none");

    $(".nomeArquivo").text("");
    $(".tamanhoArquivo").text("");
    $(".inputFile").val("");
});