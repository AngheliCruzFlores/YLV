import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getMessaging, onMessage } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyBKMNkwYORRLl4kv0T9lBcwovD_lqR68Ks",
  authDomain: "proyectod-32943.firebaseapp.com",
  projectId: "proyectod-32943",
  storageBucket: "proyectod-32943.appspot.com",
  messagingSenderId: "1087752326466",
  appId: "1:1087752326466:web:4718b6426812a1f1368cdb",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon
  });
});

