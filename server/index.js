const cookieSession = require("cookie-session");

const bodyParser = require('body-parser')
const express = require("express");
const app = express();
const port = 4000;
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const session = require("express-session");
const authRoutes = require("./routes/auth-routes");
const { find } = require("./middlewares/mysql");
const sequelize = require("sequelize");
const DataTypes = sequelize.DataTypes;
const Types = require("./models/types")(sequelize, DataTypes);
const keys = require("./config/keys");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // parse cookie header
const path = require("path");
const config = require("./config/configProvider")();

const { ApolloServer } = require("apollo-server-express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");

const typeDefs = require("./graphql/schemas");
const resolvers = require("./graphql/resolvers");
const context = require("./graphql/context");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  // uploads: false,
  // context,
  // introspection: true,
  // playground: {
  //   settings: {
  //     "schema.polling.enable": false,
  //     "editor.fontSize": 18,
  //   },
  // },
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

config.db
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });


app.use(
  cookieSession({
    name: "session",
    keys: [keys.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100
  })
);

// parse cookies
app.use(cookieParser());

// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

// set up routes
app.use("/auth", authRoutes);
require("./routes/dailyTasks.routes")(app);
require("./routes/competence.routes")(app);
require("./routes/resource.routes")(app);


const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};

const authCheckMiddleware = require('./middleware/auth-check')
app.use("/users", authCheck,  require("./controllers/users"));
app.use("/usersPrivate", authCheck, require("./controllers/usersPrivate"));
app.use("/schedule",  authCheck, require("./controllers/schedule"));
app.use("/types", find(Types));


app.use("/", express.static(path.resolve(__dirname, "../client/public/dist")));

// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page
app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  });
});

apolloServer.applyMiddleware({ app, path: "/graphql" });


// connect react to nodejs express server
app.listen(port, () => console.log(`Server is running on port ${port}!`));
