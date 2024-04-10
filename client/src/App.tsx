import { io } from "socket.io-client";

const socket = io("https://wizards-peqx.onrender.com");
var GameCanvas = document.createElement("canvas");
var CreateRoomButtom = document.createElement("button")
var JoinRoomButtom = document.createElement("button")
var ChooseNameHostDone = document.createElement("button")
var ChooseNameHostTextbox = document.createElement("input")
var ChooseNameJoinGameDone = document.createElement("button")
var ChooseNameJoineGameTextbox = document.createElement("input")
var ChooseNameJoinNameDone = document.createElement("button")
var ChooseNameJoinNameTextbox = document.createElement("input")
var ChooseNameError = document.createElement("p")
var ctx: CanvasRenderingContext2D | any 
var players: any[]
var loaded = false;
var X = 0;
var Y = 0;
var speed = 0.7;
var newImage = new Image();
var newImage2 = new Image();
const items = {
  block: {
    name: "block",
    scale: [50, 50]
  },
  CobbleStoneTile :{
    name: "Cobble_Stone_Tile"
  }
}
const DefaultMap = {
  CollibleObjects: [
    {
      ...items.block,
      position: [0, 0]
    }
  ],
  UnCollibleObjects: [
    {
      ...items.CobbleStoneTile,
      position: [200, 200]
    }
  ]
}
var room = "default";
var JoinedRoom = false;
var Games: any[]
var ErrorNameVisible = false;

let MovingUp = false;
let MovingDown = false;
let MovingLeft = false;
let MovingRight = false;

setInterval(function() { 
  draw();
}, 1);

window.addEventListener('keypress', (e) => {
  switch (e.key) {
    case "w" || "W":
      MovingUp = true;
      return;
    case "s" || "S":
      MovingDown = true;
      return;
    case "a" || "A":
        MovingLeft = true;
        return;
    case "d" || "D":
        MovingRight = true;
        return;
  }
})
window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case "w" || "W":
      MovingUp = false;
      return;
    case "s" || "S":
      MovingDown = false;
      return;
    case "a" || "A":
        MovingLeft = false;
        return;
    case "d" || "D":
        MovingRight = false;
        return;
  }
})

function JoinGameCode(){
  document.body.removeChild(JoinRoomButtom);
  document.body.removeChild(CreateRoomButtom);
  ChooseNameJoinGameDone.innerHTML = "Done"
  ChooseNameJoinGameDone.id = "ChooseJoinGameDone"
  ChooseNameJoinGameDone.onclick = JoinSetNameMenu
  document.body.appendChild(ChooseNameJoinGameDone)
  ChooseNameJoineGameTextbox.placeholder = "Game Code"
  ChooseNameJoineGameTextbox.id = "ChooseJoinGameTextbox"
  document.body.appendChild(ChooseNameJoineGameTextbox)
}

function JoinSetNameMenu(){
  for(let i = 0; i < Games.length; i++){
    if(Games[i].code === ChooseNameJoineGameTextbox.value){
      SetRoom(ChooseNameJoineGameTextbox.value);
      document.body.removeChild(ChooseNameJoinGameDone);
      document.body.removeChild(ChooseNameJoineGameTextbox);
      SetRoom(Games[i].code);
      room = Games[i].code
      ShowChooseNameJoin()
    }
  }
}

function ShowChooseNameJoin(){
  ChooseNameJoinNameDone.innerHTML = "Done"
  ChooseNameJoinNameDone.id = "ChooseNameJoinNameDone"
  ChooseNameJoinNameDone.onclick = DetermineJoinNameAndJoin;
  document.body.appendChild(ChooseNameJoinNameDone);
  ChooseNameJoinNameTextbox.placeholder = "Name"
  ChooseNameJoinNameTextbox.id = "ChooseNameJoinNameTextbox"
  document.body.appendChild(ChooseNameJoinNameTextbox)
}

function DetermineJoinNameAndJoin(){
  if(ChooseNameJoinNameTextbox.value != null && ChooseNameJoinNameTextbox.value != ""){
    for(let i = 0; i < players.length; i++){
      if(players[i].id === socket.id){
        players[i].name = ChooseNameJoinNameTextbox.value;
        socket.emit("setname", players)
        document.body.removeChild(ChooseNameJoinNameTextbox);
        document.body.removeChild(ChooseNameJoinNameDone);
        if(ErrorNameVisible){
          document.body.removeChild(ChooseNameError);
        }
        JoinedRoom = true;
      }
    }
  } else {
    ChooseNameError.id = "ChooseNameError"
    ChooseNameError.innerHTML = "Invalid Name"
    ErrorNameVisible = true;
    document.body.appendChild(ChooseNameError)
  }
}

