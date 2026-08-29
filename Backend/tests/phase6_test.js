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
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
};

const run = async () => {
  try {
    const health = await request('/api/health');
    if (health.status !== 200) throw new Error('Health check failed');

    const customerLogin = await request('/api/auth/login', 'POST', { email: 'customer@petcare.com', password: 'password123' });
    const customerCookie = customerLogin.headers['set-cookie'] ? customerLogin.headers['set-cookie'].map(c => c.split(';')[0]).join('; ') : '';

    const supplierLogin = await request('/api/auth/login', 'POST', { email: 'supplier@petcare.com', password: 'password123' });
    const supplierCookie = supplierLogin.headers['set-cookie'] ? supplierLogin.headers['set-cookie'].map(c => c.split(';')[0]).join('; ') : '';

    const adminLogin = await request('/api/auth/login', 'POST', { email: 'admin@petcare.com', password: 'password123' });
    const adminCookie = adminLogin.headers['set-cookie'] ? adminLogin.headers['set-cookie'].map(c => c.split(';')[0]).join('; ') : '';

    const customerDashboard = await request('/api/dashboard/customer', 'GET', null, { Cookie: customerCookie });
    if (customerDashboard.status !== 200 || !customerDashboard.data.data) throw new Error('Customer dashboard missing data');

    const supplierDashboard = await request('/api/dashboard/supplier', 'GET', null, { Cookie: supplierCookie });
    if (supplierDashboard.status !== 200 || !supplierDashboard.data.data) throw new Error('Supplier dashboard missing data');

    const adminDashboard = await request('/api/dashboard/admin', 'GET', null, { Cookie: adminCookie });
    if (adminDashboard.status !== 200 || !adminDashboard.data.data) throw new Error('Admin dashboard missing data');

    const notifications = await request('/api/notifications', 'GET', null, { Cookie: customerCookie });
    if (notifications.status !== 200 || !Array.isArray(notifications.data.data.notifications)) throw new Error('Notifications endpoint malformed');

    const unreadCount = await request('/api/notifications/unread-count', 'GET', null, { Cookie: customerCookie });
    if (unreadCount.status !== 200 || typeof unreadCount.data.data.unreadCount !== 'number') throw new Error('Unread count malformed');

    const markAll = await request('/api/notifications/mark-all-read', 'PATCH', null, { Cookie: customerCookie });
    if (markAll.status !== 200) throw new Error('Mark all read failed');

    console.log('✅ Phase 6 API smoke test passed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Phase 6 API smoke test failed:', err.response?.data || err.message);
    process.exit(1);
  }
};

run();
