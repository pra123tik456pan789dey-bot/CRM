import { PrismaClient } from "@prisma/client";
import ChatInterface from "./ChatInterface";

const prisma = new PrismaClient();

export default async function MessagesPage() {
  // Fetch all leads that have messages
  const leadsWithMessages = await prisma.lead.findMany({
    where: {
      messages: {
        some: {} // Only leads that have at least one message
      }
    },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' }
      }
    }
  });

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp Chats</h1>
        <p className="text-gray-500 mt-1">Manage all your WhatsApp conversations in one place.</p>
      </div>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex overflow-hidden">
        <ChatInterface initialLeads={leadsWithMessages} />
      </div>
    </div>
  );
}
