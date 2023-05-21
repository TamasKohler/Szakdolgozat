const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.listen(port, () => console.log(`Listen on port ${port}`));


//MySQL credentials
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'teams'
});

//List records
app.post('/getlines', (req, res) => {
    const params = req.body;
    var time = new Date().toLocaleString();
    console.log(time + ` Recieved request to list rows where:`, JSON.stringify(params));
    GetRows(params.chanelOrChatId, (err, rows) => {
        if (err == null) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});

// Beérkező adat
app.post('/postlines', (req, res) => {
    const data = req.body;
    var channelOrChatId = data[0].chanelOrChatId;
    data.splice(0,1);
    console.log("Recieved request to change the following records:", data);
    var DeletedRows = [];
    var UpdatedRows = [];
    var CreatedRows = [];
    var UnchagnedRows = [];

//régi adatok behívása
    GetRows(channelOrChatId, (err,rows) => {
        if (err == null) {
            DeletedRows = rows;
            for (let i = 0; i < data.length; i++) {
                if (data[i].hasOwnProperty("id")) {
                    for (let j = 0; j < rows.length; j++) {
                        if (data[i].id == rows[j].id) {
                            if (data[i].position == rows[j].position && data[i].description == rows[j].description) {
                                UnchagnedRows.push(data[i]);
                            } else {
                                UpdatedRows.push(data[i]);
                            }
                            DeletedRows.splice(j, 1);
                        }
                    }
                } else {
                    CreatedRows.push(data[i]);
                }
            }
            UpdateRows(DeletedRows, 0, 'DELETE from items WHERE id = ?', 1, (deleted) => {
                if (deleted) {
                    UpdateRows(UpdatedRows, 0, 'UPDATE items SET description = ?, position = ? WHERE id = ?', 3, (updated) => {
                        if (updated) {
                            UpdateRows(CreatedRows, 0, 'INSERT INTO items SET ?', 0, (added) => {
                                if (added) {
                                    res.send('true');
                                }
                            })
                        }
                    })
                }
            })
        } else {
            console.log(err);
        }
    });

    
});

function GetRows(channelOrChatId, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null);
        } else {
            connection.query('SELECT * from items WHERE chanelOrChatId = ?', channelOrChatId, (err, rows) => {
                connection.release();
                if (!err) {
                    return callback(null,rows)
                } else {
                    return callback(err, null);
                }
            })
        }
    })
}

function UpdateRows(Rows, row_number, query, property, callback) {
    if (row_number < Rows.length && Rows.length != 0) {
        switch (property) {
            case 3:
                var params = [Rows[row_number].description, Rows[row_number].position, Rows[row_number].id];
                break;
            case 1: 
                var params = Rows[row_number].id;
                break;
            case 0:
                var params = Rows[row_number];
                break;
        }
        pool.getConnection((err, connection) => {
            if (err) {
                throw err;
            }
            connection.query(query, params, (err, rows) => {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(false);
                } else {
                    UpdateRows(Rows, row_number+1, query, property, callback);
                }
            })
        })
    } else {
        callback(true);
    }
}



