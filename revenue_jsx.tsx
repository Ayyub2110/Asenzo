

<header className="fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-container-desktop z-30 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border-b border-black/5 shadow-sm px-6">
<div className="flex items-center">
<h1 className="font-headline-md text-headline-md font-bold tracking-tighter text-on-surface">ASENZO OS</h1>
</div>
<div className="flex items-center gap-4">
<div className="relative hidden md:flex items-center">
<span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-sm">search</span>
<input className="bg-surface-container-low border-none rounded-full py-1.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20 w-64 transition-all" placeholder="Search documentation..." type="text"/>
</div>
<div className="flex items-center gap-2">
<button className="p-2 text-on-surface-variant hover:bg-secondary-container/50 rounded-full transition-all flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]" data-weight="fill">notifications</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-secondary-container/50 rounded-full transition-all flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">grid_view</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-secondary-container/50 rounded-full transition-all flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">account_circle</span>
</button>
<button className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-sm font-medium ml-2 hover:bg-primary/90 transition-colors flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">add</span> New
                </button>
</div>
</div>
</header>

<nav className="fixed left-0 top-0 bottom-0 flex flex-col z-40 bg-[#0B0C0E] text-white h-[calc(100vh-48px)] w-64 m-6 rounded-2xl shadow-2xl shadow-black/40">
<div className="p-6">
<div className="flex items-center gap-3 mb-8">
<div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-[20px]" data-weight="fill">token</span>
</div>
<div>
<h2 className="font-headline-sm text-headline-sm font-bold text-white tracking-tight leading-tight">ASENZO OS</h2>
<p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mt-0.5">Founder Control</p>
</div>
</div>
<div className="space-y-1 mb-8">
<p className="px-4 text-[10px] text-white/40 font-semibold tracking-wider uppercase mb-2">Engines</p>
<a className="flex items-center gap-3 text-white/60 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors" href="#">
<span className="material-symbols-outlined text-[20px]">space_dashboard</span>
<span className="font-body-sm text-body-sm font-medium">Command</span>
</a>
<a className="flex items-center gap-3 text-white/60 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors" href="#">
<span className="material-symbols-outlined text-[20px]">auto_graph</span>
<span className="font-body-sm text-body-sm font-medium">Strategy</span>
</a>
<a className="flex items-center gap-3 text-white/60 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors" href="#">
<span className="material-symbols-outlined text-[20px]">psychology</span>
<span className="font-body-sm text-body-sm font-medium">Intelligence</span>
</a>
<a className="flex items-center gap-3 text-white/60 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors" href="#">
<span className="material-symbols-outlined text-[20px]">architecture</span>
<span className="font-body-sm text-body-sm font-medium">Execution</span>
</a>
<a className="flex items-center gap-3 bg-white text-[#0B0C0E] px-4 py-2.5 rounded-xl shadow-lg scale-105 transition-all" href="#">
<span className="material-symbols-outlined text-[20px]" data-weight="fill">payments</span>
<span className="font-body-sm text-body-sm font-bold">Capital</span>
</a>
<a className="flex items-center gap-3 text-white/60 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors" href="#">
<span className="material-symbols-outlined text-[20px]">hub</span>
<span className="font-body-sm text-body-sm font-medium">Network</span>
</a>
</div>
</div>
<div className="mt-auto p-6 space-y-1">
<div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/10">
<p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-1">FIS Score</p>
<div className="flex items-end gap-2">
<span className="font-display-lg text-display-lg font-bold text-white leading-none">94</span>
<span className="text-emerald-400 text-xs font-medium mb-1">Optimal</span>
</div>
</div>
<a className="flex items-center gap-3 text-white/60 hover:text-white hover:bg-white/5 px-4 py-2 rounded-xl transition-colors text-sm" href="#">
<span className="material-symbols-outlined text-[18px]">settings</span>
                Settings
            </a>
<a className="flex items-center gap-3 text-white/60 hover:text-white hover:bg-white/5 px-4 py-2 rounded-xl transition-colors text-sm" href="#">
<span className="material-symbols-outlined text-[18px]">help</span>
                Support
            </a>
</div>
</nav>

<main className="ml-[280px] pt-24 px-8 pb-12 w-full max-w-[1440px] flex flex-col gap-6">

<section className="flex gap-4 overflow-x-auto pb-2">

