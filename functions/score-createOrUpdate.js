require('dotenv').config();
const faunadb = require('faunadb');

const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET,
    domain: 'db.fauna.com',
    port: 443,
    scheme: 'https',
});

/*
Creates new document if one does not already exist.
Updates previous document if new wpm is higher than previous wpm. 
Aborts if new wpm is lower.
*/
exports.handler = async function (event, context, callback) {
    var score = JSON.parse(event.body);
    return client.query(
        q.Let({ // look for existing name and sentenceCount 
            match: q.Match(q.Index('names_sentences'), [score.name, score.sentenceCount]),
            data: { data: score }
        },
            q.If(
                q.Exists(q.Var('match')),// match condition
                q.If( // if match is found
                    // compare new and old wpm 
                    q.GT(q.ToDouble(score.score.wpm), q.ToDouble(q.Select(['data', 'score', 'wpm'], q.Get(q.Var('match'))))),
                    q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('data')), // update if new score is higher
                    q.Abort('New score is lower!') // abort if new score is lower
                ),
                q.Create(q.Collection('Scores'), q.Var('data')) // create record if match was false
            )
        )
    ).then(async response => {
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(response)
        });
    }).catch((err) => {
        return callback(null, {
            statusCode: err.requestResult.statusCode,
            body: JSON.stringify(err.description)
        });
    });

};
