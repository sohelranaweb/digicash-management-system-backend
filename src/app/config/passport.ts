import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, IUser, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { Wallet } from "../modules/wallet/wallet.model";
import { Types } from "mongoose";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          return done(null, false, { message: "User does not exist" });
        }
        if (!isUserExist.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
          return done("User is not verified");
        }
        if (
          isUserExist.isActive === IsActive.BLOCKED ||
          isUserExist.isActive === IsActive.INACTIVE
        ) {
          // throw new AppError(
          //   httpStatus.BAD_REQUEST,
          //   `User is ${isUserExist.isActive}`
          // );
          return done(`User is ${isUserExist.isActive}`);
        }
        if (isUserExist.isDeleted) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
          return done("User is deleted");
        }

        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider === "google"
        );
        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.",
          });
        }

        const isPasswordMatch = await bcrypt.compare(
          password as string,
          isUserExist.password as string
        );
        if (!isPasswordMatch) {
          return done(null, false, { message: "Password does not match" });
        }
        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: envVars.GOOGLE_CLIENT_ID,
//       clientSecret: envVars.GOOGLE_CLIENT_SECRET,
//       callbackURL: envVars.GOOGLE_CALLBACK_URL,
//     },
//     async (
//       accessToken: string,
//       refreshToken: string,
//       profile: Profile,
//       done: VerifyCallback
//     ) => {
//       try {
//         const email = profile.emails?.[0].value;
//         if (!email) {
//           return done(null, false, { message: "No email found" });
//         }
//         let isUserExist = await User.findOne({ email });
//         if (isUserExist && !isUserExist.isVerified) {
//           // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
//           // done("User is not verified")
//           return done(null, false, { message: "User is not verified" });
//         }

//         if (
//           isUserExist &&
//           (isUserExist.isActive === IsActive.BLOCKED ||
//             isUserExist.isActive === IsActive.INACTIVE)
//         ) {
//           // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
//           done(`User is ${isUserExist.isActive}`);
//         }

//         if (isUserExist && isUserExist.isDeleted) {
//           return done(null, false, { message: "User is deleted" });
//           // done("User is deleted")
//         }

//         // 👉 If user doesn't exist, create one along with wallet
//         if (!isUserExist) {
//           // Create wallet first
//           const wallet = await Wallet.create({
//             balance: 0,
//             transactions: [],
//           });
//         }
//         if (!isUserExist) {
//           isUserExist = await User.create({
//             email,
//             name: profile.displayName,
//             picture: profile.photos?.[0].value,
//             role: Role.USER,
//             isVerified: true,
//             wallet: wallet._id, // 🪙 assign wallet id
//             auths: [
//               {
//                 provider: "google",
//                 providerId: profile.id,
//               },
//             ],
//           });
//         }

//         return done(null, isUserExist);
//       } catch (error) {
//         console.log("Google Strategy Error", error);
//         return done(error);
//       }
//     }
//   )
// );

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No email found" });
        }

        let isUserExist = await User.findOne({ email });

        // Check user validation
        if (isUserExist && !isUserExist.isVerified) {
          return done(null, false, { message: "User is not verified" });
        }

        if (
          isUserExist &&
          (isUserExist.isActive === IsActive.BLOCKED ||
            isUserExist.isActive === IsActive.INACTIVE)
        ) {
          return done(null, false, {
            message: `User is ${isUserExist.isActive}`,
          });
        }

        if (isUserExist && isUserExist.isDeleted) {
          return done(null, false, { message: "User is deleted" });
        }

        // If user doesn't exist, create one and assign wallet
        if (!isUserExist) {
          // Step 1: Create user (without wallet initially)
          const createdUser = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });

          // Step 2: Create wallet with owner = user._id
          const wallet = await Wallet.create({
            owner: createdUser._id, // ✅ Required field
            balance: 50,
            transactions: [],
          });

          // Step 3: Update user with wallet reference
          createdUser.wallet = wallet._id as Types.ObjectId;
          await createdUser.save();

          isUserExist = createdUser;
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log("Google Strategy Error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done: (err: any, id?: unknown) => void) => {
  done(null, (user as IUser)._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
