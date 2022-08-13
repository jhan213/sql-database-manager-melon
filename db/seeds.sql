INSERT INTO department(id, d_name)
VALUES (1, "Sales"),
       (2, "Engineering"), 
       (3, "Finance"), 
       (4, "Legal");

INSERT INTO roles(id, title, salary, department_id)
VALUES (1, "Sales Lead", 100000, 1),
       (2, "Sofware Engineer", 120000, 2), 
       (3, "Account Manager", 160000, 3), 
       (4, "Lawyer", 190000, 4);

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES (1, "Jae Han", "Han", 1, 1),
       (2, "Hulk", "Man", 2, 2);