<div className="bg-surface-container-lowest border border-rose-100 rounded-2xl p-5 min-w-[300px] flex-shrink-0 shadow-sm relative overflow-hidden">
<div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
<div className="flex justify-between items-start mb-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-rose-500 text-[18px]">warning</span>
<span className="font-label-caps text-label-caps text-rose-900">Overdue Payment</span>
</div>
<span className="text-xs text-on-surface-variant font-medium">3 days</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Apex Dynamics</h3>
<p className="font-body-lg text-body-lg font-bold text-on-surface mb-4">$45,200.00</p>
<button className="w-full bg-rose-50 text-rose-700 py-1.5 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors">Send Reminder</button>
</div>

<div className="bg-surface-container-lowest border border-amber-100 rounded-2xl p-5 min-w-[300px] flex-shrink-0 shadow-sm relative overflow-hidden">
<div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
<div className="flex justify-between items-start mb-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-amber-500 text-[18px]">error</span>
<span className="font-label-caps text-label-caps text-amber-900">Compliance Blocker</span>
</div>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Nexus Growth</h3>
<p className="text-sm text-on-surface-variant mb-4 line-clamp-1">Missing updated W-9 form for Q3</p>
<button className="w-full bg-amber-50 text-amber-700 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors">Request Document</button>
</div>

<div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 min-w-[300px] flex-shrink-0 shadow-sm">
<div className="flex justify-between items-start mb-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">schedule</span>
<span className="font-label-caps text-label-caps text-on-surface-variant">Expected Today</span>
</div>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Vanguard Tech</h3>
<p className="font-body-lg text-body-lg font-bold text-on-surface mb-4">$12,500.00</p>
<button className="w-full bg-surface-container text-on-surface py-1.5 rounded-lg text-sm font-medium hover:bg-surface-container-high transition-colors">View Details</button>
</div>
</section>

<div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)] min-h-[600px]">

<div className="col-span-4 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col overflow-hidden">
<div className="p-6 border-b border-outline-variant/20 bg-surface/50">
<h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-1">Active Revenue</h2>
<p className="text-sm text-on-surface-variant mb-4">Current collection cycle</p>
<div className="bg-surface-container p-4 rounded-xl">
<p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Total Expected</p>
<p className="font-display-lg text-display-lg font-bold text-primary tracking-tight">$842,500</p>
</div>
</div>
<div className="flex-1 overflow-y-auto p-2 space-y-1">

<button className="w-full text-left p-4 rounded-xl hover:bg-surface-container-low transition-colors flex items-center justify-between group">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">VX</div>
<div>
<h4 className="font-headline-sm text-sm font-semibold text-on-surface">Vanguard Tech</h4>
<p className="text-xs text-on-surface-variant">Due Oct 15</p>
</div>
</div>
<div className="text-right">
<p className="font-body-sm text-body-sm font-semibold text-on-surface">$12,500</p>
<span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 mt-1">On Track</span>
</div>
</button>

<button className="w-full text-left p-4 rounded-xl bg-surface-container border border-outline-variant/30 transition-colors flex items-center justify-between group relative">
<div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"></div>
<div className="flex items-center gap-3 ml-2">
<div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-sm border border-primary/10">NX</div>
<div>
<h4 className="font-headline-sm text-sm font-semibold text-on-surface">Nexus Growth</h4>
<p className="text-xs text-on-surface-variant">Net 30 Terms</p>
</div>
</div>
<div className="text-right">
<p className="font-body-sm text-body-sm font-semibold text-on-surface">$34,000</p>
<span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 mt-1">Action Req</span>
</div>
</button>

<button className="w-full text-left p-4 rounded-xl hover:bg-surface-container-low transition-colors flex items-center justify-between group">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold text-sm">SL</div>
<div>
<h4 className="font-headline-sm text-sm font-semibold text-on-surface">Stellar Labs</h4>
<p className="text-xs text-on-surface-variant">Collected Today</p>
</div>
</div>
<div className="text-right">
<p className="font-body-sm text-body-sm font-semibold text-on-surface-variant line-through opacity-70">$8,200</p>
<span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-surface-container-high text-on-surface-variant mt-1">Cleared</span>
</div>
</button>

<button className="w-full text-left p-4 rounded-xl hover:bg-surface-container-low transition-colors flex items-center justify-between group">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">OP</div>
<div>
<h4 className="font-headline-sm text-sm font-semibold text-on-surface">Optima Partners</h4>
<p className="text-xs text-on-surface-variant">Due Nov 01</p>
</div>
</div>
<div className="text-right">
<p className="font-body-sm text-body-sm font-semibold text-on-surface">$150,000</p>
<span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 mt-1">On Track</span>
</div>
</button>
</div>
</div>

<div className="col-span-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col overflow-hidden glass-panel relative">

<div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>

<div className="p-8 border-b border-outline-variant/10">
<div className="flex justify-between items-start mb-6">
<div className="flex items-center gap-4">
<div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface font-bold text-xl shadow-inner">
                                NX
                            </div>
