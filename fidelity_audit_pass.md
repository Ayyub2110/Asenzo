# Executive Obsidian Refinement - Audit Pass


## Executive Summary
* The codebase relies heavily on hardcoded inline styles instead of CSS classes.
* Emojis are used for icons across multiple screens, violating the single-icon system rule.
* Spacing is arbitrary (using specific px values directly in styles).

## Screen-by-Screen Breakdown

### renderOverview
**Inline Styles Detected:**
- `font-variation-settings: 'FILL' 1;`
- `stop-color:#64748b;stop-opacity:0.2`
- `stop-color:#64748b;stop-opacity:0`
- `stop-color:#10b981;stop-opacity:0.2`
- `stop-color:#10b981;stop-opacity:0`
- `clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);`
- `clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%); transform: rotate(45deg);`
- `clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%); transform: rotate(-45deg);`


### renderFoundationPage
**Inline Styles Detected:**
- `display:flex;align-items:center;gap:14px;flex:1;min-width:0`
- `width:40px;height:40px;border-radius:12px;background:${color};display:flex;align-items:center;justify-content:center;flex-shrink:0`
- `font-size:20px;color:#ffffff;font-variation-settings:'FILL' 1`
- `flex:1;min-width:0`
- `display:flex;align-items:center;gap:8px`
- `font-size:10.5px;font-weight:700;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.06em`
- `background:${badgeBg};color:${badgeColor};font-size:10.5px;font-weight:700;padding:1px 8px;border-radius:999px`
- `font-size:16px;font-weight:800;color:var(--text-main);letter-spacing:-0.01em;margin-top:1px`
- `font-size:12px;color:var(--text-muted);margin-top:1px`
- `display:flex;align-items:center;gap:10px;flex-shrink:0`
- ...and 19 more variations.


### renderRevenue
**Inline Styles Detected:**
- `font-size:16px`
- `margin-top:16px`
- `overflow-x:auto`
- `font-weight:800;color:#16a34a`


### renderRetention
**Inline Styles Detected:**
- `margin-top:16px`
- `overflow-x:auto`


### renderActionQueue
**Emojis found:** ✓
**Inline Styles Detected:**
- `font-size:16px`
- `font-size:18px`
- `display:flex;flex-direction:column;gap:14px;margin-top:16px`
- `border-left:4px solid #EA580C`
- `display:flex;justify-content:space-between;align-items:flex-start`
- `display:flex;align-items:center;gap:8px`
- `background:#ffedd5;color:#ea580c`
- `font-size:12px;color:var(--text-muted)`
- `font-size:16px;font-weight:700;color:var(--text-main);margin-top:6px`
- `font-size:13px;color:var(--text-muted);margin-top:4px`
- ...and 5 more variations.


### renderAttention
**Emojis found:** ⚡ 📊 💡 📝 🎬 🚀 🧠
**Inline Styles Detected:**
- `align-items:center`
- `font-weight:600;font-size:11.5px;cursor:pointer;padding:6px 12px`
- `font-size:18px`
- `margin-bottom:14px; display:flex; flex-wrap:wrap; gap:4px`


### renderAttentionOverviewSubTab
**Emojis found:** ⚡ 📝 👁 💬 🧠
**Inline Styles Detected:**
- `display:flex; flex-direction:column; gap:16px;`
- `background:linear-gradient(135deg, #0F172A 0%, #1E293B 100%);color:#FFFFFF;border:none`
- `display:flex;justify-content:space-between;align-items:flex-start`
- `display:flex;align-items:center;gap:8px`
- `font-size:10px;font-weight:700`
- `font-size:11px;color:#94A3B8`
- `font-size:18px;font-weight:800;color:#F8FAFC;margin-top:8px;line-height:1.3`
- `font-size:12.5px;color:#CBD5E1;margin-top:6px`
- `color:#34D399;font-weight:700`
- `font-size:12px;color:#94A3B8;margin-top:6px;font-style:italic`
- ...and 33 more variations.


