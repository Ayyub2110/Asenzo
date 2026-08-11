'use strict';

// ══════════════════════════════════════════════════════════════
// ASENZO GROWTH OPERATING SYSTEM — FRONTEND API CLIENT
// ══════════════════════════════════════════════════════════════

const API_BASE = 'http://localhost:3001/api';

async function apiFetch(endpoint, options = {}) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      const msg = data.error || data.details?.[0]?.message || 'API request failed';
      throw new Error(msg);
    }

    return data;
  } catch (err) {
    console.warn(`[ASENZO API Warning] ${endpoint}:`, err.message);
    throw err;
  }
}

window.ASENZO_API = {
  // Business DNA Positioning Suite
  async getPositioning() { return apiFetch('/positioning'); },
  async savePositioning(data) { return apiFetch('/positioning', { method: 'POST', body: data }); },
  async generatePositioningAlternatives() { return apiFetch('/positioning/generate-alternatives', { method: 'POST' }); },
  async acceptPositioningAlternative(alternativeIndex) { return apiFetch('/positioning/accept-alternative', { method: 'POST', body: { alternativeIndex } }); },
  async restorePositioningVersion(versionNumber) { return apiFetch(`/positioning/restore-version/${versionNumber}`, { method: 'POST' }); },

  // ICP & Offer Suite
  async getIcp() { return apiFetch('/icp'); },
  async saveIcp(data) { return apiFetch('/icp', { method: 'POST', body: data }); },
  async getOffer() { return apiFetch('/offer'); },
  async saveOffer(data) { return apiFetch('/offer', { method: 'POST', body: data }); },

  // Founder & Brand System
  async getFounderProfile() { return apiFetch('/founder/profile'); },
  async saveFounderProfile(data) { return apiFetch('/founder/profile', { method: 'POST', body: data }); },
  async getBrandProfile() { return apiFetch('/brand/profile'); },
  async saveBrandProfile(data) { return apiFetch('/brand/profile', { method: 'POST', body: data }); },
  async getVoiceProfile() { return apiFetch('/founder/voice-profile'); },

  // Knowledge Ingestion Pipeline & Vault
  async ingestKnowledgeSource(data) { return apiFetch('/knowledge-sources/ingest', { method: 'POST', body: data }); },
  async getKnowledgeSources() { return apiFetch('/knowledge-sources'); },
  async getKnowledge() { return apiFetch('/knowledge-sources'); },
  async getKnowledgeSourceById(id) { return apiFetch(`/knowledge-sources/${id}`); },
  async searchKnowledgeChunks(query) { return apiFetch(`/knowledge-sources/search?q=${encodeURIComponent(query)}`); },
  async deleteKnowledgeSource(id) { return apiFetch(`/knowledge-sources/${id}`, { method: 'DELETE' }); },

  // Content Engine (11-Stage Lifecycle State Machine)
  async getContents(status) { return apiFetch(status ? `/contents?status=${status}` : '/contents'); },
  async createContent(data) { return apiFetch('/contents', { method: 'POST', body: data }); },
  async updateContent(id, data) { return apiFetch(`/contents/${id}`, { method: 'PUT', body: data }); },
  async deleteContent(id) { return apiFetch(`/contents/${id}`, { method: 'DELETE' }); },

  // Legacy aliases used by existing UI
  async getContentItems() { return this.getContents(); },
  async createContentItem(data) { return this.createContent(data); },

  // Content Strategy — Pillars
  async getPillars(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/pillars${qs}`);
  },
  async createPillar(data) { return apiFetch('/pillars', { method: 'POST', body: data }); },
  async updatePillar(id, data) { return apiFetch(`/pillars/${id}`, { method: 'PUT', body: data }); },
  async archivePillar(id) { return apiFetch(`/pillars/${id}/archive`, { method: 'POST' }); },
  async deletePillar(id) { return apiFetch(`/pillars/${id}`, { method: 'DELETE' }); },

  // Content Idea Engine
  async getIdeas(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/ideas${qs}`);
  },
  async createIdea(data) { return apiFetch('/ideas', { method: 'POST', body: data }); },
  async updateIdea(id, data) { return apiFetch(`/ideas/${id}`, { method: 'PUT', body: data }); },
  async scoreIdea(id) { return apiFetch(`/ideas/${id}/score`, { method: 'POST' }); },
  async archiveIdea(id) { return apiFetch(`/ideas/${id}/archive`, { method: 'POST' }); },
  async deleteIdea(id) { return apiFetch(`/ideas/${id}`, { method: 'DELETE' }); },
  async checkIdeaDuplicate(data) { return apiFetch('/ideas/check-duplicate', { method: 'POST', body: data }); },
  async generateIdeas(data) { return apiFetch('/ideas/generate', { method: 'POST', body: data }); },
  async convertIdeaToContent(id, data) { return apiFetch(`/ideas/${id}/convert`, { method: 'POST', body: data || {} }); },

  // Market Intelligence
  async getMarketIntel() { return apiFetch('/market-intel'); },
  async addMarketIntel(data) { return apiFetch('/market-intel', { method: 'POST', body: data }); },

  // Analytics & Legacy Script Generation
  async getAnalytics() { return apiFetch('/attention/analytics'); },
  async generateScript(payload) { return apiFetch('/attention/generate-script', { method: 'POST', body: payload }); },

  // Production-Grade AI Hook & Script Studio
  async generateHooks(payload) { return apiFetch('/generate/hooks', { method: 'POST', body: payload }); },
  async generateProductionScript(payload) { return apiFetch('/generate/script', { method: 'POST', body: payload }); },
  async validateGuardrails(payload) { return apiFetch('/generate/validate', { method: 'POST', body: payload }); },
  async saveContentVersion(contentId, payload) { return apiFetch(`/contents/${contentId}/versions`, { method: 'POST', body: payload }); },
  async getContentVersions(contentId) { return apiFetch(`/contents/${contentId}/versions`); },

  async getRecommendations() { return apiFetch('/recommendations'); },
  async applyRecommendation(id) { return apiFetch(`/recommendations/${id}/apply`, { method: 'POST' }); },
  async getAuditLogs() { return apiFetch('/audit-logs'); }
};
