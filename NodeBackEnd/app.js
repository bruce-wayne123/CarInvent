var express = require('express');
var boydParser = require('body-parser');
var sql = require("mssql");
const cors = require('cors'); 
var rand = require("random-key");
var dbconf = require("./dbconfig");
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors()); 
var config = {
    user: 'XXXX',
    password: 'XXXX',
    server: 'XXXX',
    database: 'XXXX'
};
//GEt API
app.get('/api/GetCarDetails', function (req, res) {

    var query = "select * from CarInfo";
    res.header("Access-Control-Allow-Origin", "*");
    executeDBQuery(query)
        .then((userInfo) => {

            if (userInfo && userInfo.length != 0) {
                var useDate = userInfo;
                var user = useDate[0];
                var updateQuery = "select * from CarInfo";
                return executeDBQuery(updateQuery);
            } else {
                return false;
                //res.send({code : 404 , message : "Record not found"});
            }
        })
        .then((updateInfo) => {
            var updateQuery = "select * from CarInfo";
            return executeDBQuery(updateQuery);
        })
        .then((updateInfo) => {
            res.send(updateInfo)
        })
        .catch((err) => {
            res.send(err);
        })


})

//POST API

app.post('/PostData', function (req, res) {

   // let userVehicleId = rand.generateDigits(4);
    let userBrand = req.body.Brand;
    let userPrice = req.body.Price;
    let userfuelType=req.body.FuelType;
    res.header("Access-Control-Allow-Origin", "*");
    var insertQuery = `INSERT INTO CarInfo (Brand,Price,FuelType) VALUES('${userBrand}',${userPrice},'${userfuelType}')`;
    executeDBQuery(insertQuery)
        .then(() => {
            //res.redirect('/CarInfo');
            res.send("Car Added to Inventory!!");
        })
        .catch((err) => {
            res.send(err);

        })
});


app.get('/api/GetCarDetailsById/:Id', function (req, res) {

    var query = "select * from CarInfo where Id="+req.params.Id;
    res.header("Access-Control-Allow-Origin", "*");
    executeDBQuery(query)
        .then((userInfo) => {

            if (userInfo && userInfo.length != 0) {
                var useDate = userInfo;
                var user = useDate[0];
                return user;
            } else {
                return false;
                //res.send({code : 404 , message : "Record not found"});
            }
        })
        .then((updateInfo) => {
            res.send(updateInfo)
        })
        .catch((err) => {
            res.send(err);
        })


})


//Delete APi
app.delete('/DeleteData/:Id', function (req, res) {
    var userVehicleId = req.params.Id;
    res.header("Access-Control-Allow-Origin", "*");
    var deleteQuery = "DELETE FROM CarInfo WHERE Id=" + userVehicleId;
    var searchQuery="SELECT * FROM CarInfo WHERE Id=" + userVehicleId;
    executeDBQuery(searchQuery)
        .then((userInfo) => {

            if (userInfo && userInfo.length != 0) {
                var useDate = userInfo;
                var user = useDate[0];
                if (user.Id != null) {
                    executeDBQuery(deleteQuery);
                    res.send({code : 200 , message : "Record Successfully deleted"});

                }
                
            } else {
                res.send({code : 404 , message : "Record not found"});
            }
        })
        .catch((err) => {
            res.send({code : 500 , message : "Error in deleting record"});
        })


});

//Update Data


app.post('/UpdateData', function (req, res) {
    //
    let userBrand=req.body.Brand;
    let userPrice=req.body.Price;
    let userfuelType = req.body.FuelType;
    var searchQuery="SELECT * FROM CarInfo WHERE VehicleId=" + userVehicleId;
    
    var updateQuery='UPDATE Carinfo SET Brand='+ "'"+ userBrand + "'" +',Price='+userPrice +',FuelType='+userfuelType+ 'WHERE Id='+ userVehicleId;
    executeDBQuery(searchQuery)
        .then((userInfo) => {

            if (userInfo && userInfo.length != 0) {
                var useDate = userInfo;
                var user = useDate[0];
                if (user.VehicleId != null) {
                    executeDBQuery(updateQuery);
                    res.send({code : 200 , message : "Record Successfully Updated!!"});

                }
                
            } else {
                res.send({code : 404 , message : "Record not found"});
            }
        })
        .catch((err) => {
            res.send({code : 500 , message : "Error in updating record"});
        })


});







/* Update data from sql server */
let executeDBQuery = qry => new Promise((resolve, reject) => {
    if (qry === null) {
        log.e('Error in query string: ' + JSON.stringify(qry));
        return reject('No Query Found');
    }
    var pool = new sql.ConnectionPool(config);
    pool.connect()
        .then(client => {
            client.query(qry)
                .then(res => {
                    console.log("res===", res.recordset);

                    client.release();
                    //client.end();
                    resolve(res.recordset);
                })
                .catch(e => {
                    client.release();
                    //client.end();
                    console.error('query error in', e.message, e.stack);
                    //deferred.reject(e.message);
                    reject({
                        code: 200,
                        error: 'Internal Structure Error'
                    });
                });
        }).catch(e => {
            console.error('query error out', e.message, e.stack);
            //deferred.reject(e.message);
            reject({
                code: 200,
                error: 'Internal Connection Error'
            });
        });
})




app.listen(8080, () => {

    // logger.info('Orders server started on port ' + 8080 + '.');
    console.log("Servr running on this port " + 8080);

});


