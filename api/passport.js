// const jwt = require("jsonwebtoken");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("./models/User");
// const createWalletForUser = require("./utils/createWalletUtils");

// // Serialize the user
// passport.serializeUser((user, done) => {
//   done(null, user._id); // Mongo uses _id
// });

// // Deserialize the user
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     if (user) {
//       done(null, user);
//     } else {
//       done(new Error("User not found"), null);
//     }
//   } catch (err) {
//     done(err, null);
//   }
// });

// // Google OAuth Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Look for user by email
//         let user = await User.findOne({ email: profile.emails[0].value });

//         if (user) {
//           // If user doesn't have google_id, update it
//           if (!user.google_id) {
//             user.google_id = profile.id;
//             await user.save();
//           }
//         } else {
//           // Create new user
//           user = new User({
//             google_id: profile.id,
//             firstname: profile.name.givenName,
//             lastname: profile.name.familyName,
//             email: profile.emails[0].value,
//             photourl: profile.photos[0].value,
//           });
//           await user.save();
//         }

//         // Create wallet if doesn't exist
//         await createWalletForUser(user._id);

//         // Generate JWT token for the user
//         const token = jwt.sign(
//           {
//             id: user._id,
//             email: user.email,
//             lat: user.lat,
//             lon: user.lon,
//             role_id: user.role_id,
//           },
//           process.env.ACCESS_TOKEN_SECRET,
//           { expiresIn: "1h" }
//         );

//         // Attach token to user object
//         user = user.toObject(); // convert mongoose doc to plain object
//         user.token = token;

//         done(null, user);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");
const createWalletForUser = require("./utils/createWalletUtils");

// Function to generate a unique referral code
const generateReferralCode = (name = "User") => {
  const base = name.split(" ")[0] || name;
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random
  return `${base}${randomNum}`;
};

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Update google_id if missing
          if (!user.google_id) {
            user.google_id = profile.id;
            await user.save();
          }
        } else {
          // Generate referral code
          const referralCode = generateReferralCode(profile.name.givenName);

          // Create new user with referral code
          user = new User({
            google_id: profile.id,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            photourl: profile.photos[0].value,
            referral_code: referralCode,
          });

          await user.save();
        }

        // Create wallet if needed
        await createWalletForUser(user._id);

        // Generate JWT
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            lat: user.lat,
            lon: user.lon,
            role_id: user.role_id,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        user = user.toObject(); // plain object
        user.token = token;

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
