"use client";

import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from "react";

// Types
type NodeType = 'content' | 'landing' | 'automation';
type NodeData = {
   id: string;
   type: NodeType;
   x: number;
   y: number;
   format: string; // Instagram Reel, VSL, Email, etc.
   funnel?: string;
   pillar?: string;
   status?: string;
   title: string;
   views?: string;
   engagement?: string;
   leads?: string;
   nextStep?: string;
};

type EdgeData = {
   id: string;
   from: string;
   to: string;
};

type FormatData = {
   id: string;
   name: string;
   purpose: string;
   funnel: string;
   pillars: string;
   structure: {
      hook: string;
      context: string;
      coreMechanism: string;
      payoff: string;
      cta: string;
   };
   performance: string;
};

const initialNodes: NodeData[] = [
   { id: "n1", type: "content", format: "Instagram Reel", title: "IG Reel #1", funnel: "TOF", pillar: "Entrepreneurship", status: "Published", views: "184K", engagement: "8.4%", nextStep: "VSL", x: 50, y: 150 },
   { id: "n2", type: "content", format: "Instagram Reel", title: "IG Reel #2", funnel: "TOF", pillar: "Mindset", status: "Published", views: "92K", engagement: "6.1%", nextStep: "VSL", x: 50, y: 350 },
   { id: "n3", type: "landing", format: "VSL", title: "Main VSL Page", funnel: "MOF", pillar: "All", status: "Active", views: "12K", engagement: "45% watch", leads: "475", nextStep: "Application", x: 350, y: 250 },
   { id: "n4", type: "landing", format: "Application", title: "Qualifier Form", funnel: "BOF", pillar: "All", status: "Active", views: "800", engagement: "18% completion", leads: "150", nextStep: "Sales Call", x: 650, y: 250 },
   { id: "n5", type: "automation", format: "Email", title: "Email Nurture #1", funnel: "MOF", pillar: "Trust", status: "Active", views: "450 opens", engagement: "12% click", nextStep: "Sales Call", x: 350, y: 450 },
   { id: "n6", type: "landing", format: "Sales Call", title: "Closing Call", funnel: "BOF", pillar: "Conversion", status: "Active", views: "97 booked", engagement: "70% show", leads: "17 Deals", nextStep: "Closed", x: 950, y: 250 },
];

const initialEdges: EdgeData[] = [
   { id: "e1", from: "n1", to: "n3" },
   { id: "e2", from: "n2", to: "n3" },
   { id: "e3", from: "n3", to: "n4" },
   { id: "e4", from: "n4", to: "n6" },
   { id: "e5", from: "n3", to: "n5" },
   { id: "e6", from: "n5", to: "n6" },
];

const pillars = [
   { id: 1, name: "Founder Experience", funnel: "TOF", description: "Broad business lessons and observations.", contentCount: 24, performance: 92, trend: "up", status: "Double Down" },
   { id: 2, name: "Frameworks & Systems", funnel: "MOF", description: "Methodologies for predictable growth.", contentCount: 14, performance: 84, trend: "up", status: "Scaling" },
   { id: 3, name: "ICP Pain Points", funnel: "BOF", description: "Directly addressing why they are stuck.", contentCount: 8, performance: 76, trend: "stable", status: "Needs Testing" },
   { id: 4, name: "Mindset", funnel: "TOF", description: "Psychology of building a business.", contentCount: 5, performance: 41, trend: "down", status: "Underperforming" },
];

const researchSignals = [
   { id: 1, pattern: "Contrarian business advice", performance: "2.8x higher engagement", recommendation: "Test this pattern within MOF authority content.", type: "OPPORTUNITY" },
];

const formatsList: FormatData[] = [
   {
      id: "f1", name: "Viral Video Format", purpose: "Reach & Attention", funnel: "TOF", pillars: "Founder Experience, Mindset", performance: "4.8/5",
      structure: {
         hook: "Negative Hook",
         context: "Alternative Option",
         coreMechanism: "Promise",
         payoff: "Solution",
         cta: "CTA (Save/Share)"
      }
   },
   {
      id: "f2", name: "Authority Framework", purpose: "Trust & Expertise", funnel: "MOF", pillars: "Frameworks & Systems", performance: "4.5/5",
      structure: {
         hook: "Problem",
         context: "Insight / Paradigm Shift",
         coreMechanism: "Framework Explanation",
         payoff: "Proof / Case Study",
         cta: "CTA (Lead Magnet)"
      }
   }
];

