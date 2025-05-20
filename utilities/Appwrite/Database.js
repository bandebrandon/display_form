import { databases } from "./config"; 
import { ID } from "appwrite";

const db =  {}

const collections = [
    {
        dbId : import.meta.env.VITE_EVALUATIONS_DATABASES_ID ,
        id : import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        name : 'evaluation_questions'
    },
    {
        dbId : import.meta.env.VITE_EVALUATIONS_DATABASES_ID ,
        id : import.meta.env.VITE_APPWRITE_CAPTURED_COLLECTION_ID,
        name : 'completed'
    }
    
   
]

collections.forEach(
    col =>{
        db[col.name]={

            create:(payload ,id = ID.unique())=>{
                databases.createDocument(
                    col.dbId ,
                    col.id,
                    id,
                    payload
                )
            },

            update : (id , payload)=>databases.updateDocument(
                col.dbId ,
                col.id ,
                id,
                payload

            ),

            get:(id)=>databases.getDocument(
                col.dbId,
                col.id,
                id
            ),


            list : (queries)=> databases.listDocuments(
                col.dbId ,
                col.id,
                queries
            ),
            delete : (id)=> databases.deleteDocument(
                col.dbId , 
                col.id, 
                id
            )
        }
    }
)






export {db};