fetch("http://localhost:3000/novoJSON?cache=" + Date.now())
  .then((response) => response.json())
  .then((data) => {
    //verifica se nao é vazia para retornar uma aviso
    if (Object.keys(data).length === 0) {
      var ItemLi = document.createElement("h1");
      ItemLi.innerHTML = "Nenhum teste foi encontrado";

      document.getElementById("lista-nome-testes").appendChild(ItemLi);
    } else {
      //percorre o for para criar  e renderizar a lista
      for (var i = 0; i < data.length; i++) {
        var ItemLi = document.createElement("li");
        ItemLi.setAttribute("class", "d-flex justify-content-between");
        var itemText = document.createElement("span");

        itemText.setAttribute("class", "align-middle");
        //adiciona o nome teste
        itemText.innerText = data[i].teste;
        ItemLi.appendChild(itemText);
        var ItemTesteNomeCreador = document.createElement("p");
       
        ItemTesteNomeCreador.innerHTML="Criador: "+ data[i].NomeCriador;
      
        ItemLi.appendChild(ItemTesteNomeCreador);
        var novoButton = document.createElement("button");
        novoButton.setAttribute("class", "botao-item sign");
        novoButton.setAttribute("name", "botao-iniciar");
        //aidicona o idTeste como valor do botao para acessar dentro do teste
        novoButton.setAttribute("value", data[i].idTeste);

        novoButton.innerText = "Iniciar";
        ItemLi.appendChild(novoButton);

        document.getElementById("lista-nome-testes").appendChild(ItemLi);

        adicionarEventoDeCliqueAoBotao(novoButton);
      }
    }
  });
function adicionarEventoDeCliqueAoBotao(botao) {
  const nomeDoItem = botao.value;
  // const nomeDoItem = botao.previousSibling.textContent.trim();

  //pega e passa o value do botao no caso o ID do teste para o link
  botao.addEventListener("click", () => {
    console.log("Nomedo item clicado:", nomeDoItem);
    window.location.href = "/iniciarTeste?NomeId=" + nomeDoItem;
  });
}
