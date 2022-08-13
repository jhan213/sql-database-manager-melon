const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL Username
      user: 'root',
      // TODO: Add MySQL Password
      password: '2023',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );

const inquirer = require('inquirer');
const { ConsoleMessage, ExecutionContext } = require('puppeteer');

function begin(){
    // begin() is the initial function to ask the user what they would like to do in the program
    inquirer
  .prompt([
    {
        type: 'list',
        name: "task",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
    }
  ])
  .then((data) => {
    run(data.task);
})
.catch((error) => {
  if (error.isTtyError) {
    // Prompt couldn't be rendered in the current environment
  } else {
    // Something else went wrong
  }
});
}

inquirer
  .prompt([
    {
        type: 'list',
        name: "task",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
    }
  ])
  .then((data) => {
    run(data.task);
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });

function run(task){
    // run function checks value from start function and asks for the inputs and updates the sql db
    if(task == "View All Employees"){
        // show dataframe of all employees
        db.query('SELECT * FROM employee', function (err, results) {
            console.log(results);
            setTimeout(function(){
                begin();
            }, 1000);
        });
    }
    if(task == "Add Employee"){
        // add an employee to the employee db
        inquirer
            .prompt([
                {
                    name: "first",
                    message: "What is the employee's first name?",
                },
                {
                    name: "last",
                    message: "What is the employee's last name?",
                },
                {
                    type: 'list',
                    name: "employeeRole",
                    message: "What is the employee's role?",
                    choices: [0,1,2,3], // roles array
                },
                {
                    type: 'list',
                    name: "employeeManager",
                    message: "Who is the employee's manager?",
                    choices: [0,1,2,3], // manager array w/ none
                },
            ])
            .then((data) => {
                db.connect(function(err){
                    if(err) throw err;
                    db.query(`INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ('${0}', '${data.first}', '${data.last}', '${data.employeeRole}', '${data.employeeManager}')`, function(err, result){
                        if(err) throw err;
                        console.log("Employee inserted.")
                    })
                })
                setTimeout(function(){
                    begin();
                }, 1000);
            })
    }
    if(task == "Update Employee Role"){
        inquirer
        .prompt([
            {
                type: 'list',
                name: "employeeName",
                message: "What is the name of the employee?",
                choices: [0,1,2,3], // employee array
            },
            {
                type: 'list',
                name: "role",
                message: "Which role should the employee be updated to?",
                choices: [0,1,2,3], // employee array
            },
        ])
        .then((data) => {
            db.connect(function(err){
                if(err) throw err;
                db.query(`UPDATE employee SET role_id = '${data.role}' WHERE id = '${data.employeeName}'`, function(err, result){
                    if(err) throw err;
                    console.log("Employee's role updated.")
                })
            })
        })
    }
    if(task == "View All Roles"){
        db.query('SELECT * FROM roles', function (err, results) {
            console.table(results);
            setTimeout(function(){
                begin();
            }, 1000);
        });
    }
    if(task == "Add Role"){
        inquirer
            .prompt([
                {
                    name: "name",
                    message: "What is the name of the role?",
                },
                {
                    name: "salary",
                    message: "What is the salary of the role?",
                },
                {
                    type: 'list',
                    name: "department",
                    message: "Which department store does the role belong to?",
                    choices: [0,1,2,3], // department array
                }
            ])
            .then((roleData) => {
                db.connect(function(err){
                    if(err) throw err;
                    db.query(`INSERT INTO roles (id, title, salary, department_id) VALUES ('${0}', '${roleData.name}', '${roleData.salary}', '${roleData.department}')`, function(err, result){
                        if(err) throw err;
                        console.log("Role inserted.")
                    })
                })
                setTimeout(function(){
                    begin();
                }, 1000);
            })
    }
    if(task == "View All Departments"){
        // show small datadrame of id and  name of departments
        db.query('SELECT * FROM department', function (err, results) {
            console.table(results);
            setTimeout(function(){
                begin();
            }, 1000);
        });
    }
    if(task == "Add Department"){
        inquirer
            .prompt([
                {
                    name: "name",
                    message: "What is the name of the department?",
                }
            ])
            .then((data) => {
                db.connect(function(err){
                    if(err) throw err;
                    db.query(`INSERT INTO department (id, d_name) VALUES ('${0}', '${data.name}')`, function(err, result){
                        if(err) throw err;
                        console.log("Department added.")
                    })
                })
                setTimeout(function(){
                    begin();
                }, 1000);
            })
    }
    if(task == "Quit"){
        process.exit();
    }
}