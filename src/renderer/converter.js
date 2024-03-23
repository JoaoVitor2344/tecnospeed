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