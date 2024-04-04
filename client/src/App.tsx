import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import player from '/pixil-frame-0.png'
import { io } from "socket.io-client";
import { atom, useAtom } from 'jotai';

const socket = io("https://refactored-telegram-x766p79x9wrcv9x5-3001.app.github.dev/");
const playerAtom = atom([]);
var GameCanvas = document.createElement("canvas");
var ctx: CanvasRenderingContext2D | any 
var players: any[]
var loaded = false;
var X = 0;
var Y = 0;
var speed = 5
var newImage = new Image();
var map;


setInterval(function() { 
  draw();
}, 1);

window.addEventListener('keypress', (e) => {
  switch (e.key) {

    case "w" || "W":
      Y-=speed;
      socket.emit("move", socket.id, X, Y)
      return;
    case "s" || "S":
      Y+=speed;
      socket.emit("move", socket.id, X, Y);
      return;
    case "a" || "A":
        X-=speed;
        socket.emit("move", socket.id, X, Y)
        return;
    case "d" || "D":
        X+=speed;
        socket.emit("move", socket.id, X, Y);
        return;
  }
})


socket.on("players", (value) => {
  players = value;
});
socket.on("map", (value) => {
  map = value;
});
window.addEventListener("load", function(){
  loaded = true;
  GameCanvas.id = "GameCanvas";
  document.body.appendChild(GameCanvas)
  ctx = GameCanvas.getContext("2d");
});

function draw(){
  if(loaded){
  GameCanvas.width = window.innerWidth;
  GameCanvas.height = window.innerHeight;
  ctx.fillStyle = "white";
  newImage.src = player
  ctx.drawImage(newImage, 0, 0, 204, 192, GameCanvas.width / 2, GameCanvas.height / 2, 100, 100);
  for(var i = 0; i < players.length; i++){
    if(players[i].id != socket.id){
      ctx.drawImage(newImage, 0, 0, 204, 192, GameCanvas.width / 2 + players[i].position[0] - X, GameCanvas.height / 2 + players[i].position[1] - Y, 100, 100);
    }
  }
  if(map[0].name === "block"){
    ctx.fillRect(map[0].position[0], map[0].position[1], 50, 50);
  }
}
  
}
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    </>
  )
}

export default App
