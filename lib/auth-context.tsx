import React, { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

// 1. Define the context type
type AuthContextType = {
  user:Models.User<Models.Preferences> | null;
  isLoodingUser:boolean;
  signUp: (email: string, password: string) => Promise<string | void>;
  signIn: (email: string, password: string) => Promise<string | void>;
   logout: () => Promise<void>;
};

// 2. Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,setUser]=useState<Models.User<Models.Preferences> | null>(null);
  const [isLoodingUser,setIsLoodingUser]=useState<boolean>(true);

  useEffect(()=>{
    getUser();
  },[])

  const getUser=async()=>{
    try {
      const session=await account.get();
      setUser(session);
    } catch (error) {
      setUser(null);
    }finally{
      setIsLoodingUser(false)
    }
  }
  // Sign Up function
  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      await signIn(email, password);
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "An error occurred during sign up";
    }
  };

  // Sign In function
 const signIn = async (email: string, password: string): Promise<string | void> => {
  try {
    await account.createEmailPasswordSession(email, password);
    const currentUser = await account.get();
    setUser(currentUser); // ✅ set user here
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return "An error occurred during sign in";
  }
};


  // signout in function 
  const logout = async () => {
  try {
    await account.deleteSession("current");
    setUser(null);
  } catch (error) {
    console.log("Logout failed:", error);
  }
}

  return (
    <AuthContext.Provider value={{user, isLoodingUser,signUp, signIn,logout}}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
