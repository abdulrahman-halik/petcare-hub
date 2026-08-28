const http = require('http');

const request = (path, method = 'GET', body = null, headers = {}) => {
    return new Promise((resolve, reject) => {
        const url = new URL(`http://localhost:5000${path}`);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch {
                    parsed = data;
                }
                resolve({ status: res.statusCode, data: parsed, headers: res.headers });
            });
        });

        req.on('error', reject);
        if (body) {
            req.write(typeof body === 'string' ? body : JSON.stringify(body));
        }
        req.end();
    });
};

const runPhase4Tests = async () => {
    console.log('--- STARTING PHASE 4 API & INNOVATIVE FEATURES VERIFICATION ---');
    let passed = 0;
    let failed = 0;

    const assert = (condition, msg) => {
        if (condition) {
            console.log(`✅ PASS: ${msg}`);
            passed++;
        } else {
            console.error(`❌ FAIL: ${msg}`);
            failed++;
        }
    };

    try {
        // 1. Health check
        const health = await request('/api/health');
        assert(health.status === 200, 'Server health check returns 200');

        // 2. Customer Authentication
        const loginRes = await request('/api/auth/login', 'POST', {
            email: 'customer@petcare.com',
            password: 'password123'
        });
        assert(loginRes.status === 200, 'Customer login successful');
        const token = loginRes.data?.data?.token;
        const setCookie = loginRes.headers['set-cookie'];
        const cookieHeader = setCookie ? setCookie.map(c => c.split(';')[0]).join('; ') : '';
        const authHeaders = {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
        };

        // 3. Pet Profile Management (CRUD)
        // 3.1 Get seeded pets
        const petsRes = await request('/api/pets', 'GET', null, authHeaders);
        assert(petsRes.status === 200 && petsRes.data?.data?.pets?.length >= 3, `Fetched ${petsRes.data?.data?.pets?.length} customer pets`);
        const bailey = petsRes.data?.data?.pets?.find(p => p.name === 'Bailey');
        const oliver = petsRes.data?.data?.pets?.find(p => p.name === 'Oliver');
        assert(!!bailey && bailey.species === 'dog', "Found seeded dog 'Bailey'");
        assert(!!oliver && oliver.species === 'cat', "Found seeded cat 'Oliver'");

        // 3.2 Create new pet
        const createPetRes = await request('/api/pets', 'POST', {
            name: 'Luna',
            species: 'cat',
            breed: 'Ragdoll',
            age: 2.5,
            gender: 'female',
            weight: 4.2,
            activityLevel: 'moderate',
            medicalConditions: ['Skin & Coat Dryness', 'Sensitive Stomach'],
            allergies: ['Chicken'],
            dietaryPreferences: ['Grain-Free Salmon'],
            microchipNumber: '985141009988776'
        }, authHeaders);
        assert(createPetRes.status === 201, "Created new pet profile 'Luna'");
        const lunaId = createPetRes.data?.data?.pet?._id;

        // 3.3 Get Pet by ID
        const getLunaRes = await request(`/api/pets/${lunaId}`, 'GET', null, authHeaders);
        assert(getLunaRes.status === 200 && getLunaRes.data?.data?.pet?.name === 'Luna', 'Fetched single pet profile by ID');

        // 3.4 Update Pet
        const updateLunaRes = await request(`/api/pets/${lunaId}`, 'PUT', {
            weight: 4.5,
            medicalConditions: ['Skin & Coat Dryness', 'Sensitive Stomach', 'Hairballs']
        }, authHeaders);
        assert(updateLunaRes.status === 200 && updateLunaRes.data?.data?.pet?.weight === 4.5, "Updated Luna's weight to 4.5kg and medical conditions");

        // 4. Smart Product Recommendations Engine
        // 4.1 Multi-Pet Recommendations for authenticated customer
        const recsRes = await request('/api/recommendations', 'GET', null, authHeaders);
        assert(recsRes.status === 200 && recsRes.data?.data?.recommendations?.length > 0, `Generated ${recsRes.data?.data?.recommendations?.length} personalized recommendations for customer`);
        const firstRec = recsRes.data?.data?.recommendations?.[0];
        assert(firstRec && firstRec.relevanceScore > 40, `Top product '${firstRec?.product?.name}' has high relevance score (${firstRec?.relevanceScore})`);
        assert(!!firstRec?.primaryReason, `Product has recommendation reason badge: "${firstRec?.primaryReason}"`);

        // 4.2 Single Pet Recommendations for Bailey (Puppy Dog)
        const baileyRecs = await request(`/api/recommendations/pet/${bailey._id}`, 'GET', null, authHeaders);
        assert(baileyRecs.status === 200 && baileyRecs.data?.data?.recommendations?.length > 0, `Generated recommendations specifically for Bailey (Dog, Puppy)`);
        const baileyTop = baileyRecs.data?.data?.recommendations?.[0];
        assert(baileyTop.product.petType === 'dog' || baileyTop.product.petType === 'all', `Bailey's top recommendation is dog-compatible (${baileyTop.product.name})`);

        // 4.3 Single Pet Recommendations for Oliver (Senior Cat with Joint Issues)
        const oliverRecs = await request(`/api/recommendations/pet/${oliver._id}`, 'GET', null, authHeaders);
        assert(oliverRecs.status === 200 && oliverRecs.data?.data?.recommendations?.length > 0, `Generated recommendations specifically for Oliver (Senior Cat)`);

        // 4.4 Guest Recommendations (Unauthenticated)
        const guestRecs = await request('/api/recommendations');
        assert(guestRecs.status === 200 && guestRecs.data?.data?.recommendations?.length > 0, 'Guest recommendations fallback returned top-rated products');

        // 5. Pet Care Reminders & Scheduling
        // 5.1 Get Reminders
        const remindersRes = await request('/api/reminders', 'GET', null, authHeaders);
        assert(remindersRes.status === 200 && remindersRes.data?.data?.reminders?.length >= 5, `Fetched ${remindersRes.data?.data?.reminders?.length} scheduled care reminders`);

        // 5.2 Create Manual Reminder for Luna
        const newReminderRes = await request('/api/reminders', 'POST', {
            petId: lunaId,
            title: 'Luna Annual Feline Checkup',
            type: 'vet-visit',
            dueDate: new Date(Date.now() + 15 * 86400000).toISOString(),
            time: '11:00 AM',
            frequency: 'yearly',
            notes: 'Check coat condition and dental health.'
        }, authHeaders);
        assert(newReminderRes.status === 201, 'Created new manual reminder for Luna');
        const lunaReminderId = newReminderRes.data?.data?.reminder?._id;

        // 5.3 Toggle Status (Complete)
        const statusRes = await request(`/api/reminders/${lunaReminderId}/status`, 'PATCH', {
            status: 'completed'
        }, authHeaders);
        assert(statusRes.status === 200 && statusRes.data?.data?.reminder?.status === 'completed', 'Updated reminder status to completed');

        // 5.4 1-Click Automated Preventive Care Plan Generation
        const carePlanRes = await request(`/api/reminders/generate-plan/${lunaId}`, 'POST', null, authHeaders);
        assert(carePlanRes.status === 201 && carePlanRes.data?.data?.reminders?.length >= 3, `Generated 1-click automated preventive health plan (${carePlanRes.data?.data?.reminders?.length} care events) for Luna`);

        // 5.5 Delete single reminder
        const deleteReminderRes = await request(`/api/reminders/${lunaReminderId}`, 'DELETE', null, authHeaders);
        assert(deleteReminderRes.status === 200, 'Deleted manual reminder successfully');

        // 6. Cascade Pet Delete
        const deleteLunaRes = await request(`/api/pets/${lunaId}`, 'DELETE', null, authHeaders);
        assert(deleteLunaRes.status === 200, 'Deleted test pet Luna and cascaded reminders cleanup');

        // 7. Verify Luna's reminders were cascade deleted
        const remainingLunaReminders = await request(`/api/reminders?pet=${lunaId}`, 'GET', null, authHeaders);
        assert(remainingLunaReminders.data?.data?.reminders?.length === 0, 'Confirmed cascading deletion of associated pet reminders');

        console.log(`\n--- PHASE 4 TEST RESULTS: ${passed} PASSED, ${failed} FAILED ---`);
        process.exit(failed > 0 ? 1 : 0);
    } catch (err) {
        console.error('Test execution error:', err);
        process.exit(1);
    }
};

runPhase4Tests();
