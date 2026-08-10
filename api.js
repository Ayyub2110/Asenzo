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
  async getKnowledgeSourceById(id) { return apiFetch(`/knowledge-sources/${id}`); },
  async searchKnowledgeChunks(query) { return apiFetch(`/knowledge-sources/search?q=${encodeURIComponent(query)}`); },
  async deleteKnowledgeSource(id) { return apiFetch(`/knowledge-sources/${id}`, { method: 'DELETE' }); },

  // Content Engine (11-Stage Lifecycle State Machine)
  async getContents(status) { return apiFetch(status ? `/contents?status=${status}` : '/contents'); },
  async createContent(data) { return apiFetch('/contents', { method: 'POST', body: data }); },
  async updateContent(id, data) { return apiFetch(`/contents/${id}`, { method: 'PUT', body: data }); },
  async deleteContent(id) { return apiFetch(`/contents/${id}`, { method: 'DELETE' }); },

  // Analytics & Script Generation
  async getAnalytics() { return apiFetch('/attention/analytics'); },
  async generateScript(payload) { return apiFetch('/attention/generate-script', { method: 'POST', body: payload }); },
  async getRecommendations() { return apiFetch('/recommendations'); },
  async applyRecommendation(id) { return apiFetch(`/recommendations/${id}/apply`, { method: 'POST' }); },
  async getAuditLogs() { return apiFetch('/audit-logs'); }
};
