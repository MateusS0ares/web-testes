fetch("http://localhost:3000/resultadoJSON?cache=" + Date.now())
  .then((response) => response.json())
  .then((data) => {
    ///esse js é bem simples , ele apenas faz um get nos resultados.json
    //com todos os testes e ai cria uma lista de resultados

    for (var i = 0; i < data.length; i++) {
      var Row = document.createElement("div");
      Row.setAttribute("class", "row");

      var Col = document.createElement("div")
      Col.setAttribute("class", "col-md-12 justify-content-center")
      Row.appendChild(Col);

      var ItemCard = document.createElement("div");
      ItemCard.setAttribute("class", "card bg-roxo my-3");
      Col.appendChild(ItemCard);

      var ItemCardHeader = document.createElement("div");
      ItemCardHeader.setAttribute("class", "card-header text-white text-uppercase fw-bold")
      ItemCardHeader.innerText = `Teste ${i + 1}°`;
      ItemCard.appendChild(ItemCardHeader);

      var ItemCardBody = document.createElement("div");
      ItemCardBody.setAttribute("class", "card-body bg-azul");
      ItemCard.appendChild(ItemCardBody);

      // var ItemCardTitle = document.createElement("div");
      // ItemCardTitle.setAttribute("class", "card-title text-white");
      // ItemCardTitle.innerText =  `data[i].teste`;
      // ItemCard.appendChild(ItemCardBody);

      var itemText = document.createElement("h5");
      itemText.innerText = `Nome do Teste: ${data[i].teste}`;
      itemText.setAttribute("class", "card-title text-white");
      ItemCardBody.appendChild(itemText);

      var itemQtdaPerguntas = document.createElement("h5");
      itemQtdaPerguntas.setAttribute("class", "card-text text-white");
      itemQtdaPerguntas.innerText =
        `Quantidade de Perguntas : ${data[i].qtd_perguntas}`;

      var itemQtdaAcertos = document.createElement("h5");
      itemQtdaAcertos.setAttribute("class", "card-text text-white");
      itemQtdaAcertos.innerText = `Acertos : ${data[i].qtd_acertos}`;
      ItemCardBody.appendChild(itemText);
      ItemCardBody.appendChild(itemQtdaPerguntas);
      ItemCardBody.appendChild(itemQtdaAcertos);
      document.getElementById("lista-nome-testes").appendChild(Row);
    }
  });