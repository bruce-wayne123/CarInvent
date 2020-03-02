
module.exports={
    
    executeDBQuery : qry => new Promise((resolve, reject) => {
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
};
