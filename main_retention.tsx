

<header className="flex justify-between items-center w-full px-container-padding py-4 top-0 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 z-40 sticky">
<div className="flex items-center gap-8">
<h2 className="font-headline-sm text-headline-sm text-on-surface">Overview Dashboard</h2>
</div>
<div className="flex items-center gap-6">

<div className="relative hidden md:block w-64">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
<input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-9 pr-4 py-1.5 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/50" placeholder="Search ASENZO engines..." type="text"/>
<span className="absolute right-2 top-1/2 -translate-y-1/2 font-label-muted text-[10px] text-on-surface-variant bg-surface border border-outline-variant/30 px-1.5 rounded">⌘K</span>
</div>

<div className="flex items-center gap-3 border-l border-outline-variant/30 pl-6">
<button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 rounded-full hover:bg-surface-container-highest">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border border-surface"></span>
</button>
<button className="flex items-center gap-2 hover:bg-surface-container-highest py-1 pl-1 pr-3 rounded-full transition-colors border border-outline-variant/20">
<div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-caps text-label-caps overflow-hidden">
<img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHfD2qI1Q75YOkfNAPFY52z1ZdYKaUMn1fUMZIHMlSPVD7u480PSEYewykYpqumaJ1jrkJ-3vP2pX7tm6Q5r7RtmTFSzVuPAV21XtTTolvldEI2c1jT86vRpNUVV3GeyTXGU2IkFZXAFhLuyQYPEQe5XZIykjlpf4YR6oRZUqUWlzXvJ5-RnOe_LC-HbiY1r3GKQOVppX8csVb5L6bJuSnOZROo6eS5Pk2FHimsxNCU23luaRmSD53jNfZwIk9tRgPzGZs20TUSAnt"/>
</div>
<span className="font-body-sm text-body-sm font-medium text-on-surface">Alex Morgan</span>
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
</button>
</div>
</div>
</header>

<div className="flex-1 overflow-y-auto p-container-padding pb-32">

<div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
<div>
<div className="flex items-center gap-2 mb-1">
<span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-primary-container text-on-primary">Engine 5</span>
<span className="font-label-muted text-label-muted text-on-surface-variant uppercase tracking-wide">Retention &amp; LTV</span>
</div>
<h2 className="font-display-lg text-display-lg text-on-background">Retention Command</h2>
</div>
<div className="flex items-center gap-4">
<div className="text-right">
<p className="font-label-muted text-label-muted text-on-surface-variant mb-1">Revenue Retention Rate</p>
<div className="flex items-baseline gap-1 justify-end">
<span className="font-headline-md text-headline-md text-on-surface font-bold">104.2%</span>
<span className="material-symbols-outlined text-[14px] text-green-600">trending_up</span>
</div>
</div>
<div className="h-10 w-px bg-outline-variant/30"></div>
<div className="text-right">
<p className="font-label-muted text-label-muted text-on-surface-variant mb-1">Avg. Client LTV</p>
<div className="font-headline-md text-headline-md text-on-surface font-bold">$42,500</div>
</div>
</div>
</div>

<section className="mb-8">
<div className="flex items-center justify-between mb-4">
<h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-error text-[20px]">warning</span>
                        Active Retention Blockers
                    </h3>
<button className="font-body-sm text-body-sm text-primary hover:underline">View All Tickets</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-card-gap">

<div className="bg-surface-container-lowest border border-error-container p-5 rounded-xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
<div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
<div className="flex justify-between items-start mb-3">
<div>
<span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container mb-2 uppercase tracking-wide">AT RISK</span>
<h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Nexus Growth</h4>
</div>
<div className="w-8 h-8 rounded-full bg-error-container/50 flex items-center justify-center text-error">
<span className="material-symbols-outlined text-[16px]">trending_down</span>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-4 h-10">Churn Signal Detected: 30% drop in active OS usage over last 14 days.</p>
<button className="w-full py-1.5 border border-error text-error text-sm font-medium rounded-lg hover:bg-error-container/20 transition-colors">Intervene Now</button>
</div>

<div className="bg-surface-container-lowest border border-outline-variant/40 p-5 rounded-xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
<div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
<div className="flex justify-between items-start mb-3">
<div>
<span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 mb-2 uppercase tracking-wide">WATCH</span>
<h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Stellar Corp</h4>
</div>
<div className="w-8 h-8 rounded-full bg-amber-100/50 flex items-center justify-center text-amber-600">
<span className="material-symbols-outlined text-[16px]">hourglass_empty</span>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-4 h-10">Low Usage: Delivery OS not adopted by sub-team after 45 days.</p>
<button className="w-full py-1.5 border border-outline-variant text-on-surface text-sm font-medium rounded-lg hover:bg-surface-container-low transition-colors">Schedule Review</button>
</div>