### renderAttentionIdeasSubTab
**Emojis found:** ⚡ 🔍 ✏ 📝
**Inline Styles Detected:**
- `display:flex;flex-direction:column;gap:14px`
- `display:flex;justify-content:space-between;align-items:center`
- `display:flex;align-items:center;gap:8px`
- `font-size:12px;color:#10B981;font-weight:700`
- `display:flex;gap:8px`
- `display:flex;gap:10px;align-items:center;margin-top:12px;flex-wrap:wrap`
- `flex:1;min-width:200px`
- `display:grid;grid-template-columns:repeat(2, 1fr);gap:14px`
- `grid-column:span 2;text-align:center;color:#94A3B8;padding:30px`
- `border-left:4px solid ${i.priority === 'HIGH' ? '#10B981' : i.priority === 'MEDIUM' ? '#F97316' : '#94A3B8'}`
- ...and 7 more variations.


### renderAttentionScriptsSubTab
**Emojis found:** ⚡ 🪝 📜 🎯 🚀 💡 ⚙ 🛡 📣
**Inline Styles Detected:**
- `display:flex;flex-direction:column;gap:16px`
- `background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:12px 16px;font-size:12.5px;color:#047857;display:flex;align-items:center;justify-content:space-between`
- `background:#FFF;color:#047857;border-color:#A7F3D0`
- `display:grid;grid-template-columns:1fr 340px;gap:16px`
- `display:flex;justify-content:space-between;align-items:center`
- `display:flex;flex-direction:column;gap:12px;margin-top:14px`
- `font-weight:700;font-size:12px;color:#0F172A`
- `width:100%;margin-top:4px`
- `display:grid;grid-template-columns:1fr 1fr;gap:10px`
- `display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid #E2E8F0`
- ...and 5 more variations.


### renderAttentionProductionSubTab
**Emojis found:** ✏ 🚀
**Inline Styles Detected:**
- `display:flex;flex-direction:column;gap:14px`
- `display:flex;justify-content:space-between;align-items:center`
- `display:grid;grid-template-columns:repeat(2, 1fr);gap:14px`
- `grid-column:span 2;text-align:center;color:#94A3B8;padding:30px`
- `display:flex;justify-content:space-between;align-items:flex-start`
- `font-size:9.5px`
- `font-size:14px;font-weight:800;color:#0F172A;margin-top:6px`
- `font-size:12px;color:#64748B;margin-top:6px`
- `display:flex;justify-content:flex-end;gap:8px;margin-top:12px;padding-top:8px;border-top:1px solid #F1F5F9`


### renderAttentionDashboard
**Emojis found:** ❤ 📋 🏆 🛡 🧲 ⚡ 🔄 🧪 ⚠ 📊
**Inline Styles Detected:**
- `margin-left:auto`
- `border-color: #38BDF8; background: rgba(56, 189, 248, 0.1)`
- `color:#60A5FA`
- `color:#FFFFFF; font-weight:700`
- `display:flex;align-items:center;gap:14px`
- `width:40px;height:40px;border-radius:10px;background:#EA580C;color:#FFF;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800`
- `font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#9A3412`
- `font-size:14px;font-weight:800;color:#7C2D12;margin-top:2px`
- `font-size:11px;font-weight:700;color:var(--t-muted);text-transform:uppercase`
- `font-size:18px`
- ...and 38 more variations.


### renderContentStrategyTab
**Emojis found:** 💡 ✏ 🗑
**Inline Styles Detected:**
- `background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);color:#FFF`
- `display:flex;justify-content:space-between;align-items:center`
- `font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.5px`
- `font-size:16px;font-weight:800;color:#F8FAFC;margin-top:2px`
- `display:flex;gap:8px`
- `background:rgba(255,255,255,0.1);color:#FFF;border-color:rgba(255,255,255,0.2)`
- `font-size:12px;color:#CBD5E1;margin-top:6px`
- `display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:14px`
- `grid-column:span 2;text-align:center;color:#94A3B8;padding:30px`
- `border-top:3px solid ${['#8B5CF6','#10B981','#F97316','#06B6D4'][i % 4]}`
- ...and 16 more variations.


