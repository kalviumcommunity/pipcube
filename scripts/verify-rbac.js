
// using native fetch

async function runVerification() {
    const baseUrl = 'http://localhost:3000/api';

    console.log('1. Fetching Test Tokens...');
    const tokenRes = await fetch(`${baseUrl}/test-utils/token`);
    if (!tokenRes.ok) {
        console.error('Failed to fetch tokens', await tokenRes.text());
        return;
    }
    const tokens = await tokenRes.json();
    const { adminToken, userToken } = tokens;
    console.log('Got tokens.');

    console.log('\n2. Testing Admin Access with ADMIN Token (Expect 200)...');
    const adminRes = await fetch(`${baseUrl}/admin`, {
        headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`Status: ${adminRes.status}`);
    const adminJson = await adminRes.json();
    console.log('Result:', adminJson);

    console.log('\n3. Testing Admin Access with USER Token (Expect 403)...');
    const userRes = await fetch(`${baseUrl}/admin`, {
        headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log(`Status: ${userRes.status}`);
    const userJson = await userRes.json();
    console.log('Result:', userJson);

    console.log('\n4. Testing Users Route with USER Token (Expect 500 or 201/200)...');
    // (Expect 500 because DB likely fails, but middleware should pass)
    // We use GET for simplicity if implemented, or POST.
    // The POST requires body.
    // The GET was implemented in my last write.
    const usersRes = await fetch(`${baseUrl}/users`, {
        method: "GET",
        headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log(`Status: ${usersRes.status}`);
    const usersJson = await usersRes.json();
    console.log('Result:', usersJson);
}

// Polyfill fetch if needed (Node < 18)
if (!globalThis.fetch) {
    console.log("Using native fetch not available, checking node version...");
}

runVerification().catch(console.error);
