"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CSVLeadInput {
  name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  source?: string;
  status?: string;
  tags?: string;
}

export async function bulkImportLeads(leadsData: CSVLeadInput[]) {
  try {
    const company = await prisma.company.findFirst();
    let createdCount = 0;
    let duplicateCount = 0;

    for (const lead of leadsData) {
      if (!lead.name) continue;

      // Duplicate Check by Phone or Email
      if (lead.phone || lead.email) {
        const existing = await prisma.lead.findFirst({
          where: {
            OR: [
              lead.phone ? { phone: lead.phone } : {},
              lead.email ? { email: lead.email } : {}
            ]
          }
        });

        if (existing) {
          duplicateCount++;
          continue; // Skip duplicate creation
        }
      }

      await prisma.lead.create({
        data: {
          name: lead.name,
          email: lead.email || null,
          phone: lead.phone || null,
          company_name: lead.company_name || null,
          source: lead.source || "BULK_IMPORT",
          status: lead.status || "NEW",
          tags: lead.tags || null,
          company_id: company?.id || null
        }
      });
      createdCount++;
    }

    revalidatePath("/leads");
    return { success: true, createdCount, duplicateCount };
  } catch (error) {
    console.error("Error bulk importing leads:", error);
    return { success: false, error: "Failed to import leads" };
  }
}
