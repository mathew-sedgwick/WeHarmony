import { createContext } from "react";
import type Firebase from "firebase/auth";

export const AuthenticationContext = createContext<Firebase.User | null>(null);
