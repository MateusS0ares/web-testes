import express from "express";
import fs from "fs";
import axios from "axios";
import data from "./src/modules/dados/novoJSON.json" assert { type: "json" };
import session from "express-session";
const app = express();

const PORTA = process.env.PORTA || 3000;

//Configura o servidor para lidar com requisições JSON
app.use(express.json());

//use /css para o html entender o type , no caso CSS
app.use("/css", function (req, res, next) {
  res.setHeader("Content-Type", "text/css");
  next();
});

//Redireciona para a página de login com a rota principal "/"
app.get("/", function (req, res) {
  res.redirect("/login");
});

//criar uma sessao para o express
app.use(
  session({
    secret: "ultraSecretaShiuuuu",
    resave: false,
    saveUninitialized: false,
  })
);

//funcao para autentificação de usuario
function isAuthenticated(req, res, next) {
  //verifique se o usuario está autenticado
  if (req.session && req.session.user) {
    //se estiver autenticado, permita o acesso a rota
    next();
  } else {
    //se nao estiver autenticado, redirecione para a pagina de login
    res.redirect("/login");
  }
}

//passando as rotas para o app e junto com o isAuthenticated para identificar se o usuario esta logado com sessao ou nao

//Configura o servidor para lidar com arquivos estáticos na pasta src.
app.use(express.static("src/"));
//Configura o servidor para lidar com arquivos CSS na pasta src/modules/css.
app.use("/css", express.static("src/modules/css"));

//Definição de rotas
app.use("/login", express.static("src/modules/pages/login.html"));
app.use("/sign", express.static("src/modules/pages/signUser.html"));
app.use(
  "/home",
  isAuthenticated,
  express.static("src/modules/pages/home.html")
);
app.use(
  "/criarTeste",
  isAuthenticated,
  express.static("src/modules/pages/criarTeste.html")
);
app.use(
  "/iniciarTeste",
  isAuthenticated,
  express.static("src/modules/pages/Iniciar_teste.html")
);
app.use(
  "/lista",
  isAuthenticated,
  express.static("src/modules/pages/listaTestes.html")
);
app.use(
  "/resultados",
  isAuthenticated,
  express.static("src/modules/pages/resultados.html")
);

//rota que retorna o json de resultados
app.get("/resultadoJSON", function (req, res) {
  const dadosJson = fs.readFileSync("./src/modules/dados/resultados.json");
  const listaTestes = JSON.parse(dadosJson).testes.map((testes) => testes);
  var temp = [];
  for (var i = 0; i < listaTestes.length; i++) {
    if (req.session.idUser == listaTestes[i].idUser) {
      temp.push(listaTestes[i]);
    }
  }
  res.json(temp);
});

//rota que retorna o json de testes
app.get("/novoJSON", function (req, res) {
  const dadosJson = fs.readFileSync("./src/modules/dados/novoJSON.json");
  const listaTestes = JSON.parse(dadosJson).testes.map((testes) => testes);

  res.json(listaTestes);
  //codigo de linha se qusier deixar o teste de cada  usuario
  // var temp=[];
  // for(var i=0;i<listaTestes.length;i++){
  //
  // if(req.session.idUser==listaTestes[i].idUser){
  //     temp.push(listaTestes[i]);
  //
  //   }
  // }
  // res.json(temp);
});

//metodo post para ler os resultados e acrecentar e reeescrever
app.post("/postTeste", async (req, res) => {
  fs.readFile("./src/modules/dados/resultados.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erro ao ler arquivo.");
      return;
    }

    //analisa o conteudo JSON para um objeto js
    const json = JSON.parse(data);

    json.testes.push({
      idUser: req.session.idUser,
      UserName: req.session.user,
      teste: req.body.teste,
      qtd_perguntas: req.body.qtd_perguntas,
      qtd_acertos: req.body.qtd_acertos,
    });

    //converte o objeto js de volta para JSON com espaço de identação 2
    const novoJSONString = JSON.stringify(json, null, 2);

    console.log(novoJSONString);
    fs.writeFile(
      "./src/modules/dados/resultados.json",
      novoJSONString,
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Erro ao salvar arquivo.");
        } else {
          console.log("Arquivo salvo com sucesso!");
          res.send("Arquivo salvo com sucesso!");
        }
      }
    );
  });
});

