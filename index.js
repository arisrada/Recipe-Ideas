import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const API_URL = "https://api.spoonacular.com/recipes";

const yourApiKey = "dc6ebc470a0b47d78fd80ed4b7093a81";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let data;

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.post("/ingredients", async (req, res) => {
  try {
    const ingredients = req.body.ingredients;
    const ingredientsList = ingredients
      .split(",")
      .map((item) => item.trim())
      .join(",+");
    const response = await axios.get(API_URL + "/findByIngredients", {
      params: { apiKey: yourApiKey, ingredients: ingredientsList },
    });
    const result = response.data;

    res.render("index.ejs", { recipes: result });
  } catch (err) {
    res.status(404).send(err);
  }
});

app.post("/recipes", async (req, res) => {
  try {
    const id = req.body.selectedRecipeId;
    const response = await axios.get(API_URL + `/${id}` + "/information", {
      params: { apiKey: yourApiKey },
    });
    const result = response.data;
    res.render("index.ejs", { details: result });
  } catch (err) {
    res.status(404).send(err);
  }
});
app.post("/reset", async (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
