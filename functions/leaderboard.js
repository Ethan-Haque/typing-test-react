require('dotenv').config();
const faunadb = require('faunadb');

const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET,
    domain: 'db.fauna.com',
    port: 443,
    scheme: 'https',
});

exports.handler = async function (event, context, callback) {
    var score = JSON.parse(event.body);
    return client.query(
        q.Create(
            q.Collection('Scores'),
            { data: { name: score.name } }
        )
    ).then(async response => {
        console.log(response);
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(response)
        });
    });

};

