import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

let server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ 'extended': true}));

server.set('port', (process.env.PORT || 5000));
server.use(express.static(path.join(__dirname)));

server.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/templates/index.html'));
});

server.listen(server.get('port'), function() {
  console.log('✔ The server is now online at http://localhost:' + server.get('port'));
});