//metodo post para ler os usuarios, acrecentar e reeescrever
app.get("/CadastrarUsuario", (req, res) => {
  const user = req.query.NameUser;
  const email = req.query.emailUser;
  const password1 = req.query.password1User;
  const password2 = req.query.password2User;

  //verifica se a senha é igual
  if (password1 == password2) {
    //le o conteudo do arquivo JSON
    fs.readFile(
      "./src/modules/dados/dadosUsuario.json",
      "utf8",
      (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Erro ao ler arquivo.");
          return;
        }

        //analisa o conteudo JSON para um objeto js
        const json = JSON.parse(data);

        json.usuario.push({
          idUser: json.usuario.length,
          NameUser: req.query.NameUser,
          emailUser: req.query.emailUser,
          passwordUser: req.query.passwordUser,
        });

        //converte o objeto js de volta para JSON
        const novoJSONString = JSON.stringify(json, null, 2);

        //gravar o json dentro do dados
        fs.writeFile(
          "./src/modules/dados/dadosUsuario.json",
          novoJSONString,
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).send("Erro ao salvar arquivo.");
            } else {
              res.redirect("/login");
            }
          }
        );
      }
    );
  } else {
    window.alert("As senhas nao combinam");
  }
});

//Login do usuario - Ele pega os .JSON e percorre o for para
//verificar se existe um usuario igual aquele que foi passado por req.query
app.get("/loginUsuario", async (req, res) => {
  const email = req.query.emailUser;
  const password = req.query.passwordUser;

  try {
    const dadosJson = fs.readFileSync("./src/modules/dados/dadosUsuario.json");
    const listausuario = JSON.parse(dadosJson).usuario.map(
      (usuario) => usuario
    );
    let userFound = false;

    for (let key in listausuario) {
      if (
        listausuario[key].emailUser === email &&
        listausuario[key].passwordUser === password
      ) {
        userFound = true;
        //guarda o username user para sessao
        req.session.user = listausuario[key].NameUser;
        req.session.idUser = listausuario[key].idUser;
        console.log("ID user: " + req.session.idUser);
        break;
      }
    }

    if (userFound) {
      // Login bem sucedido
      res.redirect("/home");
    } else {
      // Login falhou
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao obter dados do usuário");
  }
});

app.post("/criarTeste", (req, res) => {
  //le o  conteudo do arquivo JSON
  fs.readFile("./src/modules/dados/novoJSON.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erro ao ler arquivo.");
      return;
    }

    //analisa o conteudo JSON para um objeto js
    const json = JSON.parse(data);

    json.testes.push({
      idUser: req.session.idUser,
      idTeste: json.testes.length,
      NomeCriador: req.session.user,
      teste: req.body.testes[0].teste,
      perguntas: req.body.testes[0].perguntas,
    });

    //converte o objeto js de volta para JSON
    const novoJSONString = JSON.stringify(json, null, 2);

    fs.writeFile("./src/modules/dados/novoJSON.json", novoJSONString, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Erro ao salvar arquivo.");
      } else {
        console.log("Arquivo salvo com sucesso!");
        res.send("Arquivo salvo com sucesso!");
      }
    });
  });
});
app.get("/session", (req, res) => {
  res.json({ user: req.session.user });
});
//faz o logout , pois quando chamado no botao ele destroi a req.session e vai redireciona para page login
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.send("Erro ao fazer logout");
    } else {
      res.redirect("/login");
    }
  });
});

//Define a porta do servidor com a variável PORTA criada anteriormente
app.listen(PORTA, () => {
  console.log(`Servidor aberto no link: localhost/${PORTA}`);
});
