const express = require("express");
const app = express();

const { createClient } = require("redis");
const client = createClient();

const getAllProducts = async () => {
  const time = Math.random() * 5000;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["Produto 1", "Produto 2"]);
    }, time);
  });
};

app.get("/", async (req, res) => {
  const productsFromCache = await client.get("getAllProducts");
  if (productsFromCache) {
    // se tiver cache
    return res.send(JSON.parse(productsFromCache)); //retorna
  }
  //caso contrario
  const products = await getAllProducts(); // busca os produtos
  await client.set("getAllProducts", JSON.stringify(products), { EX: 10 }); // salva os produtos , EX 10 usa-se para passar quanto tempo a key vai viver
  res.send(products); // retorna produtos
});

const startup = async () => {
  await client.connect();
  app.listen(3000, () => {
    console.log("Servidor rodando");
  });
};

startup();
