"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendWhatsAppMessage } from "./whatsappActions";

export async function getInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        contact: true,
        items: true
      },
      orderBy: { createdAt: "desc" }
    });
    return invoices;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}

export async function createInvoice(data: {
  contact_id: string;
  items: { description: string; quantity: number; unit_price: number }[];
  due_date: string;
}) {
  try {
    const company = await prisma.company.findFirst();

    const subtotal = data.items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
    const gstRate = 18.0;
    const gstAmount = subtotal * 0.18;
    const totalAmount = subtotal + gstAmount;

    const invoiceNumber = `INV-2026-${Math.floor(Math.random() * 9000 + 1000)}`;
    const paymentLink = `https://rzp.io/l/pay_${Math.random().toString(36).substring(7)}`;

    const invoice = await prisma.invoice.create({
      data: {
        company_id: company?.id || null,
        contact_id: data.contact_id,
        invoice_number: invoiceNumber,
        subtotal,
        gst_rate: gstRate,
        gst_amount: gstAmount,
        total_amount: totalAmount,
        status: "UNPAID",
        due_date: new Date(data.due_date),
        payment_link: paymentLink,
        items: {
          create: data.items.map((i) => ({
            description: i.description,
            quantity: i.quantity,
            unit_price: i.unit_price,
            total: i.quantity * i.unit_price
          }))
        }
      },
      include: { contact: true }
    });

    // Create activity record for contact
    await prisma.activity.create({
      data: {
        contact_id: data.contact_id,
        type: "INVOICE",
        content: `GST Invoice ${invoiceNumber} created for ₹${totalAmount.toLocaleString("en-IN")}`
      }
    });

    revalidatePath("/invoices");
    revalidatePath(`/leads/${data.contact_id}`);
    return { success: true, invoice };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return { success: false, error: "Failed to create invoice" };
  }
}

export async function sendInvoiceWhatsApp(invoiceId: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { contact: true }
    });

    if (!invoice || !invoice.contact) return { success: false, error: "Invoice or contact not found" };

    const text = `Hello ${invoice.contact.name}! Invoice ${invoice.invoice_number} for ₹${invoice.total_amount.toLocaleString("en-IN")} (incl. 18% GST) has been generated for ${invoice.contact.company_name || "your account"}.\n\nPay online here: ${invoice.payment_link}`;

    await sendWhatsAppMessage(invoice.contact_id, text);
    return { success: true };
  } catch (error) {
    console.error("Error sending invoice WhatsApp:", error);
    return { success: false, error: "Failed to send invoice" };
  }
}
