require('dotenv').config();
const faunadb = require('faunadb');

const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET,
    domain: 'db.fauna.com',
    port: 443,
    scheme: 'https',
});


// get all scores
exports.handler = async function (event, context, callback) {
    return client.query(
        q.Map(
            q.Paginate(q.Documents(q.Collection('Scores'))),
            q.Lambda(ref => q.Get(ref))
        )
    ).then(async response => {
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(response)
        });
    });
};

