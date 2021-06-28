const sequelize = require("sequelize");
const { DataTypes, Op } = sequelize;
const Schedule = require("../models/schedule")(sequelize, DataTypes);
const { db } = require("../config/configProvider")();
const { isNull } = require("../utils/main");
const { emailFormater } = require("../middlewares/generics");

const ScheduleController = require("express").Router();

// const check = async (req, res, next) => {
//   const Response = { error: null, data: null }
//   try {
//     const { start, end } = req.body
//     const checkoverlap = await db.query(`SELECT id FROM events WHERE
//     ('${start}' >= START
//         AND '${start}' < END)
//         OR ('${end}' >= START
//         AND '${end}' < END)`)
//     if (checkoverlap[0].length == 0) {
//       next()
//     } else {
//       Response.error = { message: 'Overlap' }
//       res.json(Response)
//     }
//   } catch (err) {
//     Response.error = { message: err }
//     res.status(500).json(Response)
//   }
// }

ScheduleController.post("/add", async (req, res) => {
  const Response = { error: null, data: null };
  try {
    newSchedule = new Schedule(
      ({
        createdBy,
        type,
        nokiaid,
        bgColor,
        title,
        status,
        replacement,
        firstname,
        lastname,
        start,
        end,
      } = req.body)
    );
    console.log(req.body);
    const [typeQuery] = await db.query(
      `SELECT "InitialLevel" FROM types WHERE type='${type}'`
    );

    newSchedule.status = typeQuery[0].InitialLevel;

    newSchedule.task_admin = true
    newSchedule.task_operational = false

    console.log(typeQuery[0].InitialLevel);

    if (isNull(title)) {
      newSchedule.title = newSchedule.type;
    }

    await newSchedule.save();
    Response.data = { newSchedule };

    // FIXME: update status to newSchedule.status
    emailFormater(
      nokiaid,
      newSchedule.status,
      replacement,
      type,
      createdBy,
      start,
      end,
      "ADD"
    );

    res.json(Response);
  } catch (err) {
    Response.error = { message: err };
    res.status(500).json(Response);
  }
});

ScheduleController.post("/get", async (req, res) => {
  await console.log(req.body.admin, req.body.operational)
  const Response = { error: null, data: null };
  if (req.params.title === null || req.params.title === undefined) {
    try {
      const schedule = await Schedule.findAll({
        where: {
          [Op.and]: [
            { status: "L3" },
            { task_admin: req.body.admin },
            { task_operational: req.body.operational }
          ]
        }
      });
      if (!schedule) {
        Response.error = { message: "No Schedule found." };
        res.json(Response);
      }
      res.json({ schedule });
    } catch (error) {
      Response.error = { message: error };
      res.status(500).json(Response);
    }
  } else {
    Response.error = { message: "Bad Request" };
    res.status(400).json(Response);
  }
});

ScheduleController.get("/get/status", async (req, res) => {
  const Response = { error: null, data: null };
  if (req.params.title === null || req.params.title === undefined) {
    try {
      const schedule = await Schedule.findAll({
        where: { [Op.or]: [{ status: "L2" }, { status: "L1" }] },
      });
      if (!schedule) {
        Response.error = { message: "No Schedule found." };
        res.json(Response);
      }
      Response.data = schedule;
      res.json(Response);
    } catch (e) {
      Response.error = { message: err };
      res.status(500).json(Response);
    }
  } else {
    Response.error = { message: "Bad Request" };
    res.status(400).json(Response);
  }
});

