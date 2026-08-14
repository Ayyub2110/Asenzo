import re

# Read current index.html
with open('c:\\Users\\Administrator\\Asenzo\\index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

# The Exact styling classes for active and inactive elements from screen.html
active_class = "sb-item active flex items-center gap-3 bg-white text-slate-900 font-label-md text-label-md rounded-full px-4 py-3 scale-105 transition-all duration-300 cursor-pointer"
inactive_class = "sb-item flex items-center gap-3 text-slate-300 hover:text-white hover:bg-white/10 font-label-md text-label-md rounded-full px-4 py-3 transition-colors cursor-pointer"

# The new ASIDE to replace the old one
new_aside = """    <!-- ══════════════ LEFT SIDEBAR ══════════════ -->
    <aside class="sidebar fixed h-screen w-64 left-0 top-0 shadow-2xl z-50 flex flex-col p-6 rounded-r-3xl transition-all duration-300" style="background: linear-gradient(180deg, #0B0C0E 0%, #1D1D1F 100%); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); border-right: 1px solid rgba(255, 255, 255, 0.1);" id="sidebar">
      
      <div class="mb-12 flex items-center gap-4 cursor-pointer" onclick="go('overview', document.getElementById('nav-overview'))">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10">
          <span class="material-symbols-outlined text-[24px] text-white" style="font-variation-settings: 'FILL' 1;">terminal</span>
        </div>
        <div>
          <h1 class="font-headline-md text-[20px] leading-tight font-bold text-white">ASENZO OS</h1>
          <p class="font-label-md text-[13px] text-slate-400">Founder Control</p>
        </div>
      </div>
      
      <button class="absolute top-8 right-4 text-slate-400 hover:text-white md:hidden" onclick="toggleSidebar()" title="Toggle Sidebar">
        <span class="material-symbols-outlined text-[18px]">chevron_left</span>
      </button>

      <!-- Navigation Tabs -->
      <nav class="sb-nav flex-1 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
        
        <div class="mb-1 mt-2">
          <span class="text-[11px] uppercase tracking-wider text-slate-500 font-bold pl-3">Foundation</span>
        </div>
        <a id="nav-overview" class="{active_class}" onclick="go('overview', this)">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">dashboard</span>
          Overview
        </a>
        <a id="nav-foundation" class="{inactive_class}" onclick="go('foundation', this)">
          <span class="material-symbols-outlined">fingerprint</span>
          Business Truth
        </a>
        
        <div class="mt-4 mb-1">
          <span class="text-[11px] uppercase tracking-wider text-slate-500 font-bold pl-3">Growth Engines</span>
        </div>
        <a id="nav-attention" class="{inactive_class}" onclick="go('attention', this)">
          <span class="material-symbols-outlined">campaign</span>Attention
        </a>
        <a id="nav-conversion" class="{inactive_class}" onclick="go('conversion', this)">
          <span class="material-symbols-outlined">sync_alt</span>Conversion
        </a>
        <a id="nav-revenue" class="{inactive_class}" onclick="go('revenue', this)">
          <span class="material-symbols-outlined">payments</span>Revenue
        </a>
        <a id="nav-delivery" class="{inactive_class}" onclick="go('delivery', this)">
          <span class="material-symbols-outlined">local_shipping</span>Delivery
        </a>
        <a id="nav-retention" class="{inactive_class}" onclick="go('retention', this)">
          <span class="material-symbols-outlined">autorenew</span>Retention
        </a>

        <div class="mt-4 mb-1">
          <span class="text-[11px] uppercase tracking-wider text-slate-500 font-bold pl-3">System Layer</span>
        </div>
        <a id="nav-intelligence" class="{inactive_class}" onclick="go('intelligence', this)">
          <span class="material-symbols-outlined">psychology</span>Intelligence
        </a>
        <a id="nav-actions" class="{inactive_class} justify-between" onclick="go('actions', this)">
          <div class="flex items-center gap-3"><span class="material-symbols-outlined">checklist_rtl</span>Action Queue</div>
          <span id="sidebar-action-count-badge" class="bg-red-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full">3</span>
        </a>
        <a id="nav-operator" class="{inactive_class}" onclick="go('operator', this)">
          <span class="material-symbols-outlined">architecture</span>Operator OS
        </a>
        <a id="nav-calendar" class="{inactive_class}" onclick="go('calendar', this)">
          <span class="material-symbols-outlined">calendar_today</span>Growth Schedule
        </a>
      </nav>

      <div class="mt-auto pt-6">
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-center border border-white/10 rounded-[24px]">
          <div class="w-12 h-12 mx-auto bg-electric-blue rounded-full flex items-center justify-center mb-3 shadow-lg shadow-electric-blue/20">
            <span class="material-symbols-outlined text-white" style="font-variation-settings: 'FILL' 1;">star</span>
          </div>
          <p class="text-[13px] text-slate-300 mb-4" id="sb-fis-score-val">FIS Stable: 84/100</p>
          <button class="w-full py-2 bg-white text-slate-900 rounded-full font-semibold text-sm hover:bg-slate-100 transition-colors" onclick="openPanel()">Ask AI Coach</button>
        </div>
      </div>
    </aside>"""

new_aside = new_aside.replace("{active_class}", active_class).replace("{inactive_class}", inactive_class)

# The new Header and Main Wrapper 
new_main_start = """    <!-- ══════════════ MAIN CONTENT CANVAS ══════════════ -->
    <main class="main-wrapper ml-64 flex-1 h-screen overflow-y-auto hide-scrollbar bg-slate-50 relative transition-all duration-300 text-slate-900">
      
      <header class="topbar sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md px-10 h-20 flex justify-between items-center w-full transition-all duration-300">
        <div>
          <h2 class="font-headline-lg text-[24px] tracking-tight font-bold text-slate-900" id="topbar-title">Overview</h2>
        </div>
        <div class="flex items-center gap-6">
          <div class="relative w-96 cursor-pointer" onclick="openPalette()">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input class="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-slate-200 hover:border-blue-400 focus:ring-2 focus:ring-electric-blue focus:border-transparent text-slate-900 font-label-md shadow-sm outline-none transition-all cursor-pointer" placeholder="Search anything (Press Ctrl+K)" type="text" readonly/>
          </div>
          <div class="flex items-center gap-4">
            <button class="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors text-slate-600 relative">
              <span class="material-symbols-outlined">notifications</span>
              <span class="absolute top-0 right-0 w-3 h-3 bg-electric-blue rounded-full border-2 border-white"></span>
            </button>
            <div class="flex items-center gap-2 cursor-pointer">
              <!-- Using the founder image logic. Here we just use a generic profile or the one from Asenzo -->
              <img alt="Profile" class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvKuTHxQEBhtUL1Xk6_BbKmJGggF7YOqSolpY8tUenyc5O6sLzEPwbvr5nKiw0BwbDEopuoK6RBhPB6hyGUUD7pj_9Au_7bAmPWEXASC7AuQGibBo-YjQ4w_CgGesTLbqq1QnfOf5FO3YpR0AwHvSj3NXt2TbPdXMPX-XkxrnTEyhK-xYNTEfFOSJyHiW-Wrr1tXQSSW8cYvj3Sx5msyX1xWfTB5zux4WkR2aKVjRldGr2Vcp8gGPs7Q"/>
              <span class="material-symbols-outlined text-slate-400">expand_more</span>
            </div>
          </div>
        </div>
      </header>"""

# Using Regex to replace the old aside and header
content = re.sub(r'<!-- ══════════════ LEFT SIDEBAR ══════════════ -->.*?<!-- ══════════════ MAIN CONTENT CANVAS ══════════════ -->', new_aside + "\n\n", idx_content, flags=re.DOTALL)

content = re.sub(r'<div class="main-wrapper ml-\[280px\].*?</header>', new_main_start, content, flags=re.DOTALL)

# Because we changed <div class="main-wrapper ..."> to <main class="...">, we need to ensure the closing tag is </main>
# There's a closing div for main-wrapper at the very end of index.html.
# The end of index.html has:
#       </div> <!-- End of Module Content Section -->
#     </div> <!-- End of main-wrapper -->
#   </div> <!-- End of app-shell -->
# Let's replace the ending div for main-wrapper with </main>
content = re.sub(r'</div> <!-- End of main-wrapper -->', '</main> <!-- End of main-wrapper -->', content)
content = re.sub(r'</div>\s*</div>\s*<!-- ══════════════ OVERLAYS ══════════════ -->', '</main>\n  </div>\n\n  <!-- ══════════════ OVERLAYS ══════════════ -->', content)

with open('c:\\Users\\Administrator\\Asenzo\\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html layout.")
