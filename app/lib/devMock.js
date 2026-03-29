// Dev Mock DB for OpenLabs (no DB setup)
const MOCK_USERS = {
  "test@test.com": {
    _id: "mockuser1",
    email: "test@gmail.com",
    password: "Test123"  // plain for mock dev
  }
};

let mockDB = MOCK_USERS;

export async function mockConnect() {
  console.log("✅ Mock DB (dev): Ready - use test@test.com / Test123");
  return { conn: { useMock: true } };
}

export async function mockFindUser(email) {
  return mockDB[email] || null;
}
