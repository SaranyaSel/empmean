const express = require("express");

const Employee = require("../models/employee");

const router = express.Router();

router.post("", (req, res, next) => {
    const emp = new Employee({
      fname: req.body.fname,
      lname: req.body.lname,
      age:req.body.age,
      email: req.body.email,
      company: req.body.company
    });
    emp.save().then(createdEmp => {
      res.status(201).json({
        message: "Employee added successfully",
        emp: {
          ...createdEmp,
          id: createdEmp._id
        }
      });
    });
  });
  router.put("/:id", (req, res, next) => {
    console.log(req.body.fname);
    const emp = new Employee({
      _id: req.body.id,
      fname: req.body.fname,
      lname: req.body.lname,
      age:req.body.age,
      email: req.body.email,
      company: req.body.company
    });
    // console.log(emp);
    Employee.updateOne({ _id: req.params.id }, emp).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  });

  router.get("", (req, res, next) => {

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Employee.find();

  let fetchedRows;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
  .then(documents => {
    fetchedRows = documents;
    return Employee.count();
  })
  .then(count => {
      res.status(200).json({
        message: "Fetched employee data successfully!",
        employees: fetchedRows,
        maxRows: count
      });
    });

  });

  router.get("/:id", (req, res, next) => {
    Employee.findById(req.params.id).then(emp => {
        if(emp) {
            res.status(200).json(emp);
        } else {
            res.status(404).json({ message: "Data not found!" });
        }
    });
  });

  router.delete("/:id", (req, res, next) => {
    Employee.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result);
      res.status(200).json({ message: "Employee deleted!" });
    });
  });

  module.exports = router;
