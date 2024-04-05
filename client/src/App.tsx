import './App.css'
import playerBlue from '/Wizard_Blue.png'
import playerPink from '/Wizard_Pink.png'
import playerGreen from '/Wizard_Green.png'
import playerLightBlue from '/Wizard_Light_Blue.png'
import playerOrange from '/Wizard_Orange.png'
import playerRed from '/Wizard_Red.png'
import playerPurple from '/Wizard_Purple.png'
import { io } from "socket.io-client";

const socket = io("https://refactored-telegram-x766p79x9wrcv9x5-3001.app.github.dev/");
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
var speed = 5
var newImage = new Image();
var newImage2 = new Image();
var map: any[]
var room = "default";
var JoinedRoom = false;
var Games: any[]
var ErrorNameVisible = false;

setInterval(function() { 
  draw();
}, 1);

window.addEventListener('keypress', (e) => {
  switch (e.key) {
    case "w" || "W":
      Y-=speed;
      for(let i = 0; i < map.length; i++){
        if(collision(map[i])) {
          console.log(true)
          Y+=speed;
        }
      }
      socket.emit("move", socket.id, X, Y, "Up")
      return;
    case "s" || "S":
      Y+=speed;
      for(let i = 0; i < map.length; i++){
        if(collision(map[i])) {
          Y-=speed;
          console.log(true)
        }
      }
      socket.emit("move", socket.id, X, Y, "Down");
      return;
    case "a" || "A":
        X-=speed;
        for(let i = 0; i < map.length; i++){
          if(collision(map[i])) {
            X+=speed;
            console.log(true)
          }
        }
        socket.emit("move", socket.id, X, Y, "Left")
        return;
    case "d" || "D":
        X+=speed;
        for(let i = 0; i < map.length; i++){
          if(collision(map[i])) {
            X-=speed;
            console.log(true)
          }
        }
        socket.emit("move", socket.id, X, Y, "Right");
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
});
socket.on("map", (value) => {
  map = value;
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
});

function draw(){
  if(loaded && JoinedRoom){
  ctx.fillStyle = "black";
  GameCanvas.width = window.innerWidth;
  GameCanvas.height = window.innerHeight;
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
  InterpretMap()
} else if(loaded){

}
  
}
function App() {

  return (
    <>
    </>
  )
}


export default App

function InterpretMap(){
  for(let i = 0; i < map.length; i++){
    if(map[i].name === "block"){
      ctx.fillStyle = map[i].color;
      ctx.fillRect(map[i].position[0] - X, map[i].position[1] - Y, map[i].scale[0], map[i].scale[1])
    }
  }
}

function collision(object: { position: number[]; scale: number[] }) {
  return (
    GameCanvas.width / 2 + 100 >= object.position[0] - X &&
    object.position[0] - X + object.scale[0] >= GameCanvas.width / 2  &&
    GameCanvas.height / 2  + 100 >= object.position[1] - Y &&
    object.position[1] - Y + object.scale[1] >= GameCanvas.height / 2

    )
}
