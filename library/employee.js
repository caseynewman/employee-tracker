const sequelize = require('../config/connection');

const viewEmployeeTable = async () => {
    try {
        const result = await sequelize.query('SELECT employee.*, role.title, role.salary, role.department_id FROM employee INNER JOIN role ON employee.role_id = role.id ');

        return result[0]
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

const viewEmployeeList = async () => {
    try {
        const result = await sequelize.query('SELECT * FROM employee');
        return result[0].map(employee => {
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

const updateEmpManager = async (newManager_id, employee_id) => {
    try {
        const result = await sequelize.query('UPDATE employee SET manager_id = ? WHERE id = ?', { replacements: [newManager_id, employee_id] });
        console.log('Manager successfully updated!');
    } catch (error) {
        console.error('Failed to update manager:', error);
    }
}

module.exports = { viewEmployeeTable, viewEmployeeList, addEmployee, deleteEmployee, viewManager, updateRole, updateEmpManager };
