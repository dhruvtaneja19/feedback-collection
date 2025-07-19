import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({
          $or: [
            { providerId: profile.id, authProvider: "google" },
            { email: profile.emails[0].value },
          ],
        });

        if (user) {
          // Update user info if found
          user.name = profile.displayName;
          user.avatar = profile.photos[0]?.value || "";
          user.email = profile.emails[0].value;
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = new User({
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0]?.value || "",
          authProvider: "google",
          providerId: profile.id,
          username: await generateUniqueUsername(
            profile.emails[0].value.split("@")[0]
          ),
        });

        await user.save();
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({
          $or: [
            { providerId: profile.id, authProvider: "github" },
            { email: profile.emails?.[0]?.value },
          ],
        });

        if (user) {
          // Update user info if found
          user.name = profile.displayName || profile.username;
          user.avatar = profile.photos[0]?.value || "";
          if (profile.emails?.[0]?.value) {
            user.email = profile.emails[0].value;
          }
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = new User({
          email:
            profile.emails?.[0]?.value || `${profile.username}@github.local`,
          name: profile.displayName || profile.username,
          avatar: profile.photos[0]?.value || "",
          authProvider: "github",
          providerId: profile.id,
          username: await generateUniqueUsername(profile.username),
        });

        await user.save();
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Helper function to generate unique username
async function generateUniqueUsername(baseUsername) {
  let username = baseUsername.toLowerCase().replace(/[^a-z0-9_-]/g, "");

  // Ensure username meets minimum length
  if (username.length < 3) {
    username = `user_${username}`;
  }

  // Check if username exists
  let existingUser = await User.findOne({ username });
  let counter = 1;

  while (existingUser) {
    username = `${baseUsername}_${counter}`;
    existingUser = await User.findOne({ username });
    counter++;
  }

  return username;
}

export default passport;
