const express = require("express");
const mongoose = require("mongoose");
const yargs = require("yargs");
const Task = require("./schemas/blog");

require("dotenv").config();

const app = express();

// middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// connect to mongodb
const dbURI = process.env.dbURI;

mongoose
  .connect(dbURI, { useNewUrlParser: true })
  .then((result) => {
    console.log("connected to mongodb..");
    const PORT = process.env.PORT || 8888;
    app.listen(8888, () => console.log(`App listening on port ${PORT}!`));
  })
  .catch((err) => console.log(err));


yargs
  .command({
    command: "create",
    describe: "Add a task",

    builder: {
      Description: {
        describe: "description of the task",
        type: "string",
      },
      Completed: {
        describe: "completed or not",
        type: "boolean",
      },
    },

    handler: function () {
      let task1 = new Task({
          Description: "Desc 1",
        }),
        task2 = new Task({
          Description: "Desc 2",
          Completed: true,
        }),
        task3 = new Task({
          Description: "Desc 3",
          Completed: true,
        }),
        task4 = new Task({
          Description: "Desc 4",
        });

      let task = new Task({
        Description: yargs.argv.Description,
        Completed: yargs.argv.Completed,
      });

      Task.find()
        .then((results) => {
          const taskExists = results.some(
            (result) => result.Description === task.Description
          );
          if (taskExists) {
            console.log("task exists");
          } else {
            console.log("task doesn't exists..");
            task.save((result) => console.log("task created!"));
          }
        })
        .catch((err) => console.log(err));
    },
  })

  .command({
    command: "read",
    describe: "list the uncompleted task",

    handler: function () {
      Task.find()
        .then((results) => {
          results.some((result) => {
            if (result.Completed === false) {
              console.log(result);
            }
          });
        })
        .catch((err) => console.log(err));
    },
  })

  .command({
    command: "update",
    describe: "update the uncompleted task as completed",

    handler: function () {
      const filter = { Completed: false };
      const update = { Completed: true };

      Task.find()
        .then((results) => {
          results.some((result) => {
            if (result.Completed === false) {
              Task.updateOne(filter, update, function (err, docs) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Task Updated!");
                }
              });
            }
          });
        })
        .catch((err) => console.log(err));
    },
  })

  .command({
    command: "delete",
    describe: "delete a task",

    builder: {
      id: {
        describe: "id of the task to delete",
        demandOption: true,
        type: "string",
      },
    },

    handler: function () {
      let id = {
        _id: yargs.argv.id,
      };

      Task.findOneAndDelete(id, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Deleted User : ", docs);
        }
    });
    },
  })
  .help()
  .alias("help", "h");

yargs.parse();
