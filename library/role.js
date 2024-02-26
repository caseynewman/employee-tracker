const sequelize = require('../config/connection');

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

module.exports = { viewRole, addRole };