### renderContentIdeasTab
**Emojis found:** ⚡ 🔍 🔢 ✏ ➡ 🗑
**Inline Styles Detected:**
- `background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);color:#FFF`
- `display:flex;justify-content:space-between;align-items:center`
- `font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.5px`
- `font-size:16px;font-weight:800;color:#F8FAFC;margin-top:2px`
- `display:flex;gap:8px`
- `background:rgba(255,255,255,0.1);color:#FFF;border-color:rgba(255,255,255,0.2)`
- `font-size:12px;color:#CBD5E1;margin-top:6px`
- `display:flex;gap:10px;align-items:center;margin-top:14px;flex-wrap:wrap`
- `flex:1;min-width:220px`
- `display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:14px`
- ...and 17 more variations.


### renderPipelineTab
**Emojis found:** 💼 📸 📑 ✉ 📰 📝 👤 👁 💬 🎯 🔥
**Inline Styles Detected:**
- `display:flex;justify-content:space-between;align-items:center`
- `margin-top:2px`
- `display:flex;gap:8px;align-items:center`
- `font-weight:800;font-size:11px`
- `display:grid;grid-template-columns:repeat(4, 1fr);gap:14px;margin-top:12px`
- `background:#F8FAFC;padding:12px;border-radius:10px;border:1px solid #E2E8F0`
- `font-size:11px;font-weight:700;color:#64748B`
- `font-size:12.5px;font-weight:700;color:#0F172A;margin-top:4px`
- `margin-top:14px`
- `display:flex;justify-content:space-between;align-items:center;margin-bottom:12px`
- ...and 20 more variations.


### renderAttributionTab
**Inline Styles Detected:**
- `display:grid;grid-template-columns:1fr 340px;gap:16px`
- `margin-bottom:14px`
- `font-weight:700;color:#0F172A`
- `font-size:11px;color:#64748B`
- `border-left:4px solid #10B981;background:#F0FDF4`
- `background:#10B981;color:#FFF`
- `font-weight:800;color:#065F46`
- `font-size:11px;color:#047857`
- `color:#065F46`
- `color:#2563EB`
- ...and 9 more variations.


### renderKnowledgeTab
**Emojis found:** ⚡ 🔍 🗑
**Inline Styles Detected:**
- `margin-bottom:16px;background:linear-gradient(135deg, #0F172A 0%, #1E293B 100%);color:#FFFFFF`
- `display:flex;justify-content:space-between;align-items:center`
- `font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.5px`
- `font-size:16px;font-weight:800;color:#F8FAFC;margin-top:2px`
- `display:flex;gap:8px`
- `font-weight:700`
- `background:rgba(255,255,255,0.1);color:#FFF;border-color:rgba(255,255,255,0.2)`
- `display:grid;grid-template-columns:2fr 1fr;gap:14px;margin-top:14px`
- `background:rgba(255,255,255,0.05);padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.1)`
- `font-size:11px;font-weight:700;color:#94A3B8`
- ...and 16 more variations.


### renderAuthorityTab
**Emojis found:** 🛡 🎯 ✏ 🗑
**Inline Styles Detected:**
- `display:flex;justify-content:space-between;align-items:center`
- `background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:10px 14px;margin-top:12px;font-size:12px;color:#047857`
- `display:grid;grid-template-columns:repeat(2, 1fr);gap:12px;margin-top:14px`
- `text-align:center;color:#94A3B8;padding:30px;grid-column:span 2`
- `padding:14px;background:#F8FAFC;border-radius:10px;border:1px solid ${isApp ? '#BBF7D0' : '#E2E8F0'};display:flex;flex-direction:column;gap:8px`
- `display:flex;justify-content:space-between;align-items:flex-start`
- `font-weight:700;color:#0F172A;font-size:13px`
- `font-size:11px;color:#64748B;margin-top:2px`
- `font-weight:700`
- `font-size:12px;color:#334155;background:#FFFFFF;padding:8px;border-radius:6px;border:1px solid #E2E8F0`
- ...and 5 more variations.


