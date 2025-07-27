
import { Models } from "react-native-appwrite";
export interface Habits extends Models.Document{
    
user_id:string,
title:string,
description:string,
streak_count:number,
frequency:string,
last_completed:string,
created_at:string,
}

export interface HabitsCompletion extends Models.Document{
    habit_id:string,
    user_id:string,
    completed_at:string
}