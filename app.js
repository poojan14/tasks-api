const express=require('express');

const app=express();
const tasks = require('./routes/tasks');
const connectDB = require('./db/connect');
require('dotenv').config();
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra security packages
//HTTP HEADER protect numerous attack
//cross origin resource sharing, api accessible from different domain to public
//xss sanitize user input in req.body,req.query,req.params no cross site scripting attack

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

//middleware
app.use(express.static('./public'))
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(express.json())

//bcoz push to heroku
app.set('trust proxy', 1);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

//ROUTE



app.use('/api/v1/tasks', tasks);
// app.get('api/v1/tasks') -get all tasks
// app.post('api/v1/tasks') -create new task
// app.get('api/v1/tasks/:id') -get single task
// app.patch('api/v1/tasks/:id') -update task
// app.delete('api/v1/tasks/:id') -delete task


app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3001;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

  
