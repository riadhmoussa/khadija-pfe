const express = require('express');
const admin = require('firebase-admin');
const cron = require('node-cron');
const app = express();
const PORT = process.env.PORT || 3000;

const serviceAccount = require('./apponsr-bcf81-firebase-adminsdk-czaiw-0f15f7d51b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const tips = [
  {
    title: 'السلامة أولاً',
    description: 'تأكد دائمًا من ارتداء حزام الأمان والتقيد بالقوانين المرورية.',
  },
  {
    title: 'التركيز أثناء القيادة',
    description: 'ابق على انتباهك وتجنب استخدام الهاتف المحمول أثناء القيادة.',
  },
  {
    title: 'المسافة الآمنة',
    description: 'حافظ على مسافة آمنة بين سيارتك والسيارات الأخرى لتفادي الحوادث.',
  },
  {
    title: 'تحديث الصيانة الدورية',
    description: 'احرص على صيانة السيارة بانتظام لضمان أفضل أداء وسلامة.',
  },
  {
    title: 'التنبيهات والضوء الأحمر',
    description: 'تجنب تجاوز الإشارات الحمراء وابق آخر في التنبيهات المرورية.',
  },
];

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Server shutting down...');
  server.close(() => {
    console.log('Server shut down.');
    process.exit(0);
  });
});

cron.schedule('* * * * *', () => {
  console.log("Cron job started");
  const randomIndex = Math.floor(Math.random() * tips.length);
  const randomTip = tips[randomIndex];

  const message = {
    notification: {
      title: randomTip.title,
      body: randomTip.description,
    },
    topic: 'allUsers',
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Notification sent successfully:', response);
    })
    .catch((error) => {
      console.error('Error sending notification:', error);
    });
});
