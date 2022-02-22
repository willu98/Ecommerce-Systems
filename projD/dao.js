const _         = require('lodash');
const home      = require('os').homedir();
const dbfile    = '4413/pkg/sqlite/Models_R_US.db';
const dbpath    = require('path').join(home, ...dbfile.split('/'));
const sqlite3   = require('sqlite3').verbose();
const db        = new sqlite3.Database(dbpath);

const GET_PRODUCTS =    `SELECT P.id, P.name, P.description, P.cost, P.msrp,
                        P.qty AS quantity, C.name AS category, V.name as vendor
                        FROM Product P, Category C, Vendor V
                        WHERE C.id = P.catid AND V.id = P.venid`;

module.exports = {
    getAll( queries, success, failure = console.log){
        let fragments = _.toPairs(queries).map(function(el){
            let [k, p] = el;
            switch (k) {
                 case 'id':
                    return { q: 'P.id = ?', p};
                case 'name':
                case 'description':
                    return { q: `UPPER(P.${k}) LIKE UPPER(?)`, p: `%${p}%`};
                case 'category':
                    return { q: `UPPER(C.name) LIKE UPPER(?)`, p: `%${p}%`};     
                case 'vendor':
                    return { q: `UPPER(V.name) LIKE UPPER(?)`, p: `%${p}%`};          
                case 'min_qty':
                case 'min_cost':
                case 'min_msrp':
                    return { q: `P.${k.replace('min_', '')}`, p};
                case 'max_qty':
                case 'max_cost':
                case 'max_msrp':
                    return { q: `P.${k.replace('max_', '')}`, p};                    
            }
        });

        const qs = _.map(fragments, 'q');
        const ps = _.map(fragments, 'p');
        const statement = [GET_PRODUCTS, ...ps].join('AND');

        db.all(statement, ps, function (err, rows) {
            if(err == null){
                success(rows);            
            } else{
                failure(err);
            }
        });
    },

    getCatID( queries, success, failure = console.log){
        const statement = `SELECT id, name FROM Category C
                            WHERE C.id = ?`;
        db.all(statement, queries, function (err, rows) {
            if(err == null){
                success(rows);            
            } else{
                failure(err);
            }
        });
    },

    getAllCat( queries, success, failure = console.log){
        const statement = `SELECT * FROM Category C`;
        db.all(statement,function (err, rows) {
            if(err == null){
                success(rows);            
            } else{
                failure(err);
            }
        });
    },

    getAllProducts_CId( queries, success, failure = console.log) {
        const STATEMENT =       `SELECT P.id, P.catid, P.name, P.description, P.cost  
                                FROM Product P
                                WHERE P.catid = ?`;

        db.all(STATEMENT, queries, function (err, rows) {
            if(err == null){
                success(rows);            
            } else{
                failure(err);
            }
        });                                
    },

    getAllProducts( queries, success, failure = console.log) {
        const STATEMENT =       `SELECT P.id, P.catid, P.name, P.description, P.cost  
                                FROM Product P`;

        db.all(STATEMENT, queries, function (err, rows) {
            if(err == null){
                success(rows);            
            } else{
                failure(err);
            }
        });                                
    },

    getProduct_Id( queries, success, failure = console.log) {
        const STATEMENT =       `SELECT *  
                                FROM Product P
                                WHERE P.id = ?`;

        db.get(STATEMENT, queries, function (err, rows) {
            if(err == null){
                success(rows);            
            } else{
                failure(err);
            }
        });                                
    }    


};                    
