


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
const blogsPath = path.join(__dirname, "seed-blogs.json");
const blogs = JSON.parse(fs.readFileSync(blogsPath, "utf-8"));

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA8kSPE63aYs2QmzLR_k05hrV4-9SMXdGU",
  authDomain: "demoproject-c9fbc.firebaseapp.com",
  projectId: "demoproject-c9fbc",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedBlogs() {
  for (const blog of blogs) {
    await setDoc(doc(db, "blogs", blog.slug), {
      ...blog,
      publishedDate: Timestamp.fromDate(new Date(blog.publishedDate)),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(`✅ Seeded: ${blog.slug}`);
  }

  console.log("🎉 All blogs seeded successfully");
}

seedBlogs().catch(console.error);
