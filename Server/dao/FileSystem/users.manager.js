import fs from 'fs'

export default class UsersManager {
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

    getAll(){
        try {
            const data = JSON.parse(fs.readFileSync(`./${this.path}`, "utf-8"));
            return data;
        } catch (error) {
            return []
        }
    }

    saveUser(data){
        try {
            console.log(this.path)
            const listado = this.readFile()
            listado.push(data)
            this.writeData(listado)
            return data
        } catch (error) {
            return 'error'
        }
    }

    findByEmail(email){
        try {
            const listado = this.readFile()
            const checkEmail = listado.find(u => u.email === email)
            if(checkEmail){
                return checkEmail
            }
            return false
        } catch (error) {
            return 'error'
        }
    }
}

const newUsersManager = new UsersManager('./FileSystem/users.json')
newUsersManager.saveUser({name:'admin', email:'asd'})