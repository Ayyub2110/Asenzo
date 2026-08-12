'use strict';

// ══════════════════════════════════════════════════════════════
// ASENZO GROWTH OPERATING SYSTEM — FRONTEND API CLIENT
// ══════════════════════════════════════════════════════════════

const API_BASE = 'http://localhost:3001/api';

async function apiFetch(endpoint, options = {}, retries = 3) {
  const method = (options.method || 'GET').toUpperCase();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token_biz_default',
      ...(options.headers || {})
    },
    ...options
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  let attempt = 0;
  let lastError;

  while (attempt < retries) {
    try {
      attempt++;
      const res = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await res.json();

      if (!res.ok) {
        const msg = data.error || data.details?.[0]?.message || `API request failed (${res.status})`;
        // Only retry 5xx transient server errors on idempotent GET requests
        if (res.status >= 500 && method === 'GET' && attempt < retries) {
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 150));
          continue;
        }
        throw new Error(msg);
      }

      return data;
    } catch (err) {
      lastError = err;
      if (method === 'GET' && attempt < retries && !err.message.includes('40')) {
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 150));
        continue;
      }
      break;
    }
  }

  console.warn(`[ASENZO API Warning] ${endpoint}:`, lastError ? lastError.message : 'Failed request');
  throw lastError;
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
  async transitionContentStage(id, targetStatus, postUrl) { return apiFetch(`/contents/${id}/transition`, { method: 'POST', body: { targetStatus, postUrl } }); },
  async duplicateContent(id) { return apiFetch(`/contents/${id}/duplicate`, { method: 'POST' }); },
  async scheduleContent(id, scheduledAt) { return apiFetch(`/contents/${id}/schedule`, { method: 'POST', body: { scheduledAt } }); },
  async publishContent(id, postUrl) { return apiFetch(`/contents/${id}/publish`, { method: 'POST', body: { postUrl } }); },
  async getContentAssets(id) { return apiFetch(`/contents/${id}/assets`); },
  async addContentAsset(id, data) { return apiFetch(`/contents/${id}/assets`, { method: 'POST', body: data }); },
  async deleteContent(id) { return apiFetch(`/contents/${id}`, { method: 'DELETE' }); },

  // Legacy aliases used by existing UI
  async getContentItems() { return this.getContents(); },
  async createContentItem(data) { return this.createContent(data); },

  // Authority Asset Library (Approved Proof Engine)
  async getAuthorityAssets(params = {}) {
    let q = '/authority-assets';
    const sp = new URLSearchParams();
    if (params.type) sp.append('type', params.type);
    if (params.permissionStatus) sp.append('permissionStatus', params.permissionStatus);
    if (params.q) sp.append('q', params.q);
    const str = sp.toString();
    if (str) q += `?${str}`;
    return apiFetch(q);
  },
  async createAuthorityAsset(data) { return apiFetch('/authority-assets', { method: 'POST', body: data }); },
  async updateAuthorityAsset(id, data) { return apiFetch(`/authority-assets/${id}`, { method: 'PUT', body: data }); },
  async deleteAuthorityAsset(id) { return apiFetch(`/authority-assets/${id}`, { method: 'DELETE' }); },

  // Market Intelligence System (Signal Radar)
  async getMarketIntel() { return apiFetch('/market-intel'); },
  async createMarketIntel(data) { return apiFetch('/market-intel', { method: 'POST', body: data }); },
  async updateMarketIntel(id, data) { return apiFetch(`/market-intel/${id}`, { method: 'PUT', body: data }); },
  async deleteMarketIntel(id) { return apiFetch(`/market-intel/${id}`, { method: 'DELETE' }); },
  async convertSignalToIdea(id) { return apiFetch(`/market-intel/${id}/convert-to-idea`, { method: 'POST' }); },

  // Attention Outreach Tracker
  async getOutreachProspects() { return apiFetch('/outreach'); },
  async createOutreachProspect(data) { return apiFetch('/outreach', { method: 'POST', body: data }); },
  async updateOutreachProspect(id, data) { return apiFetch(`/outreach/${id}`, { method: 'PUT', body: data }); },
  async deleteOutreachProspect(id) { return apiFetch(`/outreach/${id}`, { method: 'DELETE' }); },
  async classifyOutreachReply(data) { return apiFetch('/outreach/classify-reply', { method: 'POST', body: data }); },

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
  async getAuditLogs() { return apiFetch('/audit-logs'); },

  // ── CONVERSION OS API METHODS (ASENZO ENGINE 2) ────────────────────────────
  async getConversionDashboard() { return apiFetch('/conversion/dashboard'); },
  async getVslFunnel() { return apiFetch('/conversion/vsl'); },
  async saveVslFunnel(payload) { return apiFetch('/conversion/vsl', { method: 'POST', body: payload }); },
  async getDmQualifier() { return apiFetch('/conversion/dm-qualifier'); },
  async saveDmQualifier(payload) { return apiFetch('/conversion/dm-qualifier', { method: 'POST', body: payload }); },
  async getStorySequences() { return apiFetch('/conversion/story-sequences'); },
  async saveStorySequence(payload) { return apiFetch('/conversion/story-sequences', { method: 'POST', body: payload }); },
  async getDeals(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/deals${qs}`);
  },
  async createDeal(payload) { return apiFetch('/deals', { method: 'POST', body: payload }); },
  async updateDeal(id, payload) { return apiFetch(`/deals/${id}`, { method: 'PUT', body: payload }); },
  async updateDealStage(id, payload) { return apiFetch(`/deals/${id}/stage`, { method: 'POST', body: payload }); },
  async logSalesCall(payload) { return apiFetch('/sales-calls', { method: 'POST', body: payload }); },
  async getSalesCall(id) { return apiFetch(`/sales-calls/${id}`); },
  async tagBenchmarkCall(id, payload) { return apiFetch(`/sales-calls/${id}/benchmark`, { method: 'POST', body: payload || {} }); },
  async analyzeSalesCallCoaching(id) { return apiFetch(`/sales-calls/${id}/analyze-coaching`, { method: 'POST' }); },
  async getObjectionLibrary() { return apiFetch('/conversion/objection-library'); },
  async saveObjectionItem(payload) { return apiFetch('/conversion/objection-library', { method: 'POST', body: payload }); },
  async createProposal(payload) { return apiFetch('/proposals', { method: 'POST', body: payload }); },
  async updateProposalStatus(id, payload) { return apiFetch(`/proposals/${id}/status`, { method: 'PUT', body: payload }); },
  async createContract(payload) { return apiFetch('/contracts', { method: 'POST', body: payload }); },
  async signContract(id, payload) { return apiFetch(`/contracts/${id}/sign`, { method: 'PUT', body: payload || {} }); },
  async recordPayment(payload) { return apiFetch('/payments', { method: 'POST', body: payload }); },
  async markDealWon(id, payload) { return apiFetch(`/deals/${id}/win`, { method: 'POST', body: payload || {} }); },
  async getCloserRoomPrep(dealId) { return apiFetch(`/conversion/closer-room/${dealId}`); },
  async getConversionIntelligence() { return apiFetch('/conversion/intelligence'); },

  // Granular Domain Model APIs
  async getPipelines() { return apiFetch('/pipelines'); },
  async createPipeline(payload) { return apiFetch('/pipelines', { method: 'POST', body: payload }); },
  async addPipelineStage(pipelineId, payload) { return apiFetch(`/pipelines/${pipelineId}/stages`, { method: 'POST', body: payload }); },
  async updatePipelineStage(id, payload) { return apiFetch(`/pipelines/stages/${id}`, { method: 'PUT', body: payload }); },
  async deletePipelineStage(id) { return apiFetch(`/pipelines/stages/${id}`, { method: 'DELETE' }); },
  async getLeadQualification(leadId) { return apiFetch(`/leads/${leadId}/qualification`); },
  async updateLeadQualification(leadId, payload) { return apiFetch(`/leads/${leadId}/qualification`, { method: 'POST', body: payload }); },
  async getDmConversations() { return apiFetch('/dm-conversations'); },
  async createDmConversation(payload) { return apiFetch('/dm-conversations', { method: 'POST', body: payload }); },
  async getDmMessages(conversationId) { return apiFetch(`/dm-conversations/${conversationId}/messages`); },
  async sendDmMessage(conversationId, payload) { return apiFetch(`/dm-conversations/${conversationId}/messages`, { method: 'POST', body: payload }); },
  async getSalesCallTranscript(callId) { return apiFetch(`/sales-calls/${callId}/transcript`); },
  async saveSalesCallTranscript(callId, payload) { return apiFetch(`/sales-calls/${callId}/transcript`, { method: 'POST', body: payload }); },
  async addSalesCallParticipant(callId, payload) { return apiFetch(`/sales-calls/${callId}/participants`, { method: 'POST', body: payload }); },
  async addSalesCallNote(callId, payload) { return apiFetch(`/sales-calls/${callId}/notes`, { method: 'POST', body: payload }); },
  async saveSalesCallOutcome(callId, payload) { return apiFetch(`/sales-calls/${callId}/outcome`, { method: 'POST', body: payload }); },
  async getSalesMethods() { return apiFetch('/sales-methods'); },
  async createSalesMethod(payload) { return apiFetch('/sales-methods', { method: 'POST', body: payload }); },
  async getTopPerformingCalls() { return apiFetch('/top-performing-calls'); },
  async registerTopPerformingCall(payload) { return apiFetch('/top-performing-calls', { method: 'POST', body: payload }); },
  async getClosers() { return apiFetch('/closers'); },
  async createCloser(payload) { return apiFetch('/closers', { method: 'POST', body: payload }); },
  async getCloserPerformance(closerId) { return apiFetch(`/closers/${closerId}/performance`); },
  async getDealActivities(dealId) { return apiFetch(`/deals/${dealId}/activities`); },
  async logDealActivity(dealId, payload) { return apiFetch(`/deals/${dealId}/activities`, { method: 'POST', body: payload }); },

  // Profile Funnel & VSL System APIs
  async getProfileFunnel() { return apiFetch('/conversion/profile-funnel'); },
  async saveProfileFunnel(payload) { return apiFetch('/conversion/profile-funnels', { method: 'POST', body: payload }); },
  async generateProfileFunnelFromDna() { return apiFetch('/conversion/profile-funnels/generate-from-dna', { method: 'POST' }); },
  async publishProfileFunnel(id, changeSummary) { return apiFetch(`/conversion/profile-funnels/${id}/publish`, { method: 'POST', body: { changeSummary } }); },
  async getProfileFunnelVersions(id) { return apiFetch(`/conversion/profile-funnels/${id}/versions`); },
  async getProfileFunnelPreview(id) { return apiFetch(`/conversion/profile-funnels/${id}/preview`); },
  async trackFunnelEvent(id, payload) { return apiFetch(`/conversion/profile-funnels/${id}/events`, { method: 'POST', body: payload }); },
  async getProfileFunnelAnalytics(id, environment = 'PRODUCTION') { return apiFetch(`/conversion/profile-funnels/${id}/analytics?environment=${environment}`); },
  async qualifyDmConversation(id) { return apiFetch(`/dm-conversations/${id}/qualify`, { method: 'POST' }); },
  async generateStorySequence(payload) { return apiFetch('/conversion/story-sequences/generate', { method: 'POST', body: payload }); }
};
