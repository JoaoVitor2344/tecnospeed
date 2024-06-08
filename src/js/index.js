$(".btnSelect").on("click", function () {
    $(this).parent().find(".inputFile").click();
});

$("#inputFileCRTKEY").on("change", function () {
    if ($(this)[0].files.length == 2) {
        if ((!this.files[0].name.toLowerCase().endsWith('.crt') && !this.files[0].name.toLowerCase().endsWith('.key')) || (!this.files[1].name.toLowerCase().endsWith('.crt') && !this.files[1].name.toLowerCase().endsWith('.key'))) {
            alert("Selecione um arquivo CRT e um arquivo KEY.");
            $(this).val("");
            return;
        }

        const files = this.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileSize = file.size;

            if (file.name.toLowerCase().endsWith('.crt')) {
                $("#inputTextCRT").val(file.path);

                $("#nomeArquivoCRT").html(file.name.toLowerCase());

                var tamanho = fileSize;
                if (tamanho < 1024) tamanho = tamanho + " bytes";
                if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " KB";
                if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " MB";

                $("#tamanhoArquivoCRT").text(tamanho);
            } else if (file.name.toLowerCase().endsWith('.key')) {
                $("#inputTextKEY").val(file.path);

                $("#nomeArquivoKEY").html(file.name.toLowerCase());

                var tamanho = fileSize;
                if (tamanho < 1024) tamanho = tamanho + " bytes";
                if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " KB";
                if (tamanho > 1024) tamanho = (tamanho / 1024).toFixed(2) + " MB";

                $("#tamanhoArquivoKEY").text(tamanho);
            }

            $("#arquivoCRTKEY").css("display", "flex");
            $("#removerArquivoCRT").css("display", "inline");
            $("#removerArquivoKEY").css("display", "inline");

            
        }
    }
    else if ($(this)[0].files.length == 1) {
        const file = this.files[0];

        if ((!this.files[0].name.toLowerCase().endsWith('.crt') && !this.files[0].name.toLowerCase().endsWith('.key'))) {
            alert("Selecione um arquivo CRT e um arquivo KEY.");
            $(this).val("");
            return;
        }

        if (file.name.toLowerCase().endsWith('.crt')) {
            $("#inputTextCRT").val(file.path);

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
            $("#inputTextKEY").val(file.path);

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

    if ($(this).attr("id") == "removerArquivoCRT") {
        $("#nomeArquivoCRT").html("");
        $("#tamanhoArquivoCRT").text("");
        $("#removerArquivoCRT").css("display", "none");
        $("#inputTextCRT").val("");

        $('#btnConvert').attr('class', 'btnConvert disabled');
    } else if ($(this).attr("id") == "removerArquivoKEY") {
        $("#nomeArquivoKEY").html("");
        $("#tamanhoArquivoKEY").text("");
        $("#removerArquivoKEY").css("display", "none");
        $("#inputTextKEY").val("");

        $('#btnConvert').attr('class', 'btnConvert disabled');
    } else {
        $(".nomeArquivo").text("");
        $(".tamanhoArquivo").text("");
        $(".inputFile").val("");
        $("#inputFilePFX").val("");

        $('#btnConvert').attr('class', 'btnConvert disabled');
    }

    if ($("#inputTextCRT").val() == "" && $("#inputTextKEY").val() == "") {
        $("#inputFileCRTKEY").val("");
    }
});