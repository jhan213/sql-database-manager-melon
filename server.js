const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create SQL connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL Username
        user: 'root',
        // MySQL Password
        password: '2023',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

const inquirer = require('inquirer');
const { ConsoleMessage, ExecutionContext } = require('puppeteer');

// Function for displaying the Main Menu
function begin() {
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
            if (error.isTtyError) { } else { }
        });
}

// Initial display
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
        if (error.isTtyError) { } else { }
    });

// Change the display based on the user's selected task
function run(task) {
    // View all existing employees
    if (task == "View All Employees") {
        db.query('SELECT * FROM employee', function (err, results) {
            console.log(results);
            setTimeout(function () {
                begin();
            }, 1000);
        });
    }
    // Add employee
    if (task == "Add Employee") {
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
                    choices: [0, 1, 2, 3],
                },
                {
                    type: 'list',
                    name: "employeeManager",
                    message: "Who is the employee's manager?",
                    choices: [0, 1, 2, 3],
                },
            ])
            .then((data) => {
                db.connect(function (err) {
                    if (err) throw err;
                    db.query(`INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ('${0}', '${data.first}', '${data.last}', '${data.employeeRole}', '${data.employeeManager}')`, function (err, result) {
                        if (err) throw err;
                        console.log("Employee inserted.")
                    })
                })
                setTimeout(function () {
                    begin();
                }, 1000);
            })
    }
    // Update existing employee's role
    if (task == "Update Employee Role") {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: "employeeName",
                    message: "What is the name of the employee?",
                    choices: [0, 1, 2, 3],
                },
                {
                    type: 'list',
                    name: "role",
                    message: "Which role should the employee be updated to?",
                    choices: [0, 1, 2, 3],
                },
            ])
            .then((data) => {
                db.connect(function (err) {
                    if (err) throw err;
                    db.query(`UPDATE employee SET role_id = '${data.role}' WHERE id = '${data.employeeName}'`, function (err, result) {
                        if (err) throw err;
                        console.log("Employee's role updated.")
                    })
                })
            })
    }
    // View all roles
    if (task == "View All Roles") {
        db.query('SELECT * FROM roles', function (err, results) {
            console.table(results);
            setTimeout(function () {
                begin();
            }, 1000);
        });
    }
    // Add role
    if (task == "Add Role") {
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
                    choices: [0, 1, 2, 3],
                }
            ])
            .then((roleData) => {
                db.connect(function (err) {
                    if (err) throw err;
                    db.query(`INSERT INTO roles (id, title, salary, department_id) VALUES ('${0}', '${roleData.name}', '${roleData.salary}', '${roleData.department}')`, function (err, result) {
                        if (err) throw err;
                        console.log("Role inserted.")
                    })
                })
                setTimeout(function () {
                    begin();
                }, 1000);
            })
    }
    // View all departments
    if (task == "View All Departments") {
        db.query('SELECT * FROM department', function (err, results) {
            console.table(results);
            setTimeout(function () {
                begin();
            }, 1000);
        });
    }
    // Add department
    if (task == "Add Department") {
        inquirer
            .prompt([
                {
                    name: "name",
                    message: "What is the name of the department?",
                }
            ])
            .then((data) => {
                db.connect(function (err) {
                    if (err) throw err;
                    db.query(`INSERT INTO department (id, d_name) VALUES ('${0}', '${data.name}')`, function (err, result) {
                        if (err) throw err;
                        console.log("Department added.")
                    })
                })
                setTimeout(function () {
                    begin();
                }, 1000);
            })
    }
    if (task == "Quit") {
        process.exit();
    }
}