function CreateRoom(){
  CreateHostRoom(getRandomInt(99999).toString())
  document.body.removeChild(CreateRoomButtom)
  document.body.removeChild(JoinRoomButtom)
  ShowChooseRoomHost()
}

function ShowChooseRoomHost(){
  ChooseNameHostDone.innerHTML = "Done"
  ChooseNameHostDone.id = "ChooseNameHostDone"
  ChooseNameHostDone.onclick = SetNameHost
  document.body.appendChild(ChooseNameHostDone);
  ChooseNameHostTextbox.placeholder = "Name";
  ChooseNameHostTextbox.id = "ChooseNameHostTextbox"
  document.body.appendChild(ChooseNameHostTextbox);
}



function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
  
}

function SetRoom(Room: string){
  for(let i = 0; i < players.length; i++){
    if(players[i].id === socket.id){
      players[i].game = Room;
      socket.emit("changeroom", players)
      room = Room;
    }
  }
}
function CreateHostRoom(Room: string){
  for(let i = 0; i < players.length; i++){
    if(players[i].id === socket.id){
      players[i].game = Room;
      socket.emit("createroom", Room)
      room = Room;
    }
  }
}
function SetNameHost(){
  if(ChooseNameHostTextbox.value != null && ChooseNameHostTextbox.value != ""){
    for(let i = 0; i < players.length; i++){
      if(players[i].id === socket.id){
        players[i].name = ChooseNameHostTextbox.value;
        socket.emit("setname", players)
        document.body.removeChild(ChooseNameHostTextbox);
        document.body.removeChild(ChooseNameHostDone);
        if(ErrorNameVisible){
          document.body.removeChild(ChooseNameError);
        }
        JoinedRoom = true;
      }
    }
  } else {
    ChooseNameError.id = "ChooseNameError"
    ChooseNameError.innerHTML = "Invalid Name"
    ErrorNameVisible = true;
    document.body.appendChild(ChooseNameError)
  }
}

socket.on("players", (value) => {
  players = value;
  console.log(players)
});

socket.on("game", (value) => {
  Games = value
})

window.addEventListener("load", function(){
  loaded = true;
  GameCanvas.id = "GameCanvas";
  GameCanvas.width = window.innerWidth;
  GameCanvas.height = window.innerHeight;
  document.body.appendChild(GameCanvas)
  ctx = GameCanvas.getContext("2d");
  CreateRoomButtom.id = "createGameButton"
  CreateRoomButtom.innerText = "Create Game"
  CreateRoomButtom.onclick = CreateRoom
  this.document.body.appendChild(CreateRoomButtom)
  ctx = GameCanvas.getContext("2d");
  JoinRoomButtom.id = "joinGameButton"
  JoinRoomButtom.innerText = "Join Game"
  JoinRoomButtom.onclick = JoinGameCode;
  this.document.body.appendChild(JoinRoomButtom)
  ChooseNameJoinNameTextbox.autocomplete = "off"
  ChooseNameJoineGameTextbox.autocomplete = "off"
  ChooseNameHostTextbox.autocomplete = "off"
});