### renderMarketIntelTab
**Emojis found:** ✓ 💡 ⚡ 🗑
**Inline Styles Detected:**
- `display:flex;justify-content:space-between;align-items:center`
- `display:flex;flex-direction:column;gap:12px;margin-top:14px`
- `text-align:center;color:#94A3B8;padding:30px`
- `padding:14px;background:#F8FAFC;border-radius:10px;border:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:flex-start`
- `flex:1;padding-right:16px`
- `display:flex;gap:8px;align-items:center`
- `font-weight:700`
- `font-weight:700;color:#0F172A;font-size:13.5px;margin-top:6px`
- `font-size:12px;color:#475569;margin-top:4px;line-height:1.45`
- `font-size:11.5px;color:#1E40AF;background:#EFF6FF;padding:6px 10px;border-radius:6px;margin-top:6px;font-weight:600`
- ...and 3 more variations.


### renderOutreachTab
**Emojis found:** ⚡ ✏
**Inline Styles Detected:**
- `display:flex;justify-content:space-between;align-items:center`
- `margin-top:14px;overflow-x:auto`
- `width:100%;font-size:12px`
- `text-align:center;color:#94A3B8;padding:24px`
- `max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`
- `display:flex;gap:4px`


### renderRecommendationsTab
**Emojis found:** ⚡ ✓
**Inline Styles Detected:**
- `display:flex;flex-direction:column;gap:14px;margin-top:14px`
- `border-left-color:${r.status === 'applied' ? '#10B981' : '#8B5CF6'}`
- `display:flex;justify-content:space-between;align-items:center`
- `font-weight:700;color:#0F172A;margin-top:4px`
- `font-size:11px;font-weight:700;color:#10B981`


### renderConversion
**Emojis found:** 🎧 🎯 📊 📄 💬 📖 🛡 📜 🚀
**Inline Styles Detected:**
- `margin-bottom:18px; display:flex; flex-wrap:wrap; gap:4px`


### renderConversionDashboardSubTab
**Emojis found:** 🎯 ⚠ 📜
**Inline Styles Detected:**
- `background:linear-gradient(135deg, #0F172A 0%, #1E293B 100%);color:#F8FAFC;padding:20px 24px;border-radius:14px;margin-bottom:20px;box-shadow:0 10px 25px -5px rgba(15,23,42,0.3)`
- `display:flex;justify-content:space-between;align-items:center;margin-bottom:8px`
- `display:flex;align-items:center;gap:8px`
- `font-size:16px`
- `font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#38BDF8`
- `background:#059669;color:#FFFFFF`
- `font-size:17px;font-weight:700;line-height:1.4;color:#FFFFFF;margin-top:6px`
- `display:grid;grid-template-columns:repeat(5, 1fr);gap:14px;margin-bottom:20px`
- `color:#0EA5E9`
- `color:#10B981`
- ...and 12 more variations.


### renderConversionPipelineSubTab
**Inline Styles Detected:**
- `display:flex;justify-content:space-between;align-items:center;margin-bottom:14px`
- `font-size:15px;font-weight:700;color:#0F172A`
- `display:grid;grid-template-columns:repeat(5, 1fr);gap:12px;margin-bottom:12px`
- `display:grid;grid-template-columns:repeat(5, 1fr);gap:12px`


### renderKanbanColumn
**Emojis found:** ⚠ 🏆 ✓
**Inline Styles Detected:**
- `background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:10px`
- `display:flex;justify-content:space-between;align-items:center;margin-bottom:8px`
- `font-size:11.5px;font-weight:700;color:#0F172A`
- `font-size:10.5px;font-weight:700;background:#E2E8F0;padding:2px 6px;border-radius:10px`
- `font-size:11px;font-weight:700;color:#0EA5E9;margin-bottom:8px`
- `display:flex;flex-direction:column;gap:8px`
- `background:#FFFFFF;border:1px solid #CBD5E1;border-radius:8px;padding:10px;cursor:pointer`
- `display:flex;justify-content:space-between;align-items:center`
- `font-weight:700;font-size:12.5px;color:#0F172A`
- `font-size:10px;background:#FEE2E2;color:#991B1B;font-weight:800;padding:2px 4px;border-radius:4px`
- ...and 5 more variations.


