import { Evented } from "../../support/Evented";
import { User } from "./User";

export interface AuthenticationServiceProperties {
  onSignIn?: (user: User) => void;
  onSignOut?: (user: User) => void;
  onRegister?: (user: User) => void;
}

export interface AuthenticationService extends Evented {
  readonly user: User | undefined;
  onSignIn: ((user: User) => void) | undefined;
  onSignOut: ((user: User) => void) | undefined;
  onRegister: ((user: User) => void) | undefined;
  signIn(email: string, password: string): Promise<User>;
  register(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  destroy(): void;
}
