const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");

admin.initializeApp();

/* 🔐 TWILIO CONFIG */
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const whatsappFrom = functions.config().twilio.whatsapp_from;

const client = twilio(accountSid, authToken);

/* 🔥 FIRESTORE TRIGGER */
exports.sendWhatsAppOnAppointment = functions.firestore
  .document("appointments/{id}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const message = `🩺 *Shanmuga Diabetic Clinic*

Hello *${data.name}* 👋  
Your appointment is *successfully booked* ✅

📅 Date: *${data.date}*  
⏰ Time: *${data.time}*  
🎟 Queue No: *${data.queueNumber}*

📍 Please arrive 10 minutes early  
📞 Contact: 88251 51522

Thank you 🙏`;

    try {
      await client.messages.create({
        from: whatsappFrom,
        to: `whatsapp:+91${data.phone}`, // 🇮🇳 India
        body: message,
      });

      console.log("✅ WhatsApp message sent");
    } catch (error) {
      console.error("❌ WhatsApp send failed", error);
    }
  });
