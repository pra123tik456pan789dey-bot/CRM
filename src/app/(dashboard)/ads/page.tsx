"use client";

import { BarChart3, TrendingUp, DollarSign, Users, ArrowUpRight, Filter } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const ADS_DATA = [
  { date: '10 Jul', spend: 4500, leads: 12 },
  { date: '11 Jul', spend: 5200, leads: 18 },
  { date: '12 Jul', spend: 4800, leads: 15 },
  { date: '13 Jul', spend: 6100, leads: 22 },
  { date: '14 Jul', spend: 5900, leads: 20 },
  { date: '15 Jul', spend: 7200, leads: 28 },
  { date: '16 Jul', spend: 6800, leads: 25 },
];

export default function AdsManagerPage() {
  return (
    <div className="font-sans text-gray-800 pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
            Facebook Ads Manager
          </h1>
          <p className="text-gray-500 mt-1">Live ROAS and Marketing Metrics</p>
        </div>
        <button className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <Filter className="w-4 h-4" />
          <span>Last 7 Days</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Spend</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₹40,500</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-red-500 flex items-center font-medium mr-2">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +12.5%
            </span>
            <span className="text-gray-400">vs last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₹1,25,000</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-500 flex items-center font-medium mr-2">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +24.8%
            </span>
            <span className="text-gray-400">vs last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">ROAS (Return on Ad Spend)</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">3.08x</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-500 flex items-center font-medium mr-2">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +0.4x
            </span>
            <span className="text-gray-400">vs last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Cost Per Lead (CPL)</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₹289.20</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-500 flex items-center font-medium mr-2">
              <ArrowUpRight className="w-4 h-4 mr-1 rotate-180" /> -5.2%
            </span>
            <span className="text-gray-400">vs last week</span>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6">Spend vs Leads (Last 7 Days)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADS_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <RechartsTooltip />
                <Area yAxisId="left" type="monotone" dataKey="spend" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                <Area yAxisId="right" type="monotone" dataKey="leads" stroke="#10B981" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6">Active Campaigns ROI</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 rounded-l-lg">Campaign Name</th>
                  <th scope="col" className="px-4 py-3">Spend</th>
                  <th scope="col" className="px-4 py-3">Leads</th>
                  <th scope="col" className="px-4 py-3 text-right rounded-r-lg">ROAS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900">Summer Sale 2026 (WhatsApp)</td>
                  <td className="px-4 py-4">₹15,200</td>
                  <td className="px-4 py-4">64</td>
                  <td className="px-4 py-4 text-right text-green-600 font-bold">4.2x</td>
                </tr>
                <tr className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900">Retargeting Visitors</td>
                  <td className="px-4 py-4">₹8,400</td>
                  <td className="px-4 py-4">22</td>
                  <td className="px-4 py-4 text-right text-green-600 font-bold">2.8x</td>
                </tr>
                <tr className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900">Cold Audience Lookalike</td>
                  <td className="px-4 py-4">₹16,900</td>
                  <td className="px-4 py-4">54</td>
                  <td className="px-4 py-4 text-right text-yellow-600 font-bold">1.5x</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
