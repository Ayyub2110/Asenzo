"use client";

import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from "react";

// Types
type NodeType = 'social' | 'step' | 'automation';
type NodeData = {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  category?: string;
  title?: string;
  subtitle?: string;
  stats?: string;
  icon?: string;
  desc?: string;
  badge?: string;
  stat1Label?: string;
  stat1Value?: string;
  stat2Label?: string;
  stat2Value?: string;
};

type EdgeData = {
  id: string;
  from: string;
  to: string;
};

// Internal Mock Data
const initialNodes: NodeData[] = [
  // Social Sources
  { id: "soc1", type: "social", category: "instagram", title: "INSTAGRAM", stats: "12K Follow", x: 60, y: 80 },
  { id: "soc2", type: "social", category: "youtube", title: "YOUTUBE", stats: "5K Subs", x: 60, y: 190 },
  { id: "soc3", type: "social", category: "tiktok", title: "TIKTOK", stats: "15K Follow", x: 60, y: 300 },
  { id: "soc4", type: "social", category: "facebook", title: "FACEBOOK", stats: "8K Follow", x: 60, y: 410 },
  
  // Automations (Left)
  { id: "auto1", type: "automation", icon: "chat", title: "Instagram DM Automation", desc: "Keyword trigger from Instagram content. Comments or DMs route...", stats: "~1.9K leads / mo", x: 280, y: 220 },
  { id: "auto2", type: "automation", icon: "mail", title: "5-Day Email Nurture", desc: "Email sequence for leads who opted in but didn't book. Builds...", stats: "~19 leads / mo rev", x: 280, y: 650 },
  
  // Funnel Steps (Middle Row)
  { id: "step1", type: "step", badge: "STEP 01", title: "Lead Magnet / Opt-in", stat1Label: "views", stat1Value: "1.9K", stat2Label: "leads", stat2Value: "475", x: 280, y: 430 },
  { id: "step2", type: "step", badge: "STEP 02", title: "Bridge Page (VSL)", stat1Label: "leads", stat1Value: "475", stat2Label: "engaged", stat2Value: "333", x: 550, y: 430 },
  { id: "step3", type: "step", badge: "STEP 03", title: "Application / Book-a-Call", stat1Label: "applied", stat1Value: "150", stat2Label: "booked", stat2Value: "97", x: 820, y: 430 },
  { id: "step4", type: "step", badge: "STEP 04", title: "Confirmation Page", stat1Label: "views", stat1Value: "97", stat2Label: "confirmed", stat2Value: "97", x: 1090, y: 430 },
  { id: "step5", type: "step", badge: "STEP 05", title: "Sales Call", stat1Label: "show-up", stat1Value: "68", stat2Label: "closed", stat2Value: "17", x: 1360, y: 430 },
  
  // Automations (Right)
  { id: "auto4", type: "automation", icon: "history", title: "Abandoned Application Recovery", desc: "Automated follow-up for started but incomplete applications...", stats: "~35 leads / mo rev", x: 820, y: 650 },
];

const initialEdges: EdgeData[] = [
  { id: "e1", from: "soc1", to: "auto1" },
  { id: "e2", from: "soc2", to: "step1" },
  { id: "e3", from: "soc3", to: "step1" },
  { id: "e4", from: "soc4", to: "step1" },
  { id: "e8", from: "auto1", to: "step1" },
  { id: "e9", from: "step1", to: "step2" },
  { id: "e10", from: "step2", to: "step3" },
  { id: "e11", from: "step3", to: "step4" },
  { id: "e12", from: "step4", to: "step5" },
  { id: "e13", from: "step1", to: "auto2" },
  { id: "e14", from: "auto2", to: "step2" },
  { id: "e16", from: "step3", to: "auto4" },
  { id: "e17", from: "auto4", to: "step3" },
];

