require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user"); // Assuming 'user.js' defines your User model
const Job = require("../models/job");
const Application = require("../models/application");

// Connect to MongoDB
// Note: useNewUrlParser and useUnifiedTopology are deprecated in recent Mongoose versions and can be removed.
mongoose.connect(process.env.DB_URI || "mongodb://127.0.0.1:27017/jobPortal", {
  // useNewUrlParser: true, // Can remove this line
  // useUnifiedTopology: true, // Can remove this line
});

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "hashedpassword",
    userType: "admin",
    // Add companyName for all users to satisfy the schema's 'required' constraint
    companyName: "Global Admin Co.", // Example: A default company name for the admin
  },
  {
    name: "Employer Inc.",
    email: "employer@example.com",
    password: "hashedpassword",
    userType: "employer",
    companyName: "Employer Inc.", // This user IS a company, so use their name
  },
  {
    name: "John Doe",
    email: "applicant@example.com",
    password: "hashedpassword",
    userType: "applicant",
    companyName: "N/A", // Example: For an applicant, it might be 'N/A' or their personal company
  },
];

// Multiple job listings
const jobTemplates = [
  {
    title: "Software Engineer",
    description: "Develop web applications.",
    salary: 80000,
    location: "New York",
    companyImage: "/images/default-company.png",
  },
  {
    title: "Data Analyst",
    description: "Analyze business data.",
    salary: 60000,
    location: "San Francisco",
    companyImage: "/images/default-company.png",
  },
  {
    title: "Project Manager",
    description: "Oversee projects.",
    salary: 90000,
    location: "Chicago",
    companyImage: "/images/default-company.png",
  },
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    // Create users
    const createdUsers = await User.insertMany(users);
    const employerId = createdUsers.find(
      (user) => user.userType === "employer"
    )._id; // Get first employer ID

    // Create jobs assigned to the first employer
    const jobs = jobTemplates.map((job) => ({ ...job, employer: employerId }));
    const createdJobs = await Job.insertMany(jobs);

    // Create applications for available jobs
    const applicantId = createdUsers.find(
      (user) => user.userType === "applicant"
    )._id;
    const applications = createdJobs.map((job) => ({
      applicant: applicantId,
      job: job._id,
      resumeUrl: "https://example.com/resume.pdf",
      status: "Pending",
    }));

    await Application.insertMany(applications);

    console.log("✅ Database seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
