/**
 * School Discipline Tracker - High Performance Collaborative Real-Time Engine
 * Multi-User Staff Attribution, Issues & Collaborative Efforts Hub,
 * Multi-Client Real-Time Sync (BroadcastChannel + IndexedDB + Firebase Ready),
 * Mobile Bottom Navigation, 5-Tier Severity Meters, and PWA Caching.
 */

(function () {
  'use strict';

  // --- Constants & Keys ---
  const STORAGE_KEY = 'hes_discipline_tracker_v2';
  const DB_NAME = 'HES_Discipline_Realtime_DB';
  const DB_VERSION = 1;
  const SYNC_CHANNEL_NAME = 'hes_discipline_realtime_sync';

  // Real-time inter-tab & multi-client sync channel
  const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(SYNC_CHANNEL_NAME) : null;

  const SEVERITY_CONFIG = {
    Low: { points: 5, color: '#10B981', badgeClass: 'sev-low-badge', label: 'Low' },
    Medium: { points: 12, color: '#F59E0B', badgeClass: 'sev-medium-badge', label: 'Medium' },
    High: { points: 25, color: '#F97316', badgeClass: 'sev-high-badge', label: 'High' },
    Extreme: { points: 45, color: '#EF4444', badgeClass: 'sev-extreme-badge', label: 'Extreme' },
    Ultra: { points: 75, color: '#881337', badgeClass: 'sev-ultra-badge', label: 'Ultra' }
  };

  // Seed Data: Students, Violations, Collaborative Issues & Efforts
  const INITIAL_SEED = {
    students: [
      { id: 'std-1', name: 'Muhammad Hamza', classSection: '10th-A', rollNo: '1001', guardianPhone: '0300-1234567', notes: 'Active in sports', createdAt: '2026-10-01T08:00:00.000Z' },
      { id: 'std-2', name: 'Ali Raza', classSection: '10th-A', rollNo: '1002', guardianPhone: '0312-9876543', notes: '', createdAt: '2026-10-01T08:00:00.000Z' },
      { id: 'std-3', name: 'Bilal Ahmed', classSection: '9th-B', rollNo: '9014', guardianPhone: '0333-5551234', notes: 'Needs counseling', createdAt: '2026-10-02T08:00:00.000Z' },
      { id: 'std-4', name: 'Usman Tariq', classSection: '9th-A', rollNo: '9005', guardianPhone: '0345-4443322', notes: '', createdAt: '2026-10-02T08:00:00.000Z' },
      { id: 'std-5', name: 'Zainab Fatima', classSection: '10th-B', rollNo: '1025', guardianPhone: '0321-7778899', notes: 'Academic achiever', createdAt: '2026-10-03T08:00:00.000Z' },
      { id: 'std-6', name: 'Aisha Noor', classSection: '8th-Rose', rollNo: '8011', guardianPhone: '0301-6667788', notes: '', createdAt: '2026-10-03T08:00:00.000Z' },
      { id: 'std-7', name: 'Daniyal Khan', classSection: '9th-B', rollNo: '9021', guardianPhone: '0308-1112233', notes: '', createdAt: '2026-10-04T08:00:00.000Z' },
      { id: 'std-8', name: 'Hassan Mujtaba', classSection: '8th-Rose', rollNo: '8004', guardianPhone: '0315-9998877', notes: '', createdAt: '2026-10-05T08:00:00.000Z' },
      { id: 'std-9', name: 'Maryam Bibi', classSection: '7th-Lily', rollNo: '7015', guardianPhone: '0302-3334455', notes: '', createdAt: '2026-10-06T08:00:00.000Z' },
      { id: 'std-10', name: 'Zohaib Akhtar', classSection: '10th-A', rollNo: '1012', guardianPhone: '0341-2223344', notes: '', createdAt: '2026-10-07T08:00:00.000Z' }
    ],
    violations: [
      { id: 'v-101', studentId: 'std-3', studentName: 'Bilal Ahmed', classSection: '9th-B', details: 'Fighting in playground during recess and damaging property.', severity: 'Ultra', memberId: 'usr-admin-1', memberName: 'Principal Muhammad Ali Hamdani', memberRole: 'Admin', timestamp: '2026-11-20T11:45:00.000Z' },
      { id: 'v-102', studentId: 'std-3', studentName: 'Bilal Ahmed', classSection: '9th-B', details: 'Using smartphone inside physics lab despite explicit ban.', severity: 'High', memberId: 'usr-member-1', memberName: 'Mr. Tariq Mehmood', memberRole: 'Member', timestamp: '2026-11-18T09:20:00.000Z' },
      { id: 'v-103', studentId: 'std-1', studentName: 'Muhammad Hamza', classSection: '10th-A', details: 'Repeated disruption in mathematics class and arguing with teacher.', severity: 'Extreme', memberId: 'usr-member-2', memberName: 'Ms. Sadia Parveen', memberRole: 'Member', timestamp: '2026-11-19T10:15:00.000Z' },
      { id: 'v-104', studentId: 'std-1', studentName: 'Muhammad Hamza', classSection: '10th-A', details: 'Arrived 35 minutes late without parent note.', severity: 'Low', memberId: 'usr-member-1', memberName: 'Mr. Tariq Mehmood', memberRole: 'Member', timestamp: '2026-11-17T08:35:00.000Z' },
      { id: 'v-105', studentId: 'std-7', studentName: 'Daniyal Khan', classSection: '9th-B', details: 'Incomplete homework 3 days consecutively and inappropriate uniform.', severity: 'Medium', memberId: 'usr-member-2', memberName: 'Ms. Sadia Parveen', memberRole: 'Member', timestamp: '2026-11-19T08:40:00.000Z' },
      { id: 'v-106', studentId: 'std-7', studentName: 'Daniyal Khan', classSection: '9th-B', details: 'Disrespectful language directed at junior student.', severity: 'High', memberId: 'usr-admin-1', memberName: 'Principal Muhammad Ali Hamdani', memberRole: 'Admin', timestamp: '2026-11-16T12:30:00.000Z' },
      { id: 'v-107', studentId: 'std-4', studentName: 'Usman Tariq', classSection: '9th-A', details: 'Leaving classroom without hall pass.', severity: 'Low', memberId: 'usr-member-1', memberName: 'Mr. Tariq Mehmood', memberRole: 'Member', timestamp: '2026-11-15T10:00:00.000Z' },
      { id: 'v-108', studentId: 'std-10', studentName: 'Zohaib Akhtar', classSection: '10th-A', details: 'Defacing school desk with markers.', severity: 'Medium', memberId: 'usr-member-2', memberName: 'Ms. Sadia Parveen', memberRole: 'Member', timestamp: '2026-11-14T11:10:00.000Z' }
    ],
    // Collaborative School Issues Hub (Shared across all staff)
    issues: [
      {
        id: 'iss-1',
        title: 'Morning assembly late arrivals by 9th and 10th grade students',
        description: 'Over 25 students consistently arrive after 8:00 AM, missing the morning national anthem and discipline briefing.',
        category: 'Punctuality',
        priority: 'Urgent',
        status: 'unsolved',
        creatorId: 'usr-member-1',
        creatorName: 'Mr. Tariq Mehmood',
        creatorRole: 'Member',
        createdAt: '2026-11-19T08:15:00.000Z',
        solvedAt: null,
        solvedById: null,
        solvedByName: null,
        solvedByRole: null,
        efforts: [
          {
            id: 'eff-1',
            memberId: 'usr-member-1',
            memberName: 'Mr. Tariq Mehmood',
            memberRole: 'Member',
            text: 'Stationed senior student prefects at main gate with gate register to record exact arrival times.',
            timestamp: '2026-11-19T09:00:00.000Z'
          },
          {
            id: 'eff-2',
            memberId: 'usr-admin-1',
            memberName: 'Principal Muhammad Ali Hamdani',
            memberRole: 'Admin',
            text: 'Sent automated SMS broadcast to all parents regarding gate closure at 8:05 AM strictly.',
            timestamp: '2026-11-20T10:30:00.000Z'
          }
        ]
      },
      {
        id: 'iss-2',
        title: '2nd Floor boys washroom hygiene and water tap leakage',
        description: 'Sanitary conditions need immediate chemical wash and two flush valves require plumbing overhaul before noon.',
        category: 'Hygiene & Facilities',
        priority: 'High',
        status: 'unsolved',
        creatorId: 'usr-member-2',
        creatorName: 'Ms. Sadia Parveen',
        creatorRole: 'Member',
        createdAt: '2026-11-20T09:45:00.000Z',
        solvedAt: null,
        solvedById: null,
        solvedByName: null,
        solvedByRole: null,
        efforts: [
          {
            id: 'eff-3',
            memberId: 'usr-member-2',
            memberName: 'Ms. Sadia Parveen',
            memberRole: 'Member',
            text: 'Notified custodial supervisor and inspected the floor personally. Maintenance vendor called.',
            timestamp: '2026-11-20T10:00:00.000Z'
          }
        ]
      },
      {
        id: 'iss-3',
        title: 'Physics & Computer Lab digital projector bulb replacement',
        description: 'Lab projector lamp burned out during morning class lecture. Replacement bulb needed.',
        category: 'Academics & IT',
        priority: 'Medium',
        status: 'solved',
        creatorId: 'usr-admin-1',
        creatorName: 'Principal Muhammad Ali Hamdani',
        creatorRole: 'Admin',
        createdAt: '2026-11-17T11:00:00.000Z',
        solvedAt: '2026-11-18T14:30:00.000Z',
        solvedById: 'usr-admin-1',
        solvedByName: 'Principal Muhammad Ali Hamdani',
        solvedByRole: 'Admin',
        efforts: [
          {
            id: 'eff-4',
            memberId: 'usr-member-1',
            memberName: 'Mr. Tariq Mehmood',
            memberRole: 'Member',
            text: 'Tested HDMI cables and confirmed bulb filament failure. Requested procurement approval.',
            timestamp: '2026-11-17T11:30:00.000Z'
          },
          {
            id: 'eff-5',
            memberId: 'usr-admin-1',
            memberName: 'Principal Muhammad Ali Hamdani',
            memberRole: 'Admin',
            text: 'Authorized new Epson projector lamp from school inventory. Technician installed and tested working.',
            timestamp: '2026-11-18T14:25:00.000Z'
          }
        ]
      }
    ],
    settings: {
      instituteName: 'Hadi Education System (HES)',
      staffPin: '1234',
      theme: 'light',
      syncMode: 'Real-Time Shared'
    }
  };

  // Utilities
  function debounce(fn, waitMs) {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      }, waitMs);
    };
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDateTime(isoString) {
    if (!isoString) return 'None';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
             ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoString;
    }
  }

  function getRelativeDate(isoString) {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // --- IndexedDB Async Engine ---
  class AsyncIDBStorage {
    constructor() {
      this.db = null;
      this.ready = this.init();
    }

    init() {
      return new Promise((resolve) => {
        if (!window.indexedDB) {
          resolve(false);
          return;
        }
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('data')) {
            db.createObjectStore('data');
          }
        };
        request.onsuccess = (e) => {
          this.db = e.target.result;
          resolve(true);
        };
        request.onerror = () => resolve(false);
      });
    }

    async get(key) {
      await this.ready;
      if (!this.db) return null;
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction('data', 'readonly');
          const store = tx.objectStore('data');
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }

    async set(key, value) {
      await this.ready;
      if (!this.db) return false;
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction('data', 'readwrite');
          const store = tx.objectStore('data');
          const req = store.put(value, key);
          req.onsuccess = () => resolve(true);
          req.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      });
    }
  }

  const idbStorage = new AsyncIDBStorage();

  // --- Real-Time Collaborative Data Store ---
  class CollaborativeStore {
    constructor() {
      this.data = this.loadFromStorage();
      this.studentMap = new Map();
      this.violationsByStudent = new Map();
      this.metricsCache = new Map();

      this.rebuildIndices();
      this.debouncedSave = debounce(() => this.commitToDisk(), 250);

      this.initRealtimeSync();
      this.hydrateFromIndexedDB();
    }

    loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && Array.isArray(parsed.students) && Array.isArray(parsed.issues)) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
      return JSON.parse(JSON.stringify(INITIAL_SEED));
    }

    async hydrateFromIndexedDB() {
      try {
        const idbData = await idbStorage.get('tracker_payload');
        if (idbData && Array.isArray(idbData.students)) {
          this.data = idbData;
          this.rebuildIndices();
          if (window.appController) {
            window.appController.renderAll();
          }
        } else {
          idbStorage.set('tracker_payload', this.data);
        }
      } catch (e) {
        console.error('IDB Hydrate error:', e);
      }
    }

    initRealtimeSync() {
      // 1. BroadcastChannel: Multi-tab & multi-window instant synchronization
      if (syncChannel) {
        syncChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'SYNC_UPDATE') {
            this.handleRemoteSync(event.data.payload, event.data.action);
          }
        };
      }

      // 2. Storage Event: Multi-window fallback
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.handleRemoteSync(parsed, 'Storage Sync');
          } catch (err) {}
        }
      }, { passive: true });
    }

    broadcastUpdate(actionDescription) {
      if (syncChannel) {
        try {
          syncChannel.postMessage({
            type: 'SYNC_UPDATE',
            payload: this.data,
            action: actionDescription
          });
        } catch (e) {}
      }
    }

    handleRemoteSync(updatedData, action) {
      if (!updatedData || !Array.isArray(updatedData.students)) return;
      this.data = updatedData;
      this.rebuildIndices();
      if (window.appController) {
        window.appController.renderAll();
        if (action) {
          showToast(`⚡ Live update: ${action}`, 'success');
        }
      }
    }

    rebuildIndices() {
      this.studentMap.clear();
      this.violationsByStudent.clear();
      this.metricsCache.clear();

      const students = this.data.students || [];
      const violations = this.data.violations || [];

      for (let i = 0; i < students.length; i++) {
        const s = students[i];
        this.studentMap.set(s.id, s);
        this.violationsByStudent.set(s.id, []);
      }

      for (let i = 0; i < violations.length; i++) {
        const v = violations[i];
        let list = this.violationsByStudent.get(v.studentId);
        if (!list) {
          list = [];
          this.violationsByStudent.set(v.studentId, list);
        }
        list.push(v);
      }

      for (let i = 0; i < students.length; i++) {
        this.computeAndCacheMetrics(students[i].id);
      }
    }

    computeAndCacheMetrics(studentId) {
      const vList = this.violationsByStudent.get(studentId) || [];
      let totalPoints = 0;
      let lastViolationDate = null;

      for (let i = 0; i < vList.length; i++) {
        const v = vList[i];
        const conf = SEVERITY_CONFIG[v.severity] || SEVERITY_CONFIG.Medium;
        totalPoints += conf.points;
        if (!lastViolationDate || v.timestamp > lastViolationDate) {
          lastViolationDate = v.timestamp;
        }
      }

      const scorePercentage = Math.min(100, Math.round(totalPoints));

      let status = 'Clean Record';
      let statusClass = 'sev-safe';
      let barColor = '#10B981';

      if (scorePercentage >= 85) {
        status = 'Critical / Ultra';
        statusClass = 'sev-ultra-badge';
        barColor = '#881337';
      } else if (scorePercentage >= 55) {
        status = 'Severe Risk';
        statusClass = 'sev-extreme-badge';
        barColor = '#EF4444';
      } else if (scorePercentage >= 30) {
        status = 'High Risk';
        statusClass = 'sev-high-badge';
        barColor = '#F97316';
      } else if (scorePercentage >= 15) {
        status = 'Moderate Attention';
        statusClass = 'sev-medium-badge';
        barColor = '#F59E0B';
      } else if (scorePercentage > 0) {
        status = 'Low Risk';
        statusClass = 'sev-low-badge';
        barColor = '#10B981';
      }

      const metrics = {
        totalViolations: vList.length,
        totalPoints,
        scorePercentage,
        status,
        statusClass,
        barColor,
        lastViolationDate
      };

      this.metricsCache.set(studentId, metrics);
      return metrics;
    }

    commitToDisk() {
      idbStorage.set('tracker_payload', this.data);
      try {
        if (this.data.students.length <= 1500) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        }
      } catch (e) {}
    }

    save(actionDescription = 'Data updated') {
      this.debouncedSave();
      this.broadcastUpdate(actionDescription);
    }

    // --- Students API ---
    getStudents() {
      return this.data.students || [];
    }

    getStudentById(id) {
      return this.studentMap.get(id);
    }

    getStudentMetrics(studentId) {
      return this.metricsCache.get(studentId) || this.computeAndCacheMetrics(studentId);
    }

    addStudent(student) {
      const newStudent = {
        id: 'std-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        name: student.name.trim(),
        classSection: student.classSection.trim(),
        rollNo: (student.rollNo || '').trim(),
        guardianPhone: (student.guardianPhone || '').trim(),
        notes: (student.notes || '').trim(),
        createdAt: new Date().toISOString()
      };
      this.data.students.unshift(newStudent);
      this.studentMap.set(newStudent.id, newStudent);
      this.violationsByStudent.set(newStudent.id, []);
      this.computeAndCacheMetrics(newStudent.id);
      this.save(`New student added: ${newStudent.name}`);
      return newStudent;
    }

    updateStudent(id, fields) {
      const student = this.studentMap.get(id);
      if (student) {
        Object.assign(student, fields);
        const idx = this.data.students.findIndex(s => s.id === id);
        if (idx !== -1) this.data.students[idx] = student;
        this.save(`Student profile updated: ${student.name}`);
        return student;
      }
      return null;
    }

    deleteStudent(id) {
      const student = this.studentMap.get(id);
      const name = student ? student.name : 'Student';
      this.data.students = this.data.students.filter(s => s.id !== id);
      this.data.violations = this.data.violations.filter(v => v.studentId !== id);
      this.studentMap.delete(id);
      this.violationsByStudent.delete(id);
      this.metricsCache.delete(id);
      this.save(`Student record removed: ${name}`);
    }

    // --- Violations API (With Staff Attribution) ---
    getViolations() {
      return this.data.violations || [];
    }

    getViolationsForStudent(studentId) {
      const list = this.violationsByStudent.get(studentId) || [];
      return list.slice().sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
    }

    addViolation({ studentId, studentName, classSection, details, severity }) {
      const currentUser = window.authManager.getCurrentUser();
      const newViolation = {
        id: 'v-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        studentId,
        studentName,
        classSection,
        details: details.trim(),
        severity: severity || 'Medium',
        // AUTOMATIC USER ATTRIBUTION & DATE/TIME
        memberId: currentUser.id,
        memberName: currentUser.name,
        memberRole: currentUser.role,
        timestamp: new Date().toISOString()
      };

      this.data.violations.unshift(newViolation);
      let list = this.violationsByStudent.get(studentId);
      if (!list) {
        list = [];
        this.violationsByStudent.set(studentId, list);
      }
      list.unshift(newViolation);

      this.computeAndCacheMetrics(studentId);
      this.save(`Violation logged for ${studentName} by ${currentUser.name}`);
      return newViolation;
    }

    deleteViolation(id) {
      const v = this.data.violations.find(item => item.id === id);
      if (!v) return;

      this.data.violations = this.data.violations.filter(item => item.id !== id);
      const list = this.violationsByStudent.get(v.studentId);
      if (list) {
        this.violationsByStudent.set(v.studentId, list.filter(item => item.id !== id));
      }
      this.computeAndCacheMetrics(v.studentId);
      this.save(`Violation record deleted`);
    }

    // --- Collaborative Issues & Efforts API ---
    getIssues() {
      return (this.data.issues || []).slice().sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    }

    getIssueById(id) {
      return (this.data.issues || []).find(iss => iss.id === id);
    }

    addIssue({ title, description, priority = 'Medium', category = 'General' }) {
      const currentUser = window.authManager.getCurrentUser();
      const newIssue = {
        id: 'iss-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        title: title.trim(),
        description: description.trim(),
        priority,
        category: category.trim() || 'General',
        status: 'unsolved',
        creatorId: currentUser.id,
        creatorName: currentUser.name,
        creatorRole: currentUser.role,
        createdAt: new Date().toISOString(),
        solvedAt: null,
        solvedById: null,
        solvedByName: null,
        solvedByRole: null,
        efforts: []
      };

      if (!this.data.issues) this.data.issues = [];
      this.data.issues.unshift(newIssue);
      this.save(`New issue created: "${newIssue.title}" by ${currentUser.name}`);
      return newIssue;
    }

    addEffortToIssue(issueId, effortText) {
      const issue = this.getIssueById(issueId);
      if (!issue) return null;

      const currentUser = window.authManager.getCurrentUser();
      const newEffort = {
        id: 'eff-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        memberId: currentUser.id,
        memberName: currentUser.name,
        memberRole: currentUser.role,
        text: effortText.trim(),
        timestamp: new Date().toISOString()
      };

      if (!issue.efforts) issue.efforts = [];
      issue.efforts.push(newEffort);

      this.save(`New effort added to "${issue.title}" by ${currentUser.name}`);
      return newEffort;
    }

    updateEffort(issueId, effortId, newText) {
      const issue = this.getIssueById(issueId);
      if (!issue || !issue.efforts) return false;

      const effort = issue.efforts.find(e => e.id === effortId);
      if (!effort) return false;

      // Permission check: only author can edit
      if (!window.authManager.canEditEffort(effort)) {
        return false;
      }

      effort.text = newText.trim();
      this.save(`Effort updated on "${issue.title}"`);
      return true;
    }

    deleteEffort(issueId, effortId) {
      const issue = this.getIssueById(issueId);
      if (!issue || !issue.efforts) return false;

      const effort = issue.efforts.find(e => e.id === effortId);
      if (!effort) return false;

      if (!window.authManager.canDeleteEffort(effort)) {
        return false;
      }

      issue.efforts = issue.efforts.filter(e => e.id !== effortId);
      this.save(`Effort deleted from "${issue.title}"`);
      return true;
    }

    markIssueSolved(issueId) {
      const issue = this.getIssueById(issueId);
      if (!issue) return false;

      if (!window.authManager.canSolveIssue(issue)) {
        return false;
      }

      const currentUser = window.authManager.getCurrentUser();
      issue.status = 'solved';
      issue.solvedAt = new Date().toISOString();
      issue.solvedById = currentUser.id;
      issue.solvedByName = currentUser.name;
      issue.solvedByRole = currentUser.role;

      this.save(`Issue marked SOLVED: "${issue.title}" by ${currentUser.name}`);
      return true;
    }

    reopenIssue(issueId) {
      const issue = this.getIssueById(issueId);
      if (!issue) return false;

      if (!window.authManager.canSolveIssue(issue)) {
        return false;
      }

      issue.status = 'unsolved';
      issue.solvedAt = null;
      issue.solvedById = null;
      issue.solvedByName = null;
      issue.solvedByRole = null;

      this.save(`Issue REOPENED: "${issue.title}"`);
      return true;
    }

    deleteIssue(issueId) {
      const issue = this.getIssueById(issueId);
      if (!issue) return false;

      if (!window.authManager.canDeleteIssue(issue)) {
        return false;
      }

      this.data.issues = this.data.issues.filter(i => i.id !== issueId);
      this.save(`Issue deleted: "${issue.title}"`);
      return true;
    }

    // --- Statistics & Counts ---
    getQuickStats() {
      const now = new Date().getTime();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

      const totalStudents = this.data.students.length;
      const totalViolations = this.data.violations.length;

      let violationsThisWeek = 0;
      const violations = this.data.violations;
      for (let i = 0; i < violations.length; i++) {
        if (new Date(violations[i].timestamp).getTime() >= oneWeekAgo) {
          violationsThisWeek++;
        }
      }

      const issues = this.data.issues || [];
      const unsolvedCount = issues.filter(i => i.status === 'unsolved').length;
      const solvedCount = issues.filter(i => i.status === 'solved').length;

      const studentMetricsList = [];
      for (const [studentId, metrics] of this.metricsCache.entries()) {
        const student = this.studentMap.get(studentId);
        if (student && metrics.totalViolations > 0) {
          studentMetricsList.push({ student, metrics });
        }
      }

      studentMetricsList.sort((a, b) => b.metrics.totalViolations - a.metrics.totalViolations || b.metrics.totalPoints - a.metrics.totalPoints);
      const top5Students = studentMetricsList.slice(0, 5);

      return {
        totalStudents,
        totalViolations,
        violationsThisWeek,
        unsolvedCount,
        solvedCount,
        top5Students
      };
    }

    getSettings() {
      return this.data.settings || INITIAL_SEED.settings;
    }

    updateSettings(newSettings) {
      this.data.settings = { ...this.data.settings, ...newSettings };
      this.save('Settings updated');
    }

    resetToDemoData() {
      this.data = JSON.parse(JSON.stringify(INITIAL_SEED));
      this.rebuildIndices();
      this.commitToDisk();
      this.broadcastUpdate('Reset to demo data');
    }
  }

  const store = new CollaborativeStore();

  // --- Severity Meter Helper ---
  function renderSeverityMeter(scorePercentage, barColor, status, statusClass) {
    const clampedScore = Math.max(0, Math.min(100, scorePercentage));
    const scaleFactor = (clampedScore / 100).toFixed(3);
    return `
      <div class="severity-meter-container">
        <div class="meter-label-row">
          <span class="meter-badge ${statusClass}">${status}</span>
          <span>${clampedScore}%</span>
        </div>
        <div class="meter-track" title="Disciplinary Weight: ${clampedScore}%">
          <div class="meter-fill" style="transform: scaleX(${scaleFactor}); background-color: ${barColor};"></div>
        </div>
      </div>
    `;
  }

  // --- Toast Manager ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>`;
    }

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, 3000);
  }

  // --- Modals ---
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function showConfirmModal(title, message, confirmText, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    if (!modal) {
      if (confirm(message)) onConfirm();
      return;
    }

    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-message').textContent = message;
    const confirmBtn = document.getElementById('confirm-modal-action-btn');
    confirmBtn.textContent = confirmText || 'Confirm';

    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

    newBtn.addEventListener('click', () => {
      closeModal('confirm-modal');
      onConfirm();
    });

    openModal('confirm-modal');
  }

  // --- Main Application UI Controller ---
  class AppController {
    constructor() {
      this.selectedSeverity = 'Medium';
      this.recordsPage = 1;
      this.recordsPageSize = 15;
      this.masterSortBy = 'violations-desc';
      this.masterClassFilter = 'all';
      this.masterSearchTerm = '';

      // Issues filter states
      this.issueStatusFilter = 'all'; // 'all' | 'unsolved' | 'solved'
      this.issuePriorityFilter = 'all';
      this.issueSortBy = 'newest';
      this.activeIssueId = null;

      this.currentProfileStudentId = null;

      this.initTheme();
      this.initAuthUI();
      this.initFontSettings();
      this.bindEvents();
      this.renderAll();

      // Listen to auth changes
      window.authManager.subscribe(() => {
        this.initAuthUI();
        this.renderAll();
      });
    }

    initTheme() {
      const settings = store.getSettings();
      const savedTheme = settings.theme || localStorage.getItem('hes_theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
      this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('hes_theme', next);
      store.updateSettings({ theme: next });
      this.updateThemeIcon(next);
      showToast(`Switched to ${next} mode`, 'success');
    }

    updateThemeIcon(theme) {
      const icon = document.getElementById('theme-toggle-icon');
      if (!icon) return;
      if (theme === 'dark') {
        icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      } else {
        icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      }
    }

    initFontSettings() {
      const savedFont = localStorage.getItem('hes_font_preference') || 'plus-jakarta';
      const smoothingEnabled = localStorage.getItem('hes_font_smoothing') !== 'false';
      this.applyFont(savedFont, false);
      this.applySmoothing(smoothingEnabled);

      const fontSelect = document.getElementById('font-family-select');
      if (fontSelect) {
        fontSelect.value = savedFont;
        fontSelect.addEventListener('change', (e) => {
          this.applyFont(e.target.value, true);
        });
      }

      const smoothingToggle = document.getElementById('font-smoothing-toggle');
      if (smoothingToggle) {
        smoothingToggle.checked = smoothingEnabled;
        smoothingToggle.addEventListener('change', (e) => {
          this.applySmoothing(e.target.checked);
        });
      }

      document.getElementById('font-toggle-btn')?.addEventListener('click', () => {
        this.cycleFont();
      });
    }

    cycleFont() {
      const fonts = ['plus-jakarta', 'outfit', 'dm-sans', 'inter', 'system'];
      const fontLabels = {
        'plus-jakarta': '✨ Plus Jakarta Sans (Ultra-Smooth)',
        'outfit': '🌸 Outfit (Soft Curves)',
        'dm-sans': '📐 DM Sans (Clean & Rounded)',
        'inter': '🎯 Inter (Standard Crisp)',
        'system': '💻 System Native Font'
      };
      const current = localStorage.getItem('hes_font_preference') || 'plus-jakarta';
      const currentIndex = fonts.indexOf(current);
      const nextFont = fonts[(currentIndex + 1) % fonts.length];
      this.applyFont(nextFont, true);
      const select = document.getElementById('font-family-select');
      if (select) select.value = nextFont;
    }

    applyFont(fontKey, notify = false) {
      const validFonts = ['plus-jakarta', 'outfit', 'dm-sans', 'inter', 'system'];
      const targetFont = validFonts.includes(fontKey) ? fontKey : 'plus-jakarta';
      validFonts.forEach(f => {
        document.documentElement.classList.remove(`font-${f}`);
        document.body.classList.remove(`font-${f}`);
      });
      document.documentElement.classList.add(`font-${targetFont}`);
      document.body.classList.add(`font-${targetFont}`);
      localStorage.setItem('hes_font_preference', targetFont);

      const fontNames = {
        'plus-jakarta': 'Plus Jakarta Sans (Ultra-Smooth)',
        'outfit': 'Outfit (Soft Curved)',
        'dm-sans': 'DM Sans (Clean & Rounded)',
        'inter': 'Inter (Crisp)',
        'system': 'System Native'
      };
      if (notify) {
        showToast(`Font switched to ${fontNames[targetFont]}`, 'success');
      }
    }

    applySmoothing(enabled) {
      if (enabled) {
        document.documentElement.classList.remove('no-smoothing');
        document.body.classList.remove('no-smoothing');
        localStorage.setItem('hes_font_smoothing', 'true');
      } else {
        document.documentElement.classList.add('no-smoothing');
        document.body.classList.add('no-smoothing');
        localStorage.setItem('hes_font_smoothing', 'false');
      }
    }

    initAuthUI() {
      const user = window.authManager.getCurrentUser();
      const chipName = document.getElementById('header-member-name');
      const chipAvatar = document.getElementById('header-member-avatar');
      const chipBadge = document.getElementById('header-member-badge');

      if (chipName) chipName.textContent = user.name;
      if (chipAvatar) {
        chipAvatar.textContent = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        chipAvatar.classList.toggle('admin-avatar', user.role === 'Admin');
      }
      if (chipBadge) {
        chipBadge.textContent = user.role;
        chipBadge.className = `role-badge ${user.role === 'Admin' ? 'role-badge-admin' : 'role-badge-member'}`;
      }

      // Sync status indicator text
      const syncText = document.getElementById('sync-mode-text');
      if (syncText) {
        syncText.textContent = window.isFirebaseConfigured?.() ? 'Cloud Firestore Real-Time Active' : 'Live Shared Real-Time Mode (Multi-Device)';
      }
    }

    renderAll() {
      this.renderQuickStats();
      this.populateStudentSelectDropdowns();
      this.populateClassDropdowns();
      if (document.getElementById('records-modal')?.classList.contains('active')) {
        this.renderMasterTable();
      }
      if (document.getElementById('issues-modal')?.classList.contains('active')) {
        this.renderIssuesHub();
      }
      if (this.activeIssueId && document.getElementById('issue-detail-modal')?.classList.contains('active')) {
        this.renderIssueDetail(this.activeIssueId);
      }
      if (this.currentProfileStudentId && document.getElementById('student-profile-modal')?.classList.contains('active')) {
        this.renderStudentProfile(this.currentProfileStudentId);
      }
    }

    bindEvents() {
      // Header & Navigation
      document.getElementById('theme-toggle-btn')?.addEventListener('click', () => this.toggleTheme());
      document.getElementById('settings-btn')?.addEventListener('click', () => openModal('settings-modal'));
      document.getElementById('header-member-chip')?.addEventListener('click', () => this.openStaffModal());

      // Center Action Cards
      document.getElementById('card-add-violation')?.addEventListener('click', () => this.openAddViolationModal());
      document.getElementById('card-issues')?.addEventListener('click', () => this.openIssuesHub());
      document.getElementById('card-records')?.addEventListener('click', () => this.openRecordsModal());

      // Mobile Bottom Nav Items
      document.getElementById('nav-home')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.setActiveBottomNav('nav-home');
      });
      document.getElementById('nav-violation')?.addEventListener('click', () => {
        this.openAddViolationModal();
        this.setActiveBottomNav('nav-violation');
      });
      document.getElementById('nav-issues')?.addEventListener('click', () => {
        this.openIssuesHub();
        this.setActiveBottomNav('nav-issues');
      });
      document.getElementById('nav-records')?.addEventListener('click', () => {
        this.openRecordsModal();
        this.setActiveBottomNav('nav-records');
      });
      document.getElementById('nav-staff')?.addEventListener('click', () => {
        this.openStaffModal();
        this.setActiveBottomNav('nav-staff');
      });

      // Mobile FAB
      document.getElementById('fab-add-issue')?.addEventListener('click', () => {
        this.openAddIssueModal();
      });

      // Global Top Search Input (Finds both students and issues)
      const globalSearch = document.getElementById('global-search-input');
      const clearSearchBtn = document.getElementById('search-clear-btn');
      const searchDropdown = document.getElementById('search-results-dropdown');

      const debouncedSearch = debounce((val) => {
        if (val.length > 0) {
          clearSearchBtn?.classList.add('visible');
          this.handleGlobalSearch(val);
        } else {
          clearSearchBtn?.classList.remove('visible');
          searchDropdown?.classList.remove('active');
        }
      }, 250);

      globalSearch?.addEventListener('input', (e) => debouncedSearch(e.target.value.trim().toLowerCase()));

      document.addEventListener('click', (e) => {
        if (!globalSearch?.contains(e.target) && !searchDropdown?.contains(e.target)) {
          searchDropdown?.classList.remove('active');
        }
      }, { passive: true });

      clearSearchBtn?.addEventListener('click', () => {
        if (globalSearch) globalSearch.value = '';
        clearSearchBtn.classList.remove('visible');
        searchDropdown?.classList.remove('active');
      });

      // Severity 5-Button Selector
      document.querySelectorAll('.sev-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('.sev-btn').forEach(b => b.classList.remove('active'));
          const target = e.currentTarget;
          target.classList.add('active');
          this.selectedSeverity = target.getAttribute('data-sev');
        });
      });

      // Quick Tag Chips for Violations
      document.querySelectorAll('.quick-tags .tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const textarea = document.getElementById('violation-details-input');
          if (textarea) {
            const current = textarea.value.trim();
            const tag = btn.getAttribute('data-tag');
            textarea.value = current ? `${current}. ${tag}` : tag;
            textarea.focus();
          }
        });
      });

      // Add Violation Form
      document.getElementById('add-violation-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveViolation();
      });

      // Add Issue Form
      document.getElementById('add-issue-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveNewIssue();
      });

      // Add Effort Form in Issue Detail
      document.getElementById('add-effort-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveNewEffort();
      });

      // Auto-fill Class on Student Select
      document.getElementById('v-student-select')?.addEventListener('change', (e) => {
        const student = store.getStudentById(e.target.value);
        const classSelect = document.getElementById('v-class-select');
        const customInput = document.getElementById('v-class-custom');
        if (student && classSelect) {
          this.ensureClassOption(classSelect, student.classSection);
          classSelect.value = student.classSection;
          if (customInput) customInput.style.display = 'none';
        }
      });

      document.getElementById('v-class-select')?.addEventListener('change', (e) => {
        const customInput = document.getElementById('v-class-custom');
        if (customInput) {
          customInput.style.display = e.target.value === 'Custom' ? 'block' : 'none';
          if (e.target.value === 'Custom') customInput.focus();
        }
      });

      // Inline New Student Modals
      document.getElementById('v-inline-add-student')?.addEventListener('click', () => openModal('add-student-modal'));
      document.getElementById('add-student-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveNewStudent();
      });

      // Master Records Filter & Sorting
      document.getElementById('records-sort-select')?.addEventListener('change', (e) => {
        this.masterSortBy = e.target.value;
        this.recordsPage = 1;
        this.renderMasterTable();
      });

      document.getElementById('records-class-filter')?.addEventListener('change', (e) => {
        this.masterClassFilter = e.target.value;
        this.recordsPage = 1;
        this.renderMasterTable();
      });

      const debouncedTableSearch = debounce((val) => {
        this.masterSearchTerm = val;
        this.recordsPage = 1;
        this.renderMasterTable();
      }, 250);

      document.getElementById('records-table-search')?.addEventListener('input', (e) => {
        debouncedTableSearch(e.target.value.toLowerCase().trim());
      });

      // Issues Hub Filter Tabs
      document.querySelectorAll('.issue-filter-tabs .tab-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('.issue-filter-tabs .tab-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.issueStatusFilter = pill.getAttribute('data-status');
          this.renderIssuesHub();
        });
      });

      document.getElementById('issue-priority-filter')?.addEventListener('change', (e) => {
        this.issuePriorityFilter = e.target.value;
        this.renderIssuesHub();
      });

      document.getElementById('issue-sort-select')?.addEventListener('change', (e) => {
        this.issueSortBy = e.target.value;
        this.renderIssuesHub();
      });

      document.getElementById('open-add-issue-btn')?.addEventListener('click', () => this.openAddIssueModal());

      // Profile Actions
      document.getElementById('print-profile-btn')?.addEventListener('click', () => window.print());
      document.getElementById('profile-add-violation-btn')?.addEventListener('click', () => {
        if (this.currentProfileStudentId) {
          closeModal('student-profile-modal');
          this.openAddViolationModal(this.currentProfileStudentId);
        }
      });

      // Edit / Delete Student from Profile
      document.getElementById('profile-edit-std-btn')?.addEventListener('click', () => {
        if (!this.currentProfileStudentId) return;
        const student = store.getStudentById(this.currentProfileStudentId);
        if (!student) return;

        document.getElementById('edit-std-id').value = student.id;
        document.getElementById('edit-std-name').value = student.name;
        document.getElementById('edit-std-class').value = student.classSection;
        document.getElementById('edit-std-roll').value = student.rollNo || '';
        document.getElementById('edit-std-phone').value = student.guardianPhone || '';
        document.getElementById('edit-std-notes').value = student.notes || '';

        openModal('edit-student-modal');
      });

      document.getElementById('edit-student-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-std-id')?.value;
        const name = document.getElementById('edit-std-name')?.value.trim();
        const classSection = document.getElementById('edit-std-class')?.value.trim();
        const rollNo = document.getElementById('edit-std-roll')?.value.trim();
        const guardianPhone = document.getElementById('edit-std-phone')?.value.trim();
        const notes = document.getElementById('edit-std-notes')?.value.trim();

        if (!name || !classSection) {
          showToast('Name and Class are required', 'error');
          return;
        }

        store.updateStudent(id, { name, classSection, rollNo, guardianPhone, notes });
        showToast('Student profile updated', 'success');
        closeModal('edit-student-modal');
        this.populateStudentSelectDropdowns();
        this.populateClassDropdowns();
        if (this.currentProfileStudentId === id) {
          this.renderStudentProfile(id);
        }
      });

      document.getElementById('profile-delete-std-btn')?.addEventListener('click', () => {
        if (!this.currentProfileStudentId) return;
        if (!window.authManager.canDeleteStudent()) {
          showToast('Only Admin can delete student records', 'error');
          return;
        }

        const student = store.getStudentById(this.currentProfileStudentId);
        if (!student) return;

        showConfirmModal(
          `Delete Student: ${student.name}`,
          `Are you sure you want to permanently delete ${student.name}? This will remove all their recorded violations from the database.`,
          'Delete Student Record',
          () => {
            store.deleteStudent(student.id);
            showToast(`Student ${student.name} deleted`, 'success');
            closeModal('student-profile-modal');
            this.currentProfileStudentId = null;
            this.renderQuickStats();
            this.populateStudentSelectDropdowns();
            this.populateClassDropdowns();
            if (document.getElementById('records-modal')?.classList.contains('active')) {
              this.renderMasterTable();
            }
          }
        );
      });

      // Staff Member Login & Registration
      document.getElementById('staff-login-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('staff-login-username')?.value;
        const password = document.getElementById('staff-login-password')?.value;
        const res = window.authManager.login(username, password);
        if (res.success) {
          showToast(`Welcome, ${res.user.name} (${res.user.role})!`, 'success');
          closeModal('staff-modal');
        } else {
          showToast(res.message, 'error');
        }
      });

      document.getElementById('staff-register-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-member-name')?.value;
        const username = document.getElementById('new-member-username')?.value;
        const password = document.getElementById('new-member-password')?.value;
        const role = document.getElementById('new-member-role')?.value;
        const designation = document.getElementById('new-member-designation')?.value;

        const res = window.authManager.registerMember({ name, username, password, role, designation });
        if (res.success) {
          showToast(`Member ${res.user.name} registered successfully!`, 'success');
          document.getElementById('staff-register-form').reset();
          this.renderStaffList();
        } else {
          showToast(res.message, 'error');
        }
      });

      // Firebase Config Save
      document.getElementById('firebase-config-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const apiKey = document.getElementById('fb-api-key')?.value.trim();
        const projectId = document.getElementById('fb-project-id')?.value.trim();
        const authDomain = document.getElementById('fb-auth-domain')?.value.trim();

        if (!apiKey || !projectId) {
          showToast('API Key and Project ID are required for Firebase', 'error');
          return;
        }

        const config = {
          apiKey,
          projectId,
          authDomain: authDomain || `${projectId}.firebaseapp.com`,
          storageBucket: `${projectId}.appspot.com`,
          messagingSenderId: "",
          appId: ""
        };

        localStorage.setItem('hes_custom_firebase_config', JSON.stringify(config));
        window.FIREBASE_CONFIG = config;
        showToast('Firebase configuration saved! Live cloud sync connected.', 'success');
        this.initAuthUI();
        closeModal('settings-modal');
      });

      // Data Management: Export / Backup
      document.getElementById('export-records-csv-btn')?.addEventListener('click', () => this.exportMasterToCSV());
      document.getElementById('export-violations-csv-btn')?.addEventListener('click', () => this.exportViolationsToCSV());
      document.getElementById('export-issues-csv-btn')?.addEventListener('click', () => this.exportIssuesToCSV());
      document.getElementById('backup-json-btn')?.addEventListener('click', () => this.downloadJSONBackup());
      document.getElementById('restore-json-input')?.addEventListener('change', (e) => this.handleJSONRestore(e));
      document.getElementById('import-students-csv-input')?.addEventListener('change', (e) => this.handleCSVImport(e));

      document.getElementById('reset-demo-data-btn')?.addEventListener('click', () => {
        showConfirmModal(
          'Reset to Demo Data',
          'Are you sure you want to reset all records to the original demo data? Any unsaved custom entries will be replaced.',
          'Reset Now',
          () => {
            store.resetToDemoData();
            showToast('All records reset to initial demo data', 'success');
            closeModal('settings-modal');
            this.renderAll();
          }
        );
      });

      // Close modal on backdrop click
      window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
          e.target.classList.remove('active');
          document.body.style.overflow = '';
        }
      }, { passive: true });
    }

    setActiveBottomNav(navId) {
      document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.classList.toggle('active', item.id === navId);
      });
    }

    ensureClassOption(selectEl, className) {
      if (!Array.from(selectEl.options).some(o => o.value === className)) {
        const opt = document.createElement('option');
        opt.value = className;
        opt.textContent = className;
        selectEl.appendChild(opt);
      }
    }

    // --- Quick Stats ---
    renderQuickStats() {
      const stats = store.getQuickStats();
      
      const totalStudentsEl = document.getElementById('stat-total-students');
      const totalViolationsEl = document.getElementById('stat-total-violations');
      const weekViolationsEl = document.getElementById('stat-week-violations');
      const unsolvedIssuesEl = document.getElementById('stat-unsolved-issues');
      const issuesCardBadge = document.getElementById('issues-card-live-badge');

      if (totalStudentsEl) totalStudentsEl.textContent = stats.totalStudents;
      if (totalViolationsEl) totalViolationsEl.textContent = stats.totalViolations;
      if (weekViolationsEl) weekViolationsEl.textContent = stats.violationsThisWeek;
      if (unsolvedIssuesEl) unsolvedIssuesEl.textContent = stats.unsolvedCount;

      // Update Center Card Live Badge: "X Unsolved / Y Solved"
      if (issuesCardBadge) {
        issuesCardBadge.textContent = `${stats.unsolvedCount} Unsolved / ${stats.solvedCount} Solved`;
      }

      // Leaderboard
      const leaderboardList = document.getElementById('top-5-leaderboard-list');
      if (!leaderboardList) return;

      if (stats.top5Students.length === 0) {
        leaderboardList.innerHTML = `<div style="text-align:center; padding: 1rem; color: var(--text-muted);">No student violations recorded yet. Outstanding discipline!</div>`;
        return;
      }

      leaderboardList.innerHTML = stats.top5Students.map((item, idx) => {
        const rank = idx + 1;
        const m = item.metrics;
        return `
          <div class="leader-item" onclick="window.appController.openStudentProfile('${item.student.id}')">
            <div class="leader-left">
              <div class="leader-rank rank-${rank}">#${rank}</div>
              <div class="leader-details">
                <div class="student-title">${escapeHtml(item.student.name)}</div>
                <div class="student-sub">Class: ${escapeHtml(item.student.classSection)} | Roll: ${escapeHtml(item.student.rollNo || 'N/A')}</div>
              </div>
            </div>
            <div class="leader-right">
              <span class="violation-pill">${m.totalViolations} Violation${m.totalViolations > 1 ? 's' : ''}</span>
              ${renderSeverityMeter(m.scorePercentage, m.barColor, m.status, m.statusClass)}
            </div>
          </div>
        `;
      }).join('');
    }

    populateStudentSelectDropdowns() {
      const students = store.getStudents();
      const sel = document.getElementById('v-student-select');
      if (!sel) return;

      const currentVal = sel.value;
      const fragment = document.createDocumentFragment();
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = '-- Choose or Search Student --';
      fragment.appendChild(defaultOpt);

      for (let i = 0; i < students.length; i++) {
        const s = students[i];
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.name} (${s.classSection}${s.rollNo ? ' - Roll: ' + s.rollNo : ''})`;
        fragment.appendChild(opt);
      }

      sel.innerHTML = '';
      sel.appendChild(fragment);
      if (currentVal && store.getStudentById(currentVal)) {
        sel.value = currentVal;
      }
    }

    populateClassDropdowns() {
      const students = store.getStudents();
      const classSet = new Set();
      for (let i = 0; i < students.length; i++) {
        if (students[i].classSection) classSet.add(students[i].classSection);
      }
      const classes = Array.from(classSet).sort();

      const sel = document.getElementById('records-class-filter');
      if (!sel) return;

      const currentVal = sel.value;
      sel.innerHTML = '<option value="all">All Classes</option>';
      for (let i = 0; i < classes.length; i++) {
        const opt = document.createElement('option');
        opt.value = classes[i];
        opt.textContent = classes[i];
        sel.appendChild(opt);
      }
      if (currentVal) sel.value = currentVal;
    }

    // --- Global Search (Students and Issues) ---
    handleGlobalSearch(query) {
      const dropdown = document.getElementById('search-results-dropdown');
      if (!dropdown) return;

      const students = store.getStudents();
      const issues = store.getIssues();

      const studentMatches = [];
      for (let i = 0; i < students.length; i++) {
        const s = students[i];
        if (
          s.name.toLowerCase().includes(query) ||
          s.classSection.toLowerCase().includes(query) ||
          (s.rollNo && s.rollNo.toLowerCase().includes(query))
        ) {
          studentMatches.push(s);
          if (studentMatches.length >= 5) break;
        }
      }

      const issueMatches = [];
      for (let i = 0; i < issues.length; i++) {
        const iss = issues[i];
        if (
          iss.title.toLowerCase().includes(query) ||
          iss.description.toLowerCase().includes(query) ||
          iss.category.toLowerCase().includes(query)
        ) {
          issueMatches.push(iss);
          if (issueMatches.length >= 4) break;
        }
      }

      if (studentMatches.length === 0 && issueMatches.length === 0) {
        dropdown.innerHTML = `
          <div style="padding: 1.25rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
            No student or issue found matching "<strong>${escapeHtml(query)}</strong>"
          </div>
        `;
      } else {
        let html = '';
        if (studentMatches.length > 0) {
          html += `<div style="padding: 6px 12px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Students</div>`;
          html += studentMatches.map(s => {
            const m = store.getStudentMetrics(s.id);
            const initials = s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            return `
              <div class="search-item" onclick="window.appController.openStudentProfile('${s.id}')">
                <div class="search-item-info">
                  <div class="search-avatar">${initials}</div>
                  <div class="search-item-text">
                    <div class="student-name">${escapeHtml(s.name)}</div>
                    <div class="student-class">${escapeHtml(s.classSection)} | Roll: ${escapeHtml(s.rollNo || 'N/A')}</div>
                  </div>
                </div>
                <div><span class="search-item-badge ${m.statusClass}">${m.totalViolations} Violations</span></div>
              </div>
            `;
          }).join('');
        }

        if (issueMatches.length > 0) {
          html += `<div style="padding: 6px 12px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; border-top: 1px solid var(--border-color);">Issues & Tasks</div>`;
          html += issueMatches.map(iss => {
            return `
              <div class="search-item" onclick="window.appController.openIssueDetail('${iss.id}')">
                <div class="search-item-info">
                  <div class="search-avatar" style="background: ${iss.status === 'solved' ? '#10B981' : '#0284C7'};">💡</div>
                  <div class="search-item-text">
                    <div class="student-name">${escapeHtml(iss.title)}</div>
                    <div class="student-class">${iss.status === 'solved' ? '🟢 Solved' : '🔴 Unsolved'} | Priority: ${iss.priority}</div>
                  </div>
                </div>
                <div><span class="badge-priority priority-${iss.priority.toLowerCase()}">${iss.priority}</span></div>
              </div>
            `;
          }).join('');
        }

        dropdown.innerHTML = html;
      }

      dropdown.classList.add('active');
    }

    // --- Modal Openers ---
    openAddViolationModal(studentId = null) {
      const select = document.getElementById('v-student-select');
      const classSelect = document.getElementById('v-class-select');
      const classCustom = document.getElementById('v-class-custom');
      const detailsInput = document.getElementById('violation-details-input');
      const dateBadge = document.getElementById('v-auto-date-badge');
      const memberChip = document.getElementById('v-member-author-chip');

      if (detailsInput) detailsInput.value = '';
      if (classCustom) {
        classCustom.value = '';
        classCustom.style.display = 'none';
      }

      const user = window.authManager.getCurrentUser();
      if (memberChip) {
        memberChip.textContent = `Logging as: ${user.name} (${user.role})`;
      }

      if (dateBadge) {
        dateBadge.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Detected: <strong>${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, Today</strong> (Auto-logged)
        `;
      }

      if (select && studentId) {
        select.value = studentId;
        const student = store.getStudentById(studentId);
        if (student && classSelect) {
          this.ensureClassOption(classSelect, student.classSection);
          classSelect.value = student.classSection;
        }
      }

      this.selectedSeverity = 'Medium';
      document.querySelectorAll('.sev-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-sev') === 'Medium');
      });

      openModal('add-violation-modal');
    }

    openIssuesHub() {
      this.renderIssuesHub();
      openModal('issues-modal');
    }

    openAddIssueModal() {
      document.getElementById('add-issue-form')?.reset();
      openModal('add-issue-modal');
    }

    openRecordsModal() {
      this.recordsPage = 1;
      this.renderMasterTable();
      openModal('records-modal');
    }

    openStudentProfile(studentId) {
      document.getElementById('search-results-dropdown')?.classList.remove('active');
      this.currentProfileStudentId = studentId;
      this.renderStudentProfile(studentId);
      openModal('student-profile-modal');
    }

    openStaffModal() {
      this.renderStaffList();
      openModal('staff-modal');
    }

    // --- Add Violation Action ---
    saveViolation() {
      const studentSelect = document.getElementById('v-student-select');
      const classSelect = document.getElementById('v-class-select');
      const classCustom = document.getElementById('v-class-custom');
      const detailsInput = document.getElementById('violation-details-input');

      const studentId = studentSelect?.value;
      const details = detailsInput?.value.trim();

      if (!studentId) {
        showToast('Please select a student', 'error');
        return;
      }
      if (!details) {
        showToast('Please enter violation details', 'error');
        return;
      }

      const student = store.getStudentById(studentId);
      const studentName = student ? student.name : 'Unknown';
      let classSection = classSelect?.value === 'Custom' ? classCustom?.value.trim() : classSelect?.value.trim();
      if (!classSection) {
        classSection = student ? student.classSection : 'General';
      }

      store.addViolation({
        studentId,
        studentName,
        classSection,
        details,
        severity: this.selectedSeverity
      });

      showToast(`Violation saved for ${studentName}`, 'success');
      closeModal('add-violation-modal');

      this.renderQuickStats();
      if (document.getElementById('records-modal')?.classList.contains('active')) {
        this.renderMasterTable();
      }
      if (this.currentProfileStudentId === studentId) {
        this.renderStudentProfile(studentId);
      }
    }

    // --- Issues Hub Implementation ---
    renderIssuesHub() {
      const listEl = document.getElementById('issues-list-container');
      const countAllEl = document.getElementById('issue-count-all');
      const countUnsolvedEl = document.getElementById('issue-count-unsolved');
      const countSolvedEl = document.getElementById('issue-count-solved');

      const issues = store.getIssues();
      const allCount = issues.length;
      const unsolvedCount = issues.filter(i => i.status === 'unsolved').length;
      const solvedCount = issues.filter(i => i.status === 'solved').length;

      if (countAllEl) countAllEl.textContent = allCount;
      if (countUnsolvedEl) countUnsolvedEl.textContent = unsolvedCount;
      if (countSolvedEl) countSolvedEl.textContent = solvedCount;

      let filtered = issues;

      // Status filter
      if (this.issueStatusFilter === 'unsolved') {
        filtered = filtered.filter(i => i.status === 'unsolved');
      } else if (this.issueStatusFilter === 'solved') {
        filtered = filtered.filter(i => i.status === 'solved');
      }

      // Priority filter
      if (this.issuePriorityFilter !== 'all') {
        filtered = filtered.filter(i => i.priority === this.issuePriorityFilter);
      }

      // Sorting
      if (this.issueSortBy === 'newest') {
        filtered.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
      } else if (this.issueSortBy === 'efforts') {
        filtered.sort((a, b) => (b.efforts?.length || 0) - (a.efforts?.length || 0));
      } else if (this.issueSortBy === 'priority') {
        const pMap = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        filtered.sort((a, b) => (pMap[b.priority] || 0) - (pMap[a.priority] || 0));
      }

      if (!listEl) return;

      if (filtered.length === 0) {
        listEl.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.5rem; opacity: 0.5;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <p>No issues found in this view. Use the "+ Add Issue" button to report a problem.</p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = filtered.map(iss => {
        const effortCount = iss.efforts?.length || 0;
        const isSolved = iss.status === 'solved';
        return `
          <div class="issue-card ${isSolved ? 'solved-card' : 'unsolved-card'}" onclick="window.appController.openIssueDetail('${iss.id}')">
            <div>
              <div class="issue-card-header">
                <span class="badge-status ${isSolved ? 'badge-solved' : 'badge-unsolved'}">
                  ${isSolved ? '🟢 Solved' : '🔴 Unsolved'}
                </span>
                <span class="badge-priority priority-${iss.priority.toLowerCase()}">${iss.priority} Priority</span>
              </div>
              <h3 class="issue-card-title urdu-text" dir="auto">${escapeHtml(iss.title)}</h3>
              <p class="issue-card-desc urdu-text" dir="auto">${escapeHtml(iss.description)}</p>
            </div>
            <div>
              <div class="issue-card-footer">
                <div>
                  <span>Reported by <strong>${escapeHtml(iss.creatorName)}</strong></span>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">${getRelativeDate(iss.createdAt)}</div>
                </div>
                <div class="effort-counter-tag">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  <span>${effortCount} Effort${effortCount === 1 ? '' : 's'}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    saveNewIssue() {
      const titleInput = document.getElementById('new-issue-title');
      const descInput = document.getElementById('new-issue-desc');
      const prioSelect = document.getElementById('new-issue-priority');
      const catInput = document.getElementById('new-issue-category');

      const title = titleInput?.value.trim();
      const description = descInput?.value.trim();

      if (!title || !description) {
        showToast('Title and description are required', 'error');
        return;
      }

      const issue = store.addIssue({
        title,
        description,
        priority: prioSelect?.value || 'Medium',
        category: catInput?.value.trim() || 'General'
      });

      showToast(`Issue created: "${issue.title}"`, 'success');
      closeModal('add-issue-modal');
      this.renderQuickStats();
      this.renderIssuesHub();
    }

    // --- Issue Detail & Efforts Section ---
    openIssueDetail(issueId) {
      document.getElementById('search-results-dropdown')?.classList.remove('active');
      this.activeIssueId = issueId;
      this.renderIssueDetail(issueId);
      openModal('issue-detail-modal');
    }

    renderIssueDetail(issueId) {
      const issue = store.getIssueById(issueId);
      if (!issue) return;

      const titleEl = document.getElementById('detail-issue-title');
      const bannerEl = document.getElementById('detail-issue-banner');
      const effortsListEl = document.getElementById('detail-efforts-list');
      const solveBtnWrap = document.getElementById('detail-solve-btn-container');

      if (titleEl) titleEl.textContent = issue.title;

      const isSolved = issue.status === 'solved';
      const currentUser = window.authManager.getCurrentUser();
      const canSolve = window.authManager.canSolveIssue(issue);

      if (bannerEl) {
        bannerEl.innerHTML = `
          ${isSolved ? `
            <div class="issue-solved-callout">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <div>
                <div><strong>SOLVED</strong> by <strong>${escapeHtml(issue.solvedByName || 'Staff Member')}</strong></div>
                <div style="font-size: 0.78rem; opacity: 0.9;">Resolved on ${formatDateTime(issue.solvedAt)}</div>
              </div>
            </div>
          ` : ''}

          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span class="badge-status ${isSolved ? 'badge-solved' : 'badge-unsolved'}">${isSolved ? '🟢 Solved' : '🔴 Unsolved'}</span>
              <span class="badge-priority priority-${issue.priority.toLowerCase()}">${issue.priority} Priority</span>
              <span style="font-size: 0.78rem; background: var(--bg-surface); padding: 2px 8px; border-radius: var(--radius-full); border: 1px solid var(--border-color);">${escapeHtml(issue.category)}</span>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Created: ${formatDateTime(issue.createdAt)}</div>
          </div>

          <p class="urdu-text" dir="auto" style="font-size: 1rem; color: var(--text-primary); line-height: 1.6; margin-bottom: 0.75rem;">
            ${escapeHtml(issue.description)}
          </p>

          <div style="font-size: 0.8rem; color: var(--text-secondary); border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
            Created by: <strong>${escapeHtml(issue.creatorName)}</strong> (${issue.creatorRole})
          </div>
        `;
      }

      // Solve / Reopen Button (Visible ONLY to Creator or Admin)
      if (solveBtnWrap) {
        if (canSolve) {
          if (isSolved) {
            solveBtnWrap.innerHTML = `
              <button class="btn btn-secondary btn-sm" onclick="window.appController.reopenIssueConfirm('${issue.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.5 2v6h6M21.5 22v-6h-6"/><path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2"/></svg>
                Reopen Issue
              </button>
            `;
          } else {
            solveBtnWrap.innerHTML = `
              <button class="btn btn-success btn-sm" onclick="window.appController.markSolvedConfirm('${issue.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Mark as Solved
              </button>
            `;
          }
        } else {
          solveBtnWrap.innerHTML = `
            <span style="font-size: 0.78rem; color: var(--text-muted); font-style: italic;">
              Only creator (${escapeHtml(issue.creatorName)}) or Admin can mark as solved.
            </span>
          `;
        }
      }

      // Efforts Timeline
      if (effortsListEl) {
        const efforts = issue.efforts || [];
        if (efforts.length === 0) {
          effortsListEl.innerHTML = `
            <div style="text-align: center; padding: 1.5rem; color: var(--text-muted); background: var(--bg-surface-alt); border-radius: var(--radius-md);">
              No efforts logged yet. Be the first staff member to record what you did!
            </div>
          `;
        } else {
          effortsListEl.innerHTML = efforts.map(eff => {
            const canEdit = window.authManager.canEditEffort(eff);
            const canDelete = window.authManager.canDeleteEffort(eff);
            return `
              <div class="effort-card">
                <div class="effort-header">
                  <div class="effort-author-wrap">
                    <span class="effort-author-name">${escapeHtml(eff.memberName)}</span>
                    <span class="role-badge ${eff.memberRole === 'Admin' ? 'role-badge-admin' : 'role-badge-member'}">${eff.memberRole}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--text-muted); font-size: 0.74rem;">${formatDateTime(eff.timestamp)}</span>
                    ${canEdit ? `
                      <button class="btn btn-secondary btn-sm" style="padding: 1px 6px; font-size: 0.72rem; min-height: 26px;" onclick="window.appController.editEffortPrompt('${issue.id}', '${eff.id}')">Edit</button>
                    ` : ''}
                    ${canDelete ? `
                      <button class="btn btn-danger btn-sm" style="padding: 1px 6px; font-size: 0.72rem; min-height: 26px;" onclick="window.appController.deleteEffortPrompt('${issue.id}', '${eff.id}')">Delete</button>
                    ` : ''}
                  </div>
                </div>
                <div class="effort-text urdu-text" dir="auto">${escapeHtml(eff.text)}</div>
              </div>
            `;
          }).join('');
        }
      }
    }

    saveNewEffort() {
      if (!this.activeIssueId) return;
      const input = document.getElementById('new-effort-text');
      const text = input?.value.trim();

      if (!text) {
        showToast('Please type your contribution note', 'error');
        return;
      }

      store.addEffortToIssue(this.activeIssueId, text);
      showToast('Effort logged to issue!', 'success');
      if (input) input.value = '';
      this.renderIssueDetail(this.activeIssueId);
      this.renderIssuesHub();
    }

    markSolvedConfirm(issueId) {
      showConfirmModal(
        'Mark Issue as Solved',
        'Has this institute problem been successfully addressed and verified? It will be marked as solved.',
        'Yes, Mark Solved',
        () => {
          store.markIssueSolved(issueId);
          showToast('Issue marked as Solved! 🎉', 'success');
          this.renderQuickStats();
          this.renderIssuesHub();
          if (this.activeIssueId === issueId) {
            this.renderIssueDetail(issueId);
          }
        }
      );
    }

    reopenIssueConfirm(issueId) {
      showConfirmModal(
        'Reopen Issue',
        'Do you want to reopen this issue for further staff efforts and follow-up?',
        'Reopen Issue',
        () => {
          store.reopenIssue(issueId);
          showToast('Issue reopened for staff collaboration', 'warning');
          this.renderQuickStats();
          this.renderIssuesHub();
          if (this.activeIssueId === issueId) {
            this.renderIssueDetail(issueId);
          }
        }
      );
    }

    editEffortPrompt(issueId, effortId) {
      const issue = store.getIssueById(issueId);
      const effort = issue?.efforts?.find(e => e.id === effortId);
      if (!effort) return;

      const newText = prompt('Edit your effort note:', effort.text);
      if (newText !== null && newText.trim()) {
        store.updateEffort(issueId, effortId, newText);
        showToast('Effort updated', 'success');
        this.renderIssueDetail(issueId);
      }
    }

    deleteEffortPrompt(issueId, effortId) {
      showConfirmModal(
        'Delete Effort Note',
        'Are you sure you want to delete this effort contribution?',
        'Delete',
        () => {
          store.deleteEffort(issueId, effortId);
          showToast('Effort note deleted', 'success');
          this.renderIssueDetail(issueId);
          this.renderIssuesHub();
        }
      );
    }

    // --- Save Student ---
    saveNewStudent() {
      const name = document.getElementById('new-std-name')?.value.trim();
      const classSection = document.getElementById('new-std-class')?.value.trim();
      const rollNo = document.getElementById('new-std-roll')?.value.trim();
      const guardianPhone = document.getElementById('new-std-phone')?.value.trim();
      const notes = document.getElementById('new-std-notes')?.value.trim();

      if (!name || !classSection) {
        showToast('Name and Class are required', 'error');
        return;
      }

      const newStd = store.addStudent({ name, classSection, rollNo, guardianPhone, notes });
      showToast(`Student ${newStd.name} added!`, 'success');
      closeModal('add-student-modal');

      this.populateStudentSelectDropdowns();
      this.populateClassDropdowns();

      const vSelect = document.getElementById('v-student-select');
      const vClass = document.getElementById('v-class-select');
      if (vSelect) vSelect.value = newStd.id;
      if (vClass) {
        this.ensureClassOption(vClass, newStd.classSection);
        vClass.value = newStd.classSection;
      }

      this.renderQuickStats();
      if (document.getElementById('records-modal')?.classList.contains('active')) {
        this.renderMasterTable();
      }
      document.getElementById('add-student-form')?.reset();
    }

    // --- Master Table ---
    renderMasterTable() {
      const tableBody = document.getElementById('master-records-table-body');
      const paginationEl = document.getElementById('master-records-pagination');
      if (!tableBody) return;

      const students = store.getStudents();
      let filtered = [];

      for (let i = 0; i < students.length; i++) {
        const s = students[i];
        if (this.masterClassFilter !== 'all' && s.classSection !== this.masterClassFilter) continue;
        if (this.masterSearchTerm) {
          const match = s.name.toLowerCase().includes(this.masterSearchTerm) ||
                        s.classSection.toLowerCase().includes(this.masterSearchTerm) ||
                        (s.rollNo && s.rollNo.toLowerCase().includes(this.masterSearchTerm));
          if (!match) continue;
        }

        const metrics = store.getStudentMetrics(s.id);
        filtered.push({ student: s, metrics });
      }

      if (this.masterSortBy === 'violations-desc') {
        filtered.sort((a, b) => b.metrics.totalViolations - a.metrics.totalViolations || b.metrics.totalPoints - a.metrics.totalPoints);
      } else if (this.masterSortBy === 'violations-asc') {
        filtered.sort((a, b) => a.metrics.totalViolations - b.metrics.totalViolations);
      } else if (this.masterSortBy === 'severity-desc') {
        filtered.sort((a, b) => b.metrics.scorePercentage - a.metrics.scorePercentage);
      } else if (this.masterSortBy === 'name-asc') {
        filtered.sort((a, b) => a.student.name.localeCompare(b.student.name));
      } else if (this.masterSortBy === 'class-asc') {
        filtered.sort((a, b) => a.student.classSection.localeCompare(b.student.classSection));
      }

      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / this.recordsPageSize) || 1;
      if (this.recordsPage > totalPages) this.recordsPage = totalPages;
      if (this.recordsPage < 1) this.recordsPage = 1;

      const startIndex = (this.recordsPage - 1) * this.recordsPageSize;
      const paginatedItems = filtered.slice(startIndex, startIndex + this.recordsPageSize);

      if (paginatedItems.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No student records found.</td></tr>`;
        if (paginationEl) paginationEl.innerHTML = '';
        return;
      }

      tableBody.innerHTML = paginatedItems.map(item => {
        const s = item.student;
        const r = item.metrics;
        const initials = s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        return `
          <tr onclick="window.appController.openStudentProfile('${s.id}')">
            <td>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="member-avatar" style="width: 32px; height: 32px; font-size: 0.78rem;">${initials}</div>
                <div>
                  <div style="font-weight: 700; color: var(--text-primary);">${escapeHtml(s.name)}</div>
                  <div style="font-size: 0.76rem; color: var(--text-muted);">Roll: ${escapeHtml(s.rollNo || 'N/A')}</div>
                </div>
              </div>
            </td>
            <td><span class="role-badge role-badge-member">${escapeHtml(s.classSection)}</span></td>
            <td>
              <span class="violation-pill" style="font-size: 0.82rem;">
                ${r.totalViolations} Violation${r.totalViolations === 1 ? '' : 's'}
              </span>
            </td>
            <td style="font-size: 0.82rem; color: var(--text-muted); white-space: nowrap;">
              ${r.lastViolationDate ? getRelativeDate(r.lastViolationDate) : '<span style="color:#10B981;">Clean</span>'}
            </td>
            <td style="min-width: 140px;">
              ${renderSeverityMeter(r.scorePercentage, r.barColor, r.status, r.statusClass)}
            </td>
            <td style="text-align: right;" onclick="event.stopPropagation();">
              <button class="btn btn-secondary btn-sm" onclick="window.appController.openStudentProfile('${s.id}')" title="View Full Profile">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Profile
              </button>
            </td>
          </tr>
        `;
      }).join('');

      if (paginationEl) {
        paginationEl.innerHTML = `
          <div class="pagination-info">
            Showing <strong>${startIndex + 1}</strong> - <strong>${Math.min(startIndex + this.recordsPageSize, totalItems)}</strong> of <strong>${totalItems}</strong> students
          </div>
          <div class="pagination-buttons">
            <button class="page-btn" ${this.recordsPage <= 1 ? 'disabled' : ''} onclick="window.appController.changeRecordsPage(${this.recordsPage - 1})">&larr; Prev</button>
            <span style="font-size: 0.85rem; font-weight: 600; padding: 0 0.5rem;">Page ${this.recordsPage} of ${totalPages}</span>
            <button class="page-btn" ${this.recordsPage >= totalPages ? 'disabled' : ''} onclick="window.appController.changeRecordsPage(${this.recordsPage + 1})">Next &rarr;</button>
          </div>
        `;
      }
    }

    changeRecordsPage(newPage) {
      this.recordsPage = newPage;
      this.renderMasterTable();
    }

    // --- Student Profile Dossier & Printable Report ---
    renderStudentProfile(studentId) {
      const student = store.getStudentById(studentId);
      if (!student) return;

      const metrics = store.getStudentMetrics(studentId);
      const violations = store.getViolationsForStudent(studentId);
      const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

      document.getElementById('profile-avatar').textContent = initials;
      document.getElementById('profile-name').textContent = student.name;
      document.getElementById('profile-class-chip').textContent = `Class: ${student.classSection}`;
      document.getElementById('profile-roll-chip').textContent = `Roll No: ${student.rollNo || 'N/A'}`;
      document.getElementById('profile-phone-chip').textContent = `Parent: ${student.guardianPhone || 'Not Provided'}`;

      document.getElementById('profile-meter-placeholder').innerHTML = `
        <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.4rem;">
          Disciplinary Severity Meter:
        </div>
        ${renderSeverityMeter(metrics.scorePercentage, metrics.barColor, metrics.status, metrics.statusClass)}
      `;

      // Violations list
      const vListEl = document.getElementById('profile-violations-list');
      if (vListEl) {
        if (violations.length === 0) {
          vListEl.innerHTML = `<div style="text-align:center; padding: 1.5rem; color: #10B981; font-weight: 600;">✨ No recorded violations! Exemplary discipline.</div>`;
        } else {
          vListEl.innerHTML = violations.map(v => {
            const conf = SEVERITY_CONFIG[v.severity] || SEVERITY_CONFIG.Medium;
            const canDelete = window.authManager.isAdmin();
            return `
              <div class="v-list-item" style="border-left-color: ${conf.color};">
                <div class="v-item-left">
                  <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.35rem;">
                    <span class="v-severity-badge" style="background-color: ${conf.color};">${conf.label} Severity (+${conf.points} pts)</span>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">Logged by <strong>${escapeHtml(v.memberName || 'Staff')}</strong></span>
                  </div>
                  <div class="v-details urdu-text" dir="auto">${escapeHtml(v.details)}</div>
                  <div class="v-timestamp">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    ${formatDateTime(v.timestamp)}
                  </div>
                </div>
                ${canDelete ? `
                  <div>
                    <button class="btn btn-danger btn-sm" style="padding: 2px 7px; min-height: 28px;" onclick="window.appController.deleteViolationConfirm('${v.id}')" title="Admin Delete">
                      Delete
                    </button>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('');
        }
      }

      // Printable Dossier layout for window.print()
      const printReportEl = document.getElementById('printable-student-report');
      if (printReportEl) {
        printReportEl.innerHTML = `
          <div class="print-header">
            <h2>HADI EDUCATION SYSTEM (HES)</h2>
            <p>Pipli Road, Balkasar, District Chakwal, Punjab, Pakistan</p>
            <h3 style="margin-top: 10px; text-decoration: underline;">OFFICIAL STUDENT DISCIPLINARY DOSSIER</h3>
            <p style="font-size: 0.85rem; color: #555;">Generated Automatically on ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })} at ${new Date().toLocaleTimeString('en-US')}</p>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 0.95rem; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
            <div>
              <p><strong>Student Name:</strong> ${escapeHtml(student.name)}</p>
              <p><strong>Class & Section:</strong> ${escapeHtml(student.classSection)}</p>
              <p><strong>Roll Number:</strong> ${escapeHtml(student.rollNo || 'N/A')}</p>
            </div>
            <div>
              <p><strong>Guardian Phone:</strong> ${escapeHtml(student.guardianPhone || 'N/A')}</p>
              <p><strong>Total Recorded Infractions:</strong> ${metrics.totalViolations}</p>
              <p><strong>Disciplinary Rating:</strong> <span style="font-weight: bold; color: ${metrics.barColor};">${metrics.status} (${metrics.scorePercentage}%)</span></p>
            </div>
          </div>

          <h4 style="margin-bottom: 8px;">RECORDED INFRACTIONS CHRONOLOGY</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; margin-bottom: 25px;">
            <thead>
              <tr style="background: #f0f0f0;">
                <th style="border: 1px solid #999; padding: 6px; text-align: left;">#</th>
                <th style="border: 1px solid #999; padding: 6px; text-align: left;">Date & Time</th>
                <th style="border: 1px solid #999; padding: 6px; text-align: left;">Severity</th>
                <th style="border: 1px solid #999; padding: 6px; text-align: left;">Reported By</th>
                <th style="border: 1px solid #999; padding: 6px; text-align: left;">Infraction Details</th>
              </tr>
            </thead>
            <tbody>
              ${violations.length === 0 ? '<tr><td colspan="5" style="border: 1px solid #999; padding: 8px; text-align: center;">No infractions recorded. Clean record.</td></tr>' :
                violations.map((v, i) => `
                  <tr>
                    <td style="border: 1px solid #999; padding: 6px;">${i + 1}</td>
                    <td style="border: 1px solid #999; padding: 6px;">${formatDateTime(v.timestamp)}</td>
                    <td style="border: 1px solid #999; padding: 6px; font-weight: bold;">${v.severity}</td>
                    <td style="border: 1px solid #999; padding: 6px;">${escapeHtml(v.memberName || 'Staff')}</td>
                    <td style="border: 1px solid #999; padding: 6px;">${escapeHtml(v.details)}</td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>

          <div class="print-signatures">
            <div class="signature-block">Class Teacher Signature</div>
            <div class="signature-block">Discipline In-Charge</div>
            <div class="signature-block">Parent / Guardian Signature</div>
          </div>
        `;
      }
    }

    deleteViolationConfirm(vId) {
      showConfirmModal(
        'Delete Violation',
        'Are you sure you want to delete this recorded violation?',
        'Delete',
        () => {
          store.deleteViolation(vId);
          showToast('Violation deleted', 'success');
          this.renderQuickStats();
          if (this.currentProfileStudentId) {
            this.renderStudentProfile(this.currentProfileStudentId);
          }
          if (document.getElementById('records-modal')?.classList.contains('active')) {
            this.renderMasterTable();
          }
        }
      );
    }

    // --- Staff Management & Quick Switch ---
    renderStaffList() {
      const container = document.getElementById('staff-members-list');
      if (!container) return;

      const users = window.authManager.getUsers();
      const current = window.authManager.getCurrentUser();

      container.innerHTML = users.map(u => {
        const isActive = u.id === current.id;
        const initials = u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        return `
          <div class="staff-item ${isActive ? 'active' : ''}" onclick="window.appController.switchMember('${u.id}')">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="member-avatar ${u.role === 'Admin' ? 'admin-avatar' : ''}">${initials}</div>
              <div>
                <div style="font-weight: 700; color: var(--text-primary);">${escapeHtml(u.name)} ${isActive ? '⭐ (Current)' : ''}</div>
                <div style="font-size: 0.76rem; color: var(--text-muted);">${escapeHtml(u.designation || u.role)} | Username: <code>${escapeHtml(u.username)}</code></div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="role-badge ${u.role === 'Admin' ? 'role-badge-admin' : 'role-badge-member'}">${u.role}</span>
              ${!isActive ? `<button class="btn btn-secondary btn-sm" style="padding: 2px 8px; min-height: 28px;">Switch</button>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    switchMember(userId) {
      window.authManager.switchUser(userId);
      const user = window.authManager.getCurrentUser();
      showToast(`Switched active user to ${user.name} (${user.role})`, 'success');
      this.initAuthUI();
      this.renderStaffList();
      closeModal('staff-modal');
    }

    // --- CSV / Excel Exports ---
    exportMasterToCSV() {
      const students = store.getStudents();
      const headers = ['Student ID', 'Name', 'Class', 'Roll No', 'Guardian Phone', 'Total Violations', 'Disciplinary Status', 'Score %', 'Last Violation Date'];
      const rows = students.map(s => {
        const m = store.getStudentMetrics(s.id);
        return [s.id, s.name, s.classSection, s.rollNo, s.guardianPhone, m.totalViolations, m.status, m.scorePercentage + '%', m.lastViolationDate ? formatDateTime(m.lastViolationDate) : 'Clean'];
      });
      downloadCSV('HES_Master_Discipline_Sheet.csv', headers, rows);
      showToast('Master sheet exported to CSV', 'success');
    }

    exportViolationsToCSV() {
      const violations = store.getViolations();
      const headers = ['Violation ID', 'Student Name', 'Class', 'Severity', 'Details', 'Recorded By', 'Timestamp'];
      const rows = violations.map(v => [v.id, v.studentName, v.classSection, v.severity, v.details, v.memberName, formatDateTime(v.timestamp)]);
      downloadCSV('HES_Violations_Log.csv', headers, rows);
      showToast('Violations log exported to CSV', 'success');
    }

    exportIssuesToCSV() {
      const issues = store.getIssues();
      const headers = ['Issue ID', 'Title', 'Description', 'Priority', 'Category', 'Status', 'Creator', 'Created At', 'Total Efforts', 'Solved By', 'Solved At'];
      const rows = issues.map(i => [
        i.id,
        i.title,
        i.description,
        i.priority,
        i.category,
        i.status,
        i.creatorName,
        formatDateTime(i.createdAt),
        i.efforts?.length || 0,
        i.solvedByName || '',
        i.solvedAt ? formatDateTime(i.solvedAt) : ''
      ]);
      downloadCSV('HES_Collaborative_Issues.csv', headers, rows);
      showToast('Issues and efforts exported to CSV', 'success');
    }

    downloadJSONBackup() {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store.data, null, 2));
      const a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', `HES_Discipline_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('Full JSON backup downloaded', 'success');
    }

    handleJSONRestore(e) {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && Array.isArray(parsed.students)) {
            showConfirmModal(
              'Restore Database Backup',
              'This will overwrite current live records with the uploaded backup. Continue?',
              'Confirm Restore',
              () => {
                store.data = parsed;
                store.rebuildIndices();
                store.save('Database restored from backup');
                showToast('Database successfully restored!', 'success');
                closeModal('settings-modal');
                this.renderAll();
              }
            );
          } else {
            showToast('Invalid backup file structure', 'error');
          }
        } catch (err) {
          showToast('Failed to parse JSON file', 'error');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    }

    handleCSVImport(e) {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const text = ev.target.result;
          const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
          if (lines.length < 2) {
            showToast('CSV file is empty or missing headers', 'error');
            return;
          }

          let importedCount = 0;
          for (let i = 1; i < lines.length; i++) {
            const cols = parseCSVRow(lines[i]);
            if (cols.length >= 2 && cols[0].trim()) {
              store.addStudent({
                name: cols[0].trim(),
                classSection: cols[1]?.trim() || 'General',
                rollNo: cols[2]?.trim() || '',
                guardianPhone: cols[3]?.trim() || '',
                notes: cols[4]?.trim() || 'Imported via CSV'
              });
              importedCount++;
            }
          }

          showToast(`Imported ${importedCount} students!`, 'success');
          closeModal('settings-modal');
          this.populateStudentSelectDropdowns();
          this.populateClassDropdowns();
          this.renderQuickStats();
        } catch (err) {
          showToast('CSV import error: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    }
  }

  // --- CSV Helpers with UTF-8 BOM ---
  function downloadCSV(filename, headers, rows) {
    const csvContent = '\uFEFF' + [
      headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','),
      ...rows.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function parseCSVRow(rowText) {
    const res = [];
    let insideQuotes = false;
    let field = '';
    for (let i = 0; i < rowText.length; i++) {
      const char = rowText[i];
      if (char === '"') {
        if (insideQuotes && rowText[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        res.push(field);
        field = '';
      } else {
        field += char;
      }
    }
    res.push(field);
    return res;
  }

  // Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./discipline-sw.js?v=multi3')
        .catch(err => console.log('SW registration error:', err));
    });
  }

  // Global instance export
  window.appController = new AppController();
  window.store = store;
  window.openModal = openModal;
  window.closeModal = closeModal;
})();
