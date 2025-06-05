// config/passport.js
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/user"); // Adjust path if your User model is elsewhere

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"], // Request email scope
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          // Find primary verified email
          const primaryEmail =
            profile.emails &&
            profile.emails.find((email) => email.primary && email.verified)
              ?.value;

          // If no primary verified email from profile, attempt to use GitHub API (less common with scope: 'user:email')
          let finalEmail = primaryEmail;
          if (!finalEmail) {
            const emailResponse = await fetch(
              "https://api.github.com/user/emails",
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
            const emailData = await emailResponse.json();
            finalEmail =
              emailData.find((email) => email.primary && email.verified)
                ?.email || `${profile.username}@github.com`; // Fallback if no primary email found
          }

          // Check if a user with this email already exists (e.g., registered via traditional method)
          let existingUserByEmail = await User.findOne({ email: finalEmail });

          if (existingUserByEmail) {
            // Link existing user to GitHub profile if it doesn't have githubId
            if (!existingUserByEmail.githubId) {
              existingUserByEmail.githubId = profile.id;
              await existingUserByEmail.save();
              user = existingUserByEmail;
            } else {
              // This case indicates a conflict, email already exists and is linked to another GitHub account
              // Or the current GitHub profile's email is linked to an existing non-GitHub account.
              // For simplicity, we'll return the existing user. You might want a more robust merge strategy or error.
              user = existingUserByEmail;
            }
          } else {
            // Create new user if not found by githubId or email
            user = await User.create({
              githubId: profile.id,
              username: profile.username,
              name: profile.displayName || profile.username,
              email: finalEmail,
              password: "", // No password for OAuth users
              userType: "github", // Or "applicant" if you want to default GitHub users to applicants
            });
          }
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Optional: Serialize and deserialize user (needed for session-based auth, less for pure JWT)
// However, good practice to include if Passport might manage sessions or if middleware relies on req.user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