<div>
<div className="flex items-center gap-3 mb-1">
<h2 className="font-display-lg text-display-lg-mobile font-bold text-on-surface">Nexus Growth</h2>
<span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Action Required</span>
</div>
<p className="text-sm text-on-surface-variant flex items-center gap-4">
<span>ID: ACC-8492</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span>Enterprise Tier</span>
</p>
</div>
</div>
<div className="text-right">
<p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Total Outstanding</p>
<p className="font-display-lg text-display-lg font-bold text-primary tracking-tight">$34,000.00</p>
</div>
</div>
<div className="flex gap-3">
<button className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Log Payment</button>
<button className="bg-surface-container-lowest border border-outline-variant text-on-surface px-5 py-2 rounded-lg text-sm font-medium hover:bg-surface-container transition-colors shadow-sm flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">mail</span> Email Client
                        </button>
<button className="bg-surface-container-lowest border border-outline-variant text-on-surface px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-container transition-colors shadow-sm ml-auto">
<span className="material-symbols-outlined text-[20px]">more_horiz</span>
</button>
</div>
</div>
<div className="flex-1 overflow-y-auto p-8 flex gap-8">

<div className="flex-1 space-y-8">

<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-amber-500">warning</span>
                                Revenue Risks
                            </h3>
<div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 flex items-start gap-4">
<div className="bg-amber-100 p-2 rounded-lg text-amber-700">
<span className="material-symbols-outlined">description</span>
</div>
<div className="flex-1">
<h4 className="text-sm font-semibold text-amber-900 mb-1">Missing updated W-9 form</h4>
<p className="text-xs text-amber-800/80 mb-3">Client compliance department requires an updated W-9 for Q3 processing before releasing the latest invoice batch.</p>
<button className="text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded transition-colors">Generate &amp; Send W-9</button>
</div>
</div>
</div>

<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Open Invoices</h3>
<div className="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-lowest">
<table className="w-full text-left text-sm">
<thead className="bg-surface-container-low border-b border-outline-variant/30">
<tr>
<th className="px-4 py-3 font-medium text-on-surface-variant">Invoice</th>
<th className="px-4 py-3 font-medium text-on-surface-variant">Date Issued</th>
<th className="px-4 py-3 font-medium text-on-surface-variant">Status</th>
<th className="px-4 py-3 font-medium text-on-surface-variant text-right">Amount</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/10">
<tr className="hover:bg-surface-container-lowest/50 transition-colors">
<td className="px-4 py-3 font-medium text-primary">INV-2024-089</td>
<td className="px-4 py-3 text-on-surface-variant">Oct 01, 2024</td>
<td className="px-4 py-3">
<span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200/50">Blocked</span>
</td>
<td className="px-4 py-3 font-medium text-right text-primary">$24,000.00</td>
</tr>
<tr className="hover:bg-surface-container-lowest/50 transition-colors">
<td className="px-4 py-3 font-medium text-primary">INV-2024-092</td>
<td className="px-4 py-3 text-on-surface-variant">Oct 15, 2024</td>
<td className="px-4 py-3">
<span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-surface-container-high text-on-surface-variant border border-outline-variant/30">Pending</span>
</td>
<td className="px-4 py-3 font-medium text-right text-primary">$10,000.00</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>

<div className="w-72 flex-shrink-0">
<div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 sticky top-0">
<h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-[16px]">task_alt</span> Next Actions
                            </h3>
<ul className="space-y-3">
<li className="flex items-start gap-3">
<input className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary rounded-sm bg-surface-container-lowest cursor-pointer" type="checkbox"/>
<div>
<p className="text-sm font-medium text-on-surface">Review SLA Terms</p>
<p className="text-xs text-on-surface-variant mt-0.5">Check for penalty clauses regarding late compliance documentation.</p>
</div>
</li>
<li className="flex items-start gap-3">
<input checked="" className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary rounded-sm bg-surface-container-lowest cursor-pointer" type="checkbox"/>
<div>
<p className="text-sm font-medium text-on-surface-variant line-through opacity-70">Ping internal accounting</p>
</div>
</li>
<li className="flex items-start gap-3">
<input className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary rounded-sm bg-surface-container-lowest cursor-pointer" type="checkbox"/>
<div>
<p className="text-sm font-medium text-on-surface">Draft client update email</p>
</div>
</li>
</ul>
<button className="w-full mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-primary hover:bg-surface-container py-2 rounded-lg transition-colors border border-dashed border-outline-variant/50">
<span className="material-symbols-outlined text-[16px]">add</span> Add Action Item
                            </button>
</div>
</div>
</div>
</div>
</div>
</main>
