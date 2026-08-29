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

const runPhase3Tests = async () => {
    console.log('--- STARTING PHASE 3 API VERIFICATION ---');
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

        // 2. Public categories list
        const categoriesRes = await request('/api/categories');
        assert(categoriesRes.status === 200 && categoriesRes.data.data.categories.length > 0, `Fetched ${categoriesRes.data.data?.categories?.length} categories`);
        const sampleCategory = categoriesRes.data.data.categories[0];

        // 3. Public products list with search and filters
        const productsRes = await request('/api/products');
        assert(productsRes.status === 200 && productsRes.data.data.products.length > 0, `Fetched ${productsRes.data.data?.products?.length} products`);

        const searchRes = await request('/api/products?keyword=salmon');
        assert(searchRes.status === 200 && searchRes.data.data.products.length > 0, `Keyword search 'salmon' found ${searchRes.data.data?.products?.length} product(s)`);

        const catFilterRes = await request(`/api/products?category=${sampleCategory.slug || sampleCategory._id}`);
        assert(catFilterRes.status === 200, `Category filter '${sampleCategory.name}' returned status 200`);

        // 4. Featured products
        const featuredRes = await request('/api/products/featured');
        assert(featuredRes.status === 200 && featuredRes.data.data.topRated.length > 0, 'Featured products returned successfully');

        // 5. Product Detail View
        const sampleProduct = productsRes.data.data.products[0];
        const singleProductRes = await request(`/api/products/${sampleProduct._id}`);
        assert(singleProductRes.status === 200 && singleProductRes.data.data.product.name === sampleProduct.name, `Fetched product detail for '${sampleProduct.name}'`);

        // 6. Supplier Login & Product CRUD
        const supplierLogin = await request('/api/auth/login', 'POST', {
            email: 'supplier@petcare.com',
            password: 'password123'
        });
        assert(supplierLogin.status === 200, 'Supplier login successful');
        const setCookie = supplierLogin.headers['set-cookie'];
        const cookieHeader = setCookie ? setCookie.map(c => c.split(';')[0]).join('; ') : '';

        // Supplier - My Products
        const myProducts = await request('/api/products/supplier/my-products', 'GET', null, { Cookie: cookieHeader });
        assert(myProducts.status === 200 && myProducts.data.data.products.length > 0, `Supplier fetched ${myProducts.data.data?.products?.length} owned products`);

        // Supplier - Create New Product
        const newProductRes = await request('/api/products', 'POST', {
            name: 'Eco-Friendly Bamboo Slicker Pet Brush',
            description: 'Ergonomic lightweight natural bamboo handle with fine bent stainless steel wire bristles to gently detangle undercoats.',
            price: 21.99,
            stock: 30,
            category: sampleCategory._id,
            brand: 'EcoPaw',
            petType: 'dog',
            features: ['Natural bamboo body', 'Self-cleaning push button', 'Ergonomic grip']
        }, { Cookie: cookieHeader });
        assert(newProductRes.status === 201, 'Supplier created new product listing');
        const createdProdId = newProductRes.data.data?.product?._id;

        // Supplier - Update Product
        if (createdProdId) {
            const updateRes = await request(`/api/products/${createdProdId}`, 'PUT', {
                price: 24.99,
                stock: 25
            }, { Cookie: cookieHeader });
            assert(updateRes.status === 200 && updateRes.data.data.product.price === 24.99, 'Supplier updated product price & stock');
        }

        // 7. Admin Login & Moderation
        const adminLogin = await request('/api/auth/login', 'POST', {
            email: 'admin@petcare.com',
            password: 'password123'
        });
        assert(adminLogin.status === 200, 'Admin login successful');
        const adminCookieHeader = adminLogin.headers['set-cookie'] ? adminLogin.headers['set-cookie'].map(c => c.split(';')[0]).join('; ') : '';

        // Admin - Category CRUD
        const newCategoryRes = await request('/api/categories', 'POST', {
            name: 'Aquatic & Fish Supplies',
            description: 'Aquariums, water filters, nutrition flakes, and underwater decorations.'
        }, { Cookie: adminCookieHeader });
        assert(newCategoryRes.status === 201, 'Admin created new Category');
        const newCatId = newCategoryRes.data.data?.category?._id;

        if (newCatId) {
            const updateCatRes = await request(`/api/categories/${newCatId}`, 'PUT', {
                description: 'Updated description for Aquatic Supplies'
            }, { Cookie: adminCookieHeader });
            assert(updateCatRes.status === 200, 'Admin updated category description');

            const deleteCatRes = await request(`/api/categories/${newCatId}`, 'DELETE', null, { Cookie: adminCookieHeader });
            assert(deleteCatRes.status === 200, 'Admin deleted category');
        }

        // Admin - Product Moderation
        if (createdProdId) {
            const modRes = await request(`/api/products/${createdProdId}/moderate`, 'PATCH', {
                status: 'flagged'
            }, { Cookie: adminCookieHeader });
            assert(modRes.status === 200 && modRes.data.data.product.status === 'flagged', 'Admin flagged product for review');

            // Supplier clean up
            const delRes = await request(`/api/products/${createdProdId}`, 'DELETE', null, { Cookie: cookieHeader });
            assert(delRes.status === 200, 'Supplier deleted test product');
        }

        console.log(`\n--- TEST RESULTS: ${passed} PASSED, ${failed} FAILED ---`);
        process.exit(failed > 0 ? 1 : 0);
    } catch (err) {
        console.error('Test execution error:', err);
        process.exit(1);
    }
};

runPhase3Tests();
