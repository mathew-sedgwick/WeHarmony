import { PropsWithChildren, useEffect, useState } from "react";
import { AuthenticationContext } from "./AuthenticationContext";
import Firebase from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";

export interface AuthenticationProviderProps extends PropsWithChildren {}

export const AuthProvider: React.FC<AuthenticationProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<Firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthenticationContext.Provider value={user}>
      {children}
    </AuthenticationContext.Provider>
  );
};
