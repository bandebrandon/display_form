import { Client , Databases} from "appwrite";


const client = new Client();
client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); 



//console.log(import.meta.env.VITE_APPWRITE_ENDPOINT)
//console.log(import.meta.VITE_APPWRITE_PROJECT_ID)

const databases = new Databases(client)

export {client ,databases}