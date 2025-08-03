import { Date, Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}

export enum AgentApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
}

export interface IAuthProvider {
  provider: "google" | "credentials"; // "Google", "Credential"
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isActive?: IsActive;
  isDeleted?: boolean; 
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
  wallet?: Types.ObjectId;

  // **নতুন Agent Approval Status ফিল্ড**
  agentApprovalStatus?: AgentApprovalStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
