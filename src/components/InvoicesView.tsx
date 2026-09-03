"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  DollarSign,
  User,
  Trash2,
  ExternalLink,
  MessageCircle
} from "lucide-react";
import { createInvoice, sendInvoiceWhatsApp } from "@/app/actions/invoiceActions";

export default function InvoicesView({ initialInvoices, leads }: { initialInvoices: any[]; leads: any[] }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [showModal, setShowModal] = useState(false);
  const [contactId, setContactId] = useState(leads[0]?.id || "");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([
    { description: "Enterprise CRM Software License (1 Year)", quantity: 1, unit_price: 350000 }
  ]);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
  const gstAmount = subtotal * 0.18;
  const grandTotal = subtotal + gstAmount;

  const handleAddItem = () => {
    setItems([...items, { description: "Implementation & Training", quantity: 1, unit_price: 50000 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId || items.length === 0 || !dueDate) return;

    const res = await createInvoice({
      contact_id: contactId,
      items,
      due_date: dueDate
    });

    if (res.success && res.invoice) {
      setInvoices([res.invoice, ...invoices]);
      setShowModal(false);
    }
  };

  const handleSendWhatsApp = async (invId: string) => {
    setSendingId(invId);
    const res = await sendInvoiceWhatsApp(invId);
    setSendingId(null);
    if (res.success) {
      setNotice("WhatsApp Invoice & Payment Link sent successfully!");
      setTimeout(() => setNotice(null), 3500);
    }
  };

  const totalInvoiced = invoices.reduce((acc, inv) => acc + (inv.total_amount || 0), 0);
  const totalPaid = invoices.filter((i) => i.status === "PAID").reduce((acc, inv) => acc + (inv.total_amount || 0), 0);
  const totalGstCollected = invoices.reduce((acc, inv) => acc + (inv.gst_amount || 0), 0);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GST Invoicing & Billing</h1>
          <p className="text-sm text-gray-500 mt-1">Generate GST-compliant invoices with automatic Razorpay payment links.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl font-medium">
          {notice}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase">Total Invoiced Amount</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{totalInvoiced.toLocaleString("en-IN")}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase">GST Collected (18%)</p>
          <h3 className="text-2xl font-bold text-indigo-600 mt-1">₹{totalGstCollected.toLocaleString("en-IN")}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase">Payments Collected</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">₹{totalPaid.toLocaleString("en-IN")}</h3>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th className="p-4">Invoice #</th>
              <th className="p-4">Contact / Client</th>
              <th className="p-4">Subtotal</th>
              <th className="p-4">GST (18%)</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="p-4 font-mono font-bold text-indigo-600">{inv.invoice_number}</td>
                <td className="p-4 font-medium text-gray-900">
                  <Link href={`/leads/${inv.contact.id}`} className="hover:underline">
                    {inv.contact?.name}
                  </Link>
                  <span className="block text-xs text-gray-400 font-normal">{inv.contact?.company_name || "N/A"}</span>
                </td>
                <td className="p-4 text-gray-600">₹{inv.subtotal?.toLocaleString("en-IN")}</td>
                <td className="p-4 text-gray-600">₹{inv.gst_amount?.toLocaleString("en-IN")}</td>
                <td className="p-4 font-bold text-gray-900">₹{inv.total_amount?.toLocaleString("en-IN")}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    inv.status === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleSendWhatsApp(inv.id)}
                    disabled={sendingId === inv.id}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Send Invoice
                  </button>

                  {inv.payment_link && (
                    <a
                      href={inv.payment_link}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md"
                      title="Payment Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Create GST Invoice</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Select Client</label>
                  <select
                    value={contactId}
                    onChange={(e) => setContactId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.company_name || "N/A"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-700">Line Items</span>
                  <button type="button" onClick={handleAddItem} className="text-xs text-indigo-600 font-bold hover:underline">+ Add Item</button>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].description = e.target.value;
                        setItems(newItems);
                      }}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].quantity = parseInt(e.target.value) || 1;
                        setItems(newItems);
                      }}
                      className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={item.unit_price}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].unit_price = parseFloat(e.target.value) || 0;
                        setItems(newItems);
                      }}
                      className="w-28 px-2 py-1.5 border border-gray-300 rounded-lg text-xs"
                    />
                    {items.length > 1 && (
                      <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Calculation Breakdown */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%):</span>
                  <span>₹{gstAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-sm border-t pt-1">
                  <span>Total Amount:</span>
                  <span className="text-emerald-600">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                >
                  Generate & Save Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
