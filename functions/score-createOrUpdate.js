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
        q.Let({ // match name and sentenceCount
            match: q.Match(q.Index('names_sentences'), [response.name, response.sentenceCount]),
            data: { data: response }
        },
            q.If(
                q.Exists(q.Var('match')),
                q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('data')), // update if exists
                q.Create(q.Collection('Scores'), q.Var('data')) // create if !exists
            )
        )
    ).then(async response => {
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(response)
        });
    }).catch((err) => {
        console.error({ err });
    });

};

