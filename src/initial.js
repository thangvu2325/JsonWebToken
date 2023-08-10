const Role = require("./app/models/Role");
const Sensor = require("./app/models/Sensor");
async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await new Role({
        name: "user",
      }).save();
      console.log("added 'user' to roles collection");

      await new Role({
        name: "HCMUTE",
      }).save();
      console.log("added 'HCMUTE' to roles collection");

      await new Role({
        name: "HCMUT",
      }).save();
      console.log("added 'HCMUT' to roles collection");

      await new Role({
        name: "admin",
      }).save();
      console.log("added 'admin' to roles collection");
    }
    // await new Sensor({
    //   name: "smokeValue",
    // }).save();
    // console.log("added 'smokeValue' to roles collection");
    // await new Sensor({
    //   name: "gasValue",
    // }).save();
    // console.log("added 'gasValue' to roles collection");
  } catch (err) {
    console.log("error", err);
  }
}
module.exports = initial;
