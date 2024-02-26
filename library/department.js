const sequelize = require('../config/connection');

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

module.exports = { viewDepartment, addDepartment };