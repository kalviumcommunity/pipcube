
const { performance } = require('perf_hooks');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

async function runTests() {
    console.log('--- Verifying Redis Caching ---');

    // 0. Login to get token
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'test@example.com', // Assuming exists or will fail gracefully
            password: 'password123'
        })
    });

    if (!loginRes.ok) {
        // Try signup if login fails
        const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Redis Test User',
                email: `redistest${Date.now()}@example.com`,
                password: 'password123',
                role: 'USER'
            })
        });
        const sData = await signupRes.json();
        authToken = sData.token || (await (await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: sData.user?.email, password: 'password123' })
        })).json()).token;
    } else {
        authToken = (await loginRes.json()).token;
    }

    if (!authToken) {
        console.error('Failed to get token');
        return;
    }

    const headers = { 'Authorization': `Bearer ${authToken}` };

    // 1. First Request (Cache Miss)
    const start1 = performance.now();
    await fetch(`${BASE_URL}/users`, { headers });
    const end1 = performance.now();
    const latency1 = end1 - start1;
    console.log(`1. First Request (Miss): ${latency1.toFixed(2)}ms`);

    // 2. Second Request (Cache Hit)
    const start2 = performance.now();
    await fetch(`${BASE_URL}/users`, { headers });
    const end2 = performance.now();
    const latency2 = end2 - start2;
    console.log(`2. Second Request (Hit): ${latency2.toFixed(2)}ms`);

    if (latency2 < latency1) {
        console.log('✅ Latency improved (Hit < Miss)');
    } else {
        console.log('⚠️ Latency did not improve (Network variance or fast DB?)');
    }

    // 3. Create User (Invalidate Cache)
    console.log('3. Creating User (Invalidating Cache)...');
    await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'New Cache User',
            email: `cache${Date.now()}@example.com`,
            password: 'password123',
            role: 'USER'
        })
    });

    // 4. Third Request (Cache Miss again)
    const start3 = performance.now();
    await fetch(`${BASE_URL}/users`, { headers });
    const end3 = performance.now();
    const latency3 = end3 - start3;
    console.log(`4. Third Request (Miss after Invalidate): ${latency3.toFixed(2)}ms`);
}

runTests();
