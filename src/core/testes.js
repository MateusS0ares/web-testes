var testes = [];
var aux = 0;

//funçao de evento para adicionar ul e li de inputs
document
  .getElementById("adicionar-pergunta")
  .addEventListener("click", function (event) {
    event.preventDefault();
    // previne o comportamento padrão do formulário

    var novoItem = document.createElement("div");

    var ItemLabel = document.createElement("label");
    ItemLabel.innerHTML = "Pergunta";
    novoItem.appendChild(ItemLabel);
    var novoInput = document.createElement("input");
    novoInput.setAttribute("type", "text");
    novoInput.setAttribute("id", "pergunta");

    novoInput.placeholder = "Digite sua pergunta";
    novoItem.appendChild(novoInput);

    var ItemLabel = document.createElement("label");
    ItemLabel.innerHTML = "Resposta A";
    novoItem.appendChild(ItemLabel);
    var novoInput = document.createElement("input");
    novoInput.setAttribute("type", "text");
    novoInput.setAttribute("class", "resposta");
    novoInput.setAttribute("id", "respostaTextA");
    novoInput.placeholder = "A";
    novoItem.appendChild(novoInput);

    var ItemLabel = document.createElement("label");
    ItemLabel.innerHTML = "Resposta B";
    novoItem.appendChild(ItemLabel);
    var novoInput = document.createElement("input");
    novoInput.setAttribute("type", "text");
    novoInput.setAttribute("class", "resposta");
    novoInput.setAttribute("id", "respostaTextB");
    novoInput.placeholder = "B";
    novoItem.appendChild(novoInput);

    var ItemLabel = document.createElement("label");
    ItemLabel.innerHTML = "Resposta C";
    novoItem.appendChild(ItemLabel);
    var novoInput = document.createElement("input");
    novoInput.setAttribute("type", "text");
    novoInput.setAttribute("class", "resposta");
    novoInput.setAttribute("id", "respostaTextC");
    novoInput.placeholder = "C";
    novoItem.appendChild(novoInput);

    var ItemLabel = document.createElement("label");
    ItemLabel.innerHTML = "Resposta D";
    novoItem.appendChild(ItemLabel);
    var novoInput = document.createElement("input");
    novoInput.setAttribute("type", "text");
    novoInput.setAttribute("class", "resposta");
    novoInput.setAttribute("id", "respostaTextD");
    novoInput.placeholder = " D";
    novoItem.appendChild(novoInput);

    var ItemLabel = document.createElement("label");
    ItemLabel.innerHTML = "Resposta E";
    novoItem.appendChild(ItemLabel);
    var novoInput = document.createElement("input");
    novoInput.setAttribute("type", "text");
    novoInput.setAttribute("class", "resposta");
    novoInput.setAttribute("id", "respostaTextE");
    novoInput.placeholder = "E";
    novoItem.appendChild(novoInput);

    var novoInput = document.createElement("select");
    novoInput.setAttribute("name", "respostaCerta");
    novoInput.setAttribute("id", "respostaCerta");
    novoInput.setAttribute("class", "form-select");
    const options = [
      "respostaTextA",
      "respostaTextB",
      "respostaTextC",
      "respostaTextD",
      "respostaTextE",
    ];
    //percorre a lista acima para criar diferentes option para colocar
    //dentro do select , no caso dropdown .
    //melhor criar com for do que criar mais codigo de create
    for (let i = 0; i < options.length; i++) {
      const newOption = document.createElement("option");
      newOption.value = options[i];
      newOption.text = options[i].slice(-1);
      novoInput.appendChild(newOption);
    }
    novoItem.appendChild(novoInput);
    //esse novoItem é  as perguntas todas para adicionar dentro da div no html de id perguntas
    document.getElementById("perguntas").appendChild(novoItem);
    //aux para identificar quantas perguntas ja foram criadas
    aux++;
  });

//evento do Botao de finazalido para criar um testes com as perguntas e resostas e armazenar no JSON
document
  .getElementById("finalizar-teste")

  .addEventListener("click", async function (event) {
    event.preventDefault();

    //cria um json temporarios para adicionando
    const novoDialogues = [];
    var respostasCertas = [];

    //pega os inputs
    var perguntas = document.querySelectorAll("#perguntas input[type=text]");
    if (document.getElementById("nome-teste").value.trim() == "") {
      alert("Preencha o nome do teste vazio");
      return;
    }
    //pega os dropdown (select)
    var perguntasSelect = document.querySelectorAll("#perguntas select");

    var perguntasArray = [];
    var novoLine;
    var j = 0;
    var respostaCerta = [];
    for (var i = 0; i < perguntas.length; i += 6) {
      if (perguntas[i].value.trim() == "") {
        alert("campo de pergunta vazio");
        return;
      }
      if (perguntas[i + 1].value.trim() == "") {
        alert("campo da resposta A vazio");
        return;
      }
      if (perguntas[i + 1].id == perguntasSelect[j].value) {
        respostaCerta[j] = perguntas[i + 1].value;
      }
      if (perguntas[i + 2].value.trim() == "") {
        alert("campo da resposta B vazio");
        return;
      }
      if (perguntas[i + 2].id == perguntasSelect[j].value) {
        respostaCerta[j] = perguntas[i + 2].value;
      }
      if (perguntas[i + 3].value.trim() == "") {
        alert("campo da resposta C vazio");
        return;
      }
      if (perguntas[i + 3].id == perguntasSelect[j].value) {
        respostaCerta[j] = perguntas[i + 3].value;
      }
      if (perguntas[i + 4].value.trim() == "") {
        alert("campo da resposta D vazio");
        return;
      }
      if (perguntas[i + 4].id == perguntasSelect[j].value) {
        respostaCerta[j] = perguntas[i + 4].value;
      }
      if (perguntas[i + 5].value.trim() == "") {
        alert("campo da resposta E vazio");
        return;
      }
      if (perguntas[i + 5].id == perguntasSelect[j].value) {
        respostaCerta[j] = perguntas[i + 5].value;
      }
      j++;
    }
    j = 0;
    //percorre todas as perguntas criadas para colocar dentro do novo line
    for (var i = 0; i < perguntas.length; i += 6) {
      //adiciona a pergunta inteira e nao uma interação pequena input por input
      novoLine = {
        pergunta: perguntas[i].value,
        respostaA: perguntas[i + 1].value,
        respostaB: perguntas[i + 2].value,
        respostaC: perguntas[i + 3].value,
        respostaD: perguntas[i + 4].value,
        respostaE: perguntas[i + 5].value,
        respostaCerta: respostaCerta[j],
      };
      j++;
      //logo em seguida adiciona dentro de perguntasArray como json temporarios
      perguntasArray.push(novoLine);
    }
    //pega o nome do questionario
    var nomeTeste = document.getElementById("nome-teste").value;
    //adiciona em novoLineA
    var novoLineA = {
      teste: nomeTeste,
      perguntas: perguntasArray,
    };
    //adiciona em novo dialogue
    novoDialogues.push(novoLineA);
    //e finalmente adiciona em novo JSON
    //podia , SIMMMM melhorar esse codigo,mas fiquei sem tempo
    const novoJSON = {
      testes: novoDialogues,
    };

    const novoJSONString = JSON.stringify(novoJSON, null, 2);

    //manda para metodo post
    fetch("http://localhost:3000/criarTeste?cache=" + Date.now(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: novoJSONString,
    });
    //vai pra listas de testes
    window.location.href = "/lista";
  });