<div className="bg-surface-container-lowest border border-outline-variant/40 p-5 rounded-xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
<div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
<div className="flex justify-between items-start mb-3">
<div>
<span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 mb-2 uppercase tracking-wide">WATCH</span>
<h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Vanguard Tech</h4>
</div>
<div className="w-8 h-8 rounded-full bg-amber-100/50 flex items-center justify-center text-amber-600">
<span className="material-symbols-outlined text-[16px]">sync_problem</span>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-4 h-10">Integration Latency: CRM syncing failing consistently for 48h.</p>
<button className="w-full py-1.5 border border-outline-variant text-on-surface text-sm font-medium rounded-lg hover:bg-surface-container-low transition-colors">Assign Tech Support</button>
</div>
</div>
</section>

<div className="flex flex-col lg:flex-row gap-card-gap h-[600px]">

<div className="w-full lg:w-[40%] bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex flex-col overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
<div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface/50">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Active Relationships</h3>
<div className="flex gap-1">
<button className="p-1 text-on-surface-variant hover:text-primary rounded"><span className="material-symbols-outlined text-[18px]">filter_list</span></button>
<button className="p-1 text-on-surface-variant hover:text-primary rounded"><span className="material-symbols-outlined text-[18px]">more_horiz</span></button>
</div>
</div>
<div className="flex-1 overflow-y-auto">

<div className="p-4 border-b border-outline-variant/10 hover:bg-surface-container-low cursor-pointer transition-colors bg-surface-container-low/50 border-l-2 border-l-primary flex justify-between items-center group">
<div className="flex items-center gap-3">
<div className="relative flex h-3 w-3">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
<span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
</div>
<div>
<p className="font-body-sm text-body-sm font-semibold text-on-surface">Acme Dynamics</p>
<p className="font-label-muted text-label-muted text-on-surface-variant">Optimal • 94% Health</p>
</div>
</div>
<div className="text-right">
<p className="font-body-sm text-body-sm font-medium text-on-surface">$120k</p>
<p className="font-label-muted text-label-muted text-on-surface-variant">LTV</p>
</div>
</div>

<div className="p-4 border-b border-outline-variant/10 hover:bg-surface-container-low cursor-pointer transition-colors border-l-2 border-l-transparent flex justify-between items-center group">
<div className="flex items-center gap-3">
<div className="h-3 w-3 rounded-full bg-error shrink-0"></div>
<div>
<p className="font-body-sm text-body-sm font-semibold text-on-surface">Nexus Growth</p>
<p className="font-label-muted text-label-muted text-on-surface-variant">At Risk • 42% Health</p>
</div>
</div>
<div className="text-right">
<p className="font-body-sm text-body-sm font-medium text-on-surface">$45k</p>
<p className="font-label-muted text-label-muted text-on-surface-variant">LTV</p>
</div>
</div>

<div className="p-4 border-b border-outline-variant/10 hover:bg-surface-container-low cursor-pointer transition-colors border-l-2 border-l-transparent flex justify-between items-center group">
<div className="flex items-center gap-3">
<div className="h-3 w-3 rounded-full bg-amber-500 shrink-0"></div>
<div>
<p className="font-body-sm text-body-sm font-semibold text-on-surface">Stellar Corp</p>
<p className="font-label-muted text-label-muted text-on-surface-variant">Watch • 68% Health</p>
</div>
</div>
<div className="text-right">
<p className="font-body-sm text-body-sm font-medium text-on-surface">$85k</p>
<p className="font-label-muted text-label-muted text-on-surface-variant">LTV</p>
</div>
</div>

<div className="p-4 border-b border-outline-variant/10 hover:bg-surface-container-low cursor-pointer transition-colors border-l-2 border-l-transparent flex justify-between items-center group">
<div className="flex items-center gap-3">
<div className="h-3 w-3 rounded-full bg-green-500 shrink-0"></div>
<div>
<p className="font-body-sm text-body-sm font-semibold text-on-surface">Vanguard Tech</p>
<p className="font-label-muted text-label-muted text-on-surface-variant">Stable • 88% Health</p>
</div>
</div>
<div className="text-right">
<p className="font-body-sm text-body-sm font-medium text-on-surface">$210k</p>
<p className="font-label-muted text-label-muted text-on-surface-variant">LTV</p>
</div>
</div>
</div>
</div>

