import { connect } from "mongoose";

async function connectToMongoDB() {
    try {
        await connect('mongodb+srv://user:user@cluster0.5xz5xdc.mongodb.net/?retryWrites=true&w=majority');
        console.log('Connected to mongo');
    }
    catch (err) {
        console.log(err);
    }
}

export default {
    connectToMongoDB
}

