

<header className="full-width top-0 sticky bg-background/80 backdrop-blur-md flex justify-between items-center px-container-padding py-4 z-40">
<div className="flex items-center gap-6">
<h2 className="font-headline-md text-headline-md text-primary">Executive Dashboard</h2>
<div className="hidden lg:flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full border border-surface-variant">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-primary" style="font-variation-settings: 'FILL' 1;">sprint</span>
<span className="font-label-caps text-label-caps text-on-surface-variant">Upcoming Sprints: <strong className="text-primary">4</strong></span>
</div>
<div className="w-px h-4 bg-outline-variant"></div>
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-green-500"></span>
<span className="font-label-caps text-label-caps text-on-surface-variant">Sync: Active (Google Workspace)</span>
</div>
</div>
</div>
<div className="flex items-center gap-4">
<div className="relative hidden md:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input className="pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all" placeholder="Search calendar..." type="text"/>
</div>
<div className="flex gap-2 text-on-surface-variant">
<button className="p-2 hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">notifications</span></button>
<button className="p-2 hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">chat_bubble</span></button>
<button className="p-2 hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">apps</span></button>
</div>
<img className="w-10 h-10 rounded-full border-2 border-surface-container-lowest shadow-sm object-cover ml-2" data-alt="A professional headshot of an executive user in a modern office environment. Soft, flattering lighting with a blurred background. Corporate yet approachable vibe. Neutral color palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVDPB3S3mN6zWyKSSUynE031XjKLKqA9MAx4QlK773Peym6CphCV5V_6fqNFSgIBAqr27yE_4qXugRnNV7i9rcyTTyqQ7tlmrGNFVDQa_0HPGflUMVOduP6-qmPsbbBKBJrIeWerM8a74k8cCrgw4SmyeIsYNeEcLqBWdlhNYSrHWQSAp4r2e4n4WCTYgyUVRMdexiZMCEf7-lYSt7sKDOR4Y0F-rs2osJTFR-athiCTJF1itAtPzR4IXeRpltvokBxIzzV2Z0gS7T"/>
</div>
</header>

<div className="flex-1 p-container-padding flex gap-card-gap overflow-hidden h-[calc(100vh-80px)]">

<div className="flex-1 bg-surface-container-lowest rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col border border-surface-variant">

<div className="p-6 border-b border-surface-variant flex justify-between items-center">
<div>
<h3 className="font-headline-sm text-headline-sm text-primary">October 2023</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Week 41</p>
</div>
<div className="flex items-center gap-3">
<button className="px-4 py-2 border border-outline-variant rounded-lg font-label-caps text-label-caps hover:bg-surface-container transition-colors">Today</button>
<div className="flex border border-outline-variant rounded-lg overflow-hidden">
<button className="p-2 hover:bg-surface-container transition-colors border-r border-outline-variant"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
<button className="p-2 hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
</div>
<div className="flex bg-surface-container-low rounded-lg p-1 border border-outline-variant ml-4">
<button className="px-3 py-1 rounded bg-white shadow-sm font-label-caps text-label-caps">Week</button>
<button className="px-3 py-1 rounded text-on-surface-variant font-label-caps text-label-caps hover:text-primary">Month</button>
</div>
</div>
</div>

<div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-surface-variant bg-surface-bright">
<div className="p-4"></div> 
<div className="p-4 text-center border-l border-surface-variant">
<span className="font-label-caps text-label-caps text-on-surface-variant block">Mon</span>
<span className="font-headline-sm text-headline-sm mt-1 block">09</span>
</div>
<div className="p-4 text-center border-l border-surface-variant">
<span className="font-label-caps text-label-caps text-on-surface-variant block">Tue</span>
<span className="font-headline-sm text-headline-sm mt-1 block">10</span>
</div>
<div className="p-4 text-center border-l border-surface-variant relative">
<span className="font-label-caps text-label-caps text-primary font-bold block">Wed</span>
<span className="font-headline-sm text-headline-sm mt-1 block bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto">11</span>
</div>
<div className="p-4 text-center border-l border-surface-variant">
<span className="font-label-caps text-label-caps text-on-surface-variant block">Thu</span>
<span className="font-headline-sm text-headline-sm mt-1 block">12</span>
</div>
<div className="p-4 text-center border-l border-surface-variant">
<span className="font-label-caps text-label-caps text-on-surface-variant block">Fri</span>
<span className="font-headline-sm text-headline-sm mt-1 block">13</span>
</div>
</div>

<div className="flex-1 overflow-y-auto calendar-grid relative pb-10">

