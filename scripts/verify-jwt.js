
// Native fetch is available in recent Node versions

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
const testEmail = `test${Date.now()}@example.com`;

async function runTests() {
    console.log('--- Starting Verification ---');

    // 1. Signup
    console.log('\n1. Testing Signup...');
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Test User',
            email: testEmail,
            password: 'password123',
            role: 'USER'
        })
    });
    const signupData = await signupRes.json();
    console.log('Signup Status:', signupRes.status);
    console.log('Signup Data:', signupData);

    // 2. Login
    console.log('\n2. Testing Login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: testEmail,
            password: 'password123'
        })
    });
    const loginData = await loginRes.json();
    authToken = loginData.token;
    console.log('Login Status:', loginRes.status);
    console.log('Token received:', !!authToken);

    if (!authToken) {
        console.error('Failed to get token. Aborting.');
        return;
    }

    // 3. Access User Route
    console.log('\n3. Testing User Route (should succeed)...');
    const userRes = await fetch(`${BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const userData = await userRes.json();
    console.log('User Route Status:', userRes.status);
    console.log('User Route Data (Summary):', userData.success);

    // 4. Access Admin Route (should fail)
    console.log('\n4. Testing Admin Route as USER (should fail 403)...');
    const adminResFail = await fetch(`${BASE_URL}/admin`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('Admin Route Status:', adminResFail.status);

    // 5. Signup Admin
    console.log('\n5. Testing Signup ADMIN...');
    const adminEmail = `admin${Date.now()}@example.com`;
    const adminSignupRes = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Admin User',
            email: adminEmail,
            password: 'password123',
            role: 'ADMIN' // Requesting admin role
        })
    });
    // Note: Security flaw in demo: client can request ADMIN role. 
    // In a real app, this should be restricted, but for this demo, we implemented it to allow 'role' in body.
    const adminSignupData = await adminSignupRes.json();
    console.log('Admin Signup Status:', adminSignupRes.status);

    // Login as Admin
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: adminEmail,
            password: 'password123'
        })
    });
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.token;

    // 6. Access Admin Route as Admin
    console.log('\n6. Testing Admin Route as ADMIN (should succeed)...');
    const adminResSuccess = await fetch(`${BASE_URL}/admin`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const adminData = await adminResSuccess.json();
    console.log('Admin Route Status:', adminResSuccess.status);
    console.log('Admin Data:', adminData);
}

runTests();
