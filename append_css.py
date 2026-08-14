css = """
.glass-panel {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(194, 198, 213, 0.3);
}

.sidebar-glass {
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(2, 6, 23, 0.95) 100%);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.metric-card {
    background: #ffffff;
    border: 1px solid rgba(194, 198, 213, 0.3);
}

.ambient-shadow {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
}
"""
with open('styles.css', 'a', encoding='utf-8') as f:
    f.write(css)
print('added css to styles.css')
