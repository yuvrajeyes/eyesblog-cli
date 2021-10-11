const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  Description: {
    type: String,
    required: true,
  },
  Completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", blogSchema);

module.exports = Task;
