import { FIREBASE_AUTH } from "../../../firebaseConfig";
import {
  AuthenticationService,
  AuthenticationServiceProperties,
} from "./AuthenticationService";
import { User } from "./User";
import { Evented } from "../../support/Evented";
import { IHandle } from "../../support/IHandle";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  User as FireBaseUser,
} from "firebase/auth";

export interface DefaultAuthenticationServiceProperties
  extends AuthenticationServiceProperties {}

export class DefaultAuthenticationService
  extends Evented
  implements AuthenticationService
{
  onSignIn: ((user: User) => void) | undefined;
  onSignOut: ((user: User) => void) | undefined;
  onRegister: ((user: User) => void) | undefined;
  protected readonly _handles: IHandle[] = [];
  private _user: User | undefined;

  constructor(properties?: DefaultAuthenticationServiceProperties) {
    super();
    this.onSignIn = properties?.onSignIn;
    this.onSignOut = properties?.onSignOut;
    this.onRegister = properties?.onRegister;
    this._setUser(FIREBASE_AUTH.currentUser!);
  }

  get user(): User | undefined {
    return this._user;
  }

  async signIn(email: string, password: string): Promise<User> {
    if (this._user) {
      throw new Error(
        "AuthenticationService: Failed to sign in. Already signed in."
      );
    }
    try {
      const result = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      this._setUser(result.user);
      this.onSignIn?.(this.user!);
    } catch (e) {
      throw new Error("AuthenticationService: Failed to sign in", {
        cause: e,
      });
    }
    return this._user!;
  }

  async register(email: string, password: string): Promise<User> {
    if (this._user) {
      throw new Error(
        "AuthenticationService: Failed to register. Already signed in."
      );
    }
    try {
      const result = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      this._setUser(result.user);
    } catch (e) {
      throw new Error("AuthenticationService: Failed to register", {
        cause: e,
      });
    }
    this.onRegister?.(this.user!);
    this.onSignIn?.(this.user!);
    return this._user!;
  }

  async signOut(): Promise<void> {
    this.onSignOut?.(this.user!);
    signOut(FIREBASE_AUTH);
  }

  destroy(): void {
    this._handles.forEach((h) => h.remove());
  }

  private _setUser(firebaseUser: FireBaseUser | undefined): void {
    this._user = firebaseUser
      ? new User({
          email: firebaseUser.email!,
          id: firebaseUser.uid,
        })
      : undefined;
    this.emit("user-changed", this._user);
  }
}
