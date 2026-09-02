"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
type NodeType = "traffic" | "capture" | "nurture" | "conversion" | "recovery" | "outcome" | "automation";
type FunnelNode = {
  id: string; x: number; y: number; label: string; sublabel: string; type: NodeType;
  metrics: { leads: number; convRate: string; revenue: number };
};
type FunnelEdge = { id: string; from: string; to: string; convRate: string };

// ─── Node colours — light theme ───────────────────────────────────────────────
const NODE_STYLE: Record<NodeType, { border: string; bg: string; dot: string; text: string }> = {
  traffic:    { border: "#BFDBFE", bg: "#EFF6FF", dot: "#2563EB", text: "#1D4ED8" },
  capture:    { border: "#DDD6FE", bg: "#F5F3FF", dot: "#7C3AED", text: "#6D28D9" },
  nurture:    { border: "#FDE68A", bg: "#FFFBEB", dot: "#D97706", text: "#B45309" },
  conversion: { border: "#BBF7D0", bg: "#F0FDF4", dot: "#16A34A", text: "#15803D" },
  recovery:   { border: "#FECACA", bg: "#FFF1F2", dot: "#DC2626", text: "#B91C1C" },
  outcome:    { border: "#A5F3FC", bg: "#ECFEFF", dot: "#0891B2", text: "#0E7490" },
  automation: { border: "#E2E8F0", bg: "#F8FAFC", dot: "#64748B", text: "#475569" },
};

const NODE_TYPES: { type: NodeType; label: string }[] = [
  { type: "traffic", label: "Traffic Source" },
  { type: "capture", label: "Lead Capture" },
  { type: "nurture", label: "Nurture" },
  { type: "conversion", label: "Conversion" },
  { type: "recovery", label: "Recovery" },
  { type: "outcome", label: "Outcome" },
  { type: "automation", label: "Automation" },
];

const TEMPLATES = {
  "High-Ticket": {
    nodes: [
      { id: "t1", x: 60, y: 80, label: "Instagram", sublabel: "125K followers", type: "traffic" as NodeType, metrics: { leads: 0, convRate: "", revenue: 0 } },
      { id: "t2", x: 280, y: 80, label: "Lead Magnet", sublabel: "7-Day Guide", type: "capture" as NodeType, metrics: { leads: 1284, convRate: "38%", revenue: 0 } },
      { id: "t3", x: 500, y: 40, label: "Email Nurture", sublabel: "5-Day Sequence", type: "nurture" as NodeType, metrics: { leads: 0, convRate: "", revenue: 0 } },
      { id: "t4", x: 500, y: 130, label: "DM Automation", sublabel: "Comment GUIDE", type: "automation" as NodeType, metrics: { leads: 0, convRate: "", revenue: 0 } },
      { id: "t5", x: 720, y: 80, label: "VSL / Application", sublabel: "High-ticket qualifier", type: "conversion" as NodeType, metrics: { leads: 287, convRate: "22%", revenue: 0 } },
      { id: "t6", x: 940, y: 40, label: "Sales Call", sublabel: "1-1 call", type: "conversion" as NodeType, metrics: { leads: 97, convRate: "34%", revenue: 0 } },
      { id: "t7", x: 940, y: 130, label: "No-Show Recovery", sublabel: "Automation", type: "recovery" as NodeType, metrics: { leads: 0, convRate: "", revenue: 0 } },
      { id: "t8", x: 1160, y: 80, label: "Client", sublabel: "Paid programme", type: "outcome" as NodeType, metrics: { leads: 17, convRate: "17%", revenue: 51000 } },
    ],
    edges: [
      { id: "e1", from: "t1", to: "t2", convRate: "4.8%" },
      { id: "e2", from: "t2", to: "t3", convRate: "68%" },
      { id: "e3", from: "t2", to: "t4", convRate: "32%" },
      { id: "e4", from: "t3", to: "t5", convRate: "24%" },
      { id: "e5", from: "t4", to: "t5", convRate: "18%" },
      { id: "e6", from: "t5", to: "t6", convRate: "34%" },
      { id: "e7", from: "t6", to: "t7", convRate: "22%" },
      { id: "e8", from: "t6", to: "t8", convRate: "17%" },
    ],
  },
};