ScheduleController.post("/update/:id?", async (req, res) => {
  const Response = { error: null, data: null };

  const {
    start,
    end,
    title,
    type,
    nokiaid,
    newResource,
    id,
    replacement,
    createdBy,
    status,
    event,
  } = req.body;

  console.log(req.body);
  if (!isNull(start) && !isNull(end) && !isNull(title)) {
    //update DragAndDrop
    const updateScheduleDnD = await Schedule.update(
      { title, start, end, nokiaid: newResource, type, replacement },
      { where: { nokiaid, id } }
    );
    if (!updateScheduleDnD) {
      Response.error = { message: "No Schedule found." };
      res.json(Response);
    }
    Response.data = updateScheduleDnD;

    // check if values or null
    let newReplacement = "";
    if (!isNull(replacement)) {
      newReplacement = replacement;
    } else {
      if (event !== undefined) {
        newReplacement = event.replacement;
      }
    }
    let createdBy = "";
    if (isNull(createdBy)) {
      createdBy = "error to be resolved";
    }

    let newType = "";
    if (!isNull(type)) {
      newType = type;
    } else {
      newType = event.type;
    }
    emailFormater(
      nokiaid,
      "L3",
      newReplacement,
      newType,
      createdBy,
      start,
      end,
      "UPDATE"
    );
    res.json(Response);
  } else if (
    req.body.status !== "" &&
    req.body.status !== undefined &&
    req.body.status !== null
  ) {
    //update Approval
    const { nokiaid, status, ids, events } = req.body;
    const updateScheduleApproval = await Schedule.update(
      { nokiaid, status, events },
      { where: { id: ids } }
    );

    if (!updateScheduleApproval) {
      Response.error = { message: "No Schedule found." };
      res.json(Response);
    }
    Response.data = updateScheduleApproval;
    res.json(updateScheduleApproval);
    // filter which ids are approved in order to call emailFormater
    events.forEach((element) => {
      if (ids.includes(element.id)) {
        emailFormater(
          element.nokiaid,
          status,
          element.replacement,
          element.type,
          element.createdBy,
          element.start,
          element.end,
          "APPROVAL"
        );
      }
    });
  } else {
    //update Start
    if (req.body.start !== undefined && req.body.start !== "") {
      const { start, id } = req.body;
      const updateScheduleStart = await Schedule.update(
        { start },
        { where: { id } }
      );
      if (!updateScheduleStart) {
        Response.error = { message: "No Schedule found." };
        res.json(Response);
      }
    }
    //update End
    if (req.body.end !== undefined && req.body.end !== "") {
      const { end, id, event } = req.body;
      console.log(event);
      const updateScheduleEnd = await Schedule.update(
        { end },
        { where: { id } }
      );
      emailFormater(
        nokiaid,
        status,
        replacement,
        type,
        createdBy,
        start,
        end,
        "UPDATE"
      );
      if (!updateScheduleEnd) {
        Response.error = { message: "No Schedule found." };
        res.json(Response);
      }
    }
    //update Title
    if (req.body.title !== undefined && req.body.title !== "") {
      const { title, id } = req.body;
      const updateScheduleTitle = await Schedule.update(
        { title },
        { where: { id } }
      );
      if (!updateScheduleTitle) {
        Response.error = { message: "No Schedule found." };
        return res.json(Response);
      }
    }
    //update Color
    if (req.body.bgColor !== undefined && req.body.bgColor !== "") {
      const { bgColor, id } = req.body;
      const updateScheduleColor = await Schedule.update(
        { bgColor },
        { where: { id } }
      );
      if (!updateScheduleColor) {
        Response.error = { message: "No Schedule found." };
        return res.json(Response);
      }
    }
    //update Type
    if (req.body.type !== undefined && req.body.type !== "") {
      const { type, id } = req.body;
      const updateScheduleType = await Schedule.update(
        { type },
        { where: { id } }
      );
      if (!updateScheduleType) {
        Response.error = { message: "No Schedule found." };
        return res.json(Response);
      }
    }
    //update Replacement
    if (req.body.replacement !== undefined && req.body.replacement !== "") {
      const { replacement, id } = req.body;
      const updateScheduleReplacement = await Schedule.update(
        { replacement },
        { where: { id } }
      );
      if (!updateScheduleReplacement) {
        Response.error = { message: "No Schedule found." };
        return res.json(Response);
      }
    }
    Response.data = "OK";
    // TODO: add emailhandler

    res.json(Response);
  }
  // TODO: add function to process email handler request. for loop if multiple events, go to email formatter if events
});

ScheduleController.delete("/delete/:id", async (req, res, next) => {
  // console.log(events);
  const Response = { error: null, data: null };
  console.log(req.body);
  const id = JSON.parse("[" + req.params.id + "]");
  const userlevel = "L1";
  const deleteSchedule = await Schedule.destroy({ where: { id } });
  if (!deleteSchedule) {
    Response.error = { message: "No Schedule found." };
    return res.json(Response);
  }
  Response.data = "OK";
  res.json(Response);
  // emailFormater(
  //   nokiaid,
  //   status,
  //   replacement,
  //   type,
  //   createdBy,
  //   start,
  //   end,
  //   "DELETE"
  // );
});

module.exports = ScheduleController;
