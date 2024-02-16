const sequelize = require('./config/connection');
const inquirer = require('inquirer');

const viewEmployee = async() => {
    const result = await sequelize.query("SELECT * FROM employee");
    return(result[0]);
}

const addEmployee = async() => {
    const result = viewEmployee();
}

const viewRole = async() => {
    const result = await sequelize.query("SELECT * FROM role");
    return(result[0]);
}

const viewDepartment = async() => {
    const result = await sequelize.query("SELECT * FROM department");
    // console.log(result[0]);
    return(result[0]);
}

const addDepartment = async(department) => {
    const result = await sequelize.query(`INSERT INTO department (name) values ('${department}')`);
}

const start = async() => {
    const response = await inquirer.prompt([
        {
            type: "list",
            message: "choose an option below:",
            name: "selection",
            choices: [
                {
                    name: "view employees",
                    value: "VIEW EMP"
                },
                {
                    name: "view roles",
                    value: "VIEW ROLE"
                },
                {
                    name: "view departments",
                    value: "VIEW DEPT"
                },
                {
                    name: "add employee",
                    value: "ADD EMP"
                },
                {
                    name: "add role",
                    value: "ADD ROLE"
                },
                {
                    name: "add department",
                    value: "ADD DEPT"
                }
            ]
        }
    ])

    // const selection = response.selection;
    const { selection } = response;

    // if selection equals
    switch(selection) {
        case "VIEW EMP":
            console.log(await viewEmployee());
            break
        case "VIEW ROLE":
            console.log(await viewRole());
            break
        case "VIEW DEPT":
            console.log(await viewDepartment());
            break
        case "ADD EMP":
            addEmployee();
            break
        case "ADD ROLE":
            const role = await inquirer.prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter the title"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter the salary"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Select the department:",
                    choices: (await viewDepartment()).map(dept => {
                        return {name: dept.name, value: dept.id}
                    })
                }

            ])
            console.log(role)
            addRole();
            break
        case "ADD DEPT":
            //validating user input
            const newDepartment = await inquirer.prompt([
                {
                    type: "input",
                    name: "department",
                    message: "Enter a new department:"
                }
            ])
            addDepartment(newDepartment.department);
            break
    }


    console.log(response)
}

// force true would drop tables every time you connect to db
sequelize.sync({force: false}).then(start);
