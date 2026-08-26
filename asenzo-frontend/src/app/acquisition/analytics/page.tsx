"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AcquisitionAnalyticsPage() {
  const [timeframe, setTimeframe] = useState("30d");

  // Mock Performance Classification
  const performanceAssets = [
    { title: "Watch this before hiring a setter", type: "Reel", views: "1.2M", class: "Viral", hook: "68%", retention: "42%", cta: "3.1%" },
    { title: "The asynchronous delegation framework", type: "Carousel", views: "45K", class: "Scaling", hook: "44%", retention: "28%", cta: "4.8%" },
    { title: "Why I stopped taking sales calls", type: "VSL", views: "12K", class: "Baseline", hook: "39%", retention: "45%", cta: "8.2%" },
    { title: "Morning routines are wasting your time", type: "Reel", views: "4K", class: "Drawing Board", hook: "18%", retention: "12%", cta: "0.4%" },
  ];

  // Mock Creator Analysis
  const creatorData = [
    {
      name: "Alex Morgan",
      niche: "B2B Growth",
      pillars: "Founder Psychology, Operations",
      followers: "42.5K",
      avgViews: "184K",
      engagement: "7.2%",
      bestFormat: "Contrarian",
      bestPillar: "Founder Psychology",
      landingPage: "high-converting",
      contentValue: "High",
      offerValue: "High",
      instagram: "instagram.com/alexmorgan"
    }
  ];

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto w-full pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border/50 pb-6 mb-8 gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Acquisition Analytics</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Classify performance, extract insights, and optimize the machine.</p>
        </div>
        <div className="flex bg-card border border-border rounded-[6px] overflow-hidden">
          {["7d", "30d", "90d", "All Time"].map(t => (
            <button 
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${timeframe === t ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-card border border-border rounded-[12px] p-6">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest block mb-2">Total Impressions</span>
            <div className="text-[28px] font-bold text-foreground">1.8M</div>
            <div className="text-[12px] font-bold text-success flex items-center mt-1"><span className="material-symbols-outlined text-[14px] leading-none">trending_up</span> +34%</div>
         </div>
         <div className="bg-card border border-border rounded-[12px] p-6">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest block mb-2">New Followers</span>
            <div className="text-[28px] font-bold text-foreground">14,203</div>
            <div className="text-[12px] font-bold text-success flex items-center mt-1"><span className="material-symbols-outlined text-[14px] leading-none">trending_up</span> +82%</div>
         </div>
         <div className="bg-card border border-border rounded-[12px] p-6">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest block mb-2">Opt-ins / Lead Magnets</span>
            <div className="text-[28px] font-bold text-foreground">842</div>
            <div className="text-[12px] font-bold text-success flex items-center mt-1"><span className="material-symbols-outlined text-[14px] leading-none">trending_up</span> +12%</div>
         </div>
         <div className="bg-card border border-border rounded-[12px] p-6 bg-tertiary/10 border-tertiary/30">
            <span className="text-[10px] uppercase font-bold text-tertiary tracking-widest block mb-2">Qualified Conversations</span>
            <div className="text-[28px] font-bold text-foreground">41</div>
            <div className="text-[12px] font-bold text-muted-foreground flex items-center mt-1">Goal: 50/mo</div>
         </div>
      </div>

      {/* Actionable Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         
         <div className="lg:col-span-2 bg-card border border-border rounded-[12px] flex flex-col">
            <div className="p-4 border-b border-border/50 bg-muted/10">
               <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 <span className="material-symbols-outlined text-[14px]">psychology</span> AI Performance Insights
               </h3>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center gap-6">
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                     <span className="material-symbols-outlined text-success">campaign</span>
                  </div>
                  <div>
                     <h4 className="text-[14px] font-bold text-foreground mb-1">Hook Rate is outperforming baseline</h4>
                     <p className="text-[13px] text-muted-foreground">Your recent shift to 'Contrarian' hooks increased 3-second view retention from 24% to 48%. Continue this pattern.</p>
                  </div>
               </div>
               
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                     <span className="material-symbols-outlined text-warning">timeline</span>
                  </div>
                  <div>
                     <h4 className="text-[14px] font-bold text-foreground mb-1">Mid-video retention drop-off detected</h4>
                     <p className="text-[13px] text-muted-foreground">Short-form videos over 60 seconds are losing 60% of audience during the solution phase. <span className="font-bold text-foreground">Recommendation:</span> Use faster pacing and b-roll during educational segments.</p>
                  </div>
               </div>
               
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center shrink-0">
                     <span className="material-symbols-outlined text-tertiary">conversion_path</span>
                  </div>
                  <div>
                     <h4 className="text-[14px] font-bold text-foreground mb-1">BOF assets driving outsized returns</h4>
                     <p className="text-[13px] text-muted-foreground">Your VSL generated only 1% of total traffic but 82% of qualified conversations. Consider routing more TOF traffic directly to the VSL.</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Funnel Health */}
         <div className="lg:col-span-1 bg-card border border-border rounded-[12px]">
            <div className="p-4 border-b border-border/50 bg-muted/10">
               <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 <span className="material-symbols-outlined text-[14px]">filter_alt</span> Funnel Conversion
               </h3>
            </div>
            <div className="p-6 space-y-6">
               <div>
                  <div className="flex justify-between items-end mb-1">
                     <span className="text-[12px] font-bold text-foreground">Attention (TOF)</span>
                     <span className="text-[12px] font-bold text-muted-foreground">1.8M</span>
                  </div>
                  <div className="w-full bg-border h-2 rounded"><div className="bg-foreground h-full rounded w-full"></div></div>
               </div>
               
               <div className="relative">
                  <div className="absolute left-[8px] top-[-16px] h-4 w-px bg-border/50"></div>
                  <div className="flex justify-between items-end mb-1 pl-4">
                     <span className="text-[12px] font-bold text-foreground">Trust (MOF)</span>
                     <span className="text-[12px] font-bold text-muted-foreground">14K</span>
                  </div>
                  <div className="w-full bg-border h-2 rounded pl-4"><div className="bg-foreground h-full rounded" style={{width: '60%'}}></div></div>
                  <span className="text-[10px] text-warning font-bold absolute right-0 top-6">0.7% Conv (Low)</span>
               </div>
               
               <div className="relative">
                  <div className="absolute left-[24px] top-[-16px] h-4 w-px bg-border/50"></div>
                  <div className="flex justify-between items-end mb-1 pl-8 pt-4">
                     <span className="text-[12px] font-bold text-foreground">Intent (BOF)</span>
                     <span className="text-[12px] font-bold text-muted-foreground">842</span>
                  </div>
                  <div className="w-full bg-border h-2 rounded pl-8"><div className="bg-tertiary h-full rounded" style={{width: '40%'}}></div></div>
                  <span className="text-[10px] text-success font-bold absolute right-0 top-10">6% Conv (High)</span>
               </div>
            </div>
         </div>
      </div>

      {/* Asset Classification Table */}
      <div className="bg-card border border-border rounded-[12px] overflow-hidden">
         <div className="p-4 border-b border-border/50 bg-muted/10 flex justify-between items-center">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Asset Classifications</h3>
            <button className="text-[11px] font-bold border border-border/50 px-3 py-1.5 rounded hover:bg-muted transition-colors">Export Report</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-border/50 text-[10px] uppercase font-bold text-muted-foreground tracking-widest bg-background">
                     <th className="p-4 font-bold">Content Asset</th>
                     <th className="p-4 font-bold">Class</th>
                     <th className="p-4 font-bold">Views</th>
                     <th className="p-4 font-bold">Hook (3s)</th>
                     <th className="p-4 font-bold">Retention</th>
                     <th className="p-4 font-bold">CTA / CTR</th>
                  </tr>
               </thead>
               <tbody className="text-[13px]">
                  {performanceAssets.map((asset, i) => (
                     <tr key={i} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-bold text-foreground max-w-[300px] truncate">
                           <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-0.5">{asset.type}</span>
                           {asset.title}
                        </td>
                        <td className="p-4">
                           <span className={`px-2 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-widest
                              ${asset.class === 'Viral' ? 'bg-tertiary/20 text-tertiary' : 
                                asset.class === 'Scaling' ? 'bg-success/20 text-success' : 
                                asset.class === 'Drawing Board' ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                              {asset.class}
                           </span>
                        </td>
                        <td className="p-4 font-bold">{asset.views}</td>
                        <td className={`p-4 font-bold ${parseInt(asset.hook) > 40 ? 'text-success' : 'text-warning'}`}>{asset.hook}</td>
                        <td className="p-4 font-medium text-foreground">{asset.retention}</td>
                        <td className="p-4 font-medium text-foreground">{asset.cta}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Creator Analysis */}
      <div className="bg-card border border-border rounded-[12px] mt-8 overflow-hidden">
         <div className="p-4 border-b border-border/50 bg-muted/10 flex justify-between items-center">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               <span className="material-symbols-outlined text-[14px]">person_search</span> Creator Analysis
            </h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-border/50 text-[10px] uppercase font-bold text-muted-foreground tracking-widest bg-background">
                     <th className="p-4 font-bold">Creator</th>
                     <th className="p-4 font-bold">Niche & Pillars</th>
                     <th className="p-4 font-bold">Performance</th>
                     <th className="p-4 font-bold">Best Vectors</th>
                     <th className="p-4 font-bold">Values</th>
                  </tr>
               </thead>
               <tbody className="text-[13px]">
                  {creatorData.map((creator, i) => (
                     <tr key={i} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                           <div className="font-bold text-foreground mb-1">{creator.name}</div>
                           <a href={`https://${creator.instagram}`} className="text-[11px] text-blue-500 hover:underline">{creator.instagram}</a>
                        </td>
                        <td className="p-4">
                           <div className="font-bold text-foreground mb-1">{creator.niche}</div>
                           <div className="text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded inline-block">{creator.pillars}</div>
                        </td>
                        <td className="p-4">
                           <div className="flex flex-col gap-1 text-[11px]">
                              <span className="flex justify-between w-32"><span className="text-muted-foreground">Followers</span> <span className="font-bold text-foreground">{creator.followers}</span></span>
                              <span className="flex justify-between w-32"><span className="text-muted-foreground">Avg Views</span> <span className="font-bold text-foreground">{creator.avgViews}</span></span>
                              <span className="flex justify-between w-32"><span className="text-muted-foreground">Engagement</span> <span className="font-bold text-success">{creator.engagement}</span></span>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="flex flex-col gap-1 text-[11px]">
                              <span className="flex justify-between w-40"><span className="text-muted-foreground">Best Format</span> <span className="font-bold text-foreground">{creator.bestFormat}</span></span>
                              <span className="flex justify-between w-40"><span className="text-muted-foreground">Best Pillar</span> <span className="font-bold text-foreground">{creator.bestPillar}</span></span>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="flex flex-col gap-1 text-[11px]">
                              <span className="flex justify-between w-32"><span className="text-muted-foreground">Content Value</span> <span className="font-bold text-foreground">{creator.contentValue}</span></span>
                              <span className="flex justify-between w-32"><span className="text-muted-foreground">Offer Value</span> <span className="font-bold text-foreground">{creator.offerValue}</span></span>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}
