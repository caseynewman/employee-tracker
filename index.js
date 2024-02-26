const sequelize = require('./config/connection');
const inquirer = require('inquirer');
const { viewEmployeeTable, viewEmployeeList, addEmployee, deleteEmployee, viewManager, updateRole } = require('./library/employee');
const { viewRole, addRole } = require('./library/role');
const { viewDepartment, addDepartment } = require('./library/department');

const start = async () => {
    const response = await inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "selection",
            choices: [
                {
                    name: "View employees",
                    value: "VIEW EMP"
                },
                {
                    name: "View roles",
                    value: "VIEW ROLE"
                },
                {
                    name: "View departments",
                    value: "VIEW DEPT"
                },
                {
                    name: "Add employee",
                    value: "ADD EMP"
                },
                {
                    name: "Add role",
                    value: "ADD ROLE"
                },
                {
                    name: "Add department",
                    value: "ADD DEPT"
                },
                {
                    name: "Update employee role",
                    value: "UPDATE EMP ROLE"
                },
                {
                    name: "Delete employee",
                    value: "DELETE EMP"
                }
            ]
        }
    ])

    const { selection } = response;

    switch (selection) {
        case "VIEW EMP":
            console.table(await viewEmployeeTable());
            break;
        case "VIEW ROLE":
            console.table(await viewRole());
            break;
        case "VIEW DEPT":
            console.table(await viewDepartment());
            break;
        case "ADD EMP":
            const newEmployee = await inquirer.prompt([
                {
                    type: "input",
                    name: "fname",
                    message: "Enter the employee's first name:",
                    validate: function (input) {
                        if (input.length > 30) {
                            return 'Must not be longer than 30 characters!'
                        }
                        return true
                    }
                },
                {
                    type: "input",
                    name: "lname",
                    message: "Enter the employee's last name:",
                    validate: function (input) {
                        if (input.length > 30) {
                            return 'Must not be longer than 30 characters!'
                        }
                        return true
                    }
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "Select the employee's role:",
                    choices: await viewRole()
                },
                {
                    type: "list",
                    name: "manager_id",
                    message: "Select the employee's manager:",
                    choices: await viewManager()
                }
            ]);
            await addEmployee(newEmployee);
            console.table(newEmployee);
            break;
        case "ADD ROLE":
            const newRole = await inquirer.prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter the new title:",
                    validate: function (input) {
                        if (input.length > 30) {
                            return 'Must not be longer than 30 characters!'
                        }
                        return true
                    }
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter the salary:"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Select the department:",
                    choices: await viewDepartment()
                }
            ]);
            await addRole(newRole);
            console.table(newRole);
            break;
        case "ADD DEPT":
            const newDepartment = await inquirer.prompt([
                {
                    type: "input",
                    name: "department",
                    message: "Enter a new department:",
                    validate: function (input) {
                        if (input.length > 30) {
                            return 'Must not be longer than 30 characters!'
                        }
                        return true
                    }
                }
            ]);
            await addDepartment(newDepartment.department);
            console.table(newDepartment.department);
            break;
        case "UPDATE EMP ROLE":
            const employeeId = await inquirer.prompt([
                {
                    type: "list",
                    name: "employee_id",
                    message: "Choose the employee you would like to update",
                    choices: await viewEmployeeList()
                }
            ]);
            const newRoleId = await inquirer.prompt([
                {
                    type: "list",
                    name: "newRole_id",
                    message: "Select the employee's new role:",
                    choices: await viewRole()
                }
            ]);
            await updateRole(newRoleId.newRole_id, employeeId.employee_id);
            break;
        case "DELETE EMP":
            const deletedEmp = await inquirer.prompt([
                {
                    type: "list",
                    name: "employee_id",
                    message: "Which employee would you like to delete?",
                    choices: await viewEmployeeList()
                }
            ])
            await deleteEmployee(deletedEmp.employee_id);
    }
}

sequelize.sync({ force: false }).then(start);



// UPDATE EMPLOYEE MANAGERS
// VIEW EMPLOYEES BY MANAGER
// VIEW EMPLOYEES BY DEPARTMENT
// DELETE DEPTS, ROLES, AND EMPLOYEES
// VIEW TOTAL UTILIZED BUDGET OF DEPT