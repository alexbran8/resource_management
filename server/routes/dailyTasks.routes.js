module.exports = app => {
    const dailyTasks = require("../controllers/dailyTasks.controller.js");

    var router = require("express").Router();

    // Create a new Project
    router.post("/", dailyTasks.create);

    router.post("/tasktransfer", dailyTasks.transfer);
    router.post("/selfassign", dailyTasks.selfassign);

    // Retrieve all Projects
    router.get("/", dailyTasks.findAll);

    // Retrieve a single Project with id
    router.get("/:id", dailyTasks.findOne);

    // Update a Project with id
    router.put("/:id", dailyTasks.update);

    // Delete a Project with id
    router.delete("/:id", dailyTasks.delete);

    // Delete all Projects
    router.delete("/", dailyTasks.deleteAll);

    app.use('/dailyTasks', router);
}