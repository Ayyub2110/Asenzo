

<header className="h-20 flex justify-between items-center px-10 bg-slate-50/80 backdrop-blur-md z-40">
<div className="flex items-center gap-4">
<div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-sm border border-gray-100">
<span className="font-body-sm text-body-sm font-medium text-gray-800">Settings</span>
</div>
</div>
<div className="flex items-center gap-6">
<div className="relative flex items-center w-64 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
<span className="material-symbols-outlined text-gray-400 text-sm mr-2">search</span>
<input className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-gray-600 placeholder-gray-400" placeholder="Search ASENZO engines..." type="text"/>
<span className="text-xs text-gray-400 bg-gray-100 px-1.5 rounded ml-2">⌘K</span>
</div>
<button className="relative p-2 text-gray-600 hover:text-black transition-colors">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
</button>
<div className="flex items-center gap-3 bg-white rounded-full pl-2 pr-4 py-1.5 shadow-sm border border-gray-100 cursor-pointer">
<img alt="User Avatar" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqTm6y31u6TPHb9tv9jZJwkb_3OwK6G3QzE2wlVn4G4HvFjMZ2BVyf1KB-waRDZotu1fsc0MjqXzpQBzjswcEgLKAL8QI_53snoHGobUNHUL03_mD553H9Hg7_HKrMf-uAWlnzzmk8ubGZPqLSV3LfETHww1nF2ZE_8Tkpg9z5T4FntbOpCUbjWO9w2cw2-BUe3Op2GyDqB11hPFK2ojxCmhklVcZQRb6AYX34rAy9_EAJ26oP51hN17CyRM-zPYlGyUbzd6FeM2j6"/>
<span className="font-body-sm text-body-sm font-medium text-gray-800">Alex Morgan</span>
</div>
</div>
</header>

<div className="flex-1 overflow-y-auto p-10 pt-4 flex gap-8">

<div className="w-[280px] flex-shrink-0">
<h2 className="font-headline-sm text-headline-sm mb-6 px-4">Configuration</h2>
<nav className="flex flex-col gap-2">
<a className="px-4 py-3 rounded-xl font-body-sm text-body-sm text-gray-600 hover:bg-gray-100 transition-colors flex justify-between items-center" href="#">
                        Account
                    </a>
<a className="px-4 py-3 rounded-xl font-body-sm text-body-sm bg-white text-black font-semibold shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden" href="#">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-black rounded-l-xl"></div>
                        System DNA
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
</a>
<a className="px-4 py-3 rounded-xl font-body-sm text-body-sm text-gray-600 hover:bg-gray-100 transition-colors flex justify-between items-center" href="#">
                        Notifications
                    </a>
<a className="px-4 py-3 rounded-xl font-body-sm text-body-sm text-gray-600 hover:bg-gray-100 transition-colors flex justify-between items-center" href="#">
                        Billing
                    </a>
</nav>
</div>

<div className="flex-1 max-w-4xl">
<div className="mb-8">
<h1 className="font-display-lg text-display-lg text-gray-900 mb-2">System DNA Configuration</h1>
<p className="font-body-lg text-body-lg text-gray-500">Define your growth source of truth</p>
</div>
<div className="glass-panel rounded-2xl p-8 mb-8">
<h3 className="font-headline-sm text-headline-sm text-gray-800 mb-6 border-b border-gray-100 pb-4">Core Identity</h3>
<div className="space-y-6">
<div>
<label className="block font-label-caps text-label-caps text-gray-500 mb-2">COMPANY NAME</label>
<input className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow text-gray-800 font-body-lg text-body-lg" type="text" value="Acme Dynamics"/>
</div>
<div>
<label className="block font-label-caps text-label-caps text-gray-500 mb-2">TARGET AUDIENCE</label>
<input className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow text-gray-800 font-body-lg text-body-lg" type="text" value="B2B Founders doing $15k-$50k/mo"/>
</div>
<div>
<label className="block font-label-caps text-label-caps text-gray-500 mb-2">BRAND VOICE</label>
<textarea className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow text-gray-800 font-body-lg text-body-lg resize-none" rows="3">Direct, concise, and data-led</textarea>
</div>
</div>
</div>
<div className="glass-panel rounded-2xl p-8 mb-8">
<div className="flex items-center justify-between">
<div>
<h3 className="font-headline-sm text-headline-sm text-gray-800 mb-1">AI Automation</h3>
<p className="font-body-sm text-body-sm text-gray-500">Enable AI coach for autonomous SOP execution</p>
</div>

<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
<input checked="" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-transform duration-300 ease-in-out transform translate-x-6 border-emerald-500" id="toggle" name="toggle" type="checkbox"/>
<label className="toggle-label block overflow-hidden h-6 rounded-full bg-emerald-500 cursor-pointer transition-colors duration-300 ease-in-out" htmlFor="toggle"></label>
</div>
</div>
</div>
<div className="flex justify-end pt-4">
<button className="bg-[#0B0C0E] text-white font-body-lg text-body-lg font-medium px-8 py-3 rounded-xl hover:bg-black transition-colors shadow-lg shadow-black/10">
                        Save Configuration
                    </button>
</div>
</div>
</div>
