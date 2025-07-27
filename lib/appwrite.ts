import { Account, Client, Databases } from "react-native-appwrite";

export const client=new Client().setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!).setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!).setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!)
 
export const account=new Account(client);

export const databse=new Databases(client);

export const DATABASE_ID=process.env.EXPO_PUBLIC_DB_ID!;
export const HABITS_COLLECTION_ID=process.env.EXPO_PUBLIC_DB_COLLECTION!;
export const COMPLETION_COLLECTION_ID=process.env.EXPO_PUBLIC_COMPLETION_COLLECTION!;

export interface RealtimeResponse{
    events:string[],
    payload:any
}
