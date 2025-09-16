// health.js - فحص صحة التطبيق
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ التطبيق يعمل بنجاح!');
    process.exit(0);
  } else {
    console.log('❌ التطبيق لا يستجيب بشكل صحيح. Status:', res.statusCode);
    process.exit(1);
  }
});

req.on('error', (err) => {
  console.error('❌ خطأ في الاتصال:', err.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ انتهت مهلة الاتصال');
  req.destroy();
  process.exit(1);
});

req.end();