### renderConversionCoachingSubTab
**Emojis found:** ★ ⚡
**Inline Styles Detected:**
- `display:flex;justify-content:space-between;align-items:center;margin-bottom:12px`
- `padding:24px;text-align:center;color:#64748B;background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:10px;margin-bottom:16px`
- `font-size:14px;font-weight:700;color:#0F172A;margin-bottom:8px`
- `display:flex;flex-direction:column;gap:10px`
- `display:flex;align-items:center;justify-content:space-between;padding:12px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0`
- `display:flex;align-items:center;gap:8px`
- `font-weight:700;font-size:13px;color:#0F172A`
- `font-size:11.5px;color:#64748B;margin-top:3px`
- `display:flex;gap:8px`
- `padding:16px;text-align:center;color:#64748B;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px`


### renderCoachingResultCard
**Emojis found:** ⚡
**Inline Styles Detected:**
- `background:#F8FAFC;border:1px solid #CBD5E1;border-radius:12px;padding:16px;margin-bottom:16px`
- `display:flex;justify-content:space-between;align-items:center;margin-bottom:12px`
- `font-size:15px;font-weight:800;color:#0F172A`
- `font-size:12px;color:#64748B`
- `font-size:13px;padding:4px 10px`
- `display:grid;grid-template-columns:repeat(4, 1fr);gap:10px;margin-bottom:14px`
- `padding:10px;text-align:center`
- `font-size:11px;color:#64748B`
- `font-size:18px;font-weight:800;color:#0EA5E9`
- `font-size:18px;font-weight:800;color:#10B981`
- ...and 6 more variations.


### renderConversionObjectionsSubTab
**Emojis found:** ⚡
**Inline Styles Detected:**
- `display:flex;justify-content:space-between;align-items:center;margin-bottom:12px`
- `display:flex;flex-direction:column;gap:12px`
- `padding:14px;background:#F8FAFC;border-radius:10px;border:1px solid #E2E8F0`
- `display:flex;justify-content:space-between;align-items:center`
- `font-weight:700;font-size:13.5px;color:#0F172A`
- `display:flex;gap:6px`
- `font-size:12px;color:#475569;margin-top:6px;background:#FFFFFF;padding:10px;border-radius:6px;border:1px solid #CBD5E1`
- `font-size:11.5px;color:#6366F1;margin-top:4px;font-weight:600`
- `padding:20px;text-align:center;color:#64748B;background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:8px`


### renderConversionCloserSubTab
**Inline Styles Detected:**
- `margin:14px 0;display:flex;gap:10px;align-items:center`
- `font-weight:700;font-size:13px;color:#0F172A`
- `padding:8px 12px;border-radius:6px;border:1px solid #CBD5E1;font:inherit;font-size:13px`
- `padding:24px;text-align:center;color:#64748B;background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:10px`


### renderCloserPrepContent
**Emojis found:** 💡 🔍 ⚙ 📊 🛡 🚀 ⚡ 🛑 📅
**Inline Styles Detected:**
- `display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px`
- `display:flex;flex-direction:column;gap:12px`
- `background:#F8FAFC;padding:12px;border-radius:8px;border:1px solid #E2E8F0`
- `font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase`
- `font-size:13px;color:#0F172A;margin-top:4px`
- `font-size:12.5px;color:#0F172A;margin-top:4px;display:flex;flex-direction:column;gap:6px`
- `padding:6px;background:#FFF;border-radius:6px;border:1px solid #CBD5E1`
- `display:flex;flex-direction:column;gap:12px;margin-top:14px`
- `padding:10px;background:#EFF6FF;border-radius:8px;border:1px solid #BFDBFE;font-size:12.5px;color:#1E40AF;font-weight:600`
- `display:grid;grid-template-columns:1fr 1fr;gap:12px`
- ...and 46 more variations.


