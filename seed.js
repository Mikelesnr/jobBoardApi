require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { connectDB } = require("./database/db"); // ✅ Use centralized DB connection
const User = require("./models/user");
const Employer = require("./models/employer");
const Applicant = require("./models/applicant");
const Job = require("./models/job");
const Application = require("./models/application");

const emails = [
  "test4@byu.edu",
  "test5@byu.edu",
  "test6@byu.edu",
  "test7@byu.edu",
  "test8@byu.edu",
  "test9@byu.edu",
  "test10@byu.edu",
  "test11@byu.edu",
  "test12@byu.edu",
];
const password = "test1234#";

const seedDatabase = async () => {
  try {
    await connectDB(); // ✅ Use the database connection function

    await mongoose.connection.db.dropDatabase(); // Clears DB before seeding

    /* =========================== */
    /* 🔹 SEED USERS */
    /* =========================== */
    const hashedPassword = await bcrypt.hash(password, 10);
    const usersData = [
      {
        name: "Admin1",
        email: emails[0],
        password: hashedPassword,
        userType: "admin",
      },
      {
        name: "Admin2",
        email: emails[1],
        password: hashedPassword,
        userType: "admin",
      },
      {
        name: "Admin3",
        email: emails[2],
        password: hashedPassword,
        userType: "admin",
      },
      {
        name: "Employer1",
        email: emails[3],
        password: hashedPassword,
        userType: "employer",
      },
      {
        name: "Employer2",
        email: emails[4],
        password: hashedPassword,
        userType: "employer",
      },
      {
        name: "Employer3",
        email: emails[5],
        password: hashedPassword,
        userType: "employer",
      },
      {
        name: "Applicant1",
        email: emails[6],
        password: hashedPassword,
        userType: "applicant",
      },
      {
        name: "Applicant2",
        email: emails[7],
        password: hashedPassword,
        userType: "applicant",
      },
      {
        name: "Applicant3",
        email: emails[8],
        password: hashedPassword,
        userType: "applicant",
      },
    ];
    const users = await User.insertMany(usersData);

    /* =========================== */
    /* 🔹 SEED EMPLOYERS & APPLICANTS */
    /* =========================== */
    const employerNames = ["Wayne Tech", "Stark Enterprises", "Luthor Corp"];
    const employersData = users.slice(3, 6).map((user, index) => ({
      userId: user._id,
      companyName: employerNames[index], // 🏢 Set specific company names
      jobListings: [],
    }));

    const applicantsData = users.slice(6).map((user) => ({
      userId: user._id,
      resumeUrl: "https://example.com/resume.pdf",
      skills: ["Skill A", "Skill B"],
      experience: ["Experience X"],
      education: ["Degree Y"],
    }));

    const employers = await Employer.insertMany(employersData);
    const applicants = await Applicant.insertMany(applicantsData);

    /* =========================== */
    /* 🔹 SEED JOBS */
    /* =========================== */
    const jobsData = [];
    for (let i = 0; i < 20; i++) {
      jobsData.push({
        title: `Job ${i + 1}`,
        description: `Description for Job ${i + 1}`,
        salary: Math.floor(Math.random() * 5000) + 3000,
        location: "Remote",
        employer: employers[i % employers.length]._id,
      });
    }
    const jobs = await Job.insertMany(jobsData);

    /* =========================== */
    /* 🔹 SEED APPLICATIONS */
    /* =========================== */
    const applicationsData = [];
    for (let i = 0; i < 10; i++) {
      applicationsData.push({
        applicantId: applicants[i % applicants.length]._id,
        jobId: jobs[i]._id,
        status: "Pending",
      });
    }
    await Application.insertMany(applicationsData);

    console.log("✅ Database seeding completed successfully!");
    mongoose.connection.close(); // 🚀 Close connection after seeding
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
