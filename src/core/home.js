fetch('/session')
.then(response => response.json())
.then(data => {
  // Use a variável de sessão 'user' aqui
  var name = document.getElementById("name-user");
  name.innerText ="Olá, "+ data.user+"!";
  
})
.catch(error => {
  console.error(error);
});