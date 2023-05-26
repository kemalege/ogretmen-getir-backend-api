const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const connectDatabase = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const cors = require("cors")
const cookieParser = require('cookie-parser');
const corsOptions = require("./config/corsOptions");
const bodyParser = require('body-parser');


dotenv.config({});

connectDatabase();

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// app.use(cors({
//   origin: '*'
// }));
app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

const PORT = 5000 || process.env.PORT;

app.use(routes);

app.use(customErrorHandler);

app.get("/", (req, res) => {
  res.send("Server is up");
});

app.listen(PORT, () => {
  console.log(`App started on ${PORT}: ${process.env.NODE_ENV}`);
});
