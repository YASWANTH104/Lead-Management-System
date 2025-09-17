require("dotenv").config();
const {faker} = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
const connectDB = require("./database/db");
const User = require("./models/User");
const Lead = require("./models/Lead");

async function seedDatabase() {
  await connectDB(process.env.MONGO_URI);
  await User.deleteMany({});
  await Lead.deleteMany({});

  const passwordHash = await bcrypt.hash("test@1234", 10);
  await User.create({
    name: "Test User",
    email: "test@erino.io",
    password: passwordHash,
  });

  const sources = [
    "website",
    "facebook_ads",
    "google_ads",
    "referral",
    "events",
    "other",
  ];
  const statuses = ["new", "contacted", "qualified", "lost", "won"];

  const leads = Array.from({ length: 120 }).map(() => ({
    first_name: faker.person.firstName(), // ✅ changed
    last_name: faker.person.lastName(), // ✅ changed
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number(), // ✅ changed
    company: faker.company.name(), // ✅ changed
    city: faker.location.city(), // ✅ changed
    state: faker.location.state(), // ✅ changed
    source: faker.helpers.arrayElement(sources), // ✅ changed
    status: faker.helpers.arrayElement(statuses), // ✅ changed
    score: faker.number.int({ min: 0, max: 100 }), // ✅ changed
    lead_value: faker.number.int({ min: 100, max: 10000 }), // ✅ changed
    last_activity_at: faker.date.recent({ days: 90 }), // ✅ changed
    is_qualified: faker.datatype.boolean(),
  }));

  await Lead.insertMany(leads);
  console.log("Seed complete. Test user: test@erino.io / Test@1234");
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error(err);
  process.exit(1);
});
