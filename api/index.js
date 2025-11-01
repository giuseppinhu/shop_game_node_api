const express = require("express");
const app = express();
const port = 4040;

const cors = require("cors");

app.use(cors());

const connection = require("../db/database");

const Game = require("../db/Game");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection
  .authenticate()
  .then(() => {
    console.log("Conectado ao DB com sucesso!");
  })
  .catch((err) => {
    console.log(`Ocorreu um error: ${err}`);
  });

// ROUTE GET
app.get("/games", (req, res) => {
  res.statusCode = 200;
  Game.findAll().then((games) => {
    res.json(games);
  });
});

// ROUTE GET FIND ID
app.get("/game/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);

    Game.findOne({
      where: {
        id: id,
      },
    }).then((game) => {
      if (game == undefined) {
        res.sendStatus(404);
      } else {
        res.json(game);
        res.sendStatus(200);
      }
    });
  }
});

// ROUTE CREATE
app.post("/game", (req, res) => {
  var { title, year, price } = req.body;

  Game.create({
    title: title,
    price: price,
    year: year,
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
});

// ROUTE DELETE
app.delete("/game/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);

    Game.destroy({
      where: {
        id: id,
      },
    })
      .then((game) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        res.sendStatus(400);
      });
  }
});

// ROUTE EDIT
app.put("/game/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);

    var { title, price, year } = req.body;

    Game.update(
      {
        title: title,
        price: price,
        year: year,
      },
      {
        where: {
          id: id,
        },
      }
    ).then((game) => {
      if (game === undefined) {
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Rodando na porta: ${port}`);
});
