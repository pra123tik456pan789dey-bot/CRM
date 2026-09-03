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
