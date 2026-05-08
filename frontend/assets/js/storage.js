/**
 * storage.js — Shared data layer for all pages
 * All pages use these functions only; no page writes to localStorage directly.
 *
 * localStorage keys:
 *   "jf_jobs"        — array of all jobs created by admin
 *   "jf_selected"    — the job the user clicked to view details
 *   "jf_applied"     — array of jobs the user has applied to
 *   "jf_user"        — logged-in user object { name, email, role }
 *   "jf_search"      — latest search results array
 */

var JobStorage = (function () {

  /* Key constants */
  var KEYS = {
    jobs:     'jf_jobs',
    selected: 'jf_selected',
    applied:  'jf_applied',
    user:     'jf_user',
    search:   'jf_search'
  };

  /* ── Helpers ───────────────────────────────────────────── */
  function load(key)        { try { var s = localStorage.getItem(key); return s ? JSON.parse(s) : null; } catch(e) { return null; } }
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {} }

  /* Navigate in the top-level window (works both inside iframe and in normal pages) */
  function navigate(url) {
    if (window.top && window.top !== window) {
      window.top.location.href = url;
    } else {
      window.location.href = url;
    }
  }

  /* ── Jobs (Admin) ──────────────────────────────────────── */

  function getAllJobs() { return load(KEYS.jobs) || []; }

  function saveJob(job) {
    var jobs = getAllJobs();
    jobs.push(job);
    save(KEYS.jobs, jobs);
  }

  function updateJob(updatedJob) {
    var jobs = getAllJobs().map(function(j) {
      return j.id === updatedJob.id ? updatedJob : j;
    });
    save(KEYS.jobs, jobs);
  }

  function deleteJob(jobId) {
    save(KEYS.jobs, getAllJobs().filter(function(j) { return j.id !== jobId; }));
  }

  /* ── Selected Job ──────────────────────────────────────── */

  function selectJob(job) {
    save(KEYS.selected, job);
    navigate('job-details.html');
  }

  function getSelectedJob() { return load(KEYS.selected); }

  function clearSelectedJob() { localStorage.removeItem(KEYS.selected); }

  /* ── Applied Jobs ──────────────────────────────────────── */

  function getAppliedJobs() { return load(KEYS.applied) || []; }

  function applyToJob(job) {
    var applied = getAppliedJobs();
    var already = applied.some(function(j) { return j.id === job.id; });
    if (already) return false;
    job.appliedAt = new Date().toISOString();
    applied.push(job);
    save(KEYS.applied, applied);
    return true;
  }

  function hasApplied(jobId) {
    return getAppliedJobs().some(function(j) { return j.id === jobId; });
  }

  /* ── Auth ──────────────────────────────────────────────── */

  function setUser(user) { save(KEYS.user, user); }

  function getUser() { return load(KEYS.user); }

  function logout() {
    localStorage.removeItem(KEYS.user);
    navigate('login.html');
  }

  function isAdmin() {
    var u = getUser();
    return u && u.role === 'admin';
  }

  /* ── Search Results ────────────────────────────────────── */

  function saveSearchAndGo(results) {
    save(KEYS.search, results);
    navigate('search-results.html');
  }

  function getSearchResults() { return load(KEYS.search) || []; }

  /* ── Public API ────────────────────────────────────────── */
  return {
    getAllJobs:         getAllJobs,
    saveJob:           saveJob,
    updateJob:         updateJob,
    deleteJob:         deleteJob,
    selectJob:         selectJob,
    getSelectedJob:    getSelectedJob,
    clearSelectedJob:  clearSelectedJob,
    getAppliedJobs:    getAppliedJobs,
    applyToJob:        applyToJob,
    hasApplied:        hasApplied,
    setUser:           setUser,
    getUser:           getUser,
    logout:            logout,
    isAdmin:           isAdmin,
    saveSearchAndGo:   saveSearchAndGo,
    getSearchResults:  getSearchResults
  };

})();



