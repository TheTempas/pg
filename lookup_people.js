const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

function printFamousPeople (result) {
  console.log(`Found ${result.length} person(s) by the name '${process.argv[2]}':`);
  result.forEach ((obj, index) => {
    console.log(`- ${index + 1} ${obj.first_name} ${obj.last_name}, born '${obj.birthdate.toISOString().substr(0,10)}'`);
  });
};

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  client.query("SELECT * FROM famous_people WHERE first_name = $1 OR last_name = $1", [process.argv[2]], (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    console.log("Searching ...");
    printFamousPeople(result.rows);
    client.end();
  });
});