require('dotenv').config();
const faunadb = require('faunadb');

const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET,
    domain: 'db.fauna.com',
    port: 443,
    scheme: 'https',
});

// submit score
exports.handler = async function (event, context, callback) {
    var response = JSON.parse(event.body);
    return client.query(
        q.Create(
            q.Collection('Scores'),
            { data: { name: response.name, score: { accuracy: response.score.accuracy, wpm: response.score.wpm }, mode: { milliseconds: response.mode.milliseconds, sentenceCount: response.mode.sentenceCount } } }
        )
    ).then(async response => {
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(response)
        });
    });

};

