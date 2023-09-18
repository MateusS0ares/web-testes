// busca as perguntas e respostas do arquivo JSON
const urlParams = new URLSearchParams(window.location.search);
//pega o iD teste dentro da URL passada pela lista
const nomeId = urlParams.get("NomeId");
var DataJson = "";
var index = 0;
var length = 0;
var identificador = 0;
const respostas = [];
var listaPerguntas = [];
//pega do banco os testes
fetch("http://localhost:3000/novoJSON?cache=")
  .then((response) => response.json())
  .then((data) => {
    //verifica se qual é o teste e passa todo ele para o DataJson
    data.forEach((pergunta, index) => {
      if (data[index].idTeste == nomeId) {
        //passa um identificador da posicao do teste
        identificador = index;
        DataJson = data;
      }
    }),
      //e depois de tudo isso ele cria a lista do teste com todas as perguntas
      criarLista(),
      criarPergunta();
  });
//Essa funcao percorre um json e fica aleatoriza as suas perguntas
//conforme o numero gerado pelo Math..floor
function criarLista() {
  var perguntasRandomizadas = [];
  var ultimoNumero = [];

  for (var j = 0; j < DataJson[identificador].perguntas.length; j++) {
    var numero;
    //esse numero é para percorrer e para nao repetir o mesmo numero digitado
    do {
      numero = Math.floor(
        //randomiza do tamnho de perguntas que tem no testes
        Math.random() * DataJson[identificador].perguntas.length
      );
      //so para se o numero numero atual nao foi
    } while (ultimoNumero.includes(numero));
    //adiciona na lista o numero que nao foi para futuramente nao adiciona o mesmo denovo
    ultimoNumero.push(numero);
    //adiciona dentro das perguntas
    perguntasRandomizadas.push(DataJson[identificador].perguntas[numero]);
  }

  listaPerguntas = perguntasRandomizadas;
}
//funcao cria a pergunta
function criarPergunta() {
  const perguntas = document.querySelectorAll("input[type=radio]:checked");
  //se o usuario nao selecionou nada ele da um alerta para ele
  if (perguntas.length == 0 && index != 0) {
    window.alert("SELECIONE UMA RESPOSTA");
    return;
  }
  //se sim adiciona a peergunta atual
  perguntas.forEach((pergunta) => {
    respostas.push({
      pergunta: pergunta.name,
      resposta: pergunta.value,
    });
  });
  //se chegou no final da lista ele continua caindo no if e criando apergunta dentro da div teste
  if (listaPerguntas.length != index) {
    const TesteContainer = document.getElementById("Teste");
    let TesteOutput = "";

    const pergunta = listaPerguntas[index];

    TesteOutput += `
      <div class="container-fluid mt-5 mb-2">
        <div class="row">
          <div class="col-md-12">
              <div class="card bg-roxo">
                <h5 class="card-header">Questionário</h5>
                <div class="card-body bg-azul">
                  <h3 class="text-uppercase">${index + 1}. ${
      pergunta.pergunta
    }</h3>
                    <ul class="text-center">
                      <div id="resposta">
                        <li>
                          <p>a)</p>
                          <input class="form-check-input" type="radio" id="${index}-a" name="${index}" value="${
      pergunta.respostaA
    }" />
                          <label class="mx-2" for="${index}-a">${
      pergunta.respostaA
    }</label>
                        </li>
                      </div>
                      <div id="resposta">
                        <li>
                          <p>b)</p>
                          <input class="form-check-input" type="radio" id="${index}-b" name="${index}" value="${
      pergunta.respostaB
    }" />
                          <label class="mx-2" for="${index}-b">${
      pergunta.respostaB
    }</label>
                        </li> 
                      </div>
                      <div id="resposta">
                        <li>
                          <p>c)</p>
                          <input class="form-check-input" type="radio" id="${index}-c" name="${index}" value="${
      pergunta.respostaC
    }" />
                          <label class="mx-2" for="${index}-c">${
      pergunta.respostaC
    }</label>
                        </li> 
                      </div>
                      <div id="resposta">
                        <li>
                          <p>d)</p>
                          <input class="form-check-input" type="radio" id="${index}-d" name="${index}" value="${
      pergunta.respostaD
    }" />
                          <label class="mx-2" for="${index}-d">${
      pergunta.respostaD
    }</label>
                        </li> 
                      </div>
                      <div id="resposta">
                        <li>
                          <p>e)</p>
                          <input class="form-check-input" type="radio" id="${index}-e" name="${index}" value="${
      pergunta.respostaE
    }" />
                          <label class="mx-2" for="${index}-e">${
      pergunta.respostaE
    }</label>
                        </li>
                      </div>
                    </ul>
                </div>
              </div>
          </div>
        </div>
    </div> 
     `;

    TesteContainer.innerHTML = TesteOutput;
    index++;
    //se é a ultima pergunta nao aparece o botao de proxima pergunta
    if (index == listaPerguntas.length) {
      document.getElementById("nova-pergunta").style.display = "none";
    }
  }
}

var perguntaSubmit = document.getElementById("nova-pergunta");

perguntaSubmit.addEventListener("click", () => {
  criarPergunta();
});

var Submit = document.getElementById("submit");

//termina e ennvia o codigo
Submit.addEventListener("click", () => {
  //se a ultima pergunta nao foi selecionada ainda ele cai no alert
  const perguntas = document.querySelectorAll("input[type=radio]:checked");
  if (perguntas.length == 0) {
    window.alert("SELECIONE UMA RESPOSTA");
    return;
  }

  //se tem pergunta selecionada ele adiciona no json respostas
  perguntas.forEach((pergunta) => {
    respostas.push({
      pergunta: pergunta.name,
      resposta: pergunta.value,
    });
  });

  //pega o nome teste, e verifica todas as respostas certas
  document.getElementById("submit").disabled = true;
  fetch("http://localhost:3000/novoJSON?cache=")
    .then((response) => response.json())
    .then((data) => {
      var acertos = 0;

      for (let i = 0; i < respostas.length; i++) {
        if (respostas[i].resposta == listaPerguntas[i].respostaCerta) {
          acertos++;
        }
      }

      //adiciona no novoJson para mandar pro servidor expressjs
      const novoJSON = {
        teste: data[identificador].teste,
        qtd_perguntas: listaPerguntas.length,
        qtd_acertos: acertos,
      };
      const novoJSONString = JSON.stringify(novoJSON, null, 2);
      fetch("http://localhost:3000/postTeste", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: novoJSONString,
      });
    });
  window.location.href = "/resultados";
});