<div className="absolute left-[60px] right-0 top-[220px] h-px bg-red-400 z-20 pointer-events-none">
<div className="absolute -left-2 -top-1.5 w-3 h-3 rounded-full bg-red-400"></div>
</div>

<div className="time-col"><span>9 AM</span></div>
<div className="calendar-cell"></div>
<div className="calendar-cell"></div>
<div className="calendar-cell">
<div className="event-chip event-blue top-2 h-[150px] shadow-sm z-10 border border-blue-100/50 ring-2 ring-primary">
<div className="font-label-caps text-label-caps opacity-70 mb-1">9:00 - 10:30 AM</div>
<div className="font-body-sm text-body-sm font-semibold leading-tight">Discovery Call — SaaSify</div>
<div className="mt-2 flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">videocam</span>
<span className="text-xs opacity-80">Zoom</span>
</div>
</div>
</div>
<div className="calendar-cell"></div>
<div className="calendar-cell"></div>

<div className="time-col"><span>10 AM</span></div>
<div className="calendar-cell"></div>
<div className="calendar-cell">
<div className="event-chip event-slate top-4 h-[70px] shadow-sm z-10">
<div className="font-label-caps text-label-caps opacity-70 mb-1">10:15 - 11:00 AM</div>
<div className="font-body-sm text-body-sm font-semibold leading-tight">Engine 1 Sync</div>
</div>
</div>
<div className="calendar-cell"></div> 
<div className="calendar-cell"></div>
<div className="calendar-cell"></div>

<div className="time-col"><span>11 AM</span></div>
<div className="calendar-cell">
<div className="event-chip event-silver top-0 h-[110px] shadow-sm z-10">
<div className="font-label-caps text-label-caps opacity-70 mb-1">11:00 - 12:30 PM</div>
<div className="font-body-sm text-body-sm font-semibold leading-tight">Product Review Q4</div>
</div>
</div>
<div className="calendar-cell"></div>
<div className="calendar-cell"></div>
<div className="calendar-cell">
<div className="event-chip event-slate top-8 h-[50px] shadow-sm z-10">
<div className="font-label-caps text-label-caps opacity-70 mb-1">11:30 - 12:00 PM</div>
<div className="font-body-sm text-body-sm font-semibold leading-tight">Quick Catchup</div>
</div>
</div>
<div className="calendar-cell"></div>

<div className="time-col"><span>12 PM</span></div>
<div className="calendar-cell"></div>
<div className="calendar-cell"></div>
<div className="calendar-cell"></div>
<div className="calendar-cell"></div>
<div className="calendar-cell"></div>

<div className="time-col"><span>1 PM</span></div>
<div className="calendar-cell"></div>
<div className="calendar-cell"></div>
<div className="calendar-cell">
<div className="event-chip event-blue top-4 h-[90px] shadow-sm z-10">
<div className="font-label-caps text-label-caps opacity-70 mb-1">1:15 - 2:30 PM</div>
<div className="font-body-sm text-body-sm font-semibold leading-tight">Founder's Round Table</div>
</div>
</div>
<div className="calendar-cell"></div>
<div className="calendar-cell">
<div className="event-chip event-silver top-0 h-[70px] shadow-sm z-10">
<div className="font-label-caps text-label-caps opacity-70 mb-1">1:00 - 2:00 PM</div>
<div className="font-body-sm text-body-sm font-semibold leading-tight">Team Lunch & Learn</div>
</div>
</div>
</div>
</div>

<div className="w-[380px] bg-surface-container-lowest rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.08)] flex flex-col border border-surface-variant overflow-hidden shrink-0 hidden xl:flex relative">

<div className="h-32 bg-gradient-to-br from-blue-50 to-slate-100 border-b border-surface-variant relative p-6 flex flex-col justify-end">
<span className="material-symbols-outlined absolute top-6 right-6 text-on-surface-variant hover:text-primary cursor-pointer bg-white/50 backdrop-blur rounded-full p-1 border border-white/60">close</span>
<div className="flex items-center gap-2 mb-2">
<span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">External</span>
<span className="font-label-caps text-label-caps text-on-surface-variant">9:00 - 10:30 AM</span>
</div>
<h3 className="font-headline-sm text-headline-sm font-bold text-primary">Discovery Call — SaaSify</h3>
</div>
<div className="flex-1 overflow-y-auto p-6 space-y-8">

<section>
<h4 className="font-label-caps text-label-caps text-on-surface-variant mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-[16px]">group</span> Attendees
                        </h4>
