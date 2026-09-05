"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWelcomeEmailAction } from "@/app/actions/emailActions";

export async function registerCompanyAction(formData: FormData) {
  try {
    const companyName = formData.get("companyName") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!companyName || !name || !email || !password) {
      return { success: false, error: "All fields are required." };
    }

    // Check if user email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return { success: false, error: "A user with this email already exists." };
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create Company, Default Pipeline, and SuperAdmin User in transaction
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: companyName.trim(),
          subscription_plan: "ACTIVE",
          theme_color: "#4F46E5",
        },
      });

      // Default Pipeline
      const pipeline = await tx.pipeline.create({
        data: {
          company_id: company.id,
          name: "Standard Sales Pipeline",
        },
      });

      // Default Stages
      const defaultStages = [
        { name: "New Lead", order_index: 0, color: "bg-blue-100 text-blue-800" },
        { name: "Contacted", order_index: 1, color: "bg-yellow-100 text-yellow-800" },
        { name: "Proposal Sent", order_index: 2, color: "bg-purple-100 text-purple-800" },
        { name: "Negotiation", order_index: 3, color: "bg-orange-100 text-orange-800" },
        { name: "Won", order_index: 4, color: "bg-green-100 text-green-800" },
        { name: "Lost", order_index: 5, color: "bg-red-100 text-red-800" },
      ];

      for (const stage of defaultStages) {
        await tx.pipelineStage.create({
          data: {
            pipeline_id: pipeline.id,
            ...stage,
          },
        });
      }

      // Initial SuperAdmin User
      const user = await tx.user.create({
        data: {
          company_id: company.id,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password_hash,
          role: "SUPERADMIN",
        },
      });

      return { company, user };
    });

    // Send welcome email asynchronously
    sendWelcomeEmailAction(email, companyName, name).catch((err) =>
      console.error("Welcome email error:", err)
    );

    return {
      success: true,
      message: "Company account created successfully! You can now log in.",
      companyId: result.company.id,
    };
  } catch (error: any) {
    console.error("Error in registerCompanyAction:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during registration.",
    };
  }
}

export async function createEmployeeUserAction(data: {
  name: string;
  email: string;
  password: string;
  role: "MANAGER" | "SALESEXECUTIVE" | "SUPERADMIN";
  phone?: string;
}) {
  try {
    const { name, email, password, role, phone } = data;
    if (!name || !email || !password) {
      return { success: false, error: "Name, email, and password are required." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return { success: false, error: "A user with this email already exists." };
    }

    const company = await prisma.company.findFirst();
    if (!company) {
      return { success: false, error: "No company account found. Please register a company first." };
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        company_id: company.id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash,
        role: role || "SALESEXECUTIVE",
        phone: phone || undefined,
      },
    });

    return { success: true, message: `Account created for ${user.name} (${user.role})!`, user };
  } catch (error: any) {
    console.error("Error in createEmployeeUserAction:", error);
    return { success: false, error: error.message || "Failed to create user account." };
  }
}

export async function getStaffUsersAction() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });
    return { success: true, users };
  } catch (error: any) {

    console.error("Error fetching staff users:", error);
    return { success: false, users: [], error: error.message };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    if (!userId) return { success: false, error: "User ID required" };
    await prisma.user.delete({
      where: { id: userId },
    });
    return { success: true, message: "User deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message || "Failed to delete user." };
  }
}

// In-memory OTP storage map (for verification)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function sendOtpAction(identifier: string) {
  try {
    if (!identifier) return { success: false, error: "Email or phone number is required" };
    const cleaned = identifier.toLowerCase().trim();

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(cleaned, { code, expiresAt });

    return {
      success: true,
      message: `OTP sent successfully to ${identifier}`,
      otpCode: code // Exposed for instant test auto-fill in UI
    };
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return { success: false, error: error.message || "Failed to send OTP." };
  }
}

export async function verifyOtpAction(identifier: string, code: string) {
  try {
    if (!identifier || !code) return { success: false, error: "Identifier and OTP code required" };
    const cleaned = identifier.toLowerCase().trim();
    const record = otpStore.get(cleaned);

    if (!record) {
      return { success: false, error: "No OTP found. Please request a new OTP." };
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleaned);
      return { success: false, error: "OTP has expired. Please request a new one." };
    }

    if (record.code !== code.trim()) {
      return { success: false, error: "Incorrect OTP code. Please try again." };
    }

    otpStore.delete(cleaned);
    return { success: true, message: "OTP verified successfully!" };
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return { success: false, error: error.message || "OTP verification failed." };
  }
}

export async function registerEmployeeSelfAction(data: {
  name: string;
  email: string;
  phone: string;
  aadharNumber: string;
  password: string;
}) {
  try {
    const { name, email, phone, aadharNumber, password } = data;
    if (!name || !email || !password || !phone) {
      return { success: false, error: "Name, email, phone number, and password are required." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return { success: false, error: "An account with this email already exists." };
    }

    const company = await prisma.company.findFirst();
    if (!company) {
      return { success: false, error: "No active company workspace found." };
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        company_id: company.id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        aadhar_number: aadharNumber ? aadharNumber.trim() : undefined,
        password_hash,
        role: "SALESEXECUTIVE", // Default Employee role
      },
    });

    return {
      success: true,
      message: `Account created successfully for ${user.name}!`,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    };
  } catch (error: any) {
    console.error("Error in registerEmployeeSelfAction:", error);
    return { success: false, error: error.message || "Failed to create employee account." };
  }
}

export async function resetPasswordWithOtpAction(data: {
  identifier: string;
  newPassword: string;
}) {
  try {
    const { identifier, newPassword } = data;
    if (!identifier || !newPassword) {
      return { success: false, error: "Email/Phone and new password required." };
    }

    const cleaned = identifier.toLowerCase().trim();
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleaned },
          { phone: cleaned }
        ]
      }
    });

    if (!user) {
      return { success: false, error: "No account found matching this email or phone." };
    }

    const password_hash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash }
    });

    return { success: true, message: `Password updated successfully for ${user.email}!` };
  } catch (error: any) {
    console.error("Error resetting password:", error);
    return { success: false, error: error.message || "Failed to reset password." };
  }
}


