const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true }
});

module.exports = mongoose.model('Employee', employeeSchema);
