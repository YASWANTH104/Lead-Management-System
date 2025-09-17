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
    first_name: faker.person.firstName(), 
    last_name: faker.person.lastName(), 
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number(),  
    company: faker.company.name(),  
    city: faker.location.city(),  
    state: faker.location.state(),  
    source: faker.helpers.arrayElement(sources),
    status: faker.helpers.arrayElement(statuses),
    score: faker.number.int({ min: 0, max: 100 }), 
    lead_value: faker.number.int({ min: 100, max: 10000 }), 
    last_activity_at: faker.date.recent({ days: 90 }),  
    is_qualified: faker.datatype.boolean(),
  }));

  await Lead.insertMany(leads);
  console.log("Seed complete. Test user: test@erino.io / test@1234");
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error(err);
  process.exit(1);
});