<div className="w-full lg:w-[60%] bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex flex-col overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)] relative">

<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

<div className="p-6 border-b border-outline-variant/20 relative z-10">
<div className="flex justify-between items-start mb-4">
<div>
<h2 className="font-display-lg-mobile text-display-lg-mobile text-on-background mb-1">Acme Dynamics</h2>
<div className="flex items-center gap-3 font-body-sm text-body-sm text-on-surface-variant">
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Optimal (94%)</span>
<span>•</span>
<span>Last Interaction: 2 hours ago</span>
</div>
</div>
<button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-body-sm text-body-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                                Open Client Board
                            </button>
</div>

<div className="flex gap-6 mt-6">
<div>
<p className="font-label-muted text-label-muted text-on-surface-variant uppercase">Current ARR</p>
<p className="font-headline-sm text-headline-sm font-semibold text-on-surface">$60,000</p>
</div>
<div>
<p className="font-label-muted text-label-muted text-on-surface-variant uppercase">Months Active</p>
<p className="font-headline-sm text-headline-sm font-semibold text-on-surface">14</p>
</div>
<div>
<p className="font-label-muted text-label-muted text-on-surface-variant uppercase">Expansion Potential</p>
<p className="font-headline-sm text-headline-sm font-semibold text-on-surface text-green-600">High</p>
</div>
</div>
</div>

<div className="p-6 flex-1 overflow-y-auto space-y-8 relative z-10">

<div>
<h4 className="font-body-sm text-body-sm font-semibold text-on-surface uppercase tracking-wide mb-4">Retention &amp; Growth Goals</h4>
<div className="space-y-4">
<div>
<div className="flex justify-between text-sm mb-1">
<span className="font-medium text-on-surface">Capability Installation</span>
<span className="text-on-surface-variant">85%</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-2">
<div className="bg-primary h-2 rounded-full" style="width: 85%"></div>
</div>
</div>
<div>
<div className="flex justify-between text-sm mb-1">
<span className="font-medium text-on-surface">LTV Target Achievement</span>
<span className="text-on-surface-variant">70%</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-2">
<div className="bg-primary h-2 rounded-full" style="width: 70%"></div>
</div>
</div>
</div>
</div>

<div>
<h4 className="font-body-sm text-body-sm font-semibold text-on-surface uppercase tracking-wide mb-4">Intelligence Signals</h4>
<div className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-1">
<div className="flex items-start gap-3 p-3 hover:bg-surface rounded-lg transition-colors cursor-default">
<span className="material-symbols-outlined text-amber-500 mt-0.5">error</span>
<div>
<p className="font-body-sm text-body-sm font-medium text-on-surface">Decision Maker Shift</p>
<p className="font-label-muted text-label-muted text-on-surface-variant">New CMO joining next month. Requires re-onboarding.</p>
</div>
<span className="ml-auto px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">MEDIUM</span>
</div>
<div className="flex items-start gap-3 p-3 hover:bg-surface rounded-lg transition-colors cursor-default">
<span className="material-symbols-outlined text-surface-tint mt-0.5">info</span>
<div>
<p className="font-body-sm text-body-sm font-medium text-on-surface">Integration Latency</p>
<p className="font-label-muted text-label-muted text-on-surface-variant">Minor delay in Engine 2 data sync.</p>
</div>
<span className="ml-auto px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container-highest text-on-surface-variant uppercase tracking-wide">LOW</span>
</div>
</div>
</div>

<div>
<h4 className="font-body-sm text-body-sm font-semibold text-on-surface uppercase tracking-wide mb-4">Action Queue</h4>
<div className="space-y-2">
<label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant/20 hover:border-primary/50 transition-colors cursor-pointer bg-surface">
<input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
<span className="font-body-sm text-body-sm text-on-surface">Schedule QBR (Quarterly Business Review)</span>
</label>
<label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant/20 hover:border-primary/50 transition-colors cursor-pointer bg-surface">
<input checked="" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
<span className="font-body-sm text-body-sm text-on-surface-variant line-through">Review Engine 3 Performance Metrics</span>
</label>
<label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant/20 hover:border-primary/50 transition-colors cursor-pointer bg-surface">
<input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
<span className="font-body-sm text-body-sm text-on-surface">Update Business DNA in Foundation</span>
</label>
</div>
</div>
</div>
</div>
</div>
</div>
