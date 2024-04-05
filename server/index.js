import { Server } from "socket.io";

const io = new Server({
  cors:{
      origin: "https://refactored-telegram-x766p79x9wrcv9x5-5173.app.github.dev"
  }
});

io.listen(3001);

var players = []
var Games = []

const MapParts = {
  block: {
    name: "block",
    color: "white",
    scale: [50, 50]
  }
}

const map = [
  {
    ...MapParts.block,
    position: [0, 0]
  },
  {
    ...MapParts.block,
    position: [100, 100]
  }
]

function PickRandomWizardColor(){
  let rand = getRandomInt(6)
  if(rand === 0){
    return "Blue"
  } else if (rand === 1){
    return "Pink"
  }else if (rand === 2){
    return "Purple"
  }else if (rand === 3){
    return "Light_Blue"
  }else if (rand === 4){
    return "Green"
  }else if (rand === 5){
    return "Orange"
  }else if (rand === 6){
    return "Red"
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

io.on("connection", (socket) => {
  console.log("user connected")
  console.log(players.length + 1)
  players.push({
    id: socket.id,
    position: [0, 0],
    sprite: PickRandomWizardColor(),
    game: "default",
    facing: "Left",
    name: "Default"
  })

  io.emit("map", map);
  io.emit("players", players);
  io.emit("game", Games)

  socket.on("setname", (Players) => {
    players = Players;
    io.emit("players", players)
  })
  
  socket.on("changeroom", (Players) => {
    players = Players;
    io.emit("players", players);
  })
  socket.on("createroom", (Room) => {
    Games.push({
      code: Room
    })
    io.emit("game", Games)
    console.log(Games)
  })

  socket.on("move", (Id, X, Y, Facing) => {
    for(var i = 0; i < players.length; i++){
      if(players[i].id == Id) {
        players[i].position[0] = X;
        players[i].position[1] = Y;
        players[i].facing = Facing;
      }
    }
    io.emit("players", players);
  })

  socket.on("disconnect", () => {
    console.log("user disconnected")
    players.splice(
        players.findIndex((player) => player.id === socket.id)
    );

    io.emit("players", players);

    console.log(players.length)
})
});