function getUsername() {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == "username") {
      var username = pair[1].split("+").join("%20");
      return username;
    }
    return "";
  }
}

function formatTime(timestamp) {
  var date = new Date(timestamp).toLocaleString();
  return date;
}

function formatDrop(timestamp) {
  var date = new Date(timestamp).toLocaleString().replace(",", " at");
  return date;
}

function errorMessage(username) {
  var error_message = "Je ne trouve pas de compte Minecraft ayant ce pseudo ! Veuillez vérifier l'orthographe du pseudo."; 
  var error_invalid = "Le pseudo comporte des caractères invalides !"; 
  var error_short = "Le pseudo est trop court !"; 
  var error_long = "Le pseudo est trop long !"; 
  if (/^.{3,}$/.test(username) == false) return error_short;
  if (/^.{0,16}$/.test(username) == false) return error_long;
  if (/^[a-zA-Z0-9_]+$/.test(username) == false) return error_invalid;
  return error_message;
}

var username = decodeURIComponent(getUsername()); 
var API_URL = "https://playerdb.co/api/player/minecraft/"; 
var API = API_URL + username; 
var input = document.getElementById("username"); 
var blocked = "Le pseudo est bloquer !"; 
var dropping = "The name you entered is dropping on "; 

input.value = username; 
if (username !== "") { 
  fetch(API).then(response => response.json()).then((main) => {
    if (main.error === true) { 
      fetch(`https://api.gapple.pw/blocked/${username}`).then(response => response.json()).then((gapple) => {
        var table = document.getElementById("myTable");
        table.innerHTML = "<tr><td>" + errorMessage(username) + "</td></tr>";
        if (errorMessage(username) == "Je ne trouve pas de compte Minecraft ayant ce pseudo ! Veuillez vérifier l'orthographe du pseudo.") {
          if (gapple.status == "blocked") {
            document.getElementById("myTable").innerHTML = `<td>${blocked}</td>`;
          } else {
            if (gapple.status == "soon") {
              document.getElementById("myTable").innerHTML = `<td>${dropping}${formatDrop(gapple.drop_time)}.</td>`; 
            }
          }
        }
      });
    } else {
      window.username = main.data.player.username;
      window.name_history = main.data.player.meta.name_history.reverse();
      var icon = `https://api.ashcon.app/mojang/v2/avatar/${window.username}`;
      var title = `${window.username} | Name History`;
      buildTable(window.name_history);
      document.title = title;
      document.getElementById("icon").href = icon;
    }
    
    function buildTable(data) {
      var table = document.getElementById("myTable");
      if (data.length === 1) {
        var row3 = `<tr class="bold">
	  <td>${data.length}. <a href="https://fr.namemc.com/search?q=${data[0].name}">${data[0].name}</a><\/td>`;
        table.innerHTML += row3;
      } else {
        var row = `<tr class="bold">
	  <td>${data.length}. <a href="https://fr.namemc.com/search?q=${data[0].name}">${data[0].name}</a><\/td><td class="right">${formatTime(data[0].changedToAt)}<\/td>
	                     <\/tr>`;
        table.innerHTML += row;
        for (var i = 1; i < data.length - 1; i++) {
          var row1 = `<tr>
	  <td>${(data.length - i)}. <a href="https://fr.namemc.com/search?q=${data[i].name}">${data[i].name}<\/a><\/td><td class="right">${formatTime(data[i].changedToAt)}<\/td>
	                     <\/tr>`;
          table.innerHTML += row1;
        }
        var row2 = `<tr>
	  <td>${(data.length - i)}. <a href="https://fr.namemc.com/search?q=${data[i].name}">${data[i].name}</a><\/td>
	                     <\/tr>`;
        table.innerHTML += row2;
      }
    }
  });
}
