"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
const wallet_model_1 = require("../modules/wallet/wallet.model");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield user_model_1.User.findOne({ email });
        if (!isUserExist) {
            return done(null, false, { message: "User does not exist" });
        }
        if (!isUserExist.isVerified) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
            return done("User is not verified");
        }
        if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
            isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
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
        const isGoogleAuthenticated = isUserExist.auths.some((providerObjects) => providerObjects.provider === "google");
        if (isGoogleAuthenticated && !isUserExist.password) {
            return done(null, false, {
                message: "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.",
            });
        }
        const isPasswordMatch = yield bcrypt_1.default.compare(password, isUserExist.password);
        if (!isPasswordMatch) {
            return done(null, false, { message: "Password does not match" });
        }
        return done(null, isUserExist);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
})));
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
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { message: "No email found" });
        }
        let isUserExist = yield user_model_1.User.findOne({ email });
        // Check user validation
        if (isUserExist && !isUserExist.isVerified) {
            return done(null, false, { message: "User is not verified" });
        }
        if (isUserExist &&
            (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
                isUserExist.isActive === user_interface_1.IsActive.INACTIVE)) {
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
            const createdUser = yield user_model_1.User.create({
                email,
                name: profile.displayName,
                picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                role: user_interface_1.Role.USER,
                isVerified: true,
                auths: [
                    {
                        provider: "google",
                        providerId: profile.id,
                    },
                ],
            });
            // Step 2: Create wallet with owner = user._id
            const wallet = yield wallet_model_1.Wallet.create({
                owner: createdUser._id, // ✅ Required field
                balance: 50,
                transactions: [],
            });
            // Step 3: Update user with wallet reference
            createdUser.wallet = wallet._id;
            yield createdUser.save();
            isUserExist = createdUser;
        }
        return done(null, isUserExist);
    }
    catch (error) {
        console.log("Google Strategy Error", error);
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
