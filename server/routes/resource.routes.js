module.exports = app => {
    const resources = require("../controllers/resource.controller.js");

    var router = require("express").Router();

    // Retrieve all Resources
    router.get("/", resources.findAll);
   
    app.use('/resources', router);

}