export default function AcquisitionStrategyPage() {
   const [activeTab, setActiveTab] = useState("architecture"); // 'overview', 'architecture', 'formats'
   const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
   const [showAddNodeModal, setShowAddNodeModal] = useState(false);
   const [activeCampaignData, setActiveCampaignData] = useState("Founder Authority Campaign");

   const [nodes, setNodes] = useState<NodeData[]>(initialNodes);
   const [edges, setEdges] = useState<EdgeData[]>(initialEdges);

   const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

   // Formats State
   const [showAddFormatModal, setShowAddFormatModal] = useState(false);
   const [activeFormatId, setActiveFormatId] = useState<string | null>(null);
   const [formats, setFormats] = useState<FormatData[]>(formatsList);

   // Drag State
   const [activeDrag, setActiveDrag] = useState<'NODE' | 'EDGE' | null>(null);
   const dragRef = useRef({
      type: null as 'NODE' | 'EDGE' | null,
      nodeId: null as string | null,
      startMouseX: 0, startMouseY: 0,
      startNodeX: 0, startNodeY: 0,
      sourceId: null as string | null,
      currentMouseX: 0, currentMouseY: 0
   });

   const canvasRef = useRef<HTMLDivElement>(null);

   const getCanvasCoords = (clientX: number, clientY: number) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      return {
         x: clientX - rect.left + canvasRef.current.scrollLeft,
         y: clientY - rect.top + canvasRef.current.scrollTop
      };
   };

   useEffect(() => {
      const handleMouseMove = (e: globalThis.MouseEvent) => {
         if (dragRef.current.type === 'NODE' && dragRef.current.nodeId) {
            const dx = e.clientX - dragRef.current.startMouseX;
            const dy = e.clientY - dragRef.current.startMouseY;
            const id = dragRef.current.nodeId;
            setNodes(curr => curr.map(n => n.id === id ? { ...n, x: dragRef.current.startNodeX + dx, y: dragRef.current.startNodeY + dy } : n));
         } else if (dragRef.current.type === 'EDGE') {
            dragRef.current.currentMouseX = e.clientX;
            dragRef.current.currentMouseY = e.clientY;
            setActiveDrag('EDGE');
            setNodes(curr => [...curr]);
         }
      };

      const handleMouseUp = () => {
         dragRef.current.type = null;
         setActiveDrag(null);
      };

      if (activeDrag) {
         window.addEventListener('mousemove', handleMouseMove);
         window.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
         window.removeEventListener('mousemove', handleMouseMove);
         window.removeEventListener('mouseup', handleMouseUp);
      };
   }, [activeDrag]);

   const handleNodePointerDown = (e: ReactMouseEvent, node: NodeData) => {
      e.stopPropagation();
      e.preventDefault();
      if (activeNodeId === node.id) {
         // if clicking same node, allow drag only
      } else {
         setActiveNodeId(node.id); // open details
      }
      dragRef.current = {
         ...dragRef.current,
         type: 'NODE', nodeId: node.id,
         startMouseX: e.clientX, startMouseY: e.clientY,
         startNodeX: node.x, startNodeY: node.y
      };
      setActiveDrag('NODE');
   };

   const handlePortPointerDown = (e: ReactMouseEvent, sourceId: string) => {
      e.stopPropagation();
      e.preventDefault();
      dragRef.current = {
         ...dragRef.current,
         type: 'EDGE', sourceId,
         currentMouseX: e.clientX, currentMouseY: e.clientY
      };
      setActiveDrag('EDGE');
   };

   const handlePortPointerUp = (e: ReactMouseEvent, targetId: string) => {
      e.stopPropagation();
      if (dragRef.current.type === 'EDGE' && dragRef.current.sourceId && dragRef.current.sourceId !== targetId) {
         setEdges(prev => [...prev, { id: `e_${Date.now()}`, from: dragRef.current.sourceId!, to: targetId }]);
      }
   };

   const getNodeDimensions = () => {
      return { w: 180, h: 140 }; // Unified compact size
   };

   const drawEdge = (fromId: string, toId: string) => {
      const fromNode = nodes.find(n => n.id === fromId);
      const toNode = nodes.find(n => n.id === toId);
      if (!fromNode || !toNode) return "";
      const fromDims = getNodeDimensions();
      const toDims = getNodeDimensions();
      const x1 = fromNode.x + fromDims.w + 6;
      const y1 = fromNode.y + fromDims.h / 2;
      const x2 = toNode.x - 6;
      const y2 = toNode.y + toDims.h / 2;
      const diffX = Math.abs(x2 - x1);
      const curveness = Math.max(diffX * 0.5, 30);
      return `M ${x1} ${y1} C ${x1 + curveness} ${y1}, ${x2 - curveness} ${y2}, ${x2} ${y2}`;
   };

   const drawTempEdge = () => {
      if (!dragRef.current.sourceId || dragRef.current.type !== 'EDGE') return "";
      const fromNode = nodes.find(n => n.id === dragRef.current.sourceId);
      if (!fromNode) return "";
      const fromDims = getNodeDimensions();
      const x1 = fromNode.x + fromDims.w + 6;
      const y1 = fromNode.y + fromDims.h / 2;
      const { x: x2, y: y2 } = getCanvasCoords(dragRef.current.currentMouseX, dragRef.current.currentMouseY);
      const diffX = Math.abs(x2 - x1);
      const curveness = Math.max(diffX * 0.5, 30);
      return `M ${x1} ${y1} C ${x1 + curveness} ${y1}, ${x2 - curveness} ${y2}, ${x2} ${y2}`;
   };

   const UnifiedNode = ({ node }: { node: NodeData }) => {
      const { w, h } = getNodeDimensions();
      return (
         <div
            className="rounded-[12px] bg-white border border-gray-200 flex flex-col p-3 cursor-pointer shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:border-black transition-colors"
            style={{ position: 'absolute', left: node.x, top: node.y, width: w, height: h }}
            onMouseDown={(e) => handleNodePointerDown(e, node)}
         >
            <div className="flex justify-between items-start mb-2">
               <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{node.funnel}</span>
               <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{node.status}</span>
            </div>
            <h4 className="text-[13px] font-bold text-gray-900 leading-tight mb-1 truncate">{node.title}</h4>
            <span className="text-[10px] text-gray-500 font-medium truncate mb-auto">{node.format}</span>
            <div className="flex justify-between items-end border-t border-gray-100 pt-2 mt-2">
               <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest leading-none mb-1">Views</span>
                  <span className="text-[11px] font-bold text-gray-900 leading-none">{node.views || '-'}</span>
               </div>
               <div className="flex flex-col text-right">
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest leading-none mb-1">Eng. / Lds</span>
                  <span className="text-[11px] font-bold text-gray-900 leading-none">{node.engagement || node.leads || '-'}</span>
               </div>
            </div>
            <div
               className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border border-gray-400 rounded-full cursor-crosshair hover:border-black transition-all shadow-sm z-10 flex items-center justify-center"
               onMouseUp={(e) => handlePortPointerUp(e, node.id)}
            />
            <div
               className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border border-gray-400 rounded-full cursor-crosshair hover:border-black transition-all shadow-sm z-10 flex items-center justify-center"
               onMouseDown={(e) => handlePortPointerDown(e, node.id)}
            />
         </div>
      );
   };

   return (
      <div className="p-6 md:p-10 lg:p-12 max-w-[1500px] mx-auto w-full pb-32">

         {/* Overview/Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 pb-6">
            <div>
               <h2 className="text-[20px] font-bold text-foreground">Content Strategy</h2>
               <p className="text-[14px] text-muted-foreground mt-1">Build the content system behind your personal brand.</p>
            </div>
            <div>
               <button className="text-[11px] font-bold uppercase tracking-widest bg-black text-white px-4 py-2 rounded-[6px] hover:bg-black/90 transition-colors flex items-center gap-2">
                  View Foundation <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
               </button>
            </div>
         </div>

         {/* Internal Tabs */}
         <div className="flex gap-6 border-b border-border mb-8">
            {["overview", "architecture", "formats"].map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-[12px] font-bold uppercase tracking-widest transition-colors ${activeTab === tab ? 'text-foreground border-b-2 border-foreground' : 'text-muted-foreground hover:text-foreground'}`}
               >
                  {tab}
               </button>
            ))}
         </div>

         {/* --- OVERVIEW TAB --- */}
         {activeTab === "overview" && (
            <div className="flex flex-col gap-8">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-card border border-border rounded-[12px] p-6 relative overflow-hidden">
                     <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">travel_explore</span> AI Market Research Signals
                     </h3>
                     <div className="flex flex-col gap-4">
                        {researchSignals.map(signal => (
                           <div key={signal.id} className="border border-border/50 rounded-[8px] p-4 bg-background">
                              <div className="flex items-center gap-2 mb-2">
                                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${signal.type === 'OPPORTUNITY' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                    Pattern Detected
                                 </span>
                                 <span className="text-[13px] font-bold text-foreground">"{signal.pattern}"</span>
                              </div>
                              <p className="text-[13px] text-muted-foreground mb-3">is receiving <span className="font-bold text-foreground">{signal.performance}</span> among comparable creators in this niche.</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between items-end mb-4">
                     <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Content Pillars</h3>
                        <p className="text-[13px] text-muted-foreground mt-1">Core topics driven by funnel stage.</p>
                     </div>
                     <button className="text-[11px] font-bold border border-border/50 px-3 py-1.5 rounded hover:bg-muted transition-colors">Add Pillar</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     {pillars.map(pillar => (
                        <div key={pillar.id} className="bg-card border border-border rounded-[12px] p-5 flex flex-col hover:border-foreground/20 transition-colors cursor-pointer group">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border border-border/50 px-1.5 py-0.5 rounded w-fit mb-3">{pillar.funnel}</span>
                           <h4 className="text-[16px] font-bold text-foreground mb-1">{pillar.name}</h4>
                           <p className="text-[12px] text-muted-foreground mb-4 line-clamp-2">{pillar.description}</p>

                           <div className="mt-auto">
                              <div className="flex justify-between items-end mb-1">
                                 <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Performance</span>
                                 <span className="text-[14px] font-bold text-foreground">{pillar.performance}%</span>
                              </div>
                              <div className="w-full bg-border h-1.5 rounded-full overflow-hidden mb-3">
                                 <div className={`h-full rounded-full ${pillar.performance > 80 ? 'bg-success' : pillar.performance > 60 ? 'bg-foreground' : 'bg-warning'}`} style={{ width: `${pillar.performance}%` }}></div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* --- ARCHITECTURE TAB --- */}
         {activeTab === "architecture" && (
            <div className="bg-[#FAFAFA] border border-border shadow-md rounded-[16px] h-[800px] flex flex-col relative overflow-hidden">

               <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white z-20 shadow-sm relative">
                  <div>
                     <h3 className="text-[13px] font-bold text-black flex items-center gap-2">
                        Strategy Architecture Board
                        <span className="text-[10px] bg-black/5 text-black px-2 py-0.5 rounded">{activeCampaignData}</span>
                     </h3>
                     <span className="text-[11px] text-gray-500">Map content paths to conversion outcomes.</span>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => setShowAddCampaignModal(true)} className="text-[11px] font-bold border border-gray-200 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors bg-white shadow-sm">+ Add Campaign</button>
                     <button onClick={() => setShowAddNodeModal(true)} className="text-[11px] font-bold border border-black bg-black text-white px-3 py-1.5 rounded hover:bg-black/90 transition-colors shadow-sm">+ Add Node</button>
                  </div>
               </div>

               <div className="flex-1 bg-transparent relative overflow-auto" ref={canvasRef} onClick={() => setActiveNodeId(null)}>
                  <div className="relative min-w-[2000px] min-h-[1200px] p-8">

                     <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(0,0,0,0.1) 1.5px, transparent 0)', backgroundSize: '36px 36px' }}
                     />

                     <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        {edges.map(edge => (
                           <path
                              key={edge.id}
                              d={drawEdge(edge.from, edge.to)}
                              stroke="rgba(0,0,0,0.25)"
                              strokeWidth="2"
                              strokeDasharray="4,4"
                              fill="none"
                           />
                        ))}
                        {activeDrag === 'EDGE' && dragRef.current.sourceId && (
                           <path
                              d={drawTempEdge()}
                              stroke="rgba(0,0,0,0.4)"
                              strokeWidth="2"
                              strokeDasharray="4,4"
                              fill="none"
                           />
                        )}
                     </svg>

                     {nodes.map(node => (
                        <UnifiedNode key={node.id} node={node} />
                     ))}
                  </div>
               </div>

               {/* Slide-over detail pane */}
               {activeNodeId && (
                  <div className="absolute top-0 right-0 h-full w-[360px] bg-white border-l border-gray-200 shadow-2xl z-30 flex flex-col transform transition-transform animate-in slide-in-from-right-4 duration-300">
                     <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Node Details</span>
                        <button onClick={() => setActiveNodeId(null)} className="text-gray-400 hover:text-black"><span className="material-symbols-outlined text-[18px]">close</span></button>
                     </div>
                     {(() => {
                        const node = nodes.find(n => n.id === activeNodeId);
                        if (!node) return null;
                        const connectedSources = edges.filter(e => e.to === node.id).map(e => nodes.find(n => n.id === e.from)?.title).filter(Boolean);
                        const connectedDestinations = edges.filter(e => e.from === node.id).map(e => nodes.find(n => n.id === e.to)?.title).filter(Boolean);
                        return (
                           <div className="flex-1 overflow-y-auto p-6 space-y-6">
                              <div>
                                 <h3 className="text-[20px] font-bold text-gray-900">{node.title}</h3>
                                 <div className="flex gap-2 mt-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-600 px-2 py-1 rounded">{node.funnel || 'N/A'}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-1 rounded">{node.status || 'Active'}</span>
                                 </div>
                              </div>

                              <div className="space-y-4 text-[13px]">
                                 <div><span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Format</span><p className="font-medium">{node.format}</p></div>
                                 <div><span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Content Pillar</span><p className="font-medium">{node.pillar || 'General'}</p></div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div><span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Views</span><p className="font-bold text-[16px]">{node.views || '-'}</p></div>
                                    <div><span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Engagement</span><p className="font-bold text-[16px]">{node.engagement || '-'}</p></div>
                                 </div>
                                 {node.leads && <div><span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Conversions / Leads</span><p className="font-bold text-[16px] text-emerald-600">{node.leads}</p></div>}
                              </div>

                              <div className="border-t border-gray-100 pt-6 space-y-4">
                                 <div>
                                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Connected From (Sources)</span>
                                    {connectedSources.length > 0 ? connectedSources.map((title, i) => (
                                       <div key={i} className="text-[12px] bg-gray-50 border border-gray-200 px-3 py-2 rounded mb-2">{title}</div>
                                    )) : <div className="text-[12px] text-gray-400">None</div>}
                                 </div>
                                 <div>
                                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Next Step (Destinations)</span>
                                    {connectedDestinations.length > 0 ? connectedDestinations.map((title, i) => (
                                       <div key={i} className="text-[12px] bg-gray-50 border border-gray-200 px-3 py-2 rounded mb-2 font-medium text-black">{title}</div>
                                    )) : <div className="text-[12px] text-gray-400">None</div>}
                                 </div>
                              </div>

                              <div className="pt-4 border-t border-gray-100 flex gap-2">
                                 <button className="flex-1 border border-gray-200 py-2 text-[12px] font-bold text-black rounded hover:bg-gray-50">Edit</button>
                                 <button className="border border-red-200 py-2 px-3 text-[12px] font-bold text-red-600 rounded hover:bg-red-50 material-symbols-outlined text-[16px]">delete</button>
                              </div>
                           </div>
                        );
                     })()}
                  </div>
               )}

               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full px-10 py-4 flex items-center gap-10 shadow-[0_15px_40px_rgba(0,0,0,0.15)] z-20 pointer-events-none">
                  <div className="flex flex-col items-center mr-2">
                     <span className="text-gray-400 text-[9px] uppercase tracking-[0.2em] font-bold mb-0.5">Projected</span>
                     <span className="text-black text-[9px] uppercase tracking-[0.2em] font-bold">/ Current Funnel</span>
                  </div>
                  <div className="w-px h-6 bg-gray-200"></div>
                  <div className="flex flex-col items-center">
                     <span className="text-black text-[18px] font-bold tracking-tight">184K</span>
                     <span className="text-gray-400 text-[8px] uppercase tracking-widest font-bold mt-0.5">Reach</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <span className="text-black text-[18px] font-bold tracking-tight">475</span>
                     <span className="text-gray-400 text-[8px] uppercase tracking-widest font-bold mt-0.5">Leads</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <span className="text-black text-[18px] font-bold tracking-tight">150</span>
                     <span className="text-gray-400 text-[8px] uppercase tracking-widest font-bold mt-0.5">Applications</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <span className="text-black text-[18px] font-bold tracking-tight">97</span>
                     <span className="text-gray-400 text-[8px] uppercase tracking-widest font-bold mt-0.5">Calls</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <span className="text-emerald-500 text-[18px] font-bold tracking-tight">17</span>
                     <span className="text-gray-400 text-[8px] uppercase tracking-widest font-bold mt-0.5">Deals</span>
                  </div>
               </div>
            </div>
         )}

         {/* --- FORMATS TAB --- */}
         {activeTab === "formats" && (
            <div className="flex flex-col gap-6">
               <div className="flex justify-end">
                  <button
                     onClick={() => setShowAddFormatModal(true)}
                     className="text-[11px] font-bold uppercase tracking-widest bg-foreground text-background px-4 py-2 rounded-[6px] hover:bg-foreground/90 transition-colors flex items-center gap-2"
                  >
                     + Add Format
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formats.map((formatItem) => (
                     <div key={formatItem.id} onClick={() => setActiveFormatId(formatItem.id)} className="bg-card border border-border rounded-[12px] p-6 hover:border-foreground/30 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/30 px-2 py-0.5 rounded block">{formatItem.funnel}</span>
                           <span className="text-[11px] font-bold text-foreground flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-success">star</span> {formatItem.performance}</span>
                        </div>
                        <h4 className="text-[16px] font-bold text-foreground mb-1 group-hover:text-tertiary transition-colors">{formatItem.name}</h4>
                        <p className="text-[13px] text-muted-foreground mb-6 line-clamp-1">{formatItem.purpose}</p>
                        <div className="border-t border-border/50 pt-4">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Structure</span>
                           <div className="flex flex-wrap gap-1">
                              {[formatItem.structure.hook, formatItem.structure.context, formatItem.structure.coreMechanism].map((step, i) => (
                                 <span key={i} className="text-[10px] bg-background border border-border/50 px-1.5 py-0.5 rounded text-foreground font-medium">{step}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Format Detail Contextual Pane */}
         {activeFormatId && activeTab === "formats" && (
            <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-end">
               <div className="w-[450px] bg-card h-full shadow-2xl border-l border-border flex flex-col animate-in slide-in-from-right-8 duration-300">
                  {(() => {
                     const format = formats.find(f => f.id === activeFormatId);
                     if (!format) return null;
                     return (
                        <>
                           <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/10">
                              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Format Viewer</span>
                              <button onClick={() => setActiveFormatId(null)} className="text-muted-foreground hover:text-foreground"><span className="material-symbols-outlined">close</span></button>
                           </div>
                           <div className="p-6 overflow-y-auto flex-1 space-y-8">
                              <div>
                                 <h2 className="text-[24px] font-bold text-foreground mb-2">{format.name}</h2>
                                 <p className="text-[14px] text-muted-foreground">{format.purpose}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <div><span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Best Funnel Stage</span><p className="text-[14px] font-bold text-foreground">{format.funnel}</p></div>
                                 <div><span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Performance</span><p className="text-[14px] font-bold text-success">{format.performance}</p></div>
                                 <div className="col-span-2"><span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Best Content Pillars</span><p className="text-[14px] font-bold text-foreground">{format.pillars}</p></div>
                              </div>

                              <div>
                                 <h3 className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground mb-4 border-b border-border/50 pb-2">Structure</h3>
                                 <div className="space-y-4">
                                    {Object.entries(format.structure).map(([key, value], i) => (
                                       <div key={i} className="flex gap-4">
                                          <div className="w-6 h-6 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold uppercase mt-0.5">{i + 1}</div>
                                          <div>
                                             <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{key}</span>
                                             <p className="text-[14px] font-bold text-foreground">{value}</p>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                           <div className="p-4 border-t border-border/50 bg-background flex gap-3">
                              <button className="flex-1 bg-foreground text-background text-[12px] font-bold py-3 rounded-[6px] hover:bg-foreground/90 transition-colors">Use Format in Script Center</button>
                           </div>
                        </>
                     )
                  })()}
               </div>
            </div>
         )}

         {/* Add Format Modal */}
         {showAddFormatModal && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
               <div className="bg-card border border-border rounded-[12px] max-w-2xl w-full flex flex-col max-h-[90vh] shadow-2xl">
                  <div className="p-6 border-b border-border/50 flex justify-between items-center">
                     <h3 className="text-[16px] font-bold text-foreground uppercase tracking-widest">Add New Format</h3>
                     <button onClick={() => setShowAddFormatModal(false)} className="text-muted-foreground hover:text-foreground"><span className="material-symbols-outlined">close</span></button>
                  </div>
                  <div className="p-6 overflow-y-auto space-y-6">
                     <div>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Format Name</label>
                        <input type="text" id="fmtName" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none" placeholder="e.g. Founder Story Arc" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Purpose</label>
                           <input type="text" id="fmtPurpose" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none" placeholder="e.g. Build deeper connection" />
                        </div>
                        <div>
                           <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Funnel Stage</label>
                           <select id="fmtFunnel" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none">
                              <option value="TOF">TOF (Reach)</option>
                              <option value="MOF">MOF (Trust)</option>
                              <option value="BOF">BOF (Intent)</option>
                           </select>
                        </div>
                     </div>
                     <div>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Best Content Pillars</label>
                        <input type="text" id="fmtPillars" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none" placeholder="e.g. Founder Experience, Mindset" />
                     </div>

                     <h4 className="text-[12px] font-bold uppercase tracking-widest text-foreground mt-8 mb-4 border-b border-border/50 pb-2">Structure Breakdown</h4>
                     <div className="space-y-3">
                        {['Hook Pattern', 'Context / Body Pattern', 'Core Mechanism', 'Payoff / Proof', 'CTA Pattern'].map((label, i) => (
                           <div key={i} className="flex gap-3 items-center">
                              <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                              <input type="text" id={`fmtStep${i}`} className="flex-1 bg-background border border-border/50 rounded-[6px] p-3 text-[13px] outline-none" placeholder={label} />
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="p-6 border-t border-border/50 flex justify-end gap-3 bg-muted/10">
                     <button onClick={() => setShowAddFormatModal(false)} className="px-5 py-2.5 text-[12px] font-bold text-muted-foreground hover:text-foreground">Cancel</button>
                     <button onClick={() => {
                        const el = (id: string) => (document.getElementById(id) as HTMLInputElement).value;
                        const newFmt: FormatData = {
                           id: `f_${Date.now()}`,
                           name: el('fmtName') || 'New Format',
                           purpose: el('fmtPurpose') || 'General',
                           funnel: (document.getElementById('fmtFunnel') as HTMLSelectElement).value,
                           pillars: el('fmtPillars') || 'Any',
                           performance: 'New',
                           structure: {
                              hook: el('fmtStep0') || '...',
                              context: el('fmtStep1') || '...',
                              coreMechanism: el('fmtStep2') || '...',
                              payoff: el('fmtStep3') || '...',
                              cta: el('fmtStep4') || '...'
                           }
                        }
                        setFormats([...formats, newFmt]);
                        setShowAddFormatModal(false);
                     }} className="px-5 py-2.5 bg-foreground text-background text-[12px] font-bold rounded-[6px] hover:bg-foreground/90">Save Format</button>
                  </div>
               </div>
            </div>
         )}

         {/* MODALS */}
         {showAddCampaignModal && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
               <div className="bg-card border border-border rounded-[12px] max-w-lg w-full p-6 shadow-2xl overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-[15px] font-bold uppercase tracking-widest text-foreground">Add Campaign</h3>
                     <button onClick={() => setShowAddCampaignModal(false)} className="text-muted-foreground hover:text-foreground"><span className="material-symbols-outlined">close</span></button>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Campaign Name</label>
                        <input id="campaignNameInput" type="text" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none focus:border-foreground/40" placeholder="e.g. Founder Authority Campaign" />
                     </div>
                     <div>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Objective Funnel Stage</label>
                        <select className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none focus:border-foreground/40">
                           <option>TOF → MOF → BOF</option>
                           <option>Direct Response (BOF)</option>
                           <option>Audience Building (TOF)</option>
                        </select>
                     </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border/50">
                     <button onClick={() => setShowAddCampaignModal(false)} className="px-4 py-2 text-[12px] font-bold text-muted-foreground hover:text-foreground">Cancel</button>
                     <button onClick={() => { setActiveCampaignData((document.getElementById('campaignNameInput') as HTMLInputElement).value || "New Campaign"); setShowAddCampaignModal(false); }} className="px-5 py-2.5 bg-foreground text-background text-[12px] font-bold rounded-[6px] hover:bg-foreground/90 flex items-center gap-2">Create Campaign <span className="material-symbols-outlined text-[14px]">arrow_forward</span></button>
                  </div>
               </div>
            </div>
         )}

         {showAddNodeModal && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
               <div className="bg-card border border-border rounded-[12px] max-w-lg w-full p-6 shadow-2xl overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-[15px] font-bold uppercase tracking-widest text-foreground">Add Node</h3>
                     <button onClick={() => setShowAddNodeModal(false)} className="text-muted-foreground hover:text-foreground"><span className="material-symbols-outlined">close</span></button>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Node Name</label>
                        <input id="nodeNameInput" type="text" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none focus:border-foreground/40" placeholder="e.g. IG Reel #3" />
                     </div>
                     <div>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Format</label>
                        <select id="nodeFormatInput" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none">
                           <option>Instagram Reel</option>
                           <option>YouTube Video</option>
                           <option>LinkedIn Post</option>
                           <option>Carousel</option>
                           <option>Story</option>
                           <option>Landing Page</option>
                           <option>VSL</option>
                           <option>Lead Magnet</option>
                           <option>Application</option>
                           <option>Form</option>
                           <option>Confirmation Page</option>
                           <option>Sales Call</option>
                           <option>Email</option>
                           <option>Offer</option>
                           <option>CTA</option>
                           <option>Custom Node</option>
                        </select>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Funnel Stage</label>
                           <select id="nodeStageInput" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none">
                              <option value="TOF">TOF</option>
                              <option value="MOF">MOF</option>
                              <option value="BOF">BOF</option>
                              <option value="Automation">Automation</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Content Pillar</label>
                           <input id="nodePillarInput" type="text" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none focus:border-foreground/40" placeholder="e.g. Mindset" />
                        </div>
                     </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border/50">
                     <button onClick={() => setShowAddNodeModal(false)} className="px-4 py-2 text-[12px] font-bold text-muted-foreground hover:text-foreground">Cancel</button>
                     <button onClick={() => {
                        const name = (document.getElementById('nodeNameInput') as HTMLInputElement).value || "New Node";
                        const format = (document.getElementById('nodeFormatInput') as HTMLSelectElement).value;
                        const stage = (document.getElementById('nodeStageInput') as HTMLSelectElement).value;
                        const pillar = (document.getElementById('nodePillarInput') as HTMLInputElement).value || "General";
                        setNodes([...nodes, {
                           id: Date.now().toString(),
                           type: 'content',
                           format: format,
                           funnel: stage,
                           title: name,
                           pillar: pillar,
                           status: "Draft",
                           views: "-",
                           engagement: "-",
                           x: 500, y: 300
                        }]);
                        setShowAddNodeModal(false);
                     }} className="px-5 py-2.5 bg-foreground text-background text-[12px] font-bold rounded-[6px] hover:bg-foreground/90 flex items-center gap-2">Add to Architecture <span className="material-symbols-outlined text-[14px]">add</span></button>
                  </div>
               </div>
            </div>
         )}

      </div>
   );
}