### renderConversionHandoffSubTab
**Emojis found:** ✓ 🚀
**Inline Styles Detected:**
- `margin-top:14px;display:flex;flex-direction:column;gap:12px`
- `padding:14px;background:#F8FAFC;border-radius:10px;border:1px solid #E2E8F0`
- `display:flex;justify-content:space-between;align-items:center`
- `font-weight:700;font-size:14px;color:#0F172A`
- `font-size:12px;color:#64748B;margin-top:4px`
- `font-size:11.5px;color:#10B981;margin-top:6px;font-weight:600`
- `padding:20px;text-align:center;color:#64748B;background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:8px`


### renderDelivery
**Inline Styles Detected:**
- `margin-top:12px;display:flex;flex-direction:column;gap:12px`
- `padding:16px;background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;display:flex;flex-direction:column;gap:8px`
- `display:flex;justify-content:space-between;align-items:center`
- `font-weight:800;font-size:14px;color:#0F172A`
- `font-size:12px;color:#64748B`
- `color:#0F172A`
- `width:100%;height:8px;background:#E2E8F0;border-radius:4px;overflow:hidden;margin-top:4px`
- `width:${c.progress}%;height:100%;background:#10B981`


### renderIntelligence
**Emojis found:** ⚡ 🔍
**Inline Styles Detected:**
- `display:flex;flex-direction:column;gap:14px`


### renderOperator
**Inline Styles Detected:**
- `display:grid;grid-template-columns:repeat(3, 1fr);gap:16px`
- `display:flex;justify-content:space-between;align-items:center`
- `font-size:11px;color:#94A3B8`
- `font-size:15px;font-weight:800;color:#0F172A;margin-top:6px`
- `display:flex;flex-direction:column;gap:6px;margin-top:10px`
- `font-size:12px;color:#475569;background:#F8FAFC;padding:6px 10px;border-radius:6px;border:1px solid #E2E8F0`
- `margin-top:12px`


### renderCalendar
**Inline Styles Detected:**
- `font-size:10px;font-weight:700;margin-bottom:2px`


### renderDnaScoreBreakdown
**Emojis found:** 💡
**Inline Styles Detected:**
- `background:#FFFFFF;padding:8px 10px;border-radius:8px;border:1px solid #E2E8F0`
- `font-size:10.5px;font-weight:700;color:#64748B`
- `font-size:14px;font-weight:800;color:#0F172A;margin-top:2px`
- `width:100%;height:4px;background:#E2E8F0;border-radius:2px;overflow:hidden;margin-top:4px`
- `width:${(d.score / d.max) * 100}%;height:100%;background:#10B981`


### renderDnaAlternatives
**Emojis found:** ⚡ 🔒
**Inline Styles Detected:**
- `font-size:12px;color:#94A3B8;text-align:center;padding:20px`
- `padding:14px;background:#F8FAFC;border-radius:12px;border:1px solid #CBD5E1;display:flex;flex-direction:column;gap:8px`
- `display:flex;justify-content:space-between;align-items:center`
- `font-weight:800;color:#0F172A;font-size:13.5px`
- `font-size:12px;color:#334155`
- `font-size:11.5px;color:#64748B`
- `display:flex;justify-content:flex-end;margin-top:4px`


### renderDnaVersions
**Inline Styles Detected:**
- `font-size:12px;color:#94A3B8;text-align:center;padding:10px`
- `padding:10px 14px;background:#FFFFFF;border-radius:8px;border:1px solid #E2E8F0;display:flex;align-items:center;justify-content:space-between`
- `font-weight:700;color:#0F172A`
- `margin-left:6px`
- `font-size:11.5px;color:#64748B;margin-top:2px`


### renderSVGLineChart
**Inline Styles Detected:**
- `width:100%;height:100%`