const pillars = [
  { id: 1, name: "Founder Experience", funnel: "TOF", description: "Broad business lessons and observations.", contentCount: 24, performance: 92, trend: "up", status: "Double Down" },
  { id: 2, name: "Frameworks & Systems", funnel: "MOF", description: "Methodologies for predictable growth.", contentCount: 14, performance: 84, trend: "up", status: "Scaling" },
  { id: 3, name: "ICP Pain Points", funnel: "BOF", description: "Directly addressing why they are stuck.", contentCount: 8, performance: 76, trend: "stable", status: "Needs Testing" },
  { id: 4, name: "Mindset", funnel: "TOF", description: "Psychology of building a business.", contentCount: 5, performance: 41, trend: "down", status: "Underperforming" },
];

const researchSignals = [
  { id: 1, pattern: "Contrarian business advice", performance: "2.8x higher engagement", recommendation: "Test this pattern within MOF authority content.", type: "OPPORTUNITY" },
  { id: 2, pattern: "Generic 'How To' hooks", performance: "40% drop in retention", recommendation: "Shift to 'Mistakes' or 'Before/After' framing for educational posts.", type: "WARNING" },
];

export default function AcquisitionStrategyPage() {
  const [activeTab, setActiveTab] = useState("architecture");
  const [showAddFunnelModal, setShowAddFunnelModal] = useState(false);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [activeFunnelData, setActiveFunnelData] = useState("Founder Authority Campaign");
  
  const [nodes, setNodes] = useState<NodeData[]>(initialNodes);
  const [edges, setEdges] = useState<EdgeData[]>(initialEdges);
  
  // Dashboard routing
  const [activeFunnelId, setActiveFunnelId] = useState<string | null>(null);

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

  const getNodeDimensions = (type: NodeType) => {
    switch(type) {
      case 'social': return { w: 75, h: 95 };
      case 'step': return { w: 220, h: 140 };
      case 'automation': return { w: 240, h: 120 };
      default: return { w: 100, h: 100 };
    }
  };

  const drawEdge = (fromId: string, toId: string) => {
    const fromNode = nodes.find(n => n.id === fromId);
    const toNode = nodes.find(n => n.id === toId);
    if (!fromNode || !toNode) return "";
    const fromDims = getNodeDimensions(fromNode.type);
    const toDims = getNodeDimensions(toNode.type);
    const x1 = fromNode.x + fromDims.w;
    const y1 = fromNode.y + fromDims.h / 2;
    const x2 = toNode.x;
    const y2 = toNode.y + toDims.h / 2;
    const diffX = Math.abs(x2 - x1);
    const curveness = Math.max(diffX * 0.5, 30);
    return `M ${x1} ${y1} C ${x1 + curveness} ${y1}, ${x2 - curveness} ${y2}, ${x2} ${y2}`;
  };

  const drawTempEdge = () => {
    if (!dragRef.current.sourceId || dragRef.current.type !== 'EDGE') return "";
    const fromNode = nodes.find(n => n.id === dragRef.current.sourceId);
    if (!fromNode) return "";
    const fromDims = getNodeDimensions(fromNode.type);
    const x1 = fromNode.x + fromDims.w;
    const y1 = fromNode.y + fromDims.h / 2;
    const { x: x2, y: y2 } = getCanvasCoords(dragRef.current.currentMouseX, dragRef.current.currentMouseY);
    const diffX = Math.abs(x2 - x1);
    const curveness = Math.max(diffX * 0.5, 30);
    return `M ${x1} ${y1} C ${x1 + curveness} ${y1}, ${x2 - curveness} ${y2}, ${x2} ${y2}`;
  };

  // Funnel Sub-dashboard
  if (activeFunnelId) {
     const funnelNode = nodes.find(n => n.id === activeFunnelId);
     return (
       <div className="p-6 md:p-10 max-w-[1360px] mx-auto w-full pb-32">
          <button onClick={() => setActiveFunnelId(null)} className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-6 hover:text-foreground">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span> Back to Architecture
          </button>
          
          <div className="bg-card border border-border rounded-[12px] p-8 mb-8">
             <span className="text-[10px] font-bold uppercase tracking-widest bg-foreground/10 text-foreground px-2 py-1 rounded inline-block mb-3">{funnelNode?.badge} • {funnelNode?.type}</span>
             <h2 className="text-[28px] font-bold text-foreground tracking-tight mb-2">{funnelNode?.title} Dashboard</h2>
             <p className="text-[14px] text-muted-foreground">Manage the content, logic, and copy localized to this specific conversion node.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-card border border-border rounded-[12px] p-6 col-span-2">
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-6">Connected Assets</h3>
                <div className="text-center py-12 text-muted-foreground bg-muted/20 border border-border/50 border-dashed rounded-[8px]">
                   <span className="material-symbols-outlined text-[32px] mb-2 opacity-50">data_object</span>
                   <p className="text-[13px]">No active script iterations mapped to this node yet.</p>
                </div>
             </div>
             <div className="bg-card border border-border rounded-[12px] p-6">
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-6">Performance Sub-Metrics</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center border-b border-border/50 pb-3">
                      <span className="text-[12px] text-muted-foreground">Conversion Rate</span>
                      <span className="text-[14px] font-bold text-foreground">18.4%</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-border/50 pb-3">
                      <span className="text-[12px] text-muted-foreground">Drop-off</span>
                      <span className="text-[14px] font-bold text-warning">8.2%</span>
                   </div>
                </div>
             </div>
          </div>
       </div>
     );
  }

  // --- WHITE CANVAS RENDERERS (Light Mode Visuals) ---
  const SocialNode = ({ node }: { node: NodeData }) => {
    const bgColors: any = {
      instagram: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500',
      youtube: 'bg-red-600',
      tiktok: 'bg-black',
      facebook: 'bg-blue-600',
    };
    return (
      <div 
        className="w-[75px] h-[95px] rounded-[12px] bg-white border border-gray-200 flex flex-col items-center justify-center p-2 cursor-grab active:cursor-grabbing shadow-md"
        style={{ position: 'absolute', left: node.x, top: node.y }}
        onMouseDown={(e) => handleNodePointerDown(e, node)}
      >
        <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center mb-2 shadow-sm ${bgColors[node.category || ''] || 'bg-gray-200'}`}>
           <span className="text-white text-[14px] font-bold tracking-tighter">
             {node.category?.substring(0, 1).toUpperCase()}{node.category === 'tiktok' && 'k'}
           </span>
        </div>
        <span className="text-[7.5px] uppercase tracking-widest font-bold block mb-0.5 text-gray-800">{node.title}</span>
        <span className="text-[5.5px] uppercase tracking-widest text-gray-500 text-center leading-tight">{node.stats}</span>
        
        <div 
           className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-crosshair hover:border-black hover:scale-125 transition-all shadow-sm"
           onMouseDown={(e) => handlePortPointerDown(e, node.id)}
           title="Drag to connect"
        />
      </div>
    );
  };

  const StepNode = ({ node }: { node: NodeData }) => {
    return (
      <div 
        className="w-[220px] h-[140px] rounded-[12px] bg-white border border-gray-200 flex flex-col p-4 cursor-grab active:cursor-grabbing shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-transform hover:-translate-y-1"
        style={{ position: 'absolute', left: node.x, top: node.y }}
        onMouseDown={(e) => handleNodePointerDown(e, node)}
      >
        <div className="flex gap-1.5 mb-4">
           <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
        </div>
        
        <div className="flex justify-between items-start">
           <div>
              <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">{node.badge}</span>
              <h4 className="text-[14px] font-bold text-gray-900 mb-4">{node.title}</h4>
           </div>
           {/* Open Funnel Dashboard Button */}
           <button onClick={(e) => { e.stopPropagation(); setActiveFunnelId(node.id); }} className="w-6 h-6 rounded bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors" title="Open Funnel Dashboard">
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
           </button>
        </div>
        
        <div className="flex gap-4 mt-auto border-t border-gray-100 pt-3">
           <div className="flex items-baseline gap-1">
              <span className="text-gray-900 text-[14px] font-bold">{node.stat1Value}</span>
              <span className="text-gray-400 text-[9px] uppercase tracking-widest">{node.stat1Label}</span>
           </div>
           <div className="flex items-baseline gap-1">
              <span className="text-gray-900 text-[14px] font-bold">{node.stat2Value}</span>
              <span className="text-gray-400 text-[9px] uppercase tracking-widest">{node.stat2Label}</span>
           </div>
        </div>
        
        <div 
           className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-crosshair hover:border-black transition-all shadow-sm"
           onMouseUp={(e) => handlePortPointerUp(e, node.id)}
        />
        <div 
           className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-crosshair hover:border-black transition-all shadow-sm"
           onMouseDown={(e) => handlePortPointerDown(e, node.id)}
        />
      </div>
    );
  };

  const AutomationNode = ({ node }: { node: NodeData }) => {
    return (
      <div 
        className="w-[240px] h-[120px] rounded-[10px] bg-slate-50 border border-gray-200 flex flex-col p-4 cursor-grab active:cursor-grabbing shadow-sm"
        style={{ position: 'absolute', left: node.x, top: node.y }}
        onMouseDown={(e) => handleNodePointerDown(e, node)}
      >
        <div className="flex items-start gap-3 mb-2">
           <div className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[14px]">{(node as any).icon}</span>
           </div>
           <div>
              <span className="text-[7.5px] uppercase tracking-widest font-bold text-gray-400 block mb-0.5">AUTOMATION</span>
              <h4 className="text-[11px] font-bold text-gray-800 leading-tight">{node.title}</h4>
           </div>
        </div>
        <p className="text-[10px] text-gray-500 leading-relaxed mb-auto line-clamp-2 pr-2">{node.desc}</p>
        <span className="text-[9px] text-gray-400 block mt-3 font-mono font-medium">{node.stats}</span>

        <div 
           className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-50 border border-gray-400 rounded-full cursor-crosshair hover:border-black transition-all shadow-sm"
           onMouseUp={(e) => handlePortPointerUp(e, node.id)}
        />
        <div 
           className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-50 border border-gray-400 rounded-full cursor-crosshair hover:border-black transition-all shadow-sm"
           onMouseDown={(e) => handlePortPointerDown(e, node.id)}
        />
      </div>
    )
  }

  // Restore the normal ASENZO page layout, integrating the pure white container.
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full pb-32">
      
      {/* Overview/Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Content Strategy</h2>
          <p className="text-[14px] text-muted-foreground mt-1">Build the content system behind your personal brand.</p>
          <div className="flex items-center gap-3 mt-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> ICP Connected</span>
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> Foundation Active</span>
             <span>Last Review: 2 Days Ago</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-[8px] p-4 flex gap-8 items-center">
            <div>
               <span className="block text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Primary Goal</span>
               <span className="text-[13px] font-bold text-foreground">Generate Qualified Conversations</span>
            </div>
            <div>
               <span className="block text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Audience</span>
               <span className="text-[13px] font-bold text-foreground">Service Founders</span>
            </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-1 bg-card border border-border rounded-[12px] p-6">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Foundation Context</h3>
                <div className="space-y-4 text-[13px]">
                   <div>
                      <span className="font-bold text-foreground block">Target Audience (ICP)</span>
                      <span className="text-muted-foreground">B2B Coaches / Consultants / Service Founders paying $3k+ for growth.</span>
                   </div>
                   <div>
                      <span className="font-bold text-foreground block">Primary Pain</span>
                      <span className="text-muted-foreground">Creating content consistently but failing to generate qualified inbound conversations.</span>
                   </div>
                   <div>
                      <span className="font-bold text-foreground block">Core Desire</span>
                      <span className="text-muted-foreground">Predictable inbound channel without paid ads.</span>
                   </div>
                </div>
                <button className="mt-6 text-[11px] font-bold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors mix-blend-difference flex items-center gap-1">
                   View Foundation <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
             </div>
             <div className="lg:col-span-2 bg-card border border-border rounded-[12px] p-6 relative overflow-hidden">
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
                         <div className="bg-muted/30 p-3 rounded-[6px]">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground block mb-1">Recommended Action</span>
                            <span className="text-[13px] text-foreground font-medium">{signal.recommendation}</span>
                         </div>
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
                     <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border border-border/50 px-1.5 py-0.5 rounded relative z-10">{pillar.funnel}</span>
                        <span className="material-symbols-outlined text-[16px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                     </div>
                     <h4 className="text-[16px] font-bold text-foreground mb-1">{pillar.name}</h4>
                     <p className="text-[12px] text-muted-foreground mb-4 line-clamp-2">{pillar.description}</p>
                     
                     <div className="mt-auto">
                        <div className="flex justify-between items-end mb-1">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Performance</span>
                           <span className="text-[14px] font-bold text-foreground">{pillar.performance}%</span>
                        </div>
                        <div className="w-full bg-border h-1.5 rounded-full overflow-hidden mb-3">
                           <div className={`h-full rounded-full ${pillar.performance > 80 ? 'bg-success' : pillar.performance > 60 ? 'bg-foreground' : 'bg-warning'}`} style={{width: `${pillar.performance}%`}}></div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border/50">
                           <span className="text-[11px] font-semibold text-muted-foreground">{pillar.contentCount} assets</span>
                           <span className="text-[11px] font-bold text-foreground px-2 py-0.5 bg-muted/50 rounded">{pillar.status}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          </div>

          {/* Strategic Setup / Distribution */}
          <div className="bg-card border border-border rounded-[12px] p-6">
             <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-6">Funnel Distribution Intelligence</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="col-span-1">
                   {/* Mock Visual representation */}
                   <div className="flex w-full h-[60px] rounded-[8px] overflow-hidden">
                      <div className="bg-foreground/80 h-full flex items-center justify-center text-background font-bold text-[12px]" style={{width: '60%'}}>TOF 60%</div>
                      <div className="bg-foreground/50 h-full flex items-center justify-center text-background font-bold text-[12px]" style={{width: '30%'}}>MOF 30%</div>
                      <div className="bg-foreground/20 h-full flex items-center justify-center text-foreground font-bold text-[12px]" style={{width: '10%'}}>BOF 10%</div>
                   </div>
                </div>
                <div className="col-span-2 space-y-3">
                   <div className="bg-background border border-border/50 p-4 rounded-[8px] flex items-start gap-3">
                      <span className="material-symbols-outlined text-[18px] text-foreground mt-0.5">insights</span>
                      <div>
                         <span className="text-[13px] font-bold text-foreground block mb-1">Heavy TOF Concentration</span>
                         <span className="text-[13px] text-muted-foreground">Your TOF content is driving 84% of your reach, but BOF volume is too low (10%) to reliably capture intent.</span>
                      </div>
                   </div>
                   <div className="bg-tertiary/5 border border-tertiary/20 p-4 rounded-[8px] flex items-start gap-3">
                      <span className="material-symbols-outlined text-[18px] text-tertiary mt-0.5">strategy</span>
                      <div>
                         <span className="text-[13px] font-bold text-tertiary block mb-1">Recommendation</span>
                         <span className="text-[13px] text-foreground">Shift 10% of production capacity toward BOF Pain Point resolution. Create 2 direct objection-handling formats next week.</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- ARCHITECTURE TAB --- */}
      {activeTab === "architecture" && (
        <div className="bg-white border border-border shadow-xl rounded-[16px] h-[800px] flex flex-col relative overflow-hidden">
           
           {/* Embedded Header inside the architecture canvas frame */}
           <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white z-20 shadow-sm relative">
              <div>
                 <h3 className="text-[13px] font-bold text-black flex items-center gap-2">
                    Conversion Architecture Canvas
                    <span className="text-[10px] bg-black/5 text-black px-2 py-0.5 rounded">{activeFunnelData}</span>
                 </h3>
                 <span className="text-[11px] text-gray-500">Map content paths to conversion outcomes.</span>
              </div>
              <div className="flex gap-2">
                 {/* Replaced 'Add Campaign' with 'Add Funnel' */}
                 <button onClick={() => setShowAddFunnelModal(true)} className="text-[11px] font-bold border border-gray-200 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors bg-white shadow-sm">+ Add Funnel</button>
                 <button onClick={() => setShowAddNodeModal(true)} className="text-[11px] font-bold border border-black bg-black text-white px-3 py-1.5 rounded hover:bg-black/90 transition-colors shadow-sm">+ Add Node</button>
              </div>
           </div>
           
           <div className="flex-1 bg-white relative overflow-auto" ref={canvasRef}>
              <div className="relative min-w-[2000px] min-h-[1200px] p-8">
                 
                 {/* Light mode dotted background pattern */}
                 <div 
                    className="absolute inset-0 pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(0,0,0,0.1) 1.5px, transparent 0)', backgroundSize: '36px 36px' }}
                 />

                 {/* Edges SVG Layer */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {/* Fixed edges */}
                    {edges.map(edge => (
                      <path 
                        key={edge.id}
                        d={drawEdge(edge.from, edge.to)}
                        stroke="rgba(0,0,0,0.25)"
                        strokeWidth="1.5"
                        strokeDasharray="4,4"
                        fill="none"
                      />
                    ))}
                    {/* Active dragging edge */}
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

                 {/* Real Nodes */}
                 {nodes.map(node => {
                    if (node.type === 'social') return <SocialNode key={node.id} node={node} />;
                    if (node.type === 'step') return <StepNode key={node.id} node={node} />;
                    if (node.type === 'automation') return <AutomationNode key={node.id} node={node} />;
                    return null;
                 })}
              </div>
           </div>

           {/* Central White Footer Pill */}
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full px-10 py-4 flex items-center gap-10 shadow-[0_15px_40px_rgba(0,0,0,0.15)] z-50 pointer-events-none">
              <div className="flex flex-col items-center mr-2">
                 <span className="text-gray-400 text-[8px] uppercase tracking-[0.2em] font-bold mb-0.5">Projected</span>
                 <span className="text-gray-400 text-[8px] uppercase tracking-[0.2em] font-bold">/ Month</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
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
                 <span className="text-gray-400 text-[8px] uppercase tracking-widest font-bold mt-0.5">Calls Booked</span>
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-emerald-500 text-[18px] font-bold tracking-tight">17</span>
                 <span className="text-gray-400 text-[8px] uppercase tracking-widest font-bold mt-0.5">Deals Closed</span>
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-emerald-500 text-[18px] font-bold tracking-tight">$51K</span>
                 <span className="text-gray-400 text-[8px] uppercase tracking-widest font-bold mt-0.5">Revenue</span>
              </div>
           </div>
        </div>
      )}

      {/* --- FORMATS TAB --- */}
      {activeTab === "formats" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[ 
             { name: "Viral Video Format", focus: "Reach", uses: 12, rating: "4.8" },
             { name: "Contrarian Do vs Don't", focus: "Authority", uses: 8, rating: "4.5" },
             { name: "Rule of 3 Pattern", focus: "Saves", uses: 15, rating: "4.2" },
             { name: "Cost of Inaction Sales", focus: "Conversion", uses: 3, rating: "4.9" },
           ].map((formatItem, i) => (
             <div key={i} className="bg-card border border-border rounded-[12px] p-5 hover:border-foreground/30 transition-colors cursor-pointer block relative">
               <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2 border border-border/50 self-start px-1.5 py-0.5 rounded w-max bg-muted/20">{formatItem.focus}</span>
               <h4 className="text-[15px] font-bold text-foreground mb-1">{formatItem.name}</h4>
               <p className="text-[12px] text-muted-foreground mb-6">Structured for optimal performance in the {formatItem.focus.toLowerCase()} stage.</p>
               <div className="flex justify-between border-t border-border/50 pt-3 text-[12px]">
                 <span className="text-muted-foreground font-medium">{formatItem.uses} uses</span>
                 <span className="text-foreground font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">star</span> {formatItem.rating}</span>
               </div>
             </div>
           ))}
        </div>
      )}

      {/* MODALS */}
      {showAddFunnelModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-card border border-border rounded-[12px] max-w-lg w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-[15px] font-bold uppercase tracking-widest text-foreground">Add Funnel</h3>
                 <button onClick={() => setShowAddFunnelModal(false)} className="text-muted-foreground hover:text-foreground"><span className="material-symbols-outlined">close</span></button>
              </div>
              <div className="space-y-4 overflow-y-auto">
                 <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Funnel Name</label>
                    <input id="campaignNameInput" type="text" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none focus:border-foreground/40" placeholder="e.g. Founder Authority Funnel" />
                 </div>
                 <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Objective</label>
                    <select className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none focus:border-foreground/40">
                       <option>Generate Qualified Calls</option>
                       <option>Build Audience Trust</option>
                       <option>Launch New Offer</option>
                    </select>
                 </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border/50">
                 <button onClick={() => setShowAddFunnelModal(false)} className="px-4 py-2 text-[12px] font-bold text-muted-foreground hover:text-foreground">Cancel</button>
                 <button onClick={() => { setActiveFunnelData((document.getElementById('campaignNameInput') as HTMLInputElement).value || "New Funnel"); setShowAddFunnelModal(false); }} className="px-5 py-2.5 bg-foreground text-background text-[12px] font-bold rounded-[6px] hover:bg-foreground/90 flex items-center gap-2">Create Funnel <span className="material-symbols-outlined text-[14px]">arrow_forward</span></button>
              </div>
           </div>
        </div>
      )}

      {showAddNodeModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-card border border-border rounded-[12px] max-w-lg w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-[15px] font-bold uppercase tracking-widest text-foreground">Add Context Node</h3>
                 <button onClick={() => setShowAddNodeModal(false)} className="text-muted-foreground hover:text-foreground"><span className="material-symbols-outlined">close</span></button>
              </div>
              <div className="space-y-4 overflow-y-auto">
                 <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Node Type</label>
                    <select id="nodeTypeInput" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none">
                       <option value="Reel">Reel</option>
                       <option value="Carousel">Carousel</option>
                       <option value="Story Sequence">Story Sequence</option>
                       <option value="Newsletter">Newsletter</option>
                       <option value="Lead Magnet">Lead Magnet</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Node Name</label>
                    <input id="nodeNameInput" type="text" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none focus:border-foreground/40" placeholder="e.g. 3 Founder Mistakes" />
                 </div>
                 <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Funnel Stage</label>
                    <select id="nodeStageInput" className="w-full bg-background border border-border/50 rounded-[6px] p-3 text-[14px] outline-none">
                       <option value="TOF">TOF</option>
                       <option value="MOF">MOF</option>
                       <option value="BOF">BOF</option>
                    </select>
                 </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border/50">
                 <button onClick={() => setShowAddNodeModal(false)} className="px-4 py-2 text-[12px] font-bold text-muted-foreground hover:text-foreground">Cancel</button>
                 <button onClick={() => {
                    const name = (document.getElementById('nodeNameInput') as HTMLInputElement).value || "New Content Piece";
                    const type = (document.getElementById('nodeTypeInput') as HTMLSelectElement).value;
                    const stage = (document.getElementById('nodeStageInput') as HTMLSelectElement).value;
                    // We append it as a "step" so it gets the big card UI for now
                    setNodes([...nodes, { id: Date.now().toString(), type: 'step', badge: stage, title: name, stat1Label: 'views', stat1Value: '-', stat2Label: 'conv.', stat2Value: '-', x: 500, y: 300 }]);
                    setShowAddNodeModal(false);
                 }} className="px-5 py-2.5 bg-foreground text-background text-[12px] font-bold rounded-[6px] hover:bg-foreground/90 flex items-center gap-2">Add to Architecture <span className="material-symbols-outlined text-[14px]">add</span></button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
