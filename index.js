const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const router = require('./router');
const auth = require('./services/auth.service');
const cors = require('cors');


const app = express();

const whitelist = [config.web.frontendOrigin, config.vk.T_GET_PREFIX];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Cache-Control', 'Expires'],
};

app.set('port', process.env.PORT || config.web.port);
app.use(bodyParser.json({}));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

auth.init(app);
router.init(app);


app.listen(app.get('port'), () => {
  console.log(`Server has been started on port ${app.get('port')}`);
});
