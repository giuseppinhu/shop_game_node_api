const createGame = () => {
  const title = document.getElementById("title");
  const year = document.getElementById("year");
  const price = document.getElementById("price");

  var game = {
    title: title.value,
    year: year.value,
    price: price.value,
  };

  axios.post("http://localhost:4040/game", game).then((res) => {
    if (res.status === 200) {
      alert("Jogo cadastrado com sucesso.");
      location.reload();
    }
  });
};

const deleteGame = (item) => {
  const id = item.getAttribute("data-id");

  axios
    .delete(`http://localhost:4040/game/${id}`)
    .then((res) => {
      alert("Jogo deletado com sucesso");
      location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};

const loadForm = (item) => {
  const id = item.getAttribute("data-id");
  const title = item.getAttribute("data-title");
  const price = item.getAttribute("data-price");
  const year = item.getAttribute("data-year");

  document.getElementById("idEdit").value = id;
  document.getElementById("titleEdit").value = title;
  document.getElementById("priceEdit").value = price;
  document.getElementById("yearEdit").value = year;
};

const editGame = () => {
  const title = document.getElementById("titleEdit");
  const year = document.getElementById("yearEdit");
  const price = document.getElementById("priceEdit");

  var game = {
    title: title.value,
    year: year.value,
    price: price.value,
  };

  const id = document.getElementById("idEdit").value;

  axios.put(`http://localhost:4040/game/${id}`, game).then((res) => {
    if (res.status === 200) {
      alert("Jogo editado com sucesso.");
      location.reload();
    }
  });
};

axios
  .get("http://localhost:4040/games")
  .then((res) => {
    const games = res.data;
    const gameList = document.getElementById("list");

    games.forEach((game) => {
      const itemList = document.createElement("li");

      itemList.setAttribute("data-id", game.id);
      itemList.setAttribute("data-title", game.title);
      itemList.setAttribute("data-price", game.price);
      itemList.setAttribute("data-year", game.year);

      itemList.innerHTML = `
          <div>
            Nome: ${game.title}<br/>
            Ano: ${game.year}<br/>
            Preço: R$ ${game.price}
          </div>
        `;

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "Deletar";

      deleteBtn.addEventListener("click", function () {
        deleteGame(itemList);
      });

      itemList.appendChild(deleteBtn);

      const editBtn = document.createElement("button");
      editBtn.innerHTML = "Editar";

      editBtn.addEventListener("click", function () {
        loadForm(itemList);
      });

      itemList.appendChild(editBtn);

      gameList.appendChild(itemList);
    });
  })
  .catch((error) => {
    console.log(error);
  });
