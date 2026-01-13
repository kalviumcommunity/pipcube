
const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
    console.log('--- Verifying Email Integration ---');

    // 1. Send Welcome Email
    console.log('\n1. Sending Welcome Email...');
    const res1 = await fetch(`${BASE_URL}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            to: 'test@example.com', // In sandbox/prod this may fail if target not verified/authorized depending on plan
            subject: 'Test Welcome Email',
            templateName: 'welcome',
            name: 'Test Testerson'
        })
    });

    const data1 = await res1.json();
    console.log(`Status: ${res1.status}`);
    console.log('Response:', data1);

    if (res1.status === 200) {
        console.log('✅ Email API responded success');
    } else {
        console.log('⚠️ Email API failed (Expected if API Key missing or invalid)');
        if (data1.error?.includes('configuration missing')) {
            console.log('   Confirmed graceful failure for missing config.');
        }
    }

    // 2. Validation Error
    console.log('\n2. Testing Validation Error (Missing "to")...');
    const res2 = await fetch(`${BASE_URL}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            subject: 'Incomplete Email'
        })
    });
    console.log(`Status: ${res2.status} (Expected 400)`);
}

runTests();
