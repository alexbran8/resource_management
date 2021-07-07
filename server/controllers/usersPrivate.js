const UsersController = require("express").Router();
const sequelize = require("sequelize");
const { Op, DataTypes } = sequelize;
const User = require("../models/user")(sequelize, DataTypes);
const { db } = require("../config/configProvider")();
// const bcrypt = require("bcryptjs");

UsersController.get("/get/:id?", async (req, res, next) => {
  if (req.params.id === null || req.params.id === undefined) {
    const users = await User.findAll({
      where: {
        level: {
          [Op.not]: "L0",
        },
      },
      order: ["lastname"],
    });
    if (!users) {
      res.status(500);
    }
    const team = await User.aggregate("main_team", "DISTINCT", {
      plain: false, order: ["main_team"],
    });
    if (!team) {
      res.status(500);
    }
    const line_manager = await db.query(
      "SELECT DISTINCT LINE_MANAGER_LASTNAME,LINE_MANAGER_FIRSTNAME FROM employees WHERE NOT LINE_MANAGER_LASTNAME = '' "
      // S INNER JOIN(SELECT nokiaid FROM employees GROUP BY nokiaid HAVING COUNT(*)=1) T ON S.nokiaid = T.nokiaid"
    );
    if (!line_manager) {
      res.status(500);
    }
    const tpm = await db.query(
      "SELECT DISTINCT TPM_FIRSTNAME,TPM_LASTNAME FROM employees WHERE NOT TPM_LASTNAME IS NULL ORDER BY TPM_FIRSTNAME"
      // S INNER JOIN(SELECT nokiaid FROM employees GROUP BY nokiaid HAVING COUNT(*)=1) T ON S.nokiaid = T.nokiaid"
    );
    if (!tpm) {
      res.status(500);
    }
    const employeers = await db.query(
      "SELECT DISTINCT EMPLOYEER FROM employees WHERE NOT EMPLOYEER IS NULL"
      // S INNER JOIN(SELECT nokiaid FROM employees GROUP BY nokiaid HAVING COUNT(*)=1) T ON S.nokiaid = T.nokiaid"
    );
    if (!employeers) {
      res.status(500);
    }
    res.json({ users, team, line_manager, tpm, employeers });
  } else {
    const { id } = req.params;
    const users = await User.findAll({ where: { nokiaid: id } });
    res.json({ users });
  }
  res.status(400);
});

UsersController.post("/get/filter", async (req, res, next) => {
  const { line_manager, team, coordinator, employeers, resources } = req.body;

  const resField = "FISTNAME, LASTNAME";

  const filterUsers = await User.findAll({
    where: {
      [Op.not]: [{ level: "L0" }],
      [Op.and]: [
        {
          [Op.or]: [
            { tpm_firstname: { [Op.substring]: `${coordinator}` } },
            { tpm_lastname: { [Op.substring]: `${coordinator}` } },
          ],
        },
        {
          [Op.or]: [
            { main_team: { [Op.substring]: `${team}` } },
            { second_team: { [Op.substring]: `${team}` } },
            { third_team: { [Op.substring]: `${team}` } },
            { fourth_team: { [Op.substring]: `${team}` } },
          ],
        },
        {
          [Op.or]: [
            { line_manager_firstname: { [Op.substring]: `${line_manager}` } },
            { line_manager_lastname: { [Op.substring]: `${line_manager}` } },
          ],
        },
        {
          [Op.or]: [{ employeer: { [Op.substring]: `${employeers}` } }],
        },
        {
          [Op.or]: [
            sequelize.where(
              sequelize.fn(
                "concat",
                sequelize.col("lastname"),
                ", ",
                sequelize.col("firstname")
              ),
              {
                [Op.substring]: `${resources}`,
              }
            ),
          ],
        },
      ],
    },
    order: ["lastname"],
  });
  if (!filterUsers) {
    res.status(500);
  }
  res.json({ filterUsers });
});

UsersController.post("/edit", async (req, res, next) => {
  const {
    shortid,
    nokiaid,
    city,
    employeer,
    email,
    level,
    main_team,
    second_team,
    third_team,
    upalu,
    bandeau,
    activity,
    new_onnet,
    new_tel_fr,
    marca,
    location_area,
    location_number,
    line_manager_firstname,
    line_manager_lastname,
    tpm_firstname,
    tpm_lastname,
    checkPassword,
  } = req.body;
  let password = req.body.password;
  // if (password !== checkPassword) {
  //   password = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  // }
  const updateUser = await User.update(
    {
      shortid,
      nokiaid,
      city,
      employeer,
      email,
      level,
      main_team,
      second_team,
      third_team,
      upalu,
      bandeau,
      activity,
      new_onnet,
      new_tel_fr,
      marca,
      location_area,
      location_number,
      line_manager_firstname,
      line_manager_lastname,
      tpm_firstname,
      tpm_lastname,
      password,
    },
    { where: { nokiaid } }
  );
  if (!updateUser) {
    res.status(500);
  }
  res.json({ status: "OK" });
});

UsersController.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  const deleteUser = await User.destroy({ where: { nokiaid: id } });
  if (!deleteUser) {
    res.status(500);
  }
  res.json({ status: "OK" });
});

module.exports = UsersController;
