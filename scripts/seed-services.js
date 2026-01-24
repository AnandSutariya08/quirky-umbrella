import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Read JSON manually
const servicesPath = path.join(__dirname, "seed-services.json");
const services = JSON.parse(fs.readFileSync(servicesPath, "utf-8"));

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA8kSPE63aYs2QmzLR_k05hrV4-9SMXdGU",
  authDomain: "demoproject-c9fbc.firebaseapp.com",
  projectId: "demoproject-c9fbc",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedServices() {
  for (const service of services) {
    await setDoc(doc(db, "services", service.slug), {
      ...service,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(`✅ Seeded: ${service.slug}`);
  }

  console.log("🎉 All services seeded successfully");
}

seedServices().catch(console.error);
