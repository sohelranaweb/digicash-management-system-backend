import { Types } from "mongoose";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { Wallet } from "../modules/wallet/wallet.model";
import bcrypt from "bcrypt";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({
      email: envVars.ADMIN_EMAIL,
    });
    if (isAdminExist) {
      console.log("Admin Already Exists");
      return;
    }

    console.log("Trying to create admin...");

    const hashedPassword = await bcrypt.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Admin",
      role: Role.ADMIN,
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };

    // ✅ First, create admin user
    const adminUser = await User.create(payload);

    // ✅ Then, create wallet for the admin
    const wallet = await Wallet.create({
      owner: adminUser._id,
      balance: 100,
      isBlocked: false,
    });

    // ✅ Link the wallet with the admin user
    adminUser.wallet = wallet._id as Types.ObjectId;
    await adminUser.save();

    console.log("Admin created successfully with wallet! ✅\n");
    console.log(adminUser);
  } catch (error) {
    console.log("❌ Failed to seed admin:", error);
  }
};
