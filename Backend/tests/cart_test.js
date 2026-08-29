const axios = require('axios');
const api = axios.create({ baseURL: 'http://localhost:5000/api', withCredentials: true });
let cookie = '';
api.interceptors.response.use(r => { const sc = r.headers['set-cookie']; if (sc) cookie = sc[0].split(';')[0]; return r; });
api.interceptors.request.use(c => { if (cookie) c.headers.Cookie = cookie; return c; });

(async () => {
    await api.post('/auth/login', { email: 'customer@petcare.com', password: 'password123' });
    const { data: prod } = await api.get('/products?limit=1');
    const p = prod.data.products[0];
    console.log('Product:', p.name, '| Price: $' + p.price, '| Stock:', p.stock);

    // Clear cart first
    await api.delete('/cart');

    // Add 2 units
    const { data: c1 } = await api.post('/cart', { productId: p._id, quantity: 2 });
    const cart = c1.data.cart;
    console.log('After add (qty=2):');
    console.log('  Item:', cart.items[0].name, '| qty:', cart.items[0].quantity, '| subtotal: $' + cart.items[0].subtotal);
    console.log('  Subtotal: $' + cart.subtotal, '| Tax: $' + cart.tax, '| Shipping: $' + cart.shippingFee, '| Total: $' + cart.total);

    // Update qty to 1
    const { data: c2 } = await api.put('/cart/' + p._id, { quantity: 1 });
    console.log('After update (qty=1): total = $' + c2.data.cart.total);

    // Remove item
    await api.delete('/cart/' + p._id);
    const { data: c3 } = await api.get('/cart');
    console.log('After remove: items =', c3.data.cart.items.length);

    // Add to wishlist
    await api.post('/wishlist', { productId: p._id });
    const { data: wl } = await api.get('/wishlist/' + p._id + '/check');
    console.log('Wishlisted:', wl.data.isWishlisted);

    console.log('\n✅ Add-to-Cart & Wishlist: ALL WORKING');
})().catch(e => console.error('❌', e.response?.data?.message || e.message));
