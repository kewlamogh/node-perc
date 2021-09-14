const { isNullOrUndefined } = require("util");

class NodePerc {
    #initFile() {
        this.fs = require("fs");
        this.crypt = require("./crypt");
        if (!this.fs.existsSync(this.fileName)) {
            this.fs.createWriteStream(this.fileName);
        }  
    }
    set(key, value) {
        const content = key+"|ae3423234|"+JSON.stringify(this.crypt.encrypt((typeof value == "object" ? JSON.stringify(value) : value.toString())))+"|*&*&*&*|"
        this.fs.appendFile(this.fileName, content, err => {
            if (err) {
                console.error(err)
                return
            }
        });
    }
    get(key, handler) {
      this.fs.readFile(this.fileName, 'utf8', (err, data) => {
        let dataPairs = data.split("|*&*&*&*|");
        let a = null;
        for (let i of dataPairs) {
            let o = i.split("|ae3423234|");
            if (o[0] == key) {
                console.log()
                a = this.crypt.decrypt(this.#parse(o[1]));
            }
        }
        if (this.throwErrorOnGetNull && this.nullFilter(a)) {
            throw new Error("Value of key is null. To not throw errors on getting null, just change the constructor variable throwErrorOnGetNull to false.");
        }
        handler(a);
      });
    }
    keys(prefix = null, handler)  {
        this.fs.readFile(this.fileName, 'utf8', (err, data) => {
            let dataPairs = data.split("|*&*&*&*|");
            let res = [];
            for (let i of dataPairs) {
                let o = i.split("|ae3423234|");
                if (prefix == null && !res.includes(o)) {
                    res.push(o);
                }
                if (prefix != null && dataPairs.indexOf(prefix) >= 0 && !res.includes(o)) {
                    res.push(o)
                }
            }
            handler(res);
        });
    }
    nullFilter(item) {
        return isNullOrUndefined(item);          
    }
    del(key) {
        this.set(key, null);
    }
    #parse(dict) {
        let bai = new BoolAndInt();

        try {
            return JSON.parse(dict);
        } catch(e) {
            if (dict == 'true' || dict == "false") {
                return bai.boolParse(dict);
            }
            if (!isNan(parseInt(dict))) {
                return bai.intParse(dict);
            }
            return dict;
        }
    }
    constructor (config = {fileName: "db.txt"}) {
        this.fileName = "databases/"+config.fileName;
        this.throwErrorOnGetNull = config.throwErrorOnGetNull || false;
        require("child_process").exec("mkdir databases", () => {});        
        this.#initFile();
    }
}

class BoolAndInt {
    boolParse(text) {
        return text == "true";     
    }
    intParse(int) {
        return parseInt(int);
    }
    toString(val) {
        return val.toString();
    }
}

module.exports.NodePerc = NodePerc;