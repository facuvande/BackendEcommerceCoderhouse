import fs from 'fs'

export default class TicketManager {
    constructor(path) {
    this.path = path;
    this.products = this.readFile();
    }

    readFile() {
        try {
            const data = JSON.parse(fs.readFileSync(`./${this.path}`, "utf-8"));
            return data;
        } catch (error) {
            return []
        }
    }
    
    writeData(data) {
        let dataString = JSON.stringify(data);
        fs.writeFileSync(`./${this.path}`, dataString);
    }

}

