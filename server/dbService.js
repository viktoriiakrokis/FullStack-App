const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: '127.0.0.1', //process.env.HOST,
    user: 'test123',//process.env.USER,
    password: 'test123', //process.env.PASSWORD,
    database: 'web_app', //process.env.DATABASE,
    port: '3306'//process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});


class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT names.id AS id, names.name, names.date_added, locations.country FROM names JOIN locations ON names.location_id = locations.id";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            return await new Promise((resolve, reject) => {
                const query = "INSERT INTO names (name, date_added, location_id) VALUES (?,?,?);";

                connection.query(query, [name, dateAdded, 1] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE id = ?";
    
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id, name) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE names SET name = ? WHERE id = ?";
    
                connection.query(query, [name, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names WHERE name = ?;";

                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names JOIN locations ON names.location_id = locations.id WHERE names.id = ?;"

                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            const row = response[0];
            return {
                id: row['id'],
                name: row['name'],
                date_added: row['date_added'],
                country: row['country']
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Get name by ID from DB + join with location -> get country name
}

module.exports = DbService;