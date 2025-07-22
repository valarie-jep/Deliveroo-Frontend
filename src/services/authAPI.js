
export const fakeAuthAPI = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        credentials.email === "test@example.com" &&
        credentials.password === "password123"
      ) {
        resolve({
          user: { name: "Test User", email: "test@example.com" },
          token: "fake-jwt-token",
        });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};
