"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CanonicalResearchJob, CanonicalResearchAssignment, CanonicalResearchResult, ResearchOverviewCounts } from "@/lib/automation/db";

export default function ResearchDataBankPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "assignments" | "results">("jobs");

  // Overview counts state
  const [overview, setOverview] = useState<ResearchOverviewCounts | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Jobs state
  const [jobs, setJobs] = useState<Array<CanonicalResearchJob & { assignment_count: number; result_count: number }>>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [jobsPage, setJobsPage] = useState(0);
  const [jobsLimit] = useState(15);
  const [jobsSearch, setJobsSearch] = useState("");
  const [jobsStatusFilter, setJobsStatusFilter] = useState("all");
  const [jobsPlatformFilter, setJobsPlatformFilter] = useState("all");
  const [jobsFunnelFilter, setJobsFunnelFilter] = useState("all");
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Selected Job Detail state
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<(CanonicalResearchJob & { assignment_count?: number; result_count?: number }) | null>(null);
  const [jobAssignments, setJobAssignments] = useState<CanonicalResearchAssignment[]>([]);
  const [jobResults, setJobResults] = useState<CanonicalResearchResult[]>([]);
  const [loadingJobDetail, setLoadingJobDetail] = useState(false);

  // All Assignments state
  const [assignments, setAssignments] = useState<CanonicalResearchAssignment[]>([]);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [assignmentsPage, setAssignmentsPage] = useState(0);
  const [assignmentsLimit] = useState(25);
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState("all");
  const [assignmentTypeFilter, setAssignmentTypeFilter] = useState("all");
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  // Results state
  const [results, setResults] = useState<CanonicalResearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsPage, setResultsPage] = useState(0);
  const [resultsLimit] = useState(20);
  const [resultsSearch, setResultsSearch] = useState("");
  const [resultsClassificationFilter, setResultsClassificationFilter] = useState("all");
  const [resultsPlatformFilter, setResultsPlatformFilter] = useState("all");
  const [loadingResults, setLoadingResults] = useState(false);

  // Inspect Result Detail Modal / Drawer
  const [selectedResult, setSelectedResult] = useState<{
    result: CanonicalResearchResult;
    job: CanonicalResearchJob | null;
    assignment: CanonicalResearchAssignment | null;
  } | null>(null);
  // General error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Overview fetch effect
  useEffect(() => {
    let ignore = false;
    const loadOverview = async () => {
      try {
        const res = await fetch("/api/automation/research/overview");
        if (!res.ok) throw new Error(`Overview request failed (${res.status})`);
        const data = await res.json();
        if (data.success && !ignore) {
          setOverview(data.data);
        }
      } catch (err: unknown) {
        if (!ignore) console.error("[Data Bank] Error fetching overview:", err);
      } finally {
        if (!ignore) setLoadingOverview(false);
      }
    };
    loadOverview();
    return () => { ignore = true; };
  }, []);

  // 2. Tab data fetch effect
  useEffect(() => {
    let ignore = false;
    const loadTabData = async () => {
      if (activeTab === "jobs") {
        try {
          const params = new URLSearchParams();
          if (jobsSearch.trim()) params.set("search", jobsSearch.trim());
          if (jobsStatusFilter !== "all") params.set("status", jobsStatusFilter);
          if (jobsPlatformFilter !== "all") params.set("platform", jobsPlatformFilter);
          if (jobsFunnelFilter !== "all") params.set("funnel_stage", jobsFunnelFilter);
          params.set("limit", String(jobsLimit));
          params.set("offset", String(jobsPage * jobsLimit));

          const res = await fetch(`/api/automation/research/jobs?${params.toString()}`);
          if (!res.ok) throw new Error(`Jobs query failed (${res.status})`);
          const data = await res.json();
          if (!ignore) {
            if (data.success) {
              setJobs(data.data.jobs || []);
              setTotalJobs(data.data.total || 0);
              setErrorMessage(null);
            } else {
              setErrorMessage(data.error?.message || "Failed to fetch jobs");
            }
          }
        } catch (err: unknown) {
          if (!ignore) {
            const msg = err instanceof Error ? err.message : "Failed to load research jobs";
            setErrorMessage(msg);
          }
        } finally {
          if (!ignore) setLoadingJobs(false);
        }
      } else if (activeTab === "assignments") {
        try {
          const params = new URLSearchParams();
          if (assignmentStatusFilter !== "all") params.set("status", assignmentStatusFilter);
          if (assignmentTypeFilter !== "all") params.set("assignment_type", assignmentTypeFilter);
          params.set("limit", String(assignmentsLimit));
          params.set("offset", String(assignmentsPage * assignmentsLimit));

          const res = await fetch(`/api/automation/research/assignments?${params.toString()}`);
          if (!res.ok) throw new Error(`Assignments query failed (${res.status})`);
          const data = await res.json();
          if (!ignore) {
            if (data.success) {
              setAssignments(data.data.assignments || []);
              setTotalAssignments(data.data.total || 0);
            }
          }
        } catch (err: unknown) {
          if (!ignore) console.error("[Data Bank] Error fetching assignments:", err);
        } finally {
          if (!ignore) setLoadingAssignments(false);
        }
      } else if (activeTab === "results") {
        try {
          const params = new URLSearchParams();
          if (resultsSearch.trim()) params.set("search", resultsSearch.trim());
          if (resultsClassificationFilter !== "all") params.set("classification", resultsClassificationFilter);
          if (resultsPlatformFilter !== "all") params.set("platform", resultsPlatformFilter);
          params.set("limit", String(resultsLimit));
          params.set("offset", String(resultsPage * resultsLimit));

          const res = await fetch(`/api/automation/research/results?${params.toString()}`);
          if (!res.ok) throw new Error(`Results query failed (${res.status})`);
          const data = await res.json();
          if (!ignore) {
            if (data.success) {
              setResults(data.data.results || []);
              setTotalResults(data.data.total || 0);
            }
          }
        } catch (err: unknown) {
          if (!ignore) console.error("[Data Bank] Error fetching results:", err);
        } finally {
          if (!ignore) setLoadingResults(false);
        }
      }
    };
    loadTabData();
    return () => { ignore = true; };
  }, [
    activeTab,
    jobsSearch, jobsStatusFilter, jobsPlatformFilter, jobsFunnelFilter, jobsLimit, jobsPage,
    assignmentStatusFilter, assignmentTypeFilter, assignmentsLimit, assignmentsPage,
    resultsSearch, resultsClassificationFilter, resultsPlatformFilter, resultsLimit, resultsPage
  ]);

  // 3. Selected job detail effect
  useEffect(() => {
    if (!selectedJobId) return;
    let ignore = false;
    const loadJobDetail = async () => {
      try {
        const [jobRes, assignRes, resRes] = await Promise.all([
          fetch(`/api/automation/research/jobs/${selectedJobId}`),
          fetch(`/api/automation/research/assignments?research_job_id=${selectedJobId}&limit=100`),
          fetch(`/api/automation/research/results?research_job_id=${selectedJobId}&limit=100`)
        ]);

        if (ignore) return;

        if (jobRes.ok) {
          const jData = await jobRes.json();
          if (jData.success) setSelectedJob(jData.data.job);
        }
        if (assignRes.ok) {
          const aData = await assignRes.json();
          if (aData.success) setJobAssignments(aData.data.assignments || []);
        }
        if (resRes.ok) {
          const rData = await resRes.json();
          if (rData.success) setJobResults(rData.data.results || []);
        }
      } catch (err: unknown) {
        if (!ignore) console.error("[Data Bank] Error fetching job detail:", err);
      } finally {
        if (!ignore) setLoadingJobDetail(false);
      }
    };
    loadJobDetail();
    return () => { ignore = true; };
  }, [selectedJobId]);

  // 4. Fetch Single Result Detail (Provenance)
  const openResultDetail = async (resultId: string) => {
    try {
      const res = await fetch(`/api/automation/research/results/${resultId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSelectedResult(data.data);
        }
      }
    } catch (err) {
      console.error("[Data Bank] Error loading result detail:", err);
    }
  };

  const handleRefreshAll = () => {
    setLoadingOverview(true);
    fetch("/api/automation/research/overview")
      .then(res => res.json())
      .then(d => { if (d.success) setOverview(d.data); })
      .catch(console.error)
      .finally(() => setLoadingOverview(false));

    if (selectedJobId) {
      setLoadingJobDetail(true);
      Promise.all([
        fetch(`/api/automation/research/jobs/${selectedJobId}`).then(r => r.json()),
        fetch(`/api/automation/research/assignments?research_job_id=${selectedJobId}&limit=100`).then(r => r.json()),
        fetch(`/api/automation/research/results?research_job_id=${selectedJobId}&limit=100`).then(r => r.json())
      ]).then(([jData, aData, rData]) => {
        if (jData.success) setSelectedJob(jData.data.job);
        if (aData.success) setJobAssignments(aData.data.assignments || []);
        if (rData.success) setJobResults(rData.data.results || []);
      }).finally(() => setLoadingJobDetail(false));
    } else if (activeTab === "jobs") {
      setLoadingJobs(true);
      const params = new URLSearchParams();
      if (jobsSearch.trim()) params.set("search", jobsSearch.trim());
      if (jobsStatusFilter !== "all") params.set("status", jobsStatusFilter);
      if (jobsPlatformFilter !== "all") params.set("platform", jobsPlatformFilter);
      if (jobsFunnelFilter !== "all") params.set("funnel_stage", jobsFunnelFilter);
      params.set("limit", String(jobsLimit));
      params.set("offset", String(jobsPage * jobsLimit));
      fetch(`/api/automation/research/jobs?${params.toString()}`)
        .then(r => r.json())
        .then(d => { if (d.success) { setJobs(d.data.jobs || []); setTotalJobs(d.data.total || 0); } })
        .finally(() => setLoadingJobs(false));
    } else if (activeTab === "assignments") {
      setLoadingAssignments(true);
      const params = new URLSearchParams();
      if (assignmentStatusFilter !== "all") params.set("status", assignmentStatusFilter);
      if (assignmentTypeFilter !== "all") params.set("assignment_type", assignmentTypeFilter);
      params.set("limit", String(assignmentsLimit));
      params.set("offset", String(assignmentsPage * assignmentsLimit));
      fetch(`/api/automation/research/assignments?${params.toString()}`)
        .then(r => r.json())
        .then(d => { if (d.success) { setAssignments(d.data.assignments || []); setTotalAssignments(d.data.total || 0); } })
        .finally(() => setLoadingAssignments(false));
    } else if (activeTab === "results") {
      setLoadingResults(true);
      const params = new URLSearchParams();
      if (resultsSearch.trim()) params.set("search", resultsSearch.trim());
      if (resultsClassificationFilter !== "all") params.set("classification", resultsClassificationFilter);
      if (resultsPlatformFilter !== "all") params.set("platform", resultsPlatformFilter);
      params.set("limit", String(resultsLimit));
      params.set("offset", String(resultsPage * resultsLimit));
      fetch(`/api/automation/research/results?${params.toString()}`)
        .then(r => r.json())
        .then(d => { if (d.success) { setResults(d.data.results || []); setTotalResults(d.data.total || 0); } })
        .finally(() => setLoadingResults(false));
    }
  };

  const handleSelectJob = (jobId: string) => {
    setLoadingJobDetail(true);
    setSelectedJobId(jobId);
  };

  const handleCloseJobDetail = () => {
    setSelectedJobId(null);
    setSelectedJob(null);
    setJobAssignments([]);
    setJobResults([]);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "running":
        return "bg-blue-50 text-blue-700 border-blue-200 animate-pulse";
      case "planning":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "cancelled":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "queued":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getClassificationBadge = (classification?: string) => {
    switch (classification) {
      case "observed_fact":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "inferred_pattern":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "ai_hypothesis":
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Unavailable";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="pt-6 pb-24 px-8 max-w-[1500px] mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[26px] text-blue-600">inventory_2</span>
            <h1 className="text-[22px] font-black text-slate-900 tracking-tight">Research Data Bank</h1>
          </div>
          <p className="text-[13px] text-slate-500 font-medium mt-1">
            Persisted repository of research jobs, execution assignments, and raw source evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[12px] font-bold rounded-lg transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Refresh
          </button>
          <Link
            href="/acquisition/research"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-lg transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            New Research Job
          </Link>
        </div>
      </div>

      {/* Database-backed Overview Counts Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Total Jobs</p>
          <p className="text-[24px] font-black text-slate-900 mt-1">
            {loadingOverview ? "..." : (overview?.total_jobs ?? 0)}
          </p>
          <div className="text-[10px] text-slate-400 font-medium mt-1 flex gap-2">
            <span>Queued: {overview?.jobs_by_status?.queued ?? 0}</span>
            <span>·</span>
            <span>Running: {overview?.jobs_by_status?.running ?? 0}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Completed Jobs</p>
          <p className="text-[24px] font-black text-emerald-600 mt-1">
            {loadingOverview ? "..." : (overview?.jobs_by_status?.completed ?? 0)}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            Fully processed
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Assignments</p>
          <p className="text-[24px] font-black text-slate-900 mt-1">
            {loadingOverview ? "..." : (overview?.total_assignments ?? 0)}
          </p>
          <div className="text-[10px] text-slate-400 font-medium mt-1 flex gap-2">
            <span className="text-emerald-600">Done: {overview?.completed_assignments ?? 0}</span>
            <span>·</span>
            <span className="text-rose-600">Failed: {overview?.failed_assignments ?? 0}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Raw Evidence</p>
          <p className="text-[24px] font-black text-blue-600 mt-1">
            {loadingOverview ? "..." : (overview?.total_results ?? 0)}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            Persisted findings
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[11px] font-bold text-rose-600 uppercase tracking-widest">Failed Jobs / Tasks</p>
          <p className="text-[24px] font-black text-rose-600 mt-1">
            {loadingOverview ? "..." : ((overview?.jobs_by_status?.failed ?? 0) + (overview?.failed_assignments ?? 0))}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            Jobs or tasks with errors
          </p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        <button
          onClick={() => { setActiveTab("jobs"); handleCloseJobDetail(); }}
          className={`py-3 text-[13px] font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "jobs"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">work</span>
          Research Jobs ({totalJobs || overview?.total_jobs || 0})
        </button>

        <button
          onClick={() => { setActiveTab("assignments"); handleCloseJobDetail(); }}
          className={`py-3 text-[13px] font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "assignments"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">assignment</span>
          Assignments ({totalAssignments || overview?.total_assignments || 0})
        </button>

        <button
          onClick={() => { setActiveTab("results"); handleCloseJobDetail(); }}
          className={`py-3 text-[13px] font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "results"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">description</span>
          Evidence & Findings ({totalResults || overview?.total_results || 0})
        </button>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-700 text-[13px] font-medium">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {errorMessage}
          </div>
          <button
            onClick={() => { setErrorMessage(null); handleRefreshAll(); }}
            className="px-3 py-1 bg-white border border-rose-300 text-rose-700 text-[11px] font-bold rounded-lg hover:bg-rose-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* TAB 1: RESEARCH JOBS */}
      {activeTab === "jobs" && (
        <div className="space-y-6">
          {/* If a job is selected, show Job Detail Inspector */}
          {selectedJobId && selectedJob ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <button
                    onClick={handleCloseJobDetail}
                    className="text-[12px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Back to all research jobs
                  </button>
                  <h2 className="text-[18px] font-black text-slate-900">{selectedJob.topic}</h2>
                  <p className="text-[13px] text-slate-500 mt-0.5">{selectedJob.objective}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getStatusBadge(selectedJob.status)}`}>
                    {selectedJob.status}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedJob.priority || "normal"} priority
                  </span>
                </div>
              </div>

              {/* Job Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl text-[12px]">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedJob.platform || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Funnel Stage</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedJob.funnel_stage || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Content Pillar</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedJob.content_pillar || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Range</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedJob.date_range?.replace(/_/g, " ") || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created At</p>
                  <p className="font-medium text-slate-700 mt-0.5">{formatDate(selectedJob.created_at)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Started At</p>
                  <p className="font-medium text-slate-700 mt-0.5">{formatDate(selectedJob.started_at)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed At</p>
                  <p className="font-medium text-slate-700 mt-0.5">{formatDate(selectedJob.completed_at)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database ID</p>
                  <p className="font-mono text-[11px] text-slate-500 mt-0.5 truncate">{selectedJob.id}</p>
                </div>
              </div>

              {/* Creators & Sources */}
              {((selectedJob.creators && selectedJob.creators.length > 0) || (selectedJob.sources && selectedJob.sources.length > 0)) && (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Target Creators & Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.creators?.map((c, i) => (
                      <span key={i} className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">person</span>
                        {c.handle ? `@${c.handle}` : c.source_target || "Unknown creator"}
                      </span>
                    ))}
                    {selectedJob.sources?.map((s, i) => (
                      <span key={i} className="text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">link</span>
                        {s.target}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Error if present */}
              {selectedJob.error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-[12px] text-rose-800">
                  <p className="font-bold">Error reported during research execution:</p>
                  <p className="font-mono text-[11px] mt-1">{selectedJob.error}</p>
                </div>
              )}

              {/* Persisted Assignments for this Job */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-blue-600">assignment</span>
                    Execution Assignments ({jobAssignments.length})
                  </h3>
                </div>

                {loadingJobDetail ? (
                  <p className="text-[12px] text-slate-400 py-4">Loading assignments...</p>
                ) : jobAssignments.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-slate-500 text-[12px]">
                    No execution assignments registered for this job yet.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[12px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Target / Creator</th>
                          <th className="px-4 py-3">Topic</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Attempts</th>
                          <th className="px-4 py-3">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {jobAssignments.map(a => (
                          <tr key={a.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <span className="font-bold text-slate-800 capitalize">{a.assignment_type?.replace(/_/g, " ")}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-medium text-slate-700">{a.creator || a.source_target || "—"}</span>
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-600 max-w-[200px] truncate">{a.topic}</td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(a.status)}`}>
                                {a.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-500">{a.attempt_count ?? 0}</td>
                            <td className="px-4 py-3 text-slate-500">{formatDate(a.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Persisted Findings / Results for this Job */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">description</span>
                    Persisted Evidence & Results ({jobResults.length})
                  </h3>
                </div>

                {jobResults.length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl text-center text-slate-500 text-[12px]">
                    No research findings or observations have been ingested for this job yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobResults.map(r => (
                      <div
                        key={r.id}
                        onClick={() => openResultDetail(r.id!)}
                        className="p-4 bg-white border border-slate-200 hover:border-blue-300 rounded-xl shadow-sm cursor-pointer transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getClassificationBadge(r.classification)}`}>
                            {r.classification?.replace(/_/g, " ")}
                          </span>
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {r.platform}
                          </span>
                        </div>

                        <div>
                          <p className="text-[13px] font-bold text-slate-900 leading-snug">{r.claim || r.topic}</p>
                          {r.hook && <p className="text-[11px] text-slate-500 mt-1 italic line-clamp-2">&quot;{r.hook}&quot;</p>}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                          <span>{r.creator ? `@${r.creator}` : "Creator unlisted"}</span>
                          <span className="text-blue-600 font-bold hover:underline flex items-center gap-0.5">
                            Inspect Finding
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ALL JOBS LIST VIEW */
            <div className="space-y-4">
              {/* Search & Filter Toolbar */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="flex-1 relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-slate-400">search</span>
                  <input
                    type="text"
                    value={jobsSearch}
                    onChange={e => { setJobsSearch(e.target.value); setJobsPage(0); }}
                    placeholder="Search by topic or objective..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={jobsStatusFilter}
                    onChange={e => { setJobsStatusFilter(e.target.value); setJobsPage(0); }}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="queued">Queued</option>
                    <option value="planning">Planning</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>

                  <select
                    value={jobsPlatformFilter}
                    onChange={e => { setJobsPlatformFilter(e.target.value); setJobsPage(0); }}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="all">All Platforms</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X">X</option>
                  </select>

                  <select
                    value={jobsFunnelFilter}
                    onChange={e => { setJobsFunnelFilter(e.target.value); setJobsPage(0); }}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="all">All Funnel Stages</option>
                    <option value="TOF">TOF</option>
                    <option value="MOF">MOF</option>
                    <option value="BOF">BOF</option>
                  </select>
                </div>
              </div>

              {/* Jobs Table */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-[12px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <th className="px-6 py-4">Research Objective & Topic</th>
                      <th className="px-6 py-4">Platform / Pillar</th>
                      <th className="px-6 py-4">Funnel Stage</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Assignments</th>
                      <th className="px-6 py-4">Results</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingJobs ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">
                          Loading research jobs from database...
                        </td>
                      </tr>
                    ) : jobs.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <p className="text-[14px] font-bold text-slate-700">No research jobs found</p>
                          <p className="text-[12px] text-slate-500 mt-1">
                            {jobsSearch || jobsStatusFilter !== "all"
                              ? "Try adjusting your search criteria or status filters."
                              : "No research jobs have been created in this workspace yet."}
                          </p>
                          <Link
                            href="/acquisition/research"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-4 bg-blue-600 text-white text-[11px] font-bold rounded-lg hover:bg-blue-700"
                          >
                            Create first research job
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      jobs.map(job => (
                        <tr
                          key={job.id}
                          onClick={() => handleSelectJob(job.id!)}
                          className="hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 max-w-[320px]">
                            <div className="font-bold text-slate-900 leading-snug truncate">{job.topic}</div>
                            <div className="text-[11px] font-medium text-slate-500 truncate mt-0.5">{job.objective}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-700">{job.platform || "Any"}</span>
                            <div className="text-[10px] text-slate-400">{job.content_pillar || "General"}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                              {job.funnel_stage || "ALL"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(job.status)}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800">
                            {job.assignment_count}
                          </td>
                          <td className="px-6 py-4 font-bold text-emerald-600">
                            {job.result_count}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {formatDate(job.created_at)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedJobId(job.id!); }}
                              className="px-2.5 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            >
                              Inspect →
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {totalJobs > jobsLimit && (
                  <div className="p-4 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-500">
                    <span>
                      Showing {jobsPage * jobsLimit + 1} to {Math.min((jobsPage + 1) * jobsLimit, totalJobs)} of {totalJobs} jobs
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={jobsPage === 0}
                        onClick={() => setJobsPage(p => Math.max(0, p - 1))}
                        className="px-3 py-1 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50"
                      >
                        Previous
                      </button>
                      <button
                        disabled={(jobsPage + 1) * jobsLimit >= totalJobs}
                        onClick={() => setJobsPage(p => p + 1)}
                        className="px-3 py-1 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL ASSIGNMENTS */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div>
              <h3 className="text-[14px] font-bold text-slate-900">Research Assignments</h3>
              <p className="text-[11px] text-slate-500">Tracking execution tasks distributed to collector workers</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={assignmentStatusFilter}
                onChange={e => { setAssignmentStatusFilter(e.target.value); setAssignmentsPage(0); }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="queued">Queued</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>

              <select
                value={assignmentTypeFilter}
                onChange={e => { setAssignmentTypeFilter(e.target.value); setAssignmentsPage(0); }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="creator_research">Creator Research</option>
                <option value="topic_research">Topic Research</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Assignment Type</th>
                  <th className="px-6 py-4">Target / Creator</th>
                  <th className="px-6 py-4">Topic</th>
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Attempts</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Parent Job</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingAssignments ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">
                      Loading assignments...
                    </td>
                  </tr>
                ) : assignments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      No research assignments match the active filters.
                    </td>
                  </tr>
                ) : (
                  assignments.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 capitalize">{a.assignment_type?.replace(/_/g, " ")}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-700">{a.creator || a.source_target || "—"}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 max-w-[250px] truncate">
                        {a.topic}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{a.platform || "All"}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(a.status)}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">{a.attempt_count ?? 0}</td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(a.created_at)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => { setSelectedJobId(a.research_job_id); setActiveTab("jobs"); }}
                          className="text-[11px] font-bold text-blue-600 hover:underline"
                        >
                          View Job →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalAssignments > assignmentsLimit && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-500">
                <span>
                  Showing {assignmentsPage * assignmentsLimit + 1} to {Math.min((assignmentsPage + 1) * assignmentsLimit, totalAssignments)} of {totalAssignments} assignments
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={assignmentsPage === 0}
                    onClick={() => setAssignmentsPage(p => Math.max(0, p - 1))}
                    className="px-3 py-1 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={(assignmentsPage + 1) * assignmentsLimit >= totalAssignments}
                    onClick={() => setAssignmentsPage(p => p + 1)}
                    className="px-3 py-1 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCE & FINDINGS */}
      {activeTab === "results" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-slate-400">search</span>
              <input
                type="text"
                value={resultsSearch}
                onChange={e => { setResultsSearch(e.target.value); setResultsPage(0); }}
                placeholder="Search by claim, hook, topic, or source URL..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={resultsClassificationFilter}
                onChange={e => { setResultsClassificationFilter(e.target.value); setResultsPage(0); }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Classifications</option>
                <option value="observed_fact">Observed Fact</option>
                <option value="inferred_pattern">Inferred Pattern</option>
                <option value="ai_hypothesis">AI Hypothesis</option>
              </select>

              <select
                value={resultsPlatformFilter}
                onChange={e => { setResultsPlatformFilter(e.target.value); setResultsPage(0); }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Platforms</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="X">X</option>
              </select>
            </div>
          </div>

          {loadingResults ? (
            <div className="p-12 text-center text-slate-400 font-medium bg-white border border-slate-200 rounded-xl">
              Loading research evidence findings...
            </div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-xl text-slate-500">
              <p className="text-[14px] font-bold text-slate-700">No research results recorded</p>
              <p className="text-[12px] text-slate-400 mt-1">
                Findings are ingested when collector workers extract validated claims and source observations.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map(r => (
                <div
                  key={r.id}
                  onClick={() => openResultDetail(r.id!)}
                  className="p-5 bg-white border border-slate-200 hover:border-blue-300 rounded-xl shadow-sm cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${getClassificationBadge(r.classification)}`}>
                      {r.classification?.replace(/_/g, " ")}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">{r.platform}</span>
                      <span>{r.source_type}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900 leading-snug">{r.claim || r.topic}</h3>
                    {r.hook && (
                      <p className="text-[12px] text-slate-600 mt-1 italic line-clamp-2">
                        &quot;{r.hook}&quot;
                      </p>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Creator: <b>{r.creator ? `@${r.creator}` : "Not recorded"}</b></span>
                    <span>Confidence: <b>{r.confidence || "Standard"}</b></span>
                    <span>Strength: <b>{r.evidence_strength || "Normal"}</b></span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <a
                      href={r.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1 max-w-[250px] truncate"
                    >
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      {r.source_url}
                    </a>
                    <span className="text-slate-400 font-medium">{formatDate(r.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalResults > resultsLimit && (
            <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-[12px] text-slate-500">
              <span>
                Showing {resultsPage * resultsLimit + 1} to {Math.min((resultsPage + 1) * resultsLimit, totalResults)} of {totalResults} findings
              </span>
              <div className="flex gap-2">
                <button
                  disabled={resultsPage === 0}
                  onClick={() => setResultsPage(p => Math.max(0, p - 1))}
                  className="px-3 py-1 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50"
                >
                  Previous
                </button>
                <button
                  disabled={(resultsPage + 1) * resultsLimit >= totalResults}
                  onClick={() => setResultsPage(p => p + 1)}
                  className="px-3 py-1 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EVIDENCE & PROVENANCE INSPECTOR MODAL */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setSelectedResult(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${getClassificationBadge(selectedResult.result.classification)}`}>
                  {selectedResult.result.classification?.replace(/_/g, " ")}
                </span>
                <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {selectedResult.result.platform} · {selectedResult.result.source_type}
                </span>
              </div>
              <h2 className="text-[18px] font-black text-slate-900 leading-snug">{selectedResult.result.claim}</h2>
              <p className="text-[12px] text-slate-500 mt-1">Topic: <b>{selectedResult.result.topic}</b></p>
            </div>

            {/* Source Provenance Link */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[12px]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Original Source Reference</p>
              <div className="flex items-center justify-between">
                <a
                  href={selectedResult.result.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold hover:underline flex items-center gap-1.5 truncate max-w-[450px]"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  {selectedResult.result.source_url}
                </a>
                <span className="text-slate-500 font-medium">
                  {selectedResult.result.published_at ? formatDate(selectedResult.result.published_at) : "Publication date unavailable"}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 pt-1">
                Creator: <b>{selectedResult.result.creator ? `@${selectedResult.result.creator}` : "Not recorded for this source"}</b>
              </div>
            </div>

            {/* Hook & Angle */}
            {(selectedResult.result.hook || selectedResult.result.angle) && (
              <div className="space-y-3">
                {selectedResult.result.hook && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Extracted Hook</p>
                    <p className="text-[13px] font-medium text-slate-800 italic bg-amber-50/50 p-3 rounded-lg border border-amber-100 mt-1">
                      &quot;{selectedResult.result.hook}&quot;
                    </p>
                  </div>
                )}
                {selectedResult.result.angle && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strategic Angle</p>
                    <p className="text-[12px] font-medium text-slate-700 mt-0.5">{selectedResult.result.angle}</p>
                  </div>
                )}
              </div>
            )}

            {/* Evidence Findings Object */}
            {selectedResult.result.evidence && Object.keys(selectedResult.result.evidence).length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Supporting Evidence Data</p>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] overflow-x-auto font-mono max-h-48">
                  {JSON.stringify(selectedResult.result.evidence, null, 2)}
                </pre>
              </div>
            )}

            {/* Raw Source / Engagement Metrics */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Engagement Metrics & Signals</p>
              {selectedResult.result.raw_source_reference && Object.keys(selectedResult.result.raw_source_reference).length > 0 ? (
                <pre className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 overflow-x-auto font-mono">
                  {JSON.stringify(selectedResult.result.raw_source_reference, null, 2)}
                </pre>
              ) : (
                <p className="text-[12px] text-slate-400 italic">
                  Engagement metrics not recorded for this source.
                </p>
              )}
            </div>

            {/* Provenance Provenance Lineage */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Audit Provenance</p>
              <p>Research Agent: <b className="font-mono text-slate-700">{selectedResult.result.research_agent || "ACQ-R01"}</b></p>
              <p>Job ID: <b className="font-mono text-slate-700">{selectedResult.result.research_job_id}</b></p>
              <p>Assignment ID: <b className="font-mono text-slate-700">{selectedResult.result.research_assignment_id}</b></p>
              <p>Collected Timestamp: <b className="text-slate-700">{formatDate(selectedResult.result.created_at)}</b></p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedResult(null)}
                className="px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800"
              >
                Close Finding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
