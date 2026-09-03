"use client";

import { useState, useEffect } from "react";
import { QrCode, CheckCircle2, RefreshCw, Smartphone } from "lucide-react";
import Link from "next/link";
import io from 'socket.io-client';

export default function WhatsAppQRPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<"LOADING" | "WAITING_FOR_SCAN" | "CONNECTED" | "DISCONNECTED">("LOADING");

  useEffect(() => {
    // Connect to the backend WhatsApp service running on port 3005
    const socket = io('http://localhost:3005');

    socket.on('connect', () => {
      console.log('Connected to WhatsApp Backend Socket');
    });

    socket.on('status_update', (newStatus) => {
      setStatus(newStatus);
    });

    socket.on('qr_update', (qrUrl) => {
      setQrCode(qrUrl);
      setStatus("WAITING_FOR_SCAN");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Smartphone className="w-6 h-6 mr-2 text-indigo-600" />
          WhatsApp QR Connection
        </h1>
        <p className="text-gray-500 mt-1">Connect your WhatsApp securely to the AI CRM.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center max-w-lg mx-auto mt-10">
        
        {status === "LOADING" && (
          <div className="py-12 flex flex-col items-center text-center">
            <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Connecting to WhatsApp...</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Please wait while we initialize the secure connection. This may take up to a minute when starting the server.
            </p>
          </div>
        )}

        {status === "WAITING_FOR_SCAN" && (
          <div className="flex flex-col items-center text-center">
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200 mb-6">
              {qrCode ? (
                <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64 bg-white p-2 rounded-lg shadow-sm" />
              ) : (
                <div className="w-64 h-64 bg-white border border-gray-300 flex items-center justify-center rounded">
                  <QrCode className="w-32 h-32 text-gray-300" />
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">Scan to Link Device</h3>
            <ol className="text-sm text-gray-600 space-y-3 text-left w-full pl-4 list-decimal max-w-xs mx-auto">
              <li>Open <strong>WhatsApp</strong> on your phone</li>
              <li>Tap <strong>Menu</strong> (Android) or <strong>Settings</strong> (iPhone)</li>
              <li>Select <strong>Linked Devices</strong> &rarr; <strong>Link a Device</strong></li>
              <li>Point your phone to this screen to capture the code</li>
            </ol>
          </div>
        )}

        {status === "CONNECTED" && (
          <div className="py-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Successfully Connected!</h3>
            <p className="text-gray-600 text-center mb-6 max-w-xs text-sm">
              Your WhatsApp number is now fully integrated. The AI will handle incoming messages automatically.
            </p>
            <Link href="/messages">
              <button className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
                Go to Inbox
              </button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
