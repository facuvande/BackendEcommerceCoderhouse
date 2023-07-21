import mongoose from "mongoose";
import config from "../../config.js";

export default class MongoSingleton{
    constructor(type){
        if(type === 'MONGO'){
            const connection = mongoose.connect(config.mongo_url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },)
        }
    }

    static getInstance(type) {
        if (!this.instance) {
            this.instance = new MongoSingleton(type);
        }
        return this.instance;
    }
}