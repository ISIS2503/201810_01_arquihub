var token;
$(function() {
  var FADE_TIME = 150; // ms


  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $passwordInput = $('.passwordInput'); // Input for password
  var user = document.getElementById("usern");
  var pass = document.getElementById("passw");

  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login-page'); // The login page
  var $dashPage = $('.dash-page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var password;
  var connected = false;
  var $currentInput = $usernameInput.focus();
  var tokens;
  //Variable para manejar el json de la unidad
  var unidad;
  //Variable para manejar el json de los inmuebles de la unidad
  var inmuebles;


  var socket = io();

  // Sets the client's username
  const login = () => {
    username = cleanInput($usernameInput.val().trim());
    password = cleanInput($passwordInput.val().trim());

    // If the username is valid
    if (username && password) {
      // Tell the server your username
      socket.emit('login', username, password);
    }
  }
  const completeLogin =  () => {
    // If the username is valid
      $loginPage.fadeOut();
      $dashPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();
  }
  const loginError = () => {
    $usernameInput.val("");
    $passwordInput.val("");
    alert("Usuario o clave incorrecto");
  }

  const addParticipantsMessage = (data) => {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
  }

  // Sends a chat message
  const sendMessage = () => {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
    const log = (message, options) => {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  const addChatMessage = (data, options) => {
    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  const addMessageElement = (el, options) => {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }
    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  const cleanInput = (input) => {
    return $('<div/>').text(input).html();
  }

  // Gets the color of a username through our hash function
  const getUsernameColor = (username) => {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keydown(event => {

    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      $.post('http://172.24.42.123:8080/api/signin',
      {
        email: user.value,
        password: pass.value
      },
      function(data,status){
          tokens = data.token
          getTodo();
      }, "json");

      login();

    }
  });


  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(() => {

  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(() => {
    $inputMessage.focus();
  });
  function getTodo(){
      $.ajax({
       url: "http://172.24.42.123:8080/api/unidadResidencial/5afd8e023869b9c7bc1d302d/board",
       headers: {'Authorization' : 'Bearer '+tokens},
       type: "GET",
       success: function(result, status) {
       unidad = result.unidad ; inmuebles = result.inmuebles },
       error: function(status, error) { console.log(error);}
    }).done(function(){construir();});
  }
  function construir(){

    $.each(inmuebles,function(key,$datum){
      var propio ={ name:"",
    email:""};
      $.ajax({
       url: "http://172.24.42.123:8080/api/inmuebles/"+ inmuebles[key]._id +"/propietario",
       headers: {'Authorization' : 'Bearer '+tokens},
       type: "GET",
       success:(function(result, status){}),
       error: function(status, error) { console.log(error);}
    }).done(function(result){

      if(typeof result.name !== "undefined")
        propio = result;
      else{
        propio.name = "No disponible"
        propio.email = "No disponible"
      }


      var img;
      var htmlstring = "hola";
      var modalString = "";
      if(inmuebles[key].situacion == 1)
        {img = "\"images/online.png\"";}
      else if(inmuebles[key].situacion == 4)
        {img = "\"images/fail.png\"";}
      else
        {img = "\"images/error.png\"";}
     htmlstring = "<div class=\"col-md-2\">"+
                          "<a id=" + "\""+inmuebles[key]._id + "\" " + "class=\"d-block mb-4 h-100\">"+
                          "<img class=\"btn btn-info btn-lg img-fluid\" data-toggle=\"modal\" data-target=\"#myModal"+ inmuebles[key]._id  + "\" src=" + img + "alt=\"\"" + ">" +
                          "</a>"
                    +"</div>";
      modalString = "<div id=\"myModal" + inmuebles[key]._id + "\" class=\"modal fade\" role=\"dialog\">"
      + "<div class=\"modal-dialog\">"

      //Aqui empieza el modal content
      + "<div class =\"modal-content\">"
      + "<div class=\"modal-header\">"
      + "<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>"
      + "<h4 class=\"modal-title\">Inmueble: " + inmuebles[key]._id + "</h4>"
      + "</div>"
      + "<div class=\"modal-body\">"
      + "<p>" + "<b>Nombre del Inmueble: </b>" + inmuebles[key].name +" </p>"
      + "<p>" + "<b>Situación del Inmueble: </b>" + inmuebles[key].situacion +" </p>"
      + "<h3>Contacto</h3>"
      + "<p>" + "<b>Nombre del Propietario: </b>" + propio.name +" </p>"
      + "<p>" + "<b>Nombre del Inmueble: </b>" + propio.email +" </p>"
      + "</div>"
      + "<div class=\"modal-footer\">"
      + "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"
      + "</div>"
      + "</div>"
      + "</div>"
      + "</div>";
     $("#inmuebless").append(htmlstring);
     $("#modalitos").append(modalString);
    });
  });
  }

  // Socket events

  // Whenever the server emits 'login', log the login message

  socket.on('complete_login', (data) => {
    completeLogin();
    connected = true;
    // Display the welcome message
    var message = "Welcome to Socket.IO Chat – ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });
  socket.on('login_error', (data) => {
    loginError();
  });

  socket.on('tokens', (data) =>{

  })

  //////////////////////////////////////////////
  //Login que está funcionando en este momento
  socket.on('prueba', (data)=>{
    completeLogin();
    connected = true;
    token = data
    socket.emit('prueba', data)
  })
  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', (data) => {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', (data) => {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', (data) => {
    log(data.username + ' left');
    addParticipantsMessage(data);
  });


  socket.on('disconnect', () => {
    log('you have been disconnected');
  });

  socket.on('reconnect', () => {
    log('you have been reconnected');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', () => {
    log('attempt to reconnect has failed');
  });

});
//Script que hace todo relacionado con sign in, token, get unidades
