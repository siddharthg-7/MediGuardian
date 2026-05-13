# MediGuardian Backend & Automation Setup

This document outlines the remaining setup required to fully implement the MediGuardian automation workflows and backend services as per the PRD.

## 1. Firebase Backend Setup

### Firestore Rules & Indexes
Ensure your Firestore database has the correct rules applied. A starting `firestore.rules` is included in the project, but you must ensure it is deployed:
```bash
firebase deploy --only firestore:rules
```

### Authentication
Enable **Email/Password** and **Google Sign-In** in your Firebase Console under Authentication > Sign-in method.

## 2. n8n Automation Engine Setup

n8n is required for the Escalation Workflow (Push Notifications -> Email -> Voice -> Caretaker Alerts).

### Installation & Hosting
You can self-host n8n using Docker or use n8n Cloud.
*   [n8n Cloud](https://n8n.cloud/)
*   [n8n Self-Hosted Documentation](https://docs.n8n.io/hosting/)

### Workflow 1: Reminder Scheduler & Escalation
This workflow triggers continuously, checks for upcoming medicines, and handles the escalation process.

**Trigger:** Schedule Trigger (Every 1 minute)
**Nodes:**
1.  **Schedule Trigger:** Runs every minute.
2.  **Firebase Cloud Firestore (Fetch Prescriptions):** Fetch active prescriptions.
3.  **Code Node (Time Check):** Filter prescriptions where current time matches reminder time.
4.  **HTTP Request Node (Push Notification):** Send push notification to the patient device via Firebase Cloud Messaging.
5.  **Wait Node (10 Minutes):** Pause execution for 10 minutes.
6.  **Firebase Cloud Firestore (Check Status):** Query `medicine_logs` to check if the medicine was taken in the last 10 minutes.
7.  **IF Node:** 
    *   **True (Taken):** Stop.
    *   **False (Not Taken):** Proceed to Email Reminder.
8.  **HTTP Request Node (EmailJS or SMTP):** Send Email reminder.
9.  **Wait Node (5 Minutes):** Pause for 5 minutes.
10. **Firebase Cloud Firestore (Check Status):** Check if taken.
11. **IF Node:** 
    *   **True (Taken):** Stop.
    *   **False (Not Taken):** Proceed to Voice Reminder/Caretaker Alert.
12. **Firebase Cloud Firestore (Caretaker Alert):** Update caretaker dashboard by writing an alert document to Firestore.

### Workflow 2: Caretaker Alert
Triggered when a patient misses multiple doses consecutively or misses a "High" criticality medicine.

**Trigger:** Firestore Trigger (Listens for `status: skipped` or missing logs)
**Nodes:**
1.  **Firebase trigger:** On new missed log.
2.  **Firebase Cloud Firestore (Fetch Caretaker):** Get the `caretakerId` linked to the `patientId`.
3.  **HTTP Request Node / Email Node:** Send immediate high-priority alert to caretaker email/phone.

## 3. EmailJS Integration
To support email reminders if you prefer not using an SMTP server directly via n8n:
1.  Create an account at [EmailJS](https://www.emailjs.com/).
2.  Add a new Email Service (e.g., Gmail).
3.  Create an Email Template for "Missed Medicine Reminder".
4.  Use the EmailJS REST API within n8n's HTTP Request Node to trigger the emails.

## 4. Voice Reminders (Browser Synthesis)
Voice reminders using the `SpeechSynthesis API` are already integrated into the frontend `ReminderEngine` component. However, for a true server-side triggered voice call (like a phone call), you would need to integrate **Twilio** into your n8n workflow.

*If you want automated phone calls:*
Add a **Twilio Node** in n8n at the end of the escalation workflow to initiate an automated phone call using TwiML.

## 5. Web Push Notifications (FCM)
Currently, the app uses standard browser notifications. For true Push Notifications (receiving them when the browser is closed):
1.  Set up Firebase Cloud Messaging.
2.  Generate a VAPID key in Firebase Console (Cloud Messaging -> Web configuration).
3.  Add a service worker (`firebase-messaging-sw.js`) to your React app.
4.  Request device tokens and save them to the `users` collection in Firestore.
5.  Configure n8n to send HTTP requests to the FCM API using these tokens.

## Next Steps for Developer
- [ ] Connect Firebase project in `src/lib/firebase.ts`.
- [ ] Deploy Firebase functions/rules.
- [ ] Deploy n8n instance and create the workflows described above.
- [ ] Test the full escalation chain with a dummy prescription.
