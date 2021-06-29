module.exports = app => {
    const competences = require("../controllers/competence.controller.js");

    var router = require("express").Router();
    
    // Retrieve all Competences
    router.get("/", competences.findAll);

    // Retrieve a single Competence with id
    router.get("/:id", competences.findOne);

    // Update a Competence with id
    router.put("/:id", competences.update);

    // Delete a Competence with id
    router.delete("/:id", competences.delete);

    // Delete all Competences
    router.delete("/", competences.deleteAll);

    app.use('/competences', router);
}