<div className="flex flex-col gap-3">
<div className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-lg transition-colors border border-transparent hover:border-surface-variant">
<img className="w-8 h-8 rounded-full object-cover" data-alt="Professional headshot of a female executive in a modern bright setting. Minimalist style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb11I-yoj2_M5BGyCtxRQMpevQJMm3WGqEqqTPlX79o8QCFBHYEzIzPKJSGQH6H5d09BLg6Cv43SbPi3VZXsGZF4P-TAdd_s60GCN_GFCSZxGa6bnAAQtXO1s5BF0w6mf22CCUep7zkjspXN_QcGFSI9LB70egb_IYHb44m2pQX1hSwDnvD-iUoPGLC4IhNGlymcPfCtdPG65ssqTRtmSPmCllr28axyNQZXataUey5TS0xVRghgC30OVvT5PcryznoKHgFw0NLMnr"/>
<div>
<p className="font-body-sm text-body-sm font-medium text-primary">Sarah Jenkins</p>
<p className="text-xs text-on-surface-variant">CEO, SaaSify</p>
</div>
</div>
<div className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-lg transition-colors border border-transparent hover:border-surface-variant">
<img className="w-8 h-8 rounded-full object-cover" data-alt="Professional headshot of a male manager with glasses in a sleek office." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvt0BpRykhCqjoASGXPqKqKCZAbXa0egsmCXu09dHcCbhiQiq_6ApPQz7PKM-VhagzRLgw33rC1zQ-kphViLzazgGP__f7bgWY5hx9ls969vVvRorHT_D8Vam6y2Wp2lO2ELVu5Oi1SPDrisCTuVWWPrWBUm4D9IRtRc_LubR7o5e1eHz_E5cBlSy3qUd_JHwjEyHyvMPZ-Cuc9CDwrmlZYByWptJX41woqYZYsBczFRVuYXSJ4IH0QAweLhJ-2gPRZN3fJ4YS_Ag1"/>
<div>
<p className="font-body-sm text-body-sm font-medium text-primary">Alex Morgan</p>
<p className="text-xs text-on-surface-variant">Growth Lead</p>
</div>
</div>
</div>
</section>

<section>
<h4 className="font-label-caps text-label-caps text-on-surface-variant mb-3 flex items-center gap-2">
<span className="material-symbols-outlined text-[16px]">folder_open</span> Context
                        </h4>
<div className="bg-surface-container-low p-3 rounded-lg border border-surface-variant inline-flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-purple-500"></span>
<span className="font-body-sm text-body-sm font-medium">Engine 2 — Conversion Pipeline</span>
</div>
</section>

<section>
<div className="flex items-center justify-between mb-3">
<h4 className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-purple-600">auto_awesome</span> AI Pre-Brief
                            </h4>
<span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold uppercase">Generated</span>
</div>
<div className="glass-panel p-4 rounded-xl shadow-sm relative overflow-hidden bg-white/60">

<div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-200/40 rounded-full blur-xl pointer-events-none"></div>
<p className="font-body-sm text-body-sm text-on-surface relative z-10 leading-relaxed">
                                Sarah has watched the VSL. 
                                <span className="font-semibold text-green-700 bg-green-50 px-1 rounded">FIS Score 94</span>. 
                                <br/><br/>
                                Key objection identified from pre-call survey: <strong>Onboarding speed and integration friction.</strong>
</p>
</div>
</section>

<section>
<h4 className="font-label-caps text-label-caps text-on-surface-variant mb-3 flex items-center gap-2">
<span className="material-symbols-outlined text-[16px]">task_alt</span> Action Items
                        </h4>
<div className="space-y-2">
<label className="flex items-start gap-3 p-3 rounded-lg border border-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer group">
<input className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
<span className="font-body-sm text-body-sm group-hover:text-primary transition-colors">Review VSL heatmap for drop-off points</span>
</label>
<label className="flex items-start gap-3 p-3 rounded-lg border border-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer group">
<input className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
<span className="font-body-sm text-body-sm group-hover:text-primary transition-colors">Prepare customized ROI calculator scenario</span>
</label>
</div>
</section>
</div>

<div className="p-4 border-t border-surface-variant bg-surface-bright flex gap-2">
<button className="flex-1 bg-primary text-white py-2.5 rounded-lg font-body-sm text-body-sm font-medium hover:bg-gray-800 transition-colors flex justify-center items-center gap-2">
<span className="material-symbols-outlined text-[18px]">videocam</span> Join Call
                    </button>
<button className="px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">more_horiz</span>
</button>
</div>
</div>
</div>
