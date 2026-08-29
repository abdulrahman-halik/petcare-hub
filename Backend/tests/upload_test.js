// Native Node test for upload endpoint
const API_BASE = 'http://localhost:5000/api';

async function testUploadRoute() {
    console.log('🧪 Starting Upload Route & Cloudinary Test...');

    try {
        // 1. Authenticate user to get session cookie
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'supplier@petcare.com',
                password: 'password123'
            })
        });

        if (!loginRes.ok) {
            const errData = await loginRes.json();
            throw new Error(`Auth failed: ${JSON.stringify(errData)}`);
        }

        const cookieHeader = loginRes.headers.get('set-cookie');
        console.log('✅ 1. Authentication successful.');

        // 2. Prepare multipart FormData with a test dummy image
        const dummyPngBuffer = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            'base64'
        );
        const fileBlob = new Blob([dummyPngBuffer], { type: 'image/png' });

        const formData = new FormData();
        formData.append('image', fileBlob, 'test_pet_avatar.png');
        formData.append('folder', 'petcare-hub/test');

        // 3. Send POST request to /api/upload
        const uploadRes = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: {
                ...(cookieHeader ? { Cookie: cookieHeader } : {})
            },
            body: formData
        });

        const uploadData = await uploadRes.json();
        console.log('✅ 2. Upload Endpoint Response Status:', uploadRes.status);
        console.log('📦 3. Payload Response:');
        console.log(JSON.stringify(uploadData, null, 2));

        if (uploadData?.data?.url) {
            console.log(`\n🎉 Upload Test Passed! URL generated: ${uploadData.data.url.substring(0, 60)}...`);
        }
    } catch (err) {
        console.error('❌ Upload Test Failed:', err.message);
    }
}

testUploadRoute();
