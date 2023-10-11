import { DefaultAuthenticationService } from "../DefaultAuthenticationService";

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: async () => ({
    user: { email: "testuser@test.com", uid: "1234554321" },
  }),
  createUserWithEmailAndPassword: async () => ({
    user: { email: "testuser@test.com", uid: "1234554321" },
  }),
  signOut: () => {
    signedOut = true;
  },
}));
jest.mock("../../../../firebaseConfig", () => ({
  FIREBASE_AUTH: { onAuthStateChanged: () => {} },
}));

let signedOut = false;

beforeEach(() => {
  signedOut = false;
});

describe("signIn()", () => {
  it("executes the firebase signInWithEmailAndPassword()", async () => {
    const service = new DefaultAuthenticationService();

    const user = await service.signIn("testuser@test.com", "test");

    expect(user.email).toBe("testuser@test.com");
  });
  it("executes the onSignIn callback", async () => {
    let signIn = false;
    const service = new DefaultAuthenticationService({
      onSignIn: () => (signIn = true),
    });

    await service.signIn("testuser@test.com", "test");

    expect(signIn).toBe(true);
  });
});

describe("register()", () => {
  it("executes the firebase createUserWithEmailAndPassword()", async () => {
    const service = new DefaultAuthenticationService();

    const user = await service.register("testuser@test.com", "test");

    expect(user.email).toBe("testuser@test.com");
  });
  it("executes the onRegister and then the onSignIn callback", async () => {
    let val = 1;
    const service = new DefaultAuthenticationService({
      onSignIn: () => (val += 1),
      onRegister: () => (val *= 2),
    });

    await service.register("testuser@test.com", "test");

    expect(val).toBe(3);
  });
});

describe("signOut()", () => {
  it("executes the firebase signOut()", async () => {
    const service = new DefaultAuthenticationService();

    await service.signOut();

    expect(signedOut).toBe(true);
  });
  it("executes the onSignOut callback", async () => {
    let signOut = false;
    const service = new DefaultAuthenticationService({
      onSignOut: () => (signOut = true),
    });

    await service.signOut();

    expect(signOut).toBe(true);
  });
});