### renderSVGDonutChart
**Inline Styles Detected:**
- `width:100%;height:100%;transform:rotate(-90deg)`


### renderGuardrailsResult
**Emojis found:** ❌ ✅ ⚠
**Inline Styles Detected:**
- `color:#10B981`


### renderConversionFunnelSubTab
**Emojis found:** ⚡ ⚙ 👁 📈
**Inline Styles Detected:**
- `padding:40px;text-align:center;background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:12px`
- `font-size:16px;font-weight:700;color:#0F172A;margin-bottom:6px`
- `font-size:13px;color:#64748B;margin-bottom:16px`
- `display:grid;grid-template-columns:300px 1fr;gap:20px`
- `padding:16px`
- `font-size:14px;font-weight:800;color:#0F172A;margin-bottom:12px`
- `display:flex;flex-direction:column;gap:8px;margin-bottom:16px`
- `text-align:left; font-size:12px; padding:10px; cursor:pointer;`
- `background:#F1F5F9;padding:12px;border-radius:8px;border:1px solid #E2E8F0;font-size:12px`
- `margin-left:4px`
- ...and 4 more variations.


### renderSimulatedQuestion
**Emojis found:** 🏆 ⚠ 🔄
**Inline Styles Detected:**
- `font-weight:700;font-size:11px;color:#FFFFFF;margin-bottom:8px`
- `font-size:13px;color:#FFFFFF;margin-bottom:10px`
- `display:flex;flex-direction:column;gap:6px`
- `padding:6px; font-size:11.5px`
- `text-align:center;padding:10px`
- `font-size:28px`
- `font-weight:800;font-size:14px;color:#10B981;margin-top:8px`
- `font-size:11.5px;color:#94A3B8;margin-top:4px`
- `margin-top:10px;background:#38BDF8;color:#0B0F19;border:none`
- `font-weight:800;font-size:14px;color:#EF4444;margin-top:8px`
- ...and 2 more variations.


### renderConversionDmQualifierSubTab
**Emojis found:** ⚡ 📍
**Inline Styles Detected:**
- `padding:40px;text-align:center;background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:12px`
- `font-size:16px;font-weight:700;color:#0F172A;margin-bottom:6px`
- `font-size:13px;color:#64748B;margin-bottom:16px`
- `display:grid;grid-template-columns:250px 1fr 340px;gap:16px;height:calc(100vh - 220px);min-height:500px`
- `padding:10px;display:flex;flex-direction:column;gap:8px;overflow-y:auto`
- `font-size:12.5px;font-weight:800;color:#0F172A;padding:4px 6px`
- `display:flex;flex-direction:column;gap:6px`
- `padding:10px;border-radius:8px;border:1px solid ${isActive ? '#0EA5E9' : '#E2E8F0'};background:${isActive ? '#F0F9FF' : '#FFFFFF'};cursor:pointer`
- `display:flex;justify-content:space-between;align-items:center`
- `font-size:12px;color:#0F172A`
- ...and 39 more variations.


### renderConversionStorySequencesSubTab
**Emojis found:** ⚡ 📋 💾
**Inline Styles Detected:**
- `padding:40px;text-align:center;background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:12px`
- `font-size:16px;font-weight:700;color:#0F172A;margin-bottom:6px`
- `font-size:13px;color:#64748B;margin-bottom:16px`
- `display:grid;grid-template-columns:250px 1fr;gap:20px;height:calc(100vh - 220px);min-height:500px`
- `padding:10px;display:flex;flex-direction:column;gap:8px;overflow-y:auto`
- `font-size:12.5px;font-weight:800;color:#0F172A;padding:4px 6px`
- `display:flex;flex-direction:column;gap:6px`
- `padding:10px;border-radius:8px;border:1px solid ${isActive ? '#0EA5E9' : '#E2E8F0'};background:${isActive ? '#F0F9FF' : '#FFFFFF'};cursor:pointer`
- `font-size:12px;font-weight:700;color:#0F172A`
- `font-size:10px;color:#64748B;margin-top:4px`
- ...and 22 more variations.

