
const BASE_URL = 'http://localhost:3000';
let userToken = '';

async function runTests() {
    try {
        console.log('--- Verifying Next.js Routing ---');

        // 1. Public Route
        const res1 = await fetch(`${BASE_URL}/`);
        console.log(`1. GET / (Public): ${res1.status} (Expected 200)`);

        // 2. Protected Page (Unauthenticated)
        const res2 = await fetch(`${BASE_URL}/dashboard`, { redirect: 'manual' });
        console.log(`2. GET /dashboard (No Auth): ${res2.status} (Expected 307/308)`);

        // 3. Login
        console.log('3. Logging in...');
        let loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
        });

        if (!loginRes.ok) {
            console.log('   Login failed, trying signup...');
            const sRes = await fetch(`${BASE_URL}/api/auth/signup`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Route Test', email: `route${Date.now()}@test.com`, password: 'password123', role: 'USER' })
            });
            if (sRes.ok) {
                const sData = await sRes.json();
                loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: sData.user.email, password: 'password123' })
                });
            }
        }

        if (loginRes.ok) {
            const data = await loginRes.json();
            userToken = data.token;
            console.log(`   Token obtained: ${userToken ? 'Yes' : 'No'}`);
        } else {
            console.log('   Failed to get token.');
        }

        if (userToken) {
            // 4. Protected Page (Authenticated)
            const res4 = await fetch(`${BASE_URL}/dashboard`, {
                headers: { 'Cookie': `token=${userToken}` }
            });
            console.log(`4. GET /dashboard (With Cookie): ${res4.status} (Expected 200)`);

            // 5. Dynamic Route
            try {
                const listRes = await fetch(`${BASE_URL}/api/users`, { headers: { 'Authorization': `Bearer ${userToken}` } });
                const listData = await listRes.json();
                const users = listData.data;
                if (users && users.length > 0) {
                    const userId = users[0].id;
                    const res5 = await fetch(`${BASE_URL}/users/${userId}`, {
                        headers: { 'Cookie': `token=${userToken}` }
                    });
                    console.log(`5. GET /users/${userId} (Dynamic): ${res5.status} (Expected 200)`);
                } else {
                    console.log('   No users found to test dynamic route.');
                }
            } catch (e) {
                console.log('   Error testing dynamic route:', e.message);
            }
        }

        // 6. 404 Check
        const res6 = await fetch(`${BASE_URL}/some-random-page-xyz-123`);
        console.log(`6. GET /random (404): ${res6.status} (Expected 404)`);
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

runTests();
