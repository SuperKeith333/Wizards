import { Server } from "socket.io";

const io = new Server({
  cors:{
      origin: "https://refactored-telegram-x766p79x9wrcv9x5-5173.app.github.dev"
  }
});

io.listen(3001);

const players = []

const MapParts = {
  block: {
    name: "block"
  }
}

const map = [
  {
    ...MapParts.block,
    position: [0, 0]
  }
]

io.on("connection", (socket) => {
  console.log("user connected")
  console.log(players.length)
  players.push({
    id: socket.id,
    position: [0, 0],
    sprite: "Wizard_White_Blue"
  })

  io.emit("map", map);
  io.emit("players", players);
  

  socket.on("move", (Id, X, Y) => {
    for(var i = 0; i < players.length; i++){
      if(players[i].id == Id) {
        players[i].position[0] = X;
        players[i].position[1] = Y;
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