function draw(){
  if(loaded && JoinedRoom){
  ctx.fillStyle = "black";
  GameCanvas.width = window.innerWidth;
  GameCanvas.height = window.innerHeight;
  InterpretUnClollideableMap()
  for(let i = 0; i < players.length; i++){
    if(players[i].id == socket.id){
      if(players[i].facing === "Left"){
        newImage.src = "/Wizard_" + players[i].sprite + ".png"
      } else {
        newImage.src = "/Wizard_" + players[i].sprite + "_" + players[i].facing + ".png"
      }

    ctx.fillStyle = "white"
    ctx.fillText(players[i].name, GameCanvas.width / 2 + 32, GameCanvas.height / 2 - 10)
    }
  }
  
  ctx.drawImage(newImage, 0, 0, 204, 192, GameCanvas.width / 2, GameCanvas.height / 2, 100, 100);
  for(var i = 0; i < players.length; i++){
    if(players[i].game === room){
      if(players[i].id != socket.id){
        if(players[i].facing === "Left"){
          newImage2.src = "/Wizard_" + players[i].sprite + ".png"
        } else {
          newImage2.src = "/Wizard_" + players[i].sprite + "_" + players[i].facing + ".png"
        }
        ctx.drawImage(newImage2, 0, 0, 204, 192, GameCanvas.width / 2 + players[i].position[0] - X, GameCanvas.height / 2 + players[i].position[1] - Y, 100, 100);
        
      ctx.fillStyle = "white"
      ctx.fillText(players[i].name, GameCanvas.width / 2 + 32 + players[i].position[0] - X, GameCanvas.height / 2 - 10 + players[i].position[1] - Y)
      }
    }
  }
  if(MovingUp){
    Y-=speed;
    for(let a = 0; a < Games.length; a++){
      if(Games[a].code == room){
        if(Games[a].Map === "Default"){
          for(let i = 0; i < DefaultMap.CollibleObjects.length; i++){
            if(collision(DefaultMap.CollibleObjects[i])) {
              Y+=speed;
          }
        }
      }
    }
  }
    socket.emit("move", socket.id, X, Y, "Up")
  }
  if(MovingDown){
    Y+=speed;
    for(let a = 0; a < Games.length; a++){
      if(Games[a].code == room){
        if(Games[a].Map === "Default"){
          for(let i = 0; i < DefaultMap.CollibleObjects.length; i++){
            if(collision(DefaultMap.CollibleObjects[i])) {
              Y-=speed;
          }
        }
      }
    }
  }
    socket.emit("move", socket.id, X, Y, "Down")
  }

  if(MovingLeft){
    X-=speed;
    for(let a = 0; a < Games.length; a++){
      if(Games[a].code == room){
        if(Games[a].Map === "Default"){
          for(let i = 0; i < DefaultMap.CollibleObjects.length; i++){
            if(collision(DefaultMap.CollibleObjects[i])) {
              X+=speed;
          }
        }
      }
    }
  }
    socket.emit("move", socket.id, X, Y, "Left")
  }

  if(MovingRight){
    X+=speed;
    for(let a = 0; a < Games.length; a++){
      if(Games[a].code == room){
        if(Games[a].Map === "Default"){
          for(let i = 0; i < DefaultMap.CollibleObjects.length; i++){
            if(collision(DefaultMap.CollibleObjects[i])) {
              X-=speed;
          }
        }
      }
    }
  }
    socket.emit("move", socket.id, X, Y, "Right")
  }

  InterpretCollideableMap()
} else if(loaded){
  ctx.fillStyle = `#242424`;
  ctx.fillRect(0, 0, GameCanvas.width, GameCanvas.height);
}

}


function App() {

  return (
    <>
    </>
  )
}


export default App

function InterpretCollideableMap(){
  for(let i = 0; i < Games.length; i++){
    if(Games[i].code === room) {
      if(Games[i].Map === "Default"){
        for(let a = 0; a < DefaultMap.CollibleObjects.length; a++){
          if(DefaultMap.CollibleObjects[a].name === "block"){
            ctx.fillStyle = "white"
            ctx.fillRect(DefaultMap.CollibleObjects[a].position[0] - X, DefaultMap.CollibleObjects[a].position[1] - Y, 50, 50)
          }
        }
      }
    }
  }
}

function InterpretUnClollideableMap(){
    for(let i = 0; i < Games.length; i++){
    if(Games[i].code === room) {
      if(Games[i].Map === "Default"){
        for(let a = 0; a < DefaultMap.UnCollibleObjects.length; a++){
          if(DefaultMap.UnCollibleObjects[a].name === "Cobble_Stone_Tile"){
            let CobbleImage = new Image()
            CobbleImage.src = "/Cobble Stone Floor.png"
            ctx.drawImage(CobbleImage, 0, 0, 225, 224, DefaultMap.UnCollibleObjects[a].position[0] - X, DefaultMap.UnCollibleObjects[a].position[1] - Y, 50, 50)
          }
        }
      }
    }
  }
}

function collision(object: { position: number[]; scale: number[] }) {
  return (
    GameCanvas.width / 2 + 63 >= object.position[0] - X &&
    object.position[0] - X + object.scale[0] - 36 >= GameCanvas.width / 2  &&
    GameCanvas.height / 2  + 85 >= object.position[1] - Y &&
    object.position[1] - Y + object.scale[1] - 11 >= GameCanvas.height / 2

    )
}



