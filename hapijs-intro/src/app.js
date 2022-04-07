const hapi = require("@hapi/hapi");
const path = require("path");
const inert = require("inert");

// Database
require('./database');
const User = require('./models/users');

const init = async () => {
  const server = new hapi.Server({
    port: 3000,
    host: "localhost",
    routes: {
      files: {
        relativeTo: path.join(__dirname, "public")
      }
    }
  });

  await server.register(inert);
  await server.register(require("@hapi/vision"));

  server.views({
    engines: {
      html: require("handlebars")
    },
    relativeTo: __dirname,
    path: "templates",
    isCached: process.env.NODE_ENV === 'production' 
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      // return 'Hello World'
      return `<h1>Hello World</h1>`;
    }
  });

  // Paremeters
  server.route({
    method: "GET",
    path: "/hello/{user}",
    handler: (request, h) => {
      return `Hello ${request.params.user}`;
    }
  });

  server.route({
    method: "GET",
    path: "/text.txt",
    handler: (request, h) => {
      console.log("asad");
      return h.file("./text.txt");
    }
  });

  server.route({
    method: "GET",
    path: "/page",
    handler: (request, h) => {
      return h.view("index");
    }
  });

  server.route({
    method: "GET",
    path: "/name",
    handler: (request, h) => {
      return h.view("namepage", {
        name: "fazt"
      });
    }
  });

  server.route({
    method: "GET",
    path: "/products",
    handler: (request, h) => {
      return h.view("products", {
        products: [
          { name: "laptop" },
          { name: "mouse" },
          { name: "keyboard" },
          {
            name: "Monitor"
          }
        ]
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/users',
    handler: async (request, h) => {
      const users = await User.find();
      console.log(users)
      return h.view('users', {
        users: users
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/users',
    handler: async (request, h) => {
      const username = request.payload.username;
      const newUser = new User({username});
      await newUser.save();
      return h.redirect().location('users');
    }
  })

};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});
init();
