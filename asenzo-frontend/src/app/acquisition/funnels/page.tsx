"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

// --- Node Types and Data ---
type NodeType = "traffic" | "step" | "automation";

interface NodeBase {
  id: string;
  x: number;
  y: number;
  type: NodeType;
}

interface TrafficNode extends NodeBase {
  type: "traffic";
  platform: string;
  followers: string;
  img: string | React.ReactNode; 
  color: string;
}

interface StepNode extends NodeBase {
  type: "step";
  step: string;
  title: string;
  stats: string;
  mockup: "optin" | "vsl" | "calendar" | "check" | "video";
}

interface AutomationNode extends NodeBase {
  type: "automation";
  icon: string;
  title: string;
  desc: string;
  stats: string;
}

type Node = TrafficNode | StepNode | AutomationNode;

const INITIAL_NODES: Node[] = [
  // Traffic
  { id: "tr-ig", type: "traffic", x: 100, y: 150, platform: "INSTAGRAM", followers: "5K followers", img: <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center p-0.5"><div className="w-full h-full border-[3px] border-white rounded-[10px] flex items-center justify-center"><div className="w-4 h-4 border-[3px] border-white rounded-full"></div></div></div>, color: "#E1306C" },
  { id: "tr-yt", type: "traffic", x: 100, y: 310, platform: "YOUTUBE", followers: "8K subscribers", img: <div className="bg-red-600 w-12 h-12 rounded-xl flex items-center justify-center"><div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div></div>, color: "#FF0000" },
  { id: "tr-tt", type: "traffic", x: 100, y: 470, platform: "TIKTOK", followers: "12K followers", img: <div className="bg-black w-12 h-12 rounded-xl flex items-center justify-center"><span className="text-white font-extrabold text-2xl" style={{textShadow: "2px 2px 0px #00F2FE, -2px -2px 0px #FE0058"}}>d</span></div>, color: "#000000" },
  { id: "tr-fb", type: "traffic", x: 100, y: 630, platform: "FACEBOOK", followers: "8K followers", img: <div className="bg-[#1877F2] w-12 h-12 rounded-xl flex items-end justify-center overflow-hidden"><span className="text-white font-bold text-4xl leading-none pr-2">f</span></div>, color: "#1877F2" },
  { id: "tr-x", type: "traffic", x: 100, y: 790, platform: "X (TWITTER)", followers: "6K followers", img: <div className="bg-black w-12 h-12 rounded-xl flex items-center justify-center"><span className="text-white font-bold text-3xl leading-none">𝕏</span></div>, color: "#000000" },
  { id: "tr-li", type: "traffic", x: 100, y: 950, platform: "LINKEDIN", followers: "5K followers", img: <div className="bg-[#0A66C2] w-12 h-12 rounded-xl flex items-center justify-center"><span className="text-white font-bold text-2xl leading-none">in</span></div>, color: "#0A66C2" },
  { id: "tr-meta", type: "traffic", x: 100, y: 1110, platform: "META ADS", followers: "N/A spend", img: <div className="bg-white border-2 border-slate-100 w-12 h-12 rounded-xl flex items-center justify-center"><span className="text-blue-600 font-extrabold text-[28px] leading-none">∞</span></div>, color: "#0668E1" },

  // Steps
  { id: "st-1", type: "step", x: 380, y: 480, step: "STEP 01", title: "Lead Magnet / Opt-In", stats: "1.5K visitors  |  475 leads  |  32%", mockup: "optin" },
  { id: "st-2", type: "step", x: 740, y: 480, step: "STEP 02", title: "Bridge Page (VSL)", stats: "825 views  |  333 completions  |  40%", mockup: "vsl" },
  { id: "st-3", type: "step", x: 1100, y: 480, step: "STEP 03", title: "Application / Book-a-Call", stats: "158 started  |  97 completed  |  61%", mockup: "calendar" },
  { id: "st-4", type: "step", x: 1460, y: 480, step: "STEP 04", title: "Confirmation Page", stats: "97 views  |  87 clicks  |  90% conv.", mockup: "check" },
  { id: "st-5", type: "step", x: 1820, y: 480, step: "STEP 05", title: "Sales Call", stats: "64 booked  |  17 showed  |  27%", mockup: "video" },

  // Automations
  { id: "au-ig", type: "automation", x: 380, y: 300, icon: "play_circle", title: "Instagram DM Automation", desc: "Automated responses for new followers. Follow-ups in 7 days, 30m...", stats: "" },
  { id: "au-nur", type: "automation", x: 380, y: 800, icon: "mail", title: "5-Day Email Nurture", desc: "Email sequence for new leads.\nSend 5 emails over 5 days.", stats: "~ 1K sent   |   214 opens" },
  { id: "au-rea", type: "automation", x: 380, y: 990, icon: "refresh", title: "Direct Lead Reactivation", desc: "Re-engage cold leads via email\nand retargeting.", stats: "~ 12 sent   |   4 replies" },
  
  { id: "au-app", type: "automation", x: 1100, y: 810, icon: "quickreply", title: "Automated Application Follow-up", desc: "Reminder sequence for incomplete applications. 3 email touches.", stats: "~ 53 sent   |   12 opens" },
  { id: "au-con", type: "automation", x: 1460, y: 810, icon: "notifications_active", title: "Booking Confirmation + Reminder", desc: "Send 2 SMS + calendar invite. Reminder 24h before call.", stats: "~ 48 sent   |   36 confirmed" },
  { id: "au-rec", type: "automation", x: 1820, y: 810, icon: "chat", title: "No-Show Recovery", desc: "Re-engage no-shows via email, SMS and retargeting.", stats: "~ 17 sent   |   5 rebooked" },
];

const INITIAL_EDGES = [
  // Traffics -> St-1
  { from: "tr-ig", to: "st-1" },
  { from: "tr-yt", to: "st-1" },
  { from: "tr-tt", to: "st-1" },
  { from: "tr-fb", to: "st-1" },
  { from: "tr-x", to: "st-1" },
  { from: "tr-li", to: "st-1" },
  { from: "tr-meta", to: "st-1" },
  // Inst -> Inst Autom
  { from: "tr-ig", to: "au-ig" },
  // Automations around Step 1
  { from: "au-ig", to: "st-1" },
  { from: "st-1", to: "au-nur" },
  { from: "st-1", to: "au-rea" },
  { from: "au-nur", to: "st-2" }, // jumps from nurture up to VSL
  // Spine
  { from: "st-1", to: "st-2" },
  { from: "st-2", to: "st-3" },
  { from: "st-3", to: "st-4" },
  { from: "st-4", to: "st-5" },
  // Automations per step
  { from: "st-3", to: "au-app" },
  { from: "au-app", to: "st-3" }, // bidirectional
  { from: "st-4", to: "au-con" },
  { from: "st-5", to: "au-rec" },
  { from: "au-rec", to: "st-5" }, // bidirectional
];

// Node width/height definitions to anchor lines
const SIZES = {
  traffic: { w: 100, h: 140 },
  step: { w: 260, h: 260 },
  automation: { w: 260, h: 150 },
};

export default function FunnelsPage() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [zoom, setZoom] = useState(0.65);
  const [pan, setPan] = useState({ x: 0, y: -50 });
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'button' || (e.target as HTMLElement).closest('.node-card')) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY };
    panOrigin.current = { ...pan };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: panOrigin.current.x + (e.clientX - panStart.current.x),
        y: panOrigin.current.y + (e.clientY - panStart.current.y)
      });
    }
  }, [isPanning]);

  const handleMouseUp = () => setIsPanning(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom(z => Math.min(2, Math.max(0.2, z - e.deltaY * 0.005)));
    } else {
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  };

  const getPort = (node: Node, side: "L"|"R"|"T"|"B") => {
    const s = SIZES[node.type];
    if (side === "L") return { x: node.x, y: node.y + s.h / 2 };
    if (side === "R") return { x: node.x + s.w, y: node.y + s.h / 2 };
    if (side === "T") return { x: node.x + s.w / 2, y: node.y };
    return { x: node.x + s.w / 2, y: node.y + s.h }; // "B"
  };

  const drawBezier = (from: ReturnType<typeof getPort>, to: ReturnType<typeof getPort>) => {
    // Generate an S-curve or simple curve
    const dx = to.x - from.x;
    const dy = Math.abs(to.y - from.y);
    const m1 = { x: from.x + dx * 0.4, y: from.y };
    const m2 = { x: to.x - dx * 0.4, y: to.y };
    // If vertical path is more prominent
    if (Math.abs(from.x - to.x) < 50) {
      return `M ${from.x} ${from.y} C ${from.x} ${from.y + (to.y-from.y)/2}, ${to.x} ${from.y + (to.y-from.y)/2}, ${to.x} ${to.y}`;
    }
    return `M ${from.x} ${from.y} C ${m1.x} ${m1.y}, ${m2.x} ${m2.y}, ${to.x} ${to.y}`;
  };

  const generateEdgePath = (edge: { from: string, to: string }) => {
    const fromN = nodes.find(n => n.id === edge.from);
    const toN = nodes.find(n => n.id === edge.to);
    if (!fromN || !toN) return "";
    
    // Auto port routing heuristics to match image
    let fPort = "R" as const;
    let tPort = "L" as const;

    if (fromN.type === "traffic" && toN.id === "au-ig") { fPort = "R"; tPort = "L"; }
    else if (fromN.type === "traffic") { fPort = "R"; tPort = "L"; }
    else if (fromN.id === "au-ig" && toN.id === "st-1") { fPort = "B"; tPort = "T"; }
    else if (fromN.id === "st-1" && toN.id === "au-nur") { fPort = "B"; tPort = "T"; }
    else if (fromN.id === "st-1" && toN.id === "au-rea") { fPort = "B"; tPort = "L"; }
    else if (fromN.id === "au-nur" && toN.id === "st-2") { fPort = "R"; tPort = "B"; }
    else if (fromN.type === "step" && toN.type === "automation") { fPort = "B"; tPort = "T"; }
    else if (fromN.type === "automation" && toN.type === "step") { fPort = "T"; tPort = "B"; }
    else if (fromN.type === "step" && toN.type === "step") { fPort = "R"; tPort = "L"; }

    // Special offsets to avoid overlapping arrowheads if bidirectional
    const isBidirectional = INITIAL_EDGES.some(e => e.from === edge.to && e.to === edge.from);
    let p1 = getPort(fromN, fPort);
    let p2 = getPort(toN, tPort);

    if (isBidirectional) {
       if (fPort === "B") p1 = { x: p1.x - 20, y: p1.y };
       if (tPort === "B") p2 = { x: p2.x - 20, y: p2.y };
       if (fPort === "T") p1 = { x: p1.x + 20, y: p1.y };
       if (tPort === "T") p2 = { x: p2.x + 20, y: p2.y };
    }

    return drawBezier(p1, p2);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] font-sans">
      
      {/* Zoom controls */}
      <div className="absolute bottom-6 right-6 z-50 flex items-center bg-white shadow-lg border border-slate-100 rounded-full overflow-hidden p-1">
        <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold">−</button>
        <div className="w-12 text-center text-[12px] font-bold text-slate-700">{Math.round(zoom * 100)}%</div>
        <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold">+</button>
      </div>

      {/* Floating Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden relative isolate"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
      >
        {/* Dot Pattern Background */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#E2E8F0 1.5px, transparent 1.5px)', backgroundSize: `24px 24px`, backgroundPosition: `${pan.x}px ${pan.y}px` }} />

        {/* Scaled Canvas Layer */}
        <div 
          className="absolute origin-top-left"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {/* SVG Arrows layer */}
          <svg className="absolute top-0 left-0 overflow-visible pointer-events-none" style={{ width: 3000, height: 2000 }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#CBD5E1" />
              </marker>
            </defs>
            {INITIAL_EDGES.map((edge, i) => (
              <path 
                key={i} 
                d={generateEdgePath(edge)} 
                fill="none" 
                stroke="#CBD5E1" 
                strokeWidth="2.5" 
                strokeDasharray="6 6"
                markerEnd="url(#arrow)" 
              />
            ))}
          </svg>

          {/* HTML Nodes layer */}
          {nodes.map(node => {
            if (node.type === "traffic") return <TrafficCard key={node.id} node={node as TrafficNode} />;
            if (node.type === "step") return <StepCard key={node.id} node={node as StepNode} />;
            if (node.type === "automation") return <AutomationCard key={node.id} node={node as AutomationNode} />;
            return null;
          })}
        </div>
      </div>
      
      {/* Floating Bottom Metrics */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm shadow-xl border border-slate-100 rounded-3xl py-4 px-10 flex items-center gap-10 min-w-max">
         <div className="text-center pr-6 border-r border-slate-100">
            <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-400">PROJECTED</h4>
            <p className="text-[13px] font-bold text-slate-600 mt-0.5">7 DAYS</p>
         </div>
         <div className="text-center">
            <p className="text-[18px] font-black text-slate-900 leading-none mb-1.5">475</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Leads</p>
         </div>
         <div className="text-center">
            <p className="text-[18px] font-black text-slate-900 leading-none mb-1.5">150</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Applications</p>
         </div>
         <div className="text-center">
            <p className="text-[18px] font-black text-slate-900 leading-none mb-1.5">97</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Calls Booked</p>
         </div>
         <div className="text-center">
            <p className="text-[18px] font-black text-slate-900 leading-none mb-1.5">17</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Deals Closed</p>
         </div>
         <div className="text-center pl-6 border-l border-slate-100">
            <p className="text-[18px] font-black text-slate-900 leading-none mb-1.5">$51K</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Revenue</p>
         </div>
      </div>
    </div>
  );
}

// ─── Subcomponents ─────────────────────────────────────────────────────────────

function TrafficCard({ node }: { node: TrafficNode }) {
  return (
    <div className="absolute node-card bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center justify-center p-4 hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
      style={{ left: node.x, top: node.y, width: SIZES.traffic.w, height: SIZES.traffic.h }}>
      <div className="mb-3">{node.img}</div>
      <p className="text-[10px] font-black text-slate-700 tracking-widest leading-none">{node.platform}</p>
      <p className="text-[9px] font-bold text-slate-400 mt-1.5 tracking-tight">{node.followers}</p>
    </div>
  );
}

function StepCard({ node }: { node: StepNode }) {
  return (
    <div className="absolute node-card bg-white rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow cursor-pointer"
      style={{ left: node.x, top: node.y, width: SIZES.step.w, height: SIZES.step.h }}>
      {/* Mac window dots */}
      <div className="flex items-center gap-1.5 px-4 pt-4 pb-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
      </div>
      {/* Mockup area */}
      <div className="px-4 py-1 flex-1">
         <div className="w-full h-full border-2 border-slate-100 rounded-xl bg-slate-50 overflow-hidden flex flex-col p-3">
             <div className="bg-slate-200 h-2 w-1/3 rounded-full mb-3" />
             {node.mockup === "optin" && (
                <div className="space-y-2 mt-2">
                   <div className="bg-white border text-center border-slate-200 h-8 rounded-lg flex items-center px-3"><div className="w-20 h-1.5 bg-slate-100 rounded-full" /></div>
                   <div className="bg-white border text-center border-slate-200 h-8 rounded-lg flex items-center px-3"><div className="w-24 h-1.5 bg-slate-100 rounded-full" /></div>
                </div>
             )}
             {node.mockup === "vsl" && (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg bg-white mt-1">
                   <span className="material-symbols-outlined text-slate-300 text-3xl">image</span>
                </div>
             )}
             {node.mockup === "calendar" && (
                <div className="flex-1 flex gap-2 mt-1">
                    <div className="flex-1 space-y-1">
                       <div className="bg-slate-200 h-2 w-full rounded-full" />
                       <div className="bg-slate-200 h-2 w-full rounded-full" />
                       <div className="bg-slate-200 h-2 w-3/4 rounded-full" />
                    </div>
                    <div className="w-12 h-full bg-white border border-slate-200 rounded-md flex flex-wrap content-start p-1 gap-0.5">
                       {[...Array(12)].map((_,i) => <div key={i} className="w-2 h-2 bg-slate-200 rounded-[1px]"/>)}
                    </div>
                </div>
             )}
             {node.mockup === "check" && (
                <div className="flex-1 flex flex-col items-center justify-center">
                   <div className="w-10 h-10 rounded-full border-4 border-slate-700 flex items-center justify-center mb-2">
                       <span className="material-symbols-outlined text-slate-700 text-xl font-bold">check</span>
                   </div>
                   <div className="w-16 h-2 rounded-full bg-slate-200" />
                </div>
             )}
             {node.mockup === "video" && (
                <div className="flex-1 flex flex-col items-center p-2">
                   <div className="w-8 h-8 rounded-full border-2 border-slate-300 mx-auto mt-1 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-300 text-sm">person</span>
                   </div>
                   <div className="w-4 h-4 bg-slate-700 rounded-full mt-auto mb-1"></div>
                </div>
             )}
         </div>
      </div>
      {/* Node Info */}
      <div className="p-4 pt-3 flex-1 flex flex-col justify-end">
        <p className="text-[9px] font-black text-slate-400 tracking-[0.1em] mb-1">{node.step}</p>
        <h3 className="text-[16px] font-black text-slate-900 leading-tight tracking-tight">{node.title}</h3>
        <p className="text-[11px] font-semibold text-slate-500 mt-3 pt-3 border-t border-slate-100 flex gap-2">
           {node.stats.split("|").map((p,i) => <span key={i}>{p.trim()}</span>).reduce((prev, curr) => <>{prev}<span className="text-slate-300 mx-1">|</span>{curr}</>)}
        </p>
      </div>
    </div>
  );
}

function AutomationCard({ node }: { node: AutomationNode }) {
  return (
    <div className="absolute node-card bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
      style={{ left: node.x, top: node.y, width: SIZES.automation.w, height: SIZES.automation.h }}>
      <div className="p-4 flex gap-3">
         <div className="w-10 h-10 shrink-0 border border-slate-100 rounded-xl bg-white flex items-center justify-center shadow-sm">
             <span className="material-symbols-outlined text-[18px] text-slate-400">{node.icon}</span>
         </div>
         <div>
            <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase mb-1">Automation</p>
            <h4 className="text-[13px] font-black text-slate-900 leading-tight mb-1">{node.title}</h4>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed whitespace-pre-line">{node.desc}</p>
         </div>
      </div>
      {node.stats && (
         <div className="px-4 py-3 border-t border-slate-100 mt-auto flex items-center gap-2">
            <p className="text-[11px] font-semibold text-slate-500 w-full flex items-center justify-between px-2">
               {node.stats.split("|").map((p,i) => <span key={i}>{p.trim()}</span>).reduce((prev, curr) => <>{prev}<span className="text-slate-300">|</span>{curr}</>)}
            </p>
         </div>
      )}
    </div>
  );
}
