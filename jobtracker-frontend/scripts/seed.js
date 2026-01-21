// scripts/seed.js
const COUNT = 300; // change to 200, 500, 1000
const BASE_URL = "http://localhost:8080/applications";

const companies = [
  "Amazon", "Google", "Microsoft", "Meta", "Apple", "Netflix", "Shopify", "Stripe",
  "Uber", "Lyft", "Airbnb", "Tesla", "NVIDIA", "AMD", "IBM", "Oracle", "Intuit",
  "RBC", "BMO", "Scotiabank", "TD", "Deloitte", "KPMG", "PWC"
];

const roles = [
  "Software Engineer Intern",
  "Backend Developer Intern",
  "Frontend Developer Intern",
  "Full Stack Intern",
  "QA / Test Intern",
  "DevOps Intern",
  "Data Analyst Intern"
];

const statuses = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateISOWithinDays(daysBack = 120) {
  const now = new Date();
  const offsetDays = Math.floor(Math.random() * daysBack);
  now.setDate(now.getDate() - offsetDays);
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

async function postOne(i) {
  const body = {
    companyName: `${rand(companies)} ${i}`,     // unique-ish so duplicates don’t collapse visually
    roleTitle: rand(roles),
    status: rand(statuses),
    dateApplied: randomDateISOWithinDays(180),
    notes: Math.random() < 0.25 ? "Follow up next week" : ""
  };

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`POST failed: ${res.status} ${t}`);
  }
}

async function main() {
  console.log(`Seeding ${COUNT} applications...`);

  // simple batching so we don't overload the server
  const batchSize = 25;

  for (let start = 1; start <= COUNT; start += batchSize) {
    const batch = [];
    const end = Math.min(COUNT, start + batchSize - 1);

    for (let i = start; i <= end; i++) batch.push(postOne(i));

    await Promise.all(batch);
    console.log(`Created ${end}/${COUNT}`);
  }

  console.log("Done ✅");
}

main().catch((e) => {
  console.error("Seeding failed ❌", e);
  process.exit(1);
});
