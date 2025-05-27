const Job = require("../models/Job");

const editJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    // Check if the logged-in user is the job's employer
    if (!job || job.employer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send("Unauthorized: You can only edit your own job postings.");
    }

    // Allow editing
    job.title = req.body.title || job.title;
    job.description = req.body.description || job.description;
    await job.save();

    res.status(200).send("Job updated successfully!");
  } catch (error) {
    res.status(500).send("Error updating job: " + error.message);
  }
};
