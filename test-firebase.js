#!/usr/bin/env node

// Test Firebase credentials by making a direct REST API call
// This test will try both the web API key (from README/.env) and the Android API key
// found in `google-services.json` to see which one (if any) returns a valid response.

const keysToTest = [
  {
    name: "web_api_key_from_env",
    key: "AIzaSyBs3sqFi2RBiKd5Xt0_9DALJBaHdOXgn5U",
  },
  {
    name: "android_api_key_from_google_services",
    key: "AIzaSyCAI5_ZUTQcofp3TqslC-oWWXzigaCBjjA",
  },
];

const testEmail = `pda_test_${Date.now() % 10000}@example.com`;
const testPassword = "Test123456";

async function trySignUp(apiKeyObj) {
  console.log(
    `\n🔍 Testing key: ${apiKeyObj.name} (${apiKeyObj.key.substring(0, 10)}...)`,
  );
  try {
    const resp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKeyObj.key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          returnSecureToken: true,
        }),
      },
    );
    const data = await resp.json();
    console.log("HTTP status:", resp.status);
    console.log("Response:", JSON.stringify(data));
    if (resp.ok) {
      console.log("✅ SignUp succeeded with key:", apiKeyObj.name);
    } else {
      console.log(
        "❌ SignUp failed with key:",
        apiKeyObj.name,
        "->",
        data.error?.message || "unknown",
      );
    }
  } catch (err) {
    console.log(
      "❌ Network error while testing key",
      apiKeyObj.name,
      err.message || err,
    );
  }
}

async function main() {
  console.log("Starting Firebase key tests");
  for (const k of keysToTest) {
    // small delay between tests
    await trySignUp(k);
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log("\nDone tests");
}

main();
