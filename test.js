let nodeperc = require("./node-perc/node-perc");
let db = new nodeperc.NodePerc({
    throwErrorOnGetNull: false,
    fileName: "db.txt"
});
db.set("name", "AmoghTheCool");
db.get("name", data => {
    console.log(data);
});
db.del("name");
db.get("this doesn't exist", data => {
    console.log(data);
})