const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const graphQLSchema = require('./graphql/schema');
const graphQLResolvers = require('./graphql/resolvers');

const app = express();

app.use(bodyParser.json());

// GraphQL
app.use('/api/v1', graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}));

mongoose.connect('mongodb://localhost/graphql', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log('MongoDB succesfully connected.'))
    .catch(e => console.error(e.message));

app.listen(5000);