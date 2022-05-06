/// <reference types="@altv/types-server" />
import * as alt from 'alt-server'
import mysql from 'mysql2'

let pool

export default class Sql {
    constructor () {
        if ('undefined' === typeof pool) {
            pool = mysql.createPool({
                host: 'localhost',
                user: 'gta',
                password: '',
                database: 'altv',
                waitForConnections: true,
                connectionLimit: 30,
                queueLimit: 0
            })
            alt.emit('ConnectionComplete')
        }
    }

    getConnection () {
        return pool
    }

    async query (query, params) {
        return new Promise(resolve => {
            this.getConnection().query(query, params, function (err, results) {
                if (err) {
                    console.error(err);
                    console.log(this.sql)
                    return resolve(undefined);
                }
                return resolve(results);
            });
        });
    }

    async fetchRow(query, params)
    {
        return new Promise(resolve => {
            this.query(query, params)
            .then(results => {
                if(results.length > 0)
                {
                    return resolve(results[0]);
                }

                return resolve(undefined)
            });
        });
    }

    async fetchAll(query, params)
    {
        return new Promise(resolve => {
            this.query(query, params)
            .then(results => {
                if(results)
                {
                    return resolve(results);
                }

                return resolve(undefined)
            });
        });
    }

    async insert (query, params) {
        return new Promise(success => {
            this.query(query, params)
            .then(r => {
                if(r)
                {
                    return success(true)
                }

                return success(false)
            });
        });
    }

    async update (query, params) {
        return new Promise(success => {
            this.query(query, params)
            .then(r => {
                if(r > 0)
                {
                    return success(true)
                }

                return success(false)
            });
        });
    }
}