// ─── Component ─────────────────────────────────────────────────────────────────
export default function FunnelsPage() {
  const [nodes, setNodes] = useState<FunnelNode[]>(TEMPLATES["High-Ticket"].nodes);
  const [edges, setEdges] = useState<FunnelEdge[]>(TEMPLATES["High-Ticket"].edges);
  const [selectedNode, setSelectedNode] = useState<FunnelNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isPanning, setIsPanning] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [outreachOpen, setOutreachOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [drawingEdge, setDrawingEdge] = useState<{ fromId: string; x: number; y: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const [metricsMode, setMetricsMode] = useState<"actual" | "projected">("actual");

  // SVG position helpers
  const toCanvas = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return { x: (clientX - rect.left - pan.x) / zoom, y: (clientY - rect.top - pan.y) / zoom };
  };

  const getNodeCenter = (node: FunnelNode) => ({ x: node.x + 90, y: node.y + 36 });
  const getNodePort = (node: FunnelNode) => ({ x: node.x + 182, y: node.y + 36 });

  // Canvas events
  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target === svgRef.current) {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY };
      panOrigin.current = { ...pan };
      setSelectedNode(null);
      setSelectedEdge(null);
      setOutreachOpen(false);
    }
  };

  const handleSvgMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      setPan({ x: panOrigin.current.x + (e.clientX - panStart.current.x), y: panOrigin.current.y + (e.clientY - panStart.current.y) });
    }
    if (draggingNode) {
      const pos = toCanvas(e.clientX, e.clientY);
      setNodes(ns => ns.map(n => n.id === draggingNode ? { ...n, x: pos.x - dragOffset.x, y: pos.y - dragOffset.y } : n));
      if (selectedNode?.id === draggingNode) {
        setSelectedNode(s => s ? { ...s, x: toCanvas(e.clientX, e.clientY).x - dragOffset.x, y: toCanvas(e.clientX, e.clientY).y - dragOffset.y } : s);
      }
    }
    if (drawingEdge) {
      setMousePos(toCanvas(e.clientX, e.clientY));
    }
  }, [isPanning, draggingNode, drawingEdge, dragOffset, pan, zoom]);

  const handleSvgMouseUp = () => {
    setIsPanning(false);
    setDraggingNode(null);
    setDrawingEdge(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.min(2, Math.max(0.3, z - e.deltaY * 0.001)));
  };

  const startDragNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const pos = toCanvas(e.clientX, e.clientY);
    setDraggingNode(nodeId);
    setDragOffset({ x: pos.x - node.x, y: pos.y - node.y });
  };

  const startDrawEdge = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const pos = toCanvas(e.clientX, e.clientY);
    setDrawingEdge({ fromId: nodeId, x: pos.x, y: pos.y });
  };

  const dropOnNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (drawingEdge && drawingEdge.fromId !== nodeId) {
      const newEdge: FunnelEdge = { id: `edge-${Date.now()}`, from: drawingEdge.fromId, to: nodeId, convRate: "" };
      setEdges(es => [...es, newEdge]);
      setDrawingEdge(null);
    }
  };

  const addNode = (type: NodeType) => {
    const n: FunnelNode = { id: `n-${Date.now()}`, x: 200 + Math.random() * 300, y: 100 + Math.random() * 200, label: NODE_TYPES.find(t => t.type === type)?.label || type, sublabel: "", type, metrics: { leads: 0, convRate: "", revenue: 0 } };
    setNodes(ns => [...ns, n]);
    setShowAddMenu(false);
  };

  const deleteNode = (id: string) => {
    setNodes(ns => ns.filter(n => n.id !== id));
    setEdges(es => es.filter(e => e.from !== id && e.to !== id));
    setSelectedNode(null);
  };

  const autoArrange = () => {
    const cols: string[][] = [];
    const placed = new Set<string>();
    const starts = nodes.filter(n => !edges.some(e => e.to === n.id));
    const bfs = (ids: string[], col: number) => {
      if (!ids.length) return;
      cols[col] = ids;
      ids.forEach(id => placed.add(id));
      const next = [...new Set(edges.filter(e => ids.includes(e.from) && !placed.has(e.to)).map(e => e.to))];
      if (next.length) bfs(next, col + 1);
    };
    bfs(starts.map(n => n.id), 0);
    nodes.filter(n => !placed.has(n.id)).forEach(n => { cols[cols.length] = [n.id]; });
    const updated = [...nodes];
    cols.forEach((col, ci) => col.forEach((id, ri) => {
      const idx = updated.findIndex(n => n.id === id);
      if (idx !== -1) { updated[idx] = { ...updated[idx], x: 60 + ci * 220, y: 60 + ri * 110 }; }
    }));
    setNodes(updated);
  };

  // Bezier path
  const bezier = (x1: number, y1: number, x2: number, y2: number) => {
    const cx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
  };

  // Totals
  const totals = { leads: 1284, apps: 287, calls: 97, closed: 17, revenue: 51000 };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="shrink-0 h-12 border-b border-slate-200 flex items-center gap-2 px-5 bg-white z-10">
        <span className="text-[13px] font-bold text-slate-800 mr-2">Funnel Architect</span>
        <div className="w-px h-4 bg-slate-200 mx-1" />

        {/* Add Node */}
        <div className="relative">
          <button onClick={() => { setShowAddMenu(m => !m); setShowTemplates(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg hover:bg-slate-50">
            <span className="material-symbols-outlined text-[13px]">add</span>Add Node
          </button>
          {showAddMenu && (
            <div className="absolute top-10 left-0 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-44 z-30">
              {NODE_TYPES.map(nt => (
                <button key={nt.type} onClick={() => addNode(nt.type)}
                  className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: NODE_STYLE[nt.type].dot }} />{nt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => { setShowTemplates(t => !t); setShowAddMenu(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg hover:bg-slate-50">
            <span className="material-symbols-outlined text-[13px]">view_quilt</span>Templates
          </button>
          {showTemplates && (
            <div className="absolute top-10 left-0 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-52 z-30">
              {Object.keys(TEMPLATES).map(name => (
                <button key={name} onClick={() => { setNodes(TEMPLATES[name as keyof typeof TEMPLATES].nodes); setEdges(TEMPLATES[name as keyof typeof TEMPLATES].edges); setShowTemplates(false); setSelectedNode(null); setPan({ x: 40, y: 40 }); }}
                  className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50">{name}</button>
              ))}
            </div>
          )}
        </div>

        <button onClick={autoArrange}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg hover:bg-slate-50">
          <span className="material-symbols-outlined text-[13px]">auto_fix_high</span>Auto Arrange
        </button>

        <div className="ml-auto flex items-center gap-2">
          {/* Metrics toggle */}
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            {(["actual","projected"] as const).map(m => (
              <button key={m} onClick={() => setMetricsMode(m)}
                className={`px-3 py-1.5 text-[10px] font-bold capitalize transition-colors ${metricsMode === m ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}>{m}</button>
            ))}
          </div>
          {/* Zoom */}
          <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="w-7 h-7 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 flex items-center justify-center text-[13px] font-bold">−</button>
          <span className="text-[11px] font-semibold text-slate-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="w-7 h-7 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 flex items-center justify-center text-[13px] font-bold">+</button>
          <button onClick={() => { setZoom(1); setPan({ x: 40, y: 40 }); }} className="px-2 py-1 border border-slate-200 text-slate-500 text-[10px] rounded hover:bg-slate-50">Reset</button>
          <button className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800">Save</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden" style={{ cursor: isPanning ? "grabbing" : draggingNode ? "grabbing" : "default" }}>
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full"
            onMouseDown={handleSvgMouseDown}
            onMouseMove={handleSvgMouseMove}
            onMouseUp={handleSvgMouseUp}
            onMouseLeave={handleSvgMouseUp}
            onWheel={handleWheel}
            style={{ userSelect: "none" }}>
            {/* Dot grid */}
            <defs>
              <pattern id="grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#E2E8F0" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              {/* Edges */}
              {edges.map(edge => {
                const from = nodes.find(n => n.id === edge.from);
                const to = nodes.find(n => n.id === edge.to);
                if (!from || !to) return null;
                const fp = getNodePort(from);
                const tp = { x: to.x, y: to.y + 36 };
                const mid = { x: (fp.x + tp.x) / 2, y: (fp.y + tp.y) / 2 };
                return (
                  <g key={edge.id} onClick={() => setSelectedEdge(edge.id === selectedEdge ? null : edge.id)}>
                    <path d={bezier(fp.x, fp.y, tp.x, tp.y)} fill="none"
                      stroke={selectedEdge === edge.id ? "#2563EB" : "#CBD5E1"} strokeWidth="2" strokeLinecap="round"
                      style={{ cursor: "pointer" }} />
                    {edge.convRate && (
                      <text x={mid.x} y={mid.y - 6} textAnchor="middle" fontSize="9" fill="#64748B" fontWeight="600">{edge.convRate}</text>
                    )}
                    {selectedEdge === edge.id && (
                      <text x={mid.x} y={mid.y + 10} textAnchor="middle" fontSize="9" fill="#DC2626" style={{ cursor: "pointer" }}
                        onClick={() => setEdges(es => es.filter(e => e.id !== edge.id))}>× delete</text>
                    )}
                  </g>
                );
              })}

              {/* Drawing edge preview */}
              {drawingEdge && (() => {
                const from = nodes.find(n => n.id === drawingEdge.fromId);
                if (!from) return null;
                const fp = getNodePort(from);
                return <path d={bezier(fp.x, fp.y, mousePos.x, mousePos.y)} fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 3" />;
              })()}

              {/* Nodes */}
              {nodes.map(node => {
                const style = NODE_STYLE[node.type];
                const isSelected = selectedNode?.id === node.id;
                return (
                  <g key={node.id} transform={`translate(${node.x},${node.y})`}
                    onMouseDown={e => startDragNode(e, node.id)}
                    onMouseUp={e => dropOnNode(e, node.id)}
                    onClick={e => { e.stopPropagation(); setSelectedNode(n => n?.id === node.id ? null : node); }}
                    style={{ cursor: "grab" }}>
                    {/* Card */}
                    <rect rx="8" width="182" height="72"
                      fill={style.bg} stroke={isSelected ? "#2563EB" : style.border} strokeWidth={isSelected ? 2 : 1.5} />
                    {/* Label */}
                    <text x="36" y="26" fontSize="11" fontWeight="700" fill={style.text}>{node.label.length > 20 ? node.label.slice(0,18)+"…" : node.label}</text>
                    {node.sublabel && <text x="36" y="40" fontSize="9" fill="#64748B">{node.sublabel}</text>}
                    {node.metrics.convRate && <text x="36" y="56" fontSize="9" fill="#16A34A" fontWeight="600">{node.metrics.convRate} conv · {node.metrics.leads > 0 ? node.metrics.leads.toLocaleString()+" leads" : ""}</text>}
                    {/* Type dot */}
                    <circle cx="18" cy="24" r="6" fill={style.dot} />
                    {/* Drag port */}
                    <circle cx="182" cy="36" r="6" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1"
                      onMouseDown={e => startDrawEdge(e, node.id)}
                      style={{ cursor: "crosshair" }} />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Node Detail Drawer */}
        {selectedNode && (
          <div className="w-72 shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedNode.type}</p>
                <input value={selectedNode.label} onChange={e => { updateNode(selectedNode.id, { label: e.target.value }); }}
                  className="text-[14px] font-bold text-slate-900 bg-transparent border-none outline-none w-full mt-0.5" />
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-600 text-[20px]">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Sublabel</label>
                <input value={selectedNode.sublabel} onChange={e => updateNode(selectedNode.id, { sublabel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white focus:outline-none focus:border-blue-400" placeholder="Description..." />
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Metrics</p>
                <div className="space-y-2">
                  <div><label className="text-[10px] text-slate-400">Leads / Reach</label>
                    <input type="number" value={selectedNode.metrics.leads}
                      onChange={e => updateNodeMetrics(selectedNode.id, { leads: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-[13px] font-bold bg-white focus:outline-none" />
                  </div>
                  <div><label className="text-[10px] text-slate-400">Conversion Rate</label>
                    <input value={selectedNode.metrics.convRate}
                      onChange={e => updateNodeMetrics(selectedNode.id, { convRate: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-[12px] bg-white focus:outline-none" placeholder="e.g. 38%" />
                  </div>
                  <div><label className="text-[10px] text-slate-400">Revenue Attributed</label>
                    <input type="number" value={selectedNode.metrics.revenue}
                      onChange={e => updateNodeMetrics(selectedNode.id, { revenue: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-[12px] bg-white focus:outline-none" placeholder="0" />
                  </div>
                </div>
              </div>
              {/* Connected edges */}
              {edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Connections</p>
                  <div className="space-y-1.5">
                    {edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map(e => {
                      const other = nodes.find(n => n.id === (e.from === selectedNode.id ? e.to : e.from));
                      return other ? (
                        <div key={e.id} className="flex items-center gap-2 text-[11px] text-slate-600">
                          <span>{e.from === selectedNode.id ? "→" : "←"}</span>
                          <span>{other.label}</span>
                          {e.convRate && <span className="ml-auto text-emerald-600 font-semibold">{e.convRate}</span>}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50 mt-auto">
              {(["capture","automation","conversion"].includes(selectedNode.type)) && (
                <button onClick={() => setOutreachOpen(true)} className="w-full py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[14px]">forum</span> Open Outreach Workspace
                </button>
              )}
              <button onClick={() => deleteNode(selectedNode.id)} className="w-full py-2 border border-red-200 text-red-600 text-[11px] font-semibold rounded-lg hover:bg-red-50 transition-colors">Delete Node</button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom metrics bar */}
      <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-2.5 flex items-center gap-8">
        {[
          { label: "Leads", value: totals.leads, icon: "person" },
          { label: "Applications", value: totals.apps, icon: "description" },
          { label: "Calls Booked", value: totals.calls, icon: "call" },
          { label: "Closed", value: totals.closed, icon: "handshake" },
          { label: "Revenue", value: `£${(totals.revenue/1000).toFixed(0)}K`, icon: "payments" },
        ].map(m => (
          <div key={m.label} className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-slate-400">{m.icon}</span>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">{m.label}</p>
              <p className="text-[14px] font-bold text-slate-900">{m.value}</p>
            </div>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="material-symbols-outlined text-amber-500 text-[14px]">warning</span>
          <p className="text-[10px] text-amber-700 font-semibold">Bottleneck: Lead Magnet → Application (7.2% · target 12–18%)</p>
        </div>
      </div>

      {/* Outreach Workspace Modal */}
      {outreachOpen && selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40" onClick={() => setOutreachOpen(false)}>
          <div className="bg-white rounded-2xl w-[95vw] max-w-[1200px] h-[95vh] shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest">{selectedNode.label.toUpperCase()} • PIPELINE</p>
                <p className="text-[16px] font-bold text-slate-900 mt-1">Outreach Workspace</p>
              </div>
              <button onClick={() => setOutreachOpen(false)} className="text-2xl text-slate-400 hover:text-slate-600">×</button>
            </div>
            
            <div className="flex-1 flex overflow-hidden bg-slate-50/50">
              {/* Left: Lead Management */}
              <div className="w-[300px] shrink-0 border-r border-slate-200 bg-white flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 flex gap-2">
                  <input placeholder="Search leads..." className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-400" />
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {[
                    { name: "Michael T.", match: "High ICP Fit", campaign: "Comment GUIDE", status: "Needs Reply" },
                    { name: "Sarah L.", match: "Medium ICP Fit", campaign: "Comment GUIDE", status: "Follow up" },
                    { name: "James W.", match: "High ICP Fit", campaign: "DM Prospecting", status: "Meeting Booked" },
                    { name: "Anna K.", match: "Low ICP Fit", campaign: "Comment GUIDE", status: "Not Qualified" }
                  ].map((l, i) => (
                    <div key={i} className={`p-3 border rounded-lg cursor-pointer transition-colors ${i === 0 ? "border-blue-400 bg-blue-50/30" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                      <div className="flex justify-between items-start mb-1.5">
                        <p className="text-[12px] font-bold text-slate-900">{l.name}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${l.status === "Needs Reply" ? "bg-amber-100 text-amber-700" : l.status === "Meeting Booked" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{l.status}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mb-0.5"><strong className="text-slate-700">Source:</strong> {l.campaign}</p>
                      <p className="text-[10px] text-slate-500"><strong className={l.match.includes("High") ? "text-emerald-600" : "text-slate-700"}>{l.match}</strong></p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle: Conversation Context */}
              <div className="flex-1 flex flex-col h-full bg-white">
                <div className="p-5 flex-1 overflow-y-auto">
                  <div className="space-y-4 max-w-2xl mx-auto">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2"><span className="material-symbols-outlined text-[14px] inline-block align-middle mr-1">bolt</span> AI Personalisation Context</p>
                      <p className="text-[12px] text-slate-600 leading-relaxed mb-3">Michael runs a 7-figure creative agency but has struggled with predictable acquisition. He engaged with your MOF post about "agency growth ceilings." Based on his profile, emphasize systemization and predictability over sheer volume.</p>
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 text-[11px] font-bold rounded-lg hover:bg-blue-100">Draft Custom Reply</button>
                    </div>
                    
                    <div className="space-y-4 mt-6">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                        <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-sm text-[13px] text-slate-800">
                          GUIDE
                        </div>
                      </div>
                      <div className="flex gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold">YOU</div>
                        <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-sm text-[13px] text-white">
                          Hey Michael, here is the guide on breaking the agency growth ceiling! Let me know what you think of page 4. What's your current biggest bottleneck?
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                        <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-sm text-[13px] text-slate-800">
                          Thanks man. Honest answer - predictably closing deals without my personal involvement.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-slate-100 bg-white">
                  <div className="max-w-2xl mx-auto flex gap-2">
                    <textarea rows={2} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-[13px] bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-400 resize-none" placeholder="Write reply... (or use AI draft)" />
                    <button className="px-5 shrink-0 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center text-[12px]">Send</button>
                  </div>
                </div>
              </div>

              {/* Right: Qualification */}
              <div className="w-[300px] shrink-0 border-l border-slate-200 bg-white flex flex-col h-full overflow-y-auto p-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Qualification Data</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Company Stage</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px]"><option>$50k-$100k / mo</option><option>$10k-$50k / mo</option></select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Identified Pain</label>
                    <textarea rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] resize-none" defaultValue="Predictable deal flow, too reliant on founder" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Sales Handoff Status</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px]"><option>Triage</option><option>Ready for Call</option><option>Nurture</option></select>
                  </div>
                  <hr className="border-slate-100" />
                  <button className="w-full py-2 bg-emerald-600 text-white text-[12px] font-bold rounded-lg hover:bg-emerald-700">Push to Sales Pipeline</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function updateNode(id: string, patch: Partial<FunnelNode>) {
    setNodes(ns => ns.map(n => n.id === id ? { ...n, ...patch } : n));
    if (selectedNode?.id === id) setSelectedNode(s => s ? { ...s, ...patch } : s);
  }

  function updateNodeMetrics(id: string, patch: Partial<FunnelNode["metrics"]>) {
    setNodes(ns => ns.map(n => n.id === id ? { ...n, metrics: { ...n.metrics, ...patch } } : n));
    if (selectedNode?.id === id) setSelectedNode(s => s ? { ...s, metrics: { ...s.metrics, ...patch } } : s);
  }
}
