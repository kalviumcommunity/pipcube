
// Native fetch in Node 18+
const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

async function runTests() {
    console.log('--- Verifying Error Handling ---');

    // 1. Login to get token (needed for users route?)
    // Actually the users route in route.ts I just wrote DOES NOT seem to check auth headers explicitly?
    // Wait, the middleware does! The middleware protects /api/users.
    // So I need to login first.

    console.log('Logging in...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'test@example.com', // Assuming this user exists from previous step or I'll create one
            password: 'password123'
        })
    });

    let token = '';
    if (loginRes.ok) {
        const data = await loginRes.json();
        token = data.token;
    } else {
        // If login failed, maybe create a user first
        console.log('Login failed, creating user...');
        const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Error Test User',
                email: `errtest${Date.now()}@example.com`,
                password: 'password123',
                role: 'USER'
            })
        });
        const sData = await signupRes.json();
        token = sData.token || (await (await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: sData.user.email, password: 'password123' })
        })).json()).token;
    }

    if (!token) {
        console.error('Failed to obtain token');
        return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    // 2. Normal Request
    console.log('\n2. Normal Request to /api/users');
    const resOk = await fetch(`${BASE_URL}/users`, { headers });
    console.log('Status:', resOk.status);
    const dataOk = await resOk.json();
    console.log('Success:', dataOk.success);

    // 3. Simulated Error Request
    console.log('\n3. Simulated Error Request to /api/users?simulateError=true');
    const resErr = await fetch(`${BASE_URL}/users?simulateError=true`, { headers });
    console.log('Status:', resErr.status); // Should be 500
    const dataErr = await resErr.json();
    console.log('Error Body:', dataErr);

    if (dataErr.stack) {
        console.log('✅ Stack trace present (Expected in Dev)');
    } else {
        console.log('❌ Stack trace missing (Unexpected in Dev, unless NODE_ENV=production)');
    }
}

runTests();
