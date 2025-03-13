const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Livre = require("./models/livre");
dotenv.config();

// middelware
app.use(express.urlencoded({ extended: true }));
// gestion des fichiers statiques
app.use(express.static("public"))
//invocation de ejs
app.set("view engine", "ejs");

// connexion via mongoose
mongoose
  .connect("mongodb+srv://aimadelkaouri:aimad@livre.mwbti.mongodb.net/?retryWrites=true&w=majority&appName=livre")
  .then(() => {
    console.log("Connecté à Mongodb via Mongoose");
  })
  .catch((error) => console.error(error));



  app.post("/livres", async (req, res) => {
    const newLivre = new Livre({ titre: req.body.titre, auteur: req.body.auteur, date: req.body.date, resume: req.body.resume, });
    try {
      await newLivre.save();
      res.redirect("/livres");
    } catch (error) {
      res
        .status(400)
        .send("Erreur lors de l'ajout d'un livre! ," + error.message);
    }
  });


  app.get("/livres", async (req, res) => {
    try {
    //     const livres = await Livre.find();
    //   res.render("view_livre", {livres});

    let page = parseInt(req.query.page) || 1; // Page actuelle, par défaut 1
        let limit = 2; // Nombre de livres par page
        let skip = (page - 1) * limit; // Calcul de l'offset

        const livres = await Livre.find().skip(skip).limit(limit); // Récupérer les livres paginés
        const totalLivres = await Livre.countDocuments(); // Nombre total de livres

        res.render("view_livre", { 
            livres, 
            currentPage: page, 
            totalPages: Math.ceil(totalLivres / limit) 
        });


    } catch (error) {
      res.status(500).send("Erreur lors de la récupération des livres");
    }
  });

  app.get("/livres/edit/:id", async (req, res) => {
    try {
        const livre = await Livre.findById(req.params.id);
      res.render("edit_livre", {livre});
    } catch (error) {
      console.log(error)
    }
  });


  
app.post("/livres/:id", async (req, res) => {
    try {
      await Livre.findByIdAndDelete(req.params.id);
      res.redirect("/livres");
    } catch (error) {
      res
        .status(500)
        .send("Erreur lors de la suppression du livre: " + error.message);
    }
  });
  



app.listen(process.env.PORT, process.env.HOSTNAME, () => {
    console.log(
      `server is running on http://${process.env.HOSTNAME}:${process.env.PORT}`
    );
  });