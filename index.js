const sequelize = require('./config/connection');
const inquirer = require('inquirer');

const viewEmployeeTable = async () => {
    try {
        // const result = await sequelize.query('SELECT employee.*, role.* FROM employee LEFT JOIN role ON role.id = employee.role_id');
        const result = await sequelize.query('SELECT * FROM employee');
        return result[0]
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

const viewEmployee = async () => {
    try {
        const result = await viewEmployeeTable();
        return result.map(employee => {
            return { name: `${employee.fname} ${employee.lname}`, value: employee.id }
        });
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

const addEmployee = async (employee) => {
    try {
        const result = await sequelize.query('INSERT INTO employee (fname, lname, role_id, manager_id) VALUES (?, ?, ?, ?)', { replacements: [employee.fname, employee.lname, employee.role_id, employee.manager_id] });
        console.log(`${employee.fname} ${employee.lname} was successfully added to the database!`);
    } catch (error) {
        console.error('Failed to add employee:', error);
    }
}

const deleteEmployee = async (employee_id) => {
    try {
        const result = await sequelize.query('DELETE FROM employee WHERE id = ?', { replacements: [employee_id] });
        console.log('Employee successfully deleted!');
    } catch (error) {
        console.error('Failed to delete employee:', error);
    }
}

const viewRole = async () => {
    try {
        const result = await sequelize.query("SELECT * FROM role");
        return result[0].map(role => {
            return { name: role.title, value: role.id }
        });
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

const addRole = async (role) => {
    try {
        const result = await sequelize.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', { replacements: [role.title, role.salary, role.department_id] });
        console.log(`${role.title} was successfully added to the database!`);
    } catch (error) {
        console.error('Failed to add role:', error);
    }
}

const viewDepartment = async () => {
    try {
        const result = await sequelize.query("SELECT * FROM department");
        return result[0].map(dept => {
            return { name: dept.name, value: dept.id }
        });
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

const addDepartment = async (department) => {
    try {
        const result = await sequelize.query('INSERT INTO department (name) VALUES (?)', { replacements: [department] });
        console.log(`${department} was successfully added to the database!`);
    } catch (error) {
        console.error('Failed to add department:', error);
    }
}

const viewManager = async () => {
    try {
        const result = await sequelize.query('SELECT id, fname, lname FROM employee');
        return result[0].map(employee => {
            return { name: `${employee.fname} ${employee.lname}`, value: employee.id };
        })
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

const updateRole = async (newRole_id, employee_id) => {
    try {
        const result = await sequelize.query('UPDATE employee SET role_id = ? WHERE id = ?', { replacements: [newRole_id, employee_id] });
        console.log('Role successfully updated!');
    } catch (error) {
        console.error('Failed to update employee role:', error);
    }
}

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

    // const selection = response.selection;
    const { selection } = response;

    // if selection equals
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
                    choices: await viewEmployee()
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
            // console.log('Employee role updated.');
            break;
        case "DELETE EMP":
            const deletedEmp = await inquirer.prompt([
                {
                    type: "list",
                    name: "employee_id",
                    message: "Which employee would you like to delete?",
                    choices: await viewEmployee()
                }
            ])
            await deleteEmployee(deletedEmp.employee_id);
    }

}

// force true would drop tables every time you connect to db
sequelize.sync({ force: false }).then(start);



// MOVE FUNCTIONS INTO SEPARATE FILES - USE CLASSES
// UPDATE EMPLOYEE ROLE


// UPDATE EMPLOYEE MANAGERS
// VIEW EMPLOYEES BY MANAGER
// VIEW EMPLOYEES BY DEPARTMENT
// DELETE DEPTS, ROLES, AND EMPLOYEES
// VIEW TOTAL UTILIZED BUDGET OF DEPT