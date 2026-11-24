/**
 * Hadi Education System - School Discipline Tracker
 * High Performance Real-Time Engine & Responsive UI Controller
 * Primary Device: Android Phones (360px–430px) & Desktop (1200–1280px)
 * Multi-User Attribution, Issues & Collaborative Efforts Hub,
 * Multi-Client Real-Time Sync (BroadcastChannel + IndexedDB + Firestore Ready),
 * Mobile Bottom Navigation, 5-Tier Severity Meters, and PWA Caching.
 */

(function () {
  'use strict';

  // --- Constants & Storage Keys (v4 Engine) ---
  const STORAGE_KEY = 'hes_discipline_tracker_v4';
  const DB_NAME = 'HES_Discipline_DB_v4';
  const DB_VERSION = 1;
  const SYNC_CHANNEL_NAME = 'hes_discipline_live_sync_v4';

  // Multi-tab & multi-window instant synchronization
  const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(SYNC_CHANNEL_NAME) : null;

  // 5 Violation Severity Tiers (Low, Medium, High, Extreme, Ultra)
  const SEVERITY_CONFIG = {
    Low: { points: 5, color: '#10B981', badgeClass: 'sev-low-badge', label: 'Low' },
    Medium: { points: 12, color: '#F59E0B', badgeClass: 'sev-medium-badge', label: 'Medium' },
    High: { points: 25, color: '#F97316', badgeClass: 'sev-high-badge', label: 'High' },
    Extreme: { points: 45, color: '#EF4444', badgeClass: 'sev-extreme-badge', label: 'Extreme' },
    Ultra: { points: 75, color: '#881337', badgeClass: 'sev-ultra-badge', label: 'Ultra' }
  };

  // Seed Data: 10 Authentic Students, 8 Violations, 4 Collaborative Issues & Efforts
  const INITIAL_SEED = {
    students: [
      { id: 'std-1', name: 'Muhammad Hamza', fatherName: 'Tariq Mehmood', classSection: '10', rollNo: '1001', guardianPhone: '0300-1234567', notes: 'Active in sports', createdAt: '2026-10-01T08:00:00.000Z' },
      { id: 'std-2', name: 'Ali Raza', fatherName: 'Ghulam Raza', classSection: '10', rollNo: '1002', guardianPhone: '0312-9876543', notes: '', createdAt: '2026-10-01T08:00:00.000Z' },
      { id: 'std-3', name: 'Bilal Ahmed', fatherName: 'Naseer Ahmed', classSection: '9B', rollNo: '9014', guardianPhone: '0333-5551234', notes: 'Needs counseling', createdAt: '2026-10-02T08:00:00.000Z' },
      { id: 'std-4', name: 'Usman Tariq', fatherName: 'Tariq Jameel', classSection: '9A', rollNo: '9005', guardianPhone: '0345-4443322', notes: '', createdAt: '2026-10-02T08:00:00.000Z' },
      { id: 'std-5', name: 'Zainab Fatima', fatherName: 'Dr. Sajid Ali', classSection: '10(arts)', rollNo: '1025', guardianPhone: '0321-7778899', notes: 'Academic achiever', createdAt: '2026-10-03T08:00:00.000Z' },
      { id: 'std-6', name: 'Aisha Noor', fatherName: 'Noor Muhammad', classSection: '8', rollNo: '8011', guardianPhone: '0301-6667788', notes: '', createdAt: '2026-10-03T08:00:00.000Z' },
      { id: 'std-7', name: 'Daniyal Khan', fatherName: 'Asadullah Khan', classSection: '9B', rollNo: '9021', guardianPhone: '0308-1112233', notes: '', createdAt: '2026-10-04T08:00:00.000Z' },
      { id: 'std-8', name: 'Hassan Mujtaba', fatherName: 'Mujtaba Hussain', classSection: '8', rollNo: '8004', guardianPhone: '0315-9998877', notes: '', createdAt: '2026-10-05T08:00:00.000Z' },
      { id: 'std-9', name: 'Maryam Bibi', fatherName: 'Abdul Rasheed', classSection: '7', rollNo: '7015', guardianPhone: '0302-3334455', notes: '', createdAt: '2026-10-06T08:00:00.000Z' },
      { id: 'std-10', name: 'Zohaib Akhtar', fatherName: 'Akhtar Abbas', classSection: '10', rollNo: '1012', guardianPhone: '0341-2223344', notes: '', createdAt: '2026-10-07T08:00:00.000Z' }
    ],
    violations: [
      { id: 'v-101', studentId: 'std-3', studentName: 'Bilal Ahmed', classSection: '9B', details: 'Fighting in playground during recess and damaging school property.', severity: 'Ultra', memberId: 'usr-admin-1', memberName: 'Principal Muhammad Ali Hamdani', memberRole: 'Admin', timestamp: '2026-11-20T11:45:00.000Z' },
      { id: 'v-102', studentId: 'std-3', studentName: 'Bilal Ahmed', classSection: '9B', details: 'Using smartphone inside physics lab despite explicit ban.', severity: 'High', memberId: 'usr-member-1', memberName: 'Sir Tariq Mehmood', memberRole: 'Member', timestamp: '2026-11-18T09:20:00.000Z' },
      { id: 'v-103', studentId: 'std-1', studentName: 'Muhammad Hamza', classSection: '10', details: 'Repeated disruption in mathematics class and arguing with teacher.', severity: 'Extreme', memberId: 'usr-member-2', memberName: 'Madam Sadia Parveen', memberRole: 'Member', timestamp: '2026-11-19T10:15:00.000Z' },
      { id: 'v-104', studentId: 'std-1', studentName: 'Muhammad Hamza', classSection: '10', details: 'Arrived 35 minutes late without parent note.', severity: 'Low', memberId: 'usr-member-1', memberName: 'Sir Tariq Mehmood', memberRole: 'Member', timestamp: '2026-11-17T08:35:00.000Z' },
      { id: 'v-105', studentId: 'std-7', studentName: 'Daniyal Khan', classSection: '9B', details: 'Incomplete homework 3 days consecutively and inappropriate uniform.', severity: 'Medium', memberId: 'usr-member-2', memberName: 'Madam Sadia Parveen', memberRole: 'Member', timestamp: '2026-11-19T08:40:00.000Z' },
      { id: 'v-106', studentId: 'std-7', studentName: 'Daniyal Khan', classSection: '9B', details: 'Disrespectful language directed at junior student.', severity: 'High', memberId: 'usr-admin-1', memberName: 'Principal Muhammad Ali Hamdani', memberRole: 'Admin', timestamp: '2026-11-16T12:30:00.000Z' },
      { id: 'v-107', studentId: 'std-4', studentName: 'Usman Tariq', classSection: '9A', details: 'Leaving classroom without hall pass.', severity: 'Low', memberId: 'usr-member-1', memberName: 'Sir Tariq Mehmood', memberRole: 'Member', timestamp: '2026-11-15T10:00:00.000Z' },
      { id: 'v-108', studentId: 'std-10', studentName: 'Zohaib Akhtar', classSection: '10', details: 'Defacing school desk with markers.', severity: 'Medium', memberId: 'usr-member-2', memberName: 'Madam Sadia Parveen', memberRole: 'Member', timestamp: '2026-11-14T11:10:00.000Z' }
    ],
    issues: [
      {
        id: 'iss-1',
        title: 'Library reading hall AC not cooling during afternoon study hours',
        description: 'The library central indoor unit in the main reading hall stopped functioning properly and makes humming noise.',
        category: 'Facilities',
        priority: 'High',
        status: 'solved',
        creatorId: 'usr-admin-1',
        creatorName: 'Principal Muhammad Ali Hamdani',
        creatorRole: 'Admin',
        createdAt: '2026-11-19T09:00:00.000Z',
        solvedAt: '2026-11-20T14:30:00.000Z',
        solvedById: 'usr-admin-1',
        solvedByName: 'Principal Muhammad Ali Hamdani',
        solvedByRole: 'Admin',
        efforts: [
          {
            id: 'eff-1',
            memberId: 'usr-admin-1',
            memberName: 'Principal Muhammad Ali Hamdani',
            memberRole: 'Admin',
            text: 'HVAC technician inspected the indoor unit and replaced the faulty run capacitor. AC running cold now.',
            timestamp: '2026-11-20T14:20:00.000Z'
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
        creatorName: 'Madam Sadia Parveen',
        creatorRole: 'Member',
        createdAt: '2026-11-21T08:15:00.000Z',
        solvedAt: null,
        solvedById: null,
        solvedByName: null,
        solvedByRole: null,
        efforts: [
          {
            id: 'eff-2',
            memberId: 'usr-member-2',
            memberName: 'Madam Sadia Parveen',
            memberRole: 'Member',
            text: 'Notified custodial supervisor and inspected the floor personally. Maintenance vendor called.',
            timestamp: '2026-11-21T08:45:00.000Z'
          }
        ]
      },
      {
        id: 'iss-3',
        title: 'Morning assembly late arrivals by 9th and 10th grade students',
        description: 'Over 25 students consistently arrive after 8:00 AM, missing the morning national anthem and discipline briefing.',
        category: 'Punctuality',
        priority: 'High',
        status: 'unsolved',
        creatorId: 'usr-member-1',
        creatorName: 'Sir Tariq Mehmood',
        creatorRole: 'Member',
        createdAt: '2026-11-20T07:45:00.000Z',
        solvedAt: null,
        solvedById: null,
        solvedByName: null,
        solvedByRole: null,
        efforts: [
          {
            id: 'eff-3',
            memberId: 'usr-member-1',
            memberName: 'Sir Tariq Mehmood',
            memberRole: 'Member',
            text: 'Stationed senior student prefects at main gate with gate register to record exact arrival times.',
            timestamp: '2026-11-20T08:10:00.000Z'
          },
          {
            id: 'eff-4',
            memberId: 'usr-admin-1',
            memberName: 'Principal Muhammad Ali Hamdani',
            memberRole: 'Admin',
            text: 'Sent automated SMS broadcast to all parents regarding gate closure at 8:05 AM strictly.',
            timestamp: '2026-11-20T11:00:00.000Z'
          }
        ]
      },
      {
        id: 'iss-4',
        title: 'Physics & Computer Lab digital projector bulb replacement',
        description: 'Lab projector lamp burned out during morning class lecture. Replacement bulb needed for multimedia demonstrations.',
        category: 'Academics & IT',
        priority: 'Medium',
        status: 'solved',
        creatorId: 'usr-admin-1',
        creatorName: 'Principal Muhammad Ali Hamdani',
        creatorRole: 'Admin',
        createdAt: '2026-11-18T10:00:00.000Z',
        solvedAt: '2026-11-19T11:30:00.000Z',
        solvedById: 'usr-admin-1',
        solvedByName: 'Principal Muhammad Ali Hamdani',
        solvedByRole: 'Admin',
        efforts: [
          {
            id: 'eff-5',
            memberId: 'usr-member-1',
            memberName: 'Sir Tariq Mehmood',
            memberRole: 'Member',
            text: 'Tested HDMI cables and confirmed bulb filament failure. Requested procurement approval.',
            timestamp: '2026-11-18T10:30:00.000Z'
          },
          {
            id: 'eff-6',
            memberId: 'usr-admin-1',
            memberName: 'Principal Muhammad Ali Hamdani',
            memberRole: 'Admin',
            text: 'Authorized new projector lamp from school inventory. Technician installed and tested working.',
            timestamp: '2026-11-19T11:20:00.000Z'
          }
        ]
      }
    ],
    settings: {
      instituteName: 'Hadi Education System',
      staffPin: '1234',
      theme: 'light',
      textSize: 'normal',
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

  // --- IndexedDB Offline Storage Wrapper ---
  class IDBStorage {
    constructor(dbName, version) {
      this.dbName = dbName;
      this.version = version;
      this.db = null;
    }

    async getDB() {
      if (this.db) return this.db;
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);
        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('store')) {
            db.createObjectStore('store');
          }
        };
        request.onsuccess = (e) => {
          this.db = e.target.result;
          resolve(this.db);
        };
        request.onerror = (e) => reject(e.target.error);
      });
    }

    async get(key) {
      try {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction('store', 'readonly');
          const st = tx.objectStore('store');
          const req = st.get(key);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
      } catch (err) {
        return null;
      }
    }

    async set(key, val) {
      try {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction('store', 'readwrite');
          const st = tx.objectStore('store');
          const req = st.put(val, key);
          req.onsuccess = () => resolve(true);
          req.onerror = () => reject(req.error);
        });
      } catch (err) {
        return false;
      }
    }
  }

  const idbStorage = new IDBStorage(DB_NAME, DB_VERSION);

  // --- Collaborative Real-Time State Store ---
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
        if (idbData && Array.isArray(idbData.students) && idbData.students.length > 0) {
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
      // BroadcastChannel multi-client instant synchronization
      if (syncChannel) {
        syncChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'SYNC_UPDATE') {
            this.handleRemoteSync(event.data.payload, event.data.action);
          }
        };
      }

      // Storage event multi-window fallback
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.handleRemoteSync(parsed, 'Storage Sync');
          } catch (err) {}
        }
      }, { passive: true });
    }

    broadcastUpdate(actionName) {
      if (syncChannel) {
        try {
          syncChannel.postMessage({
            type: 'SYNC_UPDATE',
            action: actionName,
            payload: this.data,
            timestamp: Date.now()
          });
        } catch (e) {
          console.warn('Broadcast sync error:', e);
        }
      }
    }

    handleRemoteSync(remoteData, actionName) {
      if (!remoteData || !Array.isArray(remoteData.students)) return;
      this.data = remoteData;
      this.rebuildIndices();
      idbStorage.set('tracker_payload', remoteData);
      if (window.appController) {
        window.appController.renderAll();
        showToast(`Sync: ${actionName || 'Updated remotely'}`, 'info');
      }
    }

    commitToDisk() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        idbStorage.set('tracker_payload', this.data);
      } catch (e) {
        console.error('Error saving state:', e);
      }
    }

    save(actionName = 'Data updated') {
      this.commitToDisk();
      this.broadcastUpdate(actionName);
    }

    rebuildIndices() {
      this.studentMap.clear();
      this.violationsByStudent.clear();
      this.metricsCache.clear();

      const defaultFathers = {
        'std-1': 'Tariq Mehmood',
        'std-2': 'Ghulam Raza',
        'std-3': 'Naseer Ahmed',
        'std-4': 'Tariq Jameel',
        'std-5': 'Dr. Sajid Ali',
        'std-6': 'Noor Muhammad',
        'std-7': 'Asadullah Khan',
        'std-8': 'Mujtaba Hussain',
        'std-9': 'Abdul Rasheed',
        'std-10': 'Akhtar Abbas'
      };

      const students = this.data.students || [];
      for (let i = 0; i < students.length; i++) {
        const s = students[i];
        if (!s.fatherName) {
          s.fatherName = defaultFathers[s.id] || (s.name ? 'Father of ' + s.name.split(' ')[0] : 'Guardian');
        }
        if (s.classSection === '10th-A') s.classSection = '10';
        else if (s.classSection === '10th-B') s.classSection = '10(arts)';
        else if (s.classSection === '9th-A') s.classSection = '9A';
        else if (s.classSection === '9th-B') s.classSection = '9B';
        else if (s.classSection === '8th-A' || s.classSection === '8th-B') s.classSection = '8';
        else if (s.classSection === '7th-A' || s.classSection === '7th-B') s.classSection = '7';

        this.studentMap.set(s.id, s);
        this.violationsByStudent.set(s.id, []);
      }

      const violations = this.data.violations || [];
      for (let i = 0; i < violations.length; i++) {
        const v = violations[i];
        if (this.violationsByStudent.has(v.studentId)) {
          this.violationsByStudent.get(v.studentId).push(v);
        } else {
          this.violationsByStudent.set(v.studentId, [v]);
        }
      }

      for (let i = 0; i < students.length; i++) {
        this.computeAndCacheMetrics(students[i].id);
      }
    }

    computeAndCacheMetrics(studentId) {
      const vList = this.violationsByStudent.get(studentId) || [];
      let totalPoints = 0;
      let lastViolationDate = null;
      let lastSeverity = null;

      // Sort by timestamp descending to find latest incident
      const sorted = [...vList].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      for (let i = 0; i < sorted.length; i++) {
        const v = sorted[i];
        const conf = SEVERITY_CONFIG[v.severity] || SEVERITY_CONFIG.Medium;
        totalPoints += conf.points;
        if (!lastViolationDate) {
          lastViolationDate = v.timestamp;
          lastSeverity = v.severity;
        }
      }

      const scorePercentage = Math.min(100, Math.round(totalPoints));

      let status = 'Safe';
      let statusClass = 'sev-safe';
      let barColor = '#10B981';

      if (scorePercentage >= 85) {
        status = 'Ultra';
        statusClass = 'sev-ultra-badge';
        barColor = '#881337';
      } else if (scorePercentage >= 55) {
        status = 'Extreme';
        statusClass = 'sev-extreme-badge';
        barColor = '#EF4444';
      } else if (scorePercentage >= 30) {
        status = 'High';
        statusClass = 'sev-high-badge';
        barColor = '#F97316';
      } else if (scorePercentage >= 15) {
        status = 'Medium';
        statusClass = 'sev-medium-badge';
        barColor = '#F59E0B';
      } else if (scorePercentage > 0) {
        status = 'Low';
        statusClass = 'sev-low-badge';
        barColor = '#10B981';
      }

      const metricObj = {
        totalViolations: vList.length,
        totalPoints,
        scorePercentage,
        status,
        statusClass,
        barColor,
        lastViolationDate,
        lastSeverity
      };

      this.metricsCache.set(studentId, metricObj);
      return metricObj;
    }

    getStudents() {
      return this.data.students || [];
    }

    getStudent(id) {
      return this.studentMap.get(id);
    }

    getViolations() {
      return this.data.violations || [];
    }

    getStudentViolations(studentId) {
      return this.violationsByStudent.get(studentId) || [];
    }

    getStudentMetrics(studentId) {
      return this.metricsCache.get(studentId) || this.computeAndCacheMetrics(studentId);
    }

    addStudent(student) {
      const newStudent = {
        id: 'std-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        name: student.name.trim(),
        fatherName: (student.fatherName || '').trim(),
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

    addViolation({ studentId, classSection, severity, details }) {
      const student = this.studentMap.get(studentId);
      if (!student) throw new Error('Student not found');

      const user = window.authManager.getCurrentUser();
      const newViolation = {
        id: 'v-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        studentId: student.id,
        studentName: student.name,
        classSection: classSection || student.classSection,
        severity: severity || 'Medium',
        details: details.trim(),
        memberId: user.id,
        memberName: user.name,
        memberRole: user.role,
        timestamp: new Date().toISOString()
      };

      this.data.violations.unshift(newViolation);
      if (this.violationsByStudent.has(student.id)) {
        this.violationsByStudent.get(student.id).unshift(newViolation);
      } else {
        this.violationsByStudent.set(student.id, [newViolation]);
      }

      this.computeAndCacheMetrics(student.id);
      this.save(`Violation logged for ${student.name} (${severity})`);
      return newViolation;
    }

    deleteViolation(violationId) {
      const v = this.data.violations.find(item => item.id === violationId);
      if (!v) return;
      this.data.violations = this.data.violations.filter(item => item.id !== violationId);
      const studentId = v.studentId;
      if (this.violationsByStudent.has(studentId)) {
        const arr = this.violationsByStudent.get(studentId).filter(item => item.id !== violationId);
        this.violationsByStudent.set(studentId, arr);
      }
      this.computeAndCacheMetrics(studentId);
      this.save('Violation entry removed');
    }

    // --- Issues Operations ---
    getIssues() {
      return this.data.issues || [];
    }

    getIssue(id) {
      return (this.data.issues || []).find(i => i.id === id);
    }

    addIssue({ title, description, category, priority }) {
      const user = window.authManager.getCurrentUser();
      let normalizedPriority = priority || 'Medium';
      if (normalizedPriority === 'Urgent') normalizedPriority = 'High';
      if (!['High', 'Medium', 'Low'].includes(normalizedPriority)) normalizedPriority = 'Medium';

      const newIssue = {
        id: 'iss-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        title: title.trim(),
        description: description.trim(),
        category: category || 'General Discipline',
        priority: normalizedPriority,
        status: 'unsolved',
        creatorId: user.id,
        creatorName: user.name,
        creatorRole: user.role,
        createdAt: new Date().toISOString(),
        solvedAt: null,
        solvedById: null,
        solvedByName: null,
        solvedByRole: null,
        efforts: []
      };

      this.data.issues.unshift(newIssue);
      this.save(`New issue created: ${newIssue.title}`);
      return newIssue;
    }

    addEffortToIssue(issueId, effortText) {
      const issue = this.getIssue(issueId);
      if (!issue) return null;

      const user = window.authManager.getCurrentUser();
      const newEffort = {
        id: 'eff-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        memberId: user.id,
        memberName: user.name,
        memberRole: user.role,
        text: effortText.trim(),
        timestamp: new Date().toISOString()
      };

      if (!Array.isArray(issue.efforts)) issue.efforts = [];
      issue.efforts.unshift(newEffort);
      this.save(`Effort added by ${user.name} on: ${issue.title}`);
      return newEffort;
    }

    updateEffort(issueId, effortId, newText) {
      const issue = this.getIssue(issueId);
      if (!issue || !Array.isArray(issue.efforts)) return false;
      const effort = issue.efforts.find(e => e.id === effortId);
      if (!effort) return false;

      effort.text = newText.trim();
      effort.editedAt = new Date().toISOString();
      this.save('Effort updated');
      return true;
    }

    deleteEffort(issueId, effortId) {
      const issue = this.getIssue(issueId);
      if (!issue || !Array.isArray(issue.efforts)) return false;
      issue.efforts = issue.efforts.filter(e => e.id !== effortId);
      this.save('Effort deleted');
      return true;
    }

    solveIssue(issueId) {
      const issue = this.getIssue(issueId);
      if (!issue) return false;

      const user = window.authManager.getCurrentUser();
      issue.status = 'solved';
      issue.solvedAt = new Date().toISOString();
      issue.solvedById = user.id;
      issue.solvedByName = user.name;
      issue.solvedByRole = user.role;

      this.save(`Issue marked solved: ${issue.title}`);
      return true;
    }

    reopenIssue(issueId) {
      const issue = this.getIssue(issueId);
      if (!issue) return false;

      const user = window.authManager.getCurrentUser();
      issue.status = 'unsolved';
      issue.solvedAt = null;
      issue.solvedById = null;
      issue.solvedByName = null;
      issue.solvedByRole = null;

      if (!Array.isArray(issue.efforts)) issue.efforts = [];
      issue.efforts.unshift({
        id: 'eff-' + Date.now(),
        memberId: user.id,
        memberName: user.name,
        memberRole: user.role,
        text: `Reopened issue for further institutional investigation and follow-up.`,
        timestamp: new Date().toISOString()
      });

      this.save(`Issue reopened: ${issue.title}`);
      return true;
    }

    deleteIssue(issueId) {
      if (!this.data.issues) return;
      this.data.issues = this.data.issues.filter(i => i.id !== issueId);
      this.save('Issue removed');
    }

    getQuickStats() {
      const now = Date.now();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

      const totalStudents = (this.data.students || []).length;
      const totalViolations = (this.data.violations || []).length;

      let violationsThisWeek = 0;
      const violations = this.data.violations || [];
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

      // Ranking: most violations first, tie break by weighted points
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
      this.broadcastUpdate('Reset to initial data');
    }
  }

  const store = new CollaborativeStore();

  // --- Severity Meter Helper (Collision-Free Tabular Output with Radiant Gradients) ---
  function getGradientBarColor(status, fallbackColor) {
    if (status === 'ULTRA') return 'linear-gradient(90deg, #E11D48 0%, #881337 100%)';
    if (status === 'EXTREME') return 'linear-gradient(90deg, #F97316 0%, #EF4444 100%)';
    if (status === 'HIGH') return 'linear-gradient(90deg, #F59E0B 0%, #F97316 100%)';
    if (status === 'MEDIUM') return 'linear-gradient(90deg, #10B981 0%, #F59E0B 100%)';
    return 'linear-gradient(90deg, #34D399 0%, #10B981 100%)';
  }

  function renderSeverityMeter(scorePercentage, barColor, status, statusClass) {
    const clampedScore = Math.max(0, Math.min(100, scorePercentage));
    const scaleFactor = (clampedScore / 100).toFixed(3);
    const gradColor = getGradientBarColor(status, barColor);
    return `
      <div class="leader-row-meter">
        <div class="leader-meter-label">
          <span class="meter-status-pill ${statusClass}">${status}</span>
          <span class="meter-percent-num">${clampedScore}%</span>
        </div>
        <div class="meter-track" title="Cumulative Disciplinary Rating: ${clampedScore}%">
          <div class="meter-fill" style="transform: scaleX(${scaleFactor}); background: ${gradColor};"></div>
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
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-6px)';
      toast.style.transition = 'opacity 0.2s, transform 0.2s';
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }

  // --- Modal Helpers (Root Portal System) ---
  function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;

    // Close any other open modals first
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      if (m.id !== modalId) m.classList.remove('active');
    });

    el.classList.add('active');
    document.body.classList.add('modal-open');

    // Focus first input on desktop without smooth-scroll thread contention
    if (window.innerWidth > 768) {
      setTimeout(() => {
        const input = el.querySelector('input:not([type="hidden"]), select, textarea');
        if (input) input.focus({ preventScroll: true });
      }, 30);
    }
  }

  function closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;
    el.classList.remove('active');

    const anyActive = document.querySelector('.modal-overlay.active');
    if (!anyActive) {
      document.body.classList.remove('modal-open');
    }
  }

  function showConfirmModal(title, message, confirmBtnText, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;

    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-message').textContent = message;
    const actionBtn = document.getElementById('confirm-modal-action-btn');
    actionBtn.textContent = confirmBtnText || 'Confirm';

    const newBtn = actionBtn.cloneNode(true);
    actionBtn.parentNode.replaceChild(newBtn, actionBtn);

    newBtn.addEventListener('click', () => {
      closeModal('confirm-modal');
      if (typeof onConfirm === 'function') onConfirm();
    });

    openModal('confirm-modal');
  }

  // --- Application Controller ---
  class AppController {
    constructor() {
      this.selectedSeverity = 'Medium';
      this.issueStatusFilter = 'all';
      this.issuePriorityFilter = 'all';
      this.issueSortBy = 'newest';
      this.issueSearchTerm = '';
      this.currentViewingIssueId = null;

      this.masterSearchTerm = '';
      this.masterClassFilter = 'all';
      this.masterSortBy = 'violations-desc';
      this.recordsPage = 1;
      this.recordsPageSize = 10;
      this.currentProfileStudentId = null;

      // Draft preservation when adding a student inline
      this.addViolationDraft = null;

      this.init();
    }

    init() {
      this.initTheme();
      this.initStyleMode();
      this.initTextSize();
      this.initAuthUI();
      this.initEventListeners();
      this.renderAll();

      window.authManager.subscribe(() => {
        this.initAuthUI();
        this.renderAll();
      });
    }

    initStyleMode() {
      const saved = localStorage.getItem('hes_design_style') || 'neo';
      document.documentElement.setAttribute('data-style', saved);
      this.updateStyleButton(saved);
      document.getElementById('style-toggle-btn')?.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-style') || 'neo';
        const next = cur === 'neo' ? 'task-pro' : 'neo';
        document.documentElement.setAttribute('data-style', next);
        localStorage.setItem('hes_design_style', next);
        this.updateStyleButton(next);
        this.renderQuickStats();
        showToast(`Style: ${next === 'neo' ? 'Neo-Modern (Podium Mode)' : 'Task-Pro (Classic Rows)'}`, 'success');
      });
    }

    updateStyleButton(style) {
      const btn = document.getElementById('style-toggle-btn');
      if (!btn) return;
      btn.title = `Switch to ${style === 'neo' ? 'Task-Pro (Classic Rows)' : 'Neo-Modern (Podium Mode)'} Style`;
      btn.classList.toggle('active-neo', style === 'neo');
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
        icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      } else {
        icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      }
    }

    initTextSize() {
      const saved = localStorage.getItem('hes_text_size') || 'normal';
      document.documentElement.setAttribute('data-text-size', saved);
      document.getElementById('text-size-btn')?.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-text-size') || 'normal';
        const next = cur === 'large' ? 'normal' : 'large';
        document.documentElement.setAttribute('data-text-size', next);
        localStorage.setItem('hes_text_size', next);
        showToast(`Text size: ${next === 'large' ? 'Larger (+12%)' : 'Standard'}`, 'success');
      });
    }

    initAuthUI() {
      const user = window.authManager.getCurrentUser();
      const chipName = document.getElementById('header-member-name');
      const chipAvatar = document.getElementById('header-member-avatar');
      const chipBadge = document.getElementById('header-member-badge');
      const memberChip = document.getElementById('header-member-chip');

      if (user) {
        if (chipName) chipName.textContent = user.name;
        if (chipAvatar) {
          const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          chipAvatar.textContent = initials || 'ST';
          chipAvatar.className = `member-avatar ${user.role === 'Admin' ? 'admin-avatar' : ''}`;
        }
        if (chipBadge) {
          chipBadge.textContent = user.role;
          chipBadge.className = `role-badge ${user.role === 'Admin' ? 'role-badge-admin' : 'role-badge-member'}`;
        }
        if (memberChip) {
          memberChip.title = `Signed in as ${user.name} (${user.role}) - Click to switch staff member`;
        }
      }

      // Update author tag inside Add Violation modal
      const authorChip = document.getElementById('v-member-author-chip');
      if (authorChip && user) {
        authorChip.textContent = `Logging as: ${user.name} (${user.role})`;
      }

      this.renderStaffList();
    }

    initEventListeners() {
      // 1. Theme and Text size toggles
      document.getElementById('theme-toggle-btn')?.addEventListener('click', () => this.toggleTheme());
      document.getElementById('header-member-chip')?.addEventListener('click', () => openModal('staff-modal'));
      document.getElementById('settings-btn')?.addEventListener('click', () => openModal('settings-modal'));

      // 2. Center Action Cards
      document.getElementById('card-add-violation')?.addEventListener('click', () => this.openAddViolationModal());
      document.getElementById('card-issues')?.addEventListener('click', () => this.openIssuesHubModal());
      document.getElementById('card-records')?.addEventListener('click', () => this.openRecordsModal());

      // 3. Mobile Bottom Navigation
      document.getElementById('nav-home')?.addEventListener('click', () => {
        this.setActiveNav('nav-home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      document.getElementById('nav-violation')?.addEventListener('click', () => {
        this.setActiveNav('nav-violation');
        this.openAddViolationModal();
      });
      document.getElementById('nav-issues')?.addEventListener('click', () => {
        this.setActiveNav('nav-issues');
        this.openIssuesHubModal();
      });
      document.getElementById('nav-records')?.addEventListener('click', () => {
        this.setActiveNav('nav-records');
        this.openRecordsModal();
      });
      document.getElementById('nav-staff')?.addEventListener('click', () => {
        this.setActiveNav('nav-staff');
        openModal('staff-modal');
      });

      // Mobile FAB
      document.getElementById('mobile-fab-add-issue')?.addEventListener('click', () => this.openAddIssueModal());

      // 4. Global Search (300ms debounce)
      const globalInput = document.getElementById('global-search-input');
      const clearBtn = document.getElementById('search-clear-btn');
      if (globalInput) {
        globalInput.addEventListener('input', debounce((e) => {
          this.handleGlobalSearch(e.target.value);
        }, 300));

        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            globalInput.value = '';
            clearBtn.style.display = 'none';
            document.getElementById('search-results-dropdown')?.classList.remove('active');
          });
        }
      }

      // 5. 5-Severity Button Selector for Add Violation
      document.querySelectorAll('.severity-selector .sev-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const target = e.currentTarget;
          const sev = target.getAttribute('data-sev');
          this.selectSeverity(sev);
        });
      });

      // 6. Add Violation Student Name Input, Class Select & Auto-Fill Listeners
      const vStudentName = document.getElementById('v-student-name');
      vStudentName?.addEventListener('input', (e) => {
        this.handleStudentNameInput(e.target.value);
      });
      vStudentName?.addEventListener('change', (e) => {
        this.handleStudentNameInput(e.target.value);
      });

      // 6. Interactive Class Combobox (Direct typing in bar + Square dropdown button at end)
      const vClassInput = document.getElementById('v-class-select');
      const vClassTrigger = document.getElementById('v-class-dropdown-trigger');
      const vClassMenu = document.getElementById('v-class-dropdown-menu');

      const openClassDropdown = () => {
        if (!vClassMenu) return;
        vClassMenu.querySelectorAll('.vf-combobox-item').forEach(it => it.style.display = 'flex');
        vClassMenu.classList.add('open');
        vClassTrigger?.classList.add('open');
      };

      const closeClassDropdown = () => {
        if (!vClassMenu) return;
        vClassMenu.classList.remove('open');
        vClassTrigger?.classList.remove('open');
      };

      const toggleClassDropdown = (e) => {
        e?.stopPropagation();
        if (vClassMenu?.classList.contains('open')) {
          closeClassDropdown();
        } else {
          openClassDropdown();
        }
      };

      vClassTrigger?.addEventListener('click', toggleClassDropdown);

      // Typing directly in the rectangular bar allows any manual class
      vClassInput?.addEventListener('input', (e) => {
        const query = (e.target.value || '').trim().toLowerCase();
        if (vClassMenu && vClassMenu.classList.contains('open')) {
          const items = vClassMenu.querySelectorAll('.vf-combobox-item');
          items.forEach(item => {
            const val = (item.getAttribute('data-value') || '').toLowerCase();
            const text = item.textContent.toLowerCase();
            if (!query || val.includes(query) || text.includes(query)) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        }
        this.handleClassSelectChange(e.target.value);
      });

      // Selecting an item from the dropdown
      vClassMenu?.querySelectorAll('.vf-combobox-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = item.getAttribute('data-value');
          if (vClassInput) {
            vClassInput.value = val;
            vClassInput.focus();
          }
          closeClassDropdown();
          this.handleClassSelectChange(val);
        });
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#v-class-combobox-wrap')) {
          closeClassDropdown();
        }
      });

      const vStudentSelect = document.getElementById('v-student-select');
      vStudentSelect?.addEventListener('change', (e) => {
        const studentId = e.target.value;
        const student = store.getStudent(studentId);
        if (student) {
          if (vStudentName) vStudentName.value = student.name;
          const fatherInput = document.getElementById('v-father-name');
          if (fatherInput) fatherInput.value = student.fatherName || '';
          const phoneInput = document.getElementById('v-parent-phone');
          if (phoneInput) phoneInput.value = student.guardianPhone || '';
          this.setClassValue(student.classSection || '');
          const stdId = document.getElementById('v-student-id');
          if (stdId) stdId.value = student.id;
          this.updateAutoDateTime();
        }
      });

      document.getElementById('v-inline-add-student')?.addEventListener('click', () => {
        // Save current draft before opening student creation modal
        this.addViolationDraft = {
          studentName: document.getElementById('v-student-name')?.value || '',
          fatherName: document.getElementById('v-father-name')?.value || '',
          parentPhone: document.getElementById('v-parent-phone')?.value || '',
          studentId: document.getElementById('v-student-id')?.value || '',
          classSection: document.getElementById('v-class-select')?.value || '',
          severity: this.selectedSeverity || 'Medium',
          details: document.getElementById('violation-details-input')?.value || ''
        };
        openModal('add-student-modal');
      });

      // Quick Tag buttons for Add Violation
      document.querySelectorAll('.quick-tags .tag-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const tag = e.currentTarget.getAttribute('data-tag');
          const txt = document.getElementById('violation-details-input');
          if (txt) {
            if (txt.value && !txt.value.endsWith(' ')) txt.value += ' ';
            txt.value += `[${tag}] `;
            txt.focus();
          }
        });
      });

      // 7. Forms Submit Handlers
      document.getElementById('add-violation-form')?.addEventListener('submit', (e) => this.handleAddViolationSubmit(e));
      document.getElementById('add-issue-form')?.addEventListener('submit', (e) => this.handleAddIssueSubmit(e));
      document.getElementById('add-effort-form')?.addEventListener('submit', (e) => this.handleAddEffortSubmit(e));
      document.getElementById('add-student-form')?.addEventListener('submit', (e) => this.handleAddStudentSubmit(e));
      document.getElementById('edit-student-form')?.addEventListener('submit', (e) => this.handleEditStudentSubmit(e));
      (document.getElementById('new-member-form') || document.getElementById('staff-register-form'))?.addEventListener('submit', (e) => this.handleRegisterMemberSubmit(e));

      // 8. Issues Hub Filter & Sort
      document.querySelectorAll('.issue-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('.issue-filter-btn').forEach(b => b.classList.remove('active'));
          const target = e.currentTarget;
          target.classList.add('active');
          this.issueStatusFilter = target.getAttribute('data-status');
          this.renderIssuesHub();
        });
      });

      const issueSearchInput = document.getElementById('issue-search-input');
      issueSearchInput?.addEventListener('input', debounce((e) => {
        this.issueSearchTerm = e.target.value.trim().toLowerCase();
        this.renderIssuesHub();
      }, 300));

      document.getElementById('issue-priority-filter')?.addEventListener('change', (e) => {
        this.issuePriorityFilter = e.target.value;
        this.renderIssuesHub();
      });

      (document.getElementById('issue-sort-by') || document.getElementById('issue-sort-select'))?.addEventListener('change', (e) => {
        this.issueSortBy = e.target.value;
        this.renderIssuesHub();
      });

      document.getElementById('open-add-issue-btn')?.addEventListener('click', () => this.openAddIssueModal());

      // 9. Master Records Filter & Pagination
      (document.getElementById('records-search-input') || document.getElementById('records-table-search'))?.addEventListener('input', debounce((e) => {
        this.masterSearchTerm = e.target.value.trim().toLowerCase();
        this.recordsPage = 1;
        this.renderMasterTable();
      }, 300));

      document.getElementById('records-class-filter')?.addEventListener('change', (e) => {
        this.masterClassFilter = e.target.value;
        this.recordsPage = 1;
        this.renderMasterTable();
      });

      (document.getElementById('records-sort-by') || document.getElementById('records-sort-select'))?.addEventListener('change', (e) => {
        this.masterSortBy = e.target.value;
        this.recordsPage = 1;
        this.renderMasterTable();
      });

      // Student Profile Action Buttons
      document.getElementById('profile-add-violation-btn')?.addEventListener('click', () => {
        const id = this.currentProfileStudentId;
        closeModal('student-profile-modal');
        this.openAddViolationModal(id);
      });

      document.getElementById('profile-edit-std-btn')?.addEventListener('click', () => {
        const id = this.currentProfileStudentId;
        const student = store.getStudent(id);
        if (student) {
          document.getElementById('edit-std-id').value = student.id;
          document.getElementById('edit-std-name').value = student.name;
          document.getElementById('edit-std-class').value = student.classSection;
          document.getElementById('edit-std-roll').value = student.rollNo || '';
          document.getElementById('edit-std-phone').value = student.guardianPhone || '';
          document.getElementById('edit-std-notes').value = student.notes || '';
          openModal('edit-student-modal');
        }
      });

      document.getElementById('profile-delete-std-btn')?.addEventListener('click', () => {
        const id = this.currentProfileStudentId;
        const student = store.getStudent(id);
        if (!student) return;
        showConfirmModal('Delete Student Record', `Are you sure you want to permanently remove ${student.name}? All associated infractions will also be erased.`, 'Delete', () => {
          store.deleteStudent(id);
          closeModal('student-profile-modal');
          showToast(`Student record for ${student.name} deleted`, 'success');
          this.renderAll();
        });
      });

      document.getElementById('print-profile-btn')?.addEventListener('click', () => window.print());

      // 10. Data Import / Export Handlers
      document.getElementById('export-records-csv-btn')?.addEventListener('click', () => this.exportMasterToCSV());
      document.getElementById('export-violations-csv-btn')?.addEventListener('click', () => this.exportViolationsToCSV());
      document.getElementById('export-issues-csv-btn')?.addEventListener('click', () => this.exportIssuesToCSV());
      document.getElementById('backup-json-btn')?.addEventListener('click', () => this.downloadJSONBackup());
      document.getElementById('restore-json-input')?.addEventListener('change', (e) => this.handleJSONRestore(e));
      document.getElementById('import-students-csv-input')?.addEventListener('change', (e) => this.handleCSVImport(e));

      // Reset Demo Data Button
      document.getElementById('reset-demo-data-btn')?.addEventListener('click', () => {
        showConfirmModal(
          'Reset to Demo Data',
          'Are you sure you want to reset all records to the original Hadi Education System sample data? Any unsaved custom entries will be replaced.',
          'Reset Data',
          () => {
            store.resetToDemoData();
            showToast('All records reset to initial sample data', 'success');
            closeModal('settings-modal');
            this.renderAll();
          }
        );
      });

      // Keyboard & Backdrop dismissal
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const activeModal = document.querySelector('.modal-overlay.active');
          if (activeModal) closeModal(activeModal.id);
        }
      });

      window.addEventListener('click', (e) => {
        if (e.target.classList && e.target.classList.contains('modal-overlay')) {
          closeModal(e.target.id);
        }
        const searchBox = document.querySelector('.search-box-wrapper');
        const dropdown = document.getElementById('search-results-dropdown');
        if (dropdown && dropdown.classList.contains('active') && searchBox && !searchBox.contains(e.target)) {
          dropdown.classList.remove('active');
        }
      });
    }

    setActiveNav(navId) {
      document.querySelectorAll('.bottom-nav-item').forEach(btn => btn.classList.remove('active'));
      document.getElementById(navId)?.classList.add('active');
    }

    selectSeverity(severity) {
      this.selectedSeverity = severity;
      document.querySelectorAll('.severity-selector .sev-btn').forEach(btn => {
        const isMatch = btn.getAttribute('data-sev') === severity;
        btn.classList.toggle('active', isMatch);
        btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
      });
      this.updateViolationLevelBox(severity);
    }

    updateViolationLevelBox(severity) {
      const box = document.getElementById('v-level-preview-box');
      if (!box) return;

      const levelsConfig = {
        Low: {
          class: 'card-level-low',
          title: 'Low Infraction',
          points: '+5 Discipline Demerit Points',
          tier: 'Tier 1 · Minor Incident',
          desc: 'Minor non-compliance, single tardiness, or minor classroom distraction. Official verbal reprimand & internal advisory recorded.',
          action: 'Verbal counseling & internal advisory note logged.'
        },
        Medium: {
          class: 'card-level-medium',
          title: 'Medium Infraction',
          points: '+12 Discipline Demerit Points',
          tier: 'Tier 2 · Standard Incident',
          desc: 'Moderate disruption, repeated incomplete homework, or uniform dress code non-compliance. Disciplinary note logged to student dossier.',
          action: 'Parent SMS notification & Disciplinary warning logged.'
        },
        High: {
          class: 'card-level-high',
          title: 'High Infraction',
          points: '+25 Discipline Demerit Points',
          tier: 'Tier 3 · Serious Incident',
          desc: 'Direct staff disrespect, mobile phone misuse during lecture, truancy, or persistent defiant behavior requiring official detention record.',
          action: 'Parent summit requested & official detention record.'
        },
        Extreme: {
          class: 'card-level-extreme',
          title: 'Extreme Infraction',
          points: '+45 Discipline Demerit Points',
          tier: 'Tier 4 · Critical Incident',
          desc: 'Fighting, bullying, property damage, vandalism, or severe aggressive confrontation on school premises.',
          action: 'Immediate suspension hearing & mandatory parent conference.'
        },
        Ultra: {
          class: 'card-level-ultra',
          title: 'Ultra Infraction · MAXIMUM SEVERITY',
          points: '+75 Discipline Demerit Points',
          tier: 'Tier 5 · Maximum Penalty',
          desc: 'Critical integrity violation, weapons, illicit substances, or severe institutional sabotage. Maximum disciplinary escalation.',
          action: 'Immediate referral to Disciplinary Board for expulsion/dismissal.'
        }
      };

      const cfg = levelsConfig[severity] || levelsConfig.Medium;

      box.classList.remove('card-level-low', 'card-level-medium', 'card-level-high', 'card-level-extreme', 'card-level-ultra');
      box.classList.add(cfg.class);

      const titleEl = document.getElementById('v-level-title');
      const pointsEl = document.getElementById('v-level-points');
      const tierEl = document.getElementById('v-level-tier');
      const descEl = document.getElementById('v-level-desc');
      const actionEl = document.getElementById('v-level-action');

      if (titleEl) titleEl.textContent = cfg.title;
      if (pointsEl) pointsEl.textContent = cfg.points;
      if (tierEl) tierEl.textContent = cfg.tier;
      if (descEl) descEl.textContent = cfg.desc;
      if (actionEl) actionEl.textContent = cfg.action;
    }

    renderAll() {
      this.renderQuickStats();
      this.populateStudentSelectDropdowns();
      this.renderIssuesHub();
      this.renderMasterTable();
      if (this.currentViewingIssueId) {
        this.renderIssueDetail(this.currentViewingIssueId);
      }
      if (this.currentProfileStudentId) {
        this.renderStudentProfile(this.currentProfileStudentId);
      }
    }

    // --- Overview Metrics & Top 5 Leaderboard ---
    renderQuickStats() {
      const stats = store.getQuickStats();

      const totalStudentsEl = document.getElementById('stat-total-students');
      const totalViolationsEl = document.getElementById('stat-total-violations');
      const weekViolationsEl = document.getElementById('stat-week-violations');
      const unsolvedIssuesEl = document.getElementById('stat-unsolved-issues');
      const issuesCardBadge = document.getElementById('issues-card-live-badge');
      const unsolvedCountEl = document.getElementById('issues-card-unsolved-count');
      const solvedCountEl = document.getElementById('issues-card-solved-count');

      if (totalStudentsEl) totalStudentsEl.textContent = stats.totalStudents;
      if (totalViolationsEl) totalViolationsEl.textContent = stats.totalViolations;
      if (weekViolationsEl) weekViolationsEl.textContent = stats.violationsThisWeek;
      if (unsolvedIssuesEl) unsolvedIssuesEl.textContent = stats.unsolvedCount;

      if (issuesCardBadge) {
        issuesCardBadge.textContent = `${stats.unsolvedCount} Unsolved · ${stats.solvedCount} Solved`;
      }
      if (unsolvedCountEl) unsolvedCountEl.textContent = stats.unsolvedCount;
      if (solvedCountEl) solvedCountEl.textContent = stats.solvedCount;

      // Top 5 Students Leaderboard
      const leaderboardList = document.getElementById('top-5-leaderboard-list');
      if (!leaderboardList) return;

      if (stats.top5Students.length === 0) {
        leaderboardList.innerHTML = `<div style="text-align:center; padding: 1.5rem; color: var(--text-muted); font-size: 0.9rem;">No infractions recorded yet. Outstanding institutional discipline!</div>`;
        return;
      }

      // Curated vivid multi-color gradient avatars
      const avatarGradients = [
        'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)', // Gold to Crimson Fire
        'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)', // Electric Indigo to Hot Pink
        'linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)', // Ocean Blue to Cyan
        'linear-gradient(135deg, #10B981 0%, #059669 100%)', // Emerald Mint
        'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)', // Radiant Purple
        'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'  // Orange Flame
      ];

      const isNeo = (document.documentElement.getAttribute('data-style') || 'neo') === 'neo';

      if (isNeo && stats.top5Students.length > 0) {
        const top3 = stats.top5Students.slice(0, 3);
        const runnersUp = stats.top5Students.slice(3);

        const podiumHtml = `
          <div class="podium-deck">
            ${top3.map((item, idx) => {
              const rank = idx + 1;
              const m = item.metrics;
              const clampedScore = Math.max(0, Math.min(100, m.scorePercentage));
              const scaleFactor = (clampedScore / 100).toFixed(3);
              const gradColor = getGradientBarColor(m.status, m.barColor);
              const nameParts = (item.student.name || '').trim().split(/\s+/);
              const initials = (nameParts.length > 1 ? nameParts[0][0] + nameParts[nameParts.length - 1][0] : (nameParts[0] ? nameParts[0].slice(0, 2) : 'ST')).toUpperCase();
              const avatarGrad = avatarGradients[idx % avatarGradients.length];

              let rankSign = rank === 1 ? '👑 1st · Critical' : (rank === 2 ? '🥈 2nd · Elevated' : '🥉 3rd · Watch');

              return `
                <div class="podium-card podium-rank-${rank}" onclick="window.appController.openStudentProfile('${item.student.id}')" role="button" tabindex="0" aria-label="Student record for ${escapeHtml(item.student.name)}">
                  <div class="podium-badge-wrap">
                    <span class="podium-rank-tag">${rankSign}</span>
                    <span class="podium-viol-pill">${m.totalViolations} Violation${m.totalViolations > 1 ? 's' : ''}</span>
                  </div>
                  <div class="podium-avatar-wrap">
                    <div class="podium-avatar" style="background: ${avatarGrad};">${initials}</div>
                    <span class="podium-crown-icon">${rank === 1 ? '👑' : (rank === 2 ? '🥈' : '🥉')}</span>
                  </div>
                  <div class="podium-student-name">${escapeHtml(item.student.name)}</div>
                  <div class="podium-student-meta">${escapeHtml(item.student.classSection)} · Roll ${escapeHtml(item.student.rollNo || 'N/A')}</div>
                  <div class="podium-meter-wrap">
                    <div class="podium-meter-label">
                      <span class="meter-status-pill ${m.statusClass}">${m.status}</span>
                      <span class="meter-percent-num">${clampedScore}%</span>
                    </div>
                    <div class="meter-track">
                      <div class="meter-fill" style="transform: scaleX(${scaleFactor}); background: ${gradColor};"></div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;

        const runnersUpHtml = runnersUp.length > 0 ? `
          <div class="podium-runners-up-title">
            <span>Additional Watchlist Students (Ranks 4-5)</span>
          </div>
          <div class="leaderboard-runners-list">
            ${runnersUp.map((item, rIdx) => {
              const rank = rIdx + 4;
              const m = item.metrics;
              const clampedScore = Math.max(0, Math.min(100, m.scorePercentage));
              const scaleFactor = (clampedScore / 100).toFixed(3);
              const gradColor = getGradientBarColor(m.status, m.barColor);
              const nameParts = (item.student.name || '').trim().split(/\s+/);
              const initials = (nameParts.length > 1 ? nameParts[0][0] + nameParts[nameParts.length - 1][0] : (nameParts[0] ? nameParts[0].slice(0, 2) : 'ST')).toUpperCase();
              const avatarGrad = avatarGradients[rank % avatarGradients.length];

              return `
                <div class="leader-item runner-up-item" onclick="window.appController.openStudentProfile('${item.student.id}')" role="button" tabindex="0" aria-label="Student record for ${escapeHtml(item.student.name)}">
                  <div class="leader-row-top">
                    <div class="leader-identity">
                      <div class="leader-rank rank-${rank}">#${rank}</div>
                      <div class="leader-avatar" style="background: ${avatarGrad};">${initials}</div>
                      <div class="leader-student-info">
                        <span class="student-name">${escapeHtml(item.student.name)}</span>
                        <span class="student-meta">${escapeHtml(item.student.classSection)} · Roll ${escapeHtml(item.student.rollNo || 'N/A')}</span>
                      </div>
                    </div>
                    <div class="leader-badges">
                      <span class="priority-sign-tag tag-monitored">👁️ Monitored</span>
                      <span class="violation-count-pill">${m.totalViolations} Violation${m.totalViolations > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div class="leader-row-meter">
                    <div class="leader-meter-label">
                      <span class="meter-status-pill ${m.statusClass}">${m.status}</span>
                      <span class="meter-percent-num">${clampedScore}%</span>
                    </div>
                    <div class="meter-track">
                      <div class="meter-fill" style="transform: scaleX(${scaleFactor}); background: ${gradColor};"></div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : '';

        leaderboardList.innerHTML = podiumHtml + runnersUpHtml;
        return;
      }

      leaderboardList.innerHTML = stats.top5Students.map((item, idx) => {
        const rank = idx + 1;
        const m = item.metrics;
        const clampedScore = Math.max(0, Math.min(100, m.scorePercentage));
        const scaleFactor = (clampedScore / 100).toFixed(3);
        const lastSevBadge = m.lastSeverity ? `<span class="badge-last-sev sev-${m.lastSeverity.toLowerCase()}-badge">Last: ${m.lastSeverity}</span>` : '';
        const nameParts = (item.student.name || '').trim().split(/\s+/);
        const initials = (nameParts.length > 1 ? nameParts[0][0] + nameParts[nameParts.length - 1][0] : (nameParts[0] ? nameParts[0].slice(0, 2) : 'ST')).toUpperCase();

        // Professional Risk Signs & Badges
        let rankBadgeContent = `#${rank}`;
        let prioritySignTag = '';
        if (rank === 1) {
          rankBadgeContent = `👑 1`;
          prioritySignTag = `<span class="priority-sign-tag tag-critical">🚨 Critical Risk</span>`;
        } else if (rank === 2) {
          rankBadgeContent = `🥈 2`;
          prioritySignTag = `<span class="priority-sign-tag tag-high">⚡ Elevated</span>`;
        } else if (rank === 3) {
          rankBadgeContent = `🥉 3`;
          prioritySignTag = `<span class="priority-sign-tag tag-moderate">📌 High Watch</span>`;
        } else {
          prioritySignTag = `<span class="priority-sign-tag tag-monitored">👁️ Monitored</span>`;
        }
        
        // Curated vivid multi-color gradient avatars
        const avatarGradients = [
          'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)', // Gold to Crimson Fire
          'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)', // Electric Indigo to Hot Pink
          'linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)', // Ocean Blue to Cyan
          'linear-gradient(135deg, #10B981 0%, #059669 100%)', // Emerald Mint
          'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)', // Radiant Purple
          'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'  // Orange Flame
        ];
        const avatarGrad = avatarGradients[idx % avatarGradients.length];
        const gradColor = getGradientBarColor(m.status, m.barColor);

        return `
          <div class="leader-item" onclick="window.appController.openStudentProfile('${item.student.id}')" role="button" tabindex="0" aria-label="Student record for ${escapeHtml(item.student.name)}">
            <div class="leader-row-top">
              <div class="leader-identity">
                <div class="leader-rank rank-${rank}">${rankBadgeContent}</div>
                <div class="leader-avatar" style="background: ${avatarGrad};">${initials}</div>
                <div class="leader-student-info">
                  <span class="student-name">${escapeHtml(item.student.name)}</span>
                  <span class="student-meta">${escapeHtml(item.student.classSection)} · Roll ${escapeHtml(item.student.rollNo || 'N/A')}</span>
                </div>
              </div>
              <div class="leader-badges">
                ${prioritySignTag}
                ${lastSevBadge}
                <span class="violation-count-pill">${m.totalViolations} Violation${m.totalViolations > 1 ? 's' : ''}</span>
              </div>
            </div>
            <div class="leader-row-meter">
              <div class="leader-meter-label">
                <span class="meter-status-pill ${m.statusClass}">${m.status}</span>
                <span class="meter-percent-num">${clampedScore}%</span>
              </div>
              <div class="meter-track" title="Cumulative Disciplinary Rating: ${clampedScore}%">
                <div class="meter-fill" style="transform: scaleX(${scaleFactor}); background: ${gradColor};"></div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    populateStudentSelectDropdowns() {
      const students = store.getStudents();
      const sel = document.getElementById('v-student-select');
      const datalist = document.getElementById('students-datalist');

      if (datalist) {
        datalist.innerHTML = students.map(s => 
          `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)} · Class ${escapeHtml(s.classSection)} · Father: ${escapeHtml(s.fatherName || 'N/A')}</option>`
        ).join('');
      }

      if (sel) {
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
          opt.textContent = `${s.name} (${s.classSection} - Father: ${s.fatherName || 'N/A'})`;
          fragment.appendChild(opt);
        }

        sel.innerHTML = '';
        sel.appendChild(fragment);
        if (currentVal) sel.value = currentVal;
      }
    }

    handleStudentNameInput(val) {
      const trimmed = (val || '').trim().toLowerCase();
      if (!trimmed) return;
      const students = store.getStudents();
      // Match exact name first, then startsWith or contains
      const match = students.find(s => s.name.toLowerCase() === trimmed) 
                 || students.find(s => s.name.toLowerCase().startsWith(trimmed))
                 || (trimmed.length >= 3 && students.find(s => s.name.toLowerCase().includes(trimmed)));

      if (match) {
        const fatherInput = document.getElementById('v-father-name');
        const phoneInput = document.getElementById('v-parent-phone');
        const studentIdInput = document.getElementById('v-student-id');
        const vStudentSelect = document.getElementById('v-student-select');

        if (studentIdInput) studentIdInput.value = match.id;
        if (vStudentSelect) vStudentSelect.value = match.id;
        if (fatherInput && match.fatherName) {
          fatherInput.value = match.fatherName;
          this.flashAutoFill(fatherInput, 'vf-father-auto-tag');
        }
        if (phoneInput && match.guardianPhone) {
          phoneInput.value = match.guardianPhone;
          this.flashAutoFill(phoneInput, 'vf-phone-auto-tag');
        }
        if (match.classSection) {
          this.setClassValue(match.classSection);
          this.flashAutoFill(document.getElementById('v-class-select'), 'vf-class-auto-tag');
        }
        this.updateAutoDateTime();
      }
    }

    setClassValue(val) {
      const vClassInput = document.getElementById('v-class-select');
      if (vClassInput) {
        vClassInput.value = val || '';
      }
      const vClassMenu = document.getElementById('v-class-dropdown-menu');
      if (vClassMenu) {
        vClassMenu.classList.remove('open');
        document.getElementById('v-class-dropdown-trigger')?.classList.remove('open');
      }
    }

    getSelectedClass() {
      const vClassInput = document.getElementById('v-class-select');
      return vClassInput ? vClassInput.value.trim() : '';
    }

    handleClassSelectChange(cls) {
      this.updateAutoDateTime();
      const studentNameInput = document.getElementById('v-student-name');
      const sName = studentNameInput ? studentNameInput.value.trim().toLowerCase() : '';
      if (sName) {
        const students = store.getStudents();
        const match = students.find(s => s.name.toLowerCase() === sName && s.classSection === cls)
                   || students.find(s => s.name.toLowerCase() === sName);
        if (match) {
          const fatherInput = document.getElementById('v-father-name');
          const phoneInput = document.getElementById('v-parent-phone');
          const studentIdInput = document.getElementById('v-student-id');
          if (studentIdInput) studentIdInput.value = match.id;
          if (fatherInput && !fatherInput.value && match.fatherName) {
            fatherInput.value = match.fatherName;
            this.flashAutoFill(fatherInput, 'vf-father-auto-tag');
          }
          if (phoneInput && !phoneInput.value && match.guardianPhone) {
            phoneInput.value = match.guardianPhone;
            this.flashAutoFill(phoneInput, 'vf-phone-auto-tag');
          }
        }
      }
    }

    updateAutoDateTime() {
      const dtInput = document.getElementById('v-date-time');
      if (dtInput) {
        const now = new Date();
        const formatted = now.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }) + ' at ' + now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: true 
        });
        dtInput.value = formatted;
      }
    }

    flashAutoFill(element, tagId) {
      if (!element) return;
      element.classList.add('vf-input-highlight');
      const tag = document.getElementById(tagId);
      if (tag) tag.classList.add('active');
      setTimeout(() => {
        element.classList.remove('vf-input-highlight');
        if (tag) tag.classList.remove('active');
      }, 1500);
    }

    openAddViolationModal(preselectStudentId) {
      this.updateAutoDateTime();
      this.populateStudentSelectDropdowns();

      const studentNameInput = document.getElementById('v-student-name');
      const fatherNameInput = document.getElementById('v-father-name');
      const parentPhoneInput = document.getElementById('v-parent-phone');
      const studentIdInput = document.getElementById('v-student-id');
      const detailsInput = document.getElementById('violation-details-input');

      if (preselectStudentId) {
        const student = store.getStudent(preselectStudentId);
        if (student) {
          if (studentNameInput) studentNameInput.value = student.name;
          if (fatherNameInput) fatherNameInput.value = student.fatherName || '';
          if (parentPhoneInput) parentPhoneInput.value = student.guardianPhone || '';
          this.setClassValue(student.classSection || '');
          if (studentIdInput) studentIdInput.value = student.id;
          const sel = document.getElementById('v-student-select');
          if (sel) sel.value = student.id;
        }
      } else {
        if (studentNameInput) studentNameInput.value = '';
        if (fatherNameInput) fatherNameInput.value = '';
        if (parentPhoneInput) parentPhoneInput.value = '';
        this.setClassValue('');
        if (studentIdInput) studentIdInput.value = '';
        if (detailsInput) detailsInput.value = '';
      }

      this.selectSeverity(this.selectedSeverity || 'Medium');
      openModal('add-violation-modal');
    }

    handleAddViolationSubmit(e) {
      e.preventDefault();
      const studentNameInput = document.getElementById('v-student-name');
      const fatherNameInput = document.getElementById('v-father-name');
      const parentPhoneInput = document.getElementById('v-parent-phone');
      const detailsInput = document.getElementById('violation-details-input');
      const studentIdInput = document.getElementById('v-student-id');

      const studentName = studentNameInput ? studentNameInput.value.trim() : '';
      const fatherName = fatherNameInput ? fatherNameInput.value.trim() : '';
      const classSection = this.getSelectedClass();
      const parentPhone = parentPhoneInput ? parentPhoneInput.value.trim() : '';
      const details = detailsInput ? detailsInput.value.trim() : '';

      if (!studentName) {
        showToast('Please enter student name', 'error');
        if (studentNameInput) studentNameInput.focus();
        return;
      }
      if (!details) {
        showToast('Please describe the violation incident', 'error');
        if (detailsInput) detailsInput.focus();
        return;
      }

      try {
        let studentId = studentIdInput ? studentIdInput.value : '';
        let student = studentId ? store.getStudent(studentId) : null;

        // Try to match student by name if studentId wasn't explicitly set
        if (!student) {
          student = store.getStudents().find(s => s.name.toLowerCase() === studentName.toLowerCase());
        }

        if (student) {
          studentId = student.id;
          // Update student info if newly provided
          const updates = {};
          if (fatherName && (!student.fatherName || student.fatherName !== fatherName)) updates.fatherName = fatherName;
          if (parentPhone && (!student.guardianPhone || student.guardianPhone !== parentPhone)) updates.guardianPhone = parentPhone;
          if (classSection && student.classSection !== classSection) updates.classSection = classSection;
          if (Object.keys(updates).length > 0) {
            store.updateStudent(student.id, updates);
          }
        } else {
          // Auto-create new student record in registry!
          student = store.addStudent({
            name: studentName,
            fatherName: fatherName || 'Not Specified',
            classSection: classSection || 'General',
            guardianPhone: parentPhone || 'N/A',
            notes: 'Created via Disciplinary Violation Form'
          });
          studentId = student.id;
        }

        const v = store.addViolation({
          studentId,
          classSection: classSection || (student && student.classSection) || 'General',
          severity: this.selectedSeverity || 'Medium',
          details
        });

        showToast(`Violation logged for ${v.studentName}`, 'success');
        document.getElementById('add-violation-form').reset();
        this.addViolationDraft = null;
        closeModal('add-violation-modal');
        this.renderAll();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }

    // --- Issues Hub Implementation ---
    openIssuesHubModal() {
      this.renderIssuesHub();
      openModal('issues-modal');
    }

    openIssuesHubWithFilter(filter) {
      this.issueStatusFilter = filter || 'all';
      document.querySelectorAll('.issue-filter-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-status') === this.issueStatusFilter);
      });
      this.openIssuesHubModal();
    }

    openAddIssueModal() {
      openModal('add-issue-modal');
    }

    renderIssuesHub() {
      const listEl = document.getElementById('issues-list-container');
      const countAllEl = document.getElementById('issue-count-all');
      const countUnsolvedEl = document.getElementById('issue-count-unsolved');
      const countSolvedEl = document.getElementById('issue-count-solved');
      const countTextEl = document.getElementById('issues-header-count-text');

      const issues = store.getIssues();
      const allCount = issues.length;
      const unsolvedCount = issues.filter(i => i.status === 'unsolved').length;
      const solvedCount = issues.filter(i => i.status === 'solved').length;

      if (countAllEl) countAllEl.textContent = allCount;
      if (countUnsolvedEl) countUnsolvedEl.textContent = unsolvedCount;
      if (countSolvedEl) countSolvedEl.textContent = solvedCount;

      if (countTextEl) {
        countTextEl.textContent = `${unsolvedCount} unsolved of ${allCount} total`;
      }

      let filtered = [...issues];

      // Status filter
      if (this.issueStatusFilter === 'unsolved') {
        filtered = filtered.filter(i => i.status === 'unsolved');
      } else if (this.issueStatusFilter === 'solved') {
        filtered = filtered.filter(i => i.status === 'solved');
      }

      // Priority filter (High, Medium, Low; legacy Urgent -> High)
      if (this.issuePriorityFilter !== 'all') {
        filtered = filtered.filter(i => {
          let p = i.priority || 'Medium';
          if (p === 'Urgent') p = 'High';
          return p === this.issuePriorityFilter;
        });
      }

      // Search filter
      if (this.issueSearchTerm) {
        const q = this.issueSearchTerm;
        filtered = filtered.filter(i =>
          (i.title && i.title.toLowerCase().includes(q)) ||
          (i.description && i.description.toLowerCase().includes(q)) ||
          (i.creatorName && i.creatorName.toLowerCase().includes(q)) ||
          (i.category && i.category.toLowerCase().includes(q))
        );
      }

      // Sorting
      if (this.issueSortBy === 'newest') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (this.issueSortBy === 'efforts') {
        filtered.sort((a, b) => (b.efforts?.length || 0) - (a.efforts?.length || 0));
      } else if (this.issueSortBy === 'priority') {
        const pMap = { High: 3, Medium: 2, Low: 1, Urgent: 3 };
        filtered.sort((a, b) => (pMap[b.priority] || 0) - (pMap[a.priority] || 0));
      }

      if (!listEl) return;

      if (filtered.length === 0) {
        listEl.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: var(--text-muted); background: var(--bg-surface-alt); border-radius: var(--radius-card); border: 1px dashed var(--border-color);">
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;">No matching issues found</div>
            <p style="font-size: 0.85rem; margin-bottom: 1rem;">No issues match your current filter or search criteria.</p>
            <button type="button" class="btn btn-primary btn-sm" onclick="window.appController.openAddIssueModal()">+ Raise New Issue</button>
          </div>
        `;
        return;
      }

      listEl.innerHTML = filtered.map(iss => {
        const effortCount = iss.efforts?.length || 0;
        const isSolved = iss.status === 'solved';

        let priority = iss.priority || 'Medium';
        if (priority === 'Urgent') priority = 'High';
        if (!['High', 'Medium', 'Low'].includes(priority)) priority = 'Medium';
        const priorityClass = `priority-${priority.toLowerCase()}`;
        const statusClass = isSolved ? 'status-solved' : 'status-unsolved';

        const reporterName = iss.creatorName || 'Staff Member';
        const reporterInitials = reporterName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

        return `
          <div class="issue-card ${priorityClass} ${statusClass}" onclick="window.appController.openIssueDetail('${iss.id}')" role="button" tabindex="0" aria-label="Issue: ${escapeHtml(iss.title)}">
            <div>
              <div class="issue-card-top-badges">
                <span class="issue-status-pill ${isSolved ? 'status-pill-solved' : 'status-pill-unsolved'}">${isSolved ? 'Solved' : 'Unsolved'}</span>
                <span class="issue-priority-pill prio-${priority.toLowerCase()}-pill">${priority} Priority</span>
              </div>
              <div class="issue-category-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>${escapeHtml(iss.category || 'General')}</span>
              </div>
              <h4 class="issue-card-title">${escapeHtml(iss.title)}</h4>
              <p class="issue-card-desc">${escapeHtml(iss.description)}</p>
            </div>
            <div>
              <div class="issue-card-divider"></div>
              <div class="issue-card-footer">
                <div class="issue-reporter-info">
                  <div class="reporter-avatar">${reporterInitials}</div>
                  <span class="reporter-name">${escapeHtml(reporterName)}</span>
                </div>
                <div class="issue-effort-pill">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/></svg>
                  <span>${effortCount} effort${effortCount === 1 ? '' : 's'}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    handleAddIssueSubmit(e) {
      e.preventDefault();
      const title = (document.getElementById('issue-title-input') || document.getElementById('new-issue-title'))?.value || '';
      const category = (document.getElementById('issue-category-select') || document.getElementById('new-issue-category'))?.value || 'General Discipline';
      const priority = (document.getElementById('issue-priority-select') || document.getElementById('new-issue-priority'))?.value || 'Medium';
      const description = (document.getElementById('issue-desc-input') || document.getElementById('new-issue-desc'))?.value || '';

      if (!title.trim() || !description.trim()) {
        showToast('Please provide an issue title and description', 'error');
        return;
      }

      const iss = store.addIssue({ title, description, category, priority });
      showToast(`Issue created: ${iss.title}`, 'success');
      document.getElementById('add-issue-form').reset();
      closeModal('add-issue-modal');
      this.renderAll();
    }

    openIssueDetail(issueId) {
      this.currentViewingIssueId = issueId;
      this.renderIssueDetail(issueId);
      openModal('issue-detail-modal');
    }

    renderIssueDetail(issueId) {
      const issue = store.getIssue(issueId);
      if (!issue) return;

      const user = window.authManager.getCurrentUser();
      const isCreatorOrAdmin = user.role === 'Admin' || user.id === issue.creatorId;

      document.getElementById('detail-issue-title').textContent = issue.title;
      document.getElementById('detail-issue-category').textContent = issue.category;
      document.getElementById('detail-issue-priority').textContent = `${issue.priority} Priority`;
      document.getElementById('detail-issue-priority').className = `issue-priority-pill prio-${(issue.priority || 'Medium').toLowerCase()}-pill`;
      document.getElementById('detail-issue-desc').textContent = issue.description;

      const statusBadge = document.getElementById('detail-issue-status');
      const isSolved = issue.status === 'solved';
      statusBadge.textContent = isSolved ? 'Solved' : 'Unsolved';
      statusBadge.className = `issue-status-pill ${isSolved ? 'status-pill-solved' : 'status-pill-unsolved'}`;

      document.getElementById('detail-issue-creator').textContent = `${issue.creatorName} (${issue.creatorRole}) on ${formatDateTime(issue.createdAt)}`;

      // Solve / Reopen Action Container
      const solveBtnContainer = document.getElementById('detail-solve-btn-container');
      if (solveBtnContainer) {
        if (isSolved) {
          solveBtnContainer.innerHTML = `
            <div style="background: var(--issue-solved-bg); border: 1px solid #BBF7D0; border-radius: var(--radius-control); padding: 0.75rem 1rem; width: 100%; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <span style="font-size: 0.84rem; color: #166534; font-weight: 600;">
                ✓ Solved by ${escapeHtml(issue.solvedByName || 'Admin')} on ${formatDateTime(issue.solvedAt)}
              </span>
              ${isCreatorOrAdmin ? `<button id="reopen-issue-btn" class="btn btn-secondary btn-sm" onclick="window.appController.handleReopenIssue('${issue.id}')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Reopen Issue</button>` : ''}
            </div>
          `;
        } else if (isCreatorOrAdmin) {
          solveBtnContainer.innerHTML = `
            <button id="solve-issue-btn" class="btn btn-primary btn-sm" onclick="window.appController.handleSolveIssue('${issue.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> Mark as Solved
            </button>
          `;
        } else {
          solveBtnContainer.innerHTML = '';
        }
      }

      // Render Efforts Timeline
      const effortsList = document.getElementById('detail-efforts-list');
      const efforts = issue.efforts || [];

      if (effortsList) {
        if (efforts.length === 0) {
          effortsList.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; padding: 0.5rem 0;">No staff actions recorded yet. Use the form above to log your contribution.</p>`;
        } else {
          effortsList.innerHTML = efforts.map(eff => {
            const canEdit = user.id === eff.memberId;
            const canDelete = user.role === 'Admin' || user.id === eff.memberId;
            return `
              <div class="effort-card" id="effort-card-${eff.id}">
                <div class="effort-header">
                  <div class="effort-author-wrap">
                    <span>${escapeHtml(eff.memberName)}</span>
                    <span class="role-badge ${eff.memberRole === 'Admin' ? 'role-badge-admin' : 'role-badge-member'}">${eff.memberRole}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>${formatDateTime(eff.timestamp)}</span>
                    ${canDelete ? `<button type="button" onclick="window.appController.handleDeleteEffort('${issue.id}', '${eff.id}')" title="Delete effort" style="color: #EF4444; font-size: 1.1rem; line-height: 1;">&times;</button>` : ''}
                  </div>
                </div>
                <div class="effort-text" id="effort-text-${eff.id}">${escapeHtml(eff.text)}</div>
              </div>
            `;
          }).join('');
        }
      }
    }

    handleAddEffortSubmit(e) {
      e.preventDefault();
      if (!this.currentViewingIssueId) return;

      const input = document.getElementById('new-effort-text');
      const text = input.value.trim();
      if (!text) return;

      store.addEffortToIssue(this.currentViewingIssueId, text);
      input.value = '';
      showToast('Effort contribution logged', 'success');
      this.renderIssueDetail(this.currentViewingIssueId);
      this.renderIssuesHub();
    }

    handleDeleteEffort(issueId, effortId) {
      showConfirmModal('Delete Effort', 'Are you sure you want to remove this logged contribution?', 'Delete', () => {
        store.deleteEffort(issueId, effortId);
        showToast('Effort entry removed', 'success');
        this.renderIssueDetail(issueId);
        this.renderIssuesHub();
      });
    }

    handleSolveIssue(issueId) {
      showConfirmModal('Mark Issue as Solved', 'Has this institutional issue been satisfactorily resolved?', 'Confirm Solved', () => {
        store.solveIssue(issueId);
        showToast('Issue marked as solved!', 'success');
        this.renderIssueDetail(issueId);
        this.renderIssuesHub();
      });
    }

    handleReopenIssue(issueId) {
      store.reopenIssue(issueId);
      showToast('Issue reopened for follow-up', 'success');
      this.renderIssueDetail(issueId);
      this.renderIssuesHub();
    }

    // --- Master Records Table & Student Profiles ---
    openRecordsModal() {
      this.recordsPage = 1;
      this.renderMasterTable();
      openModal('records-modal');
    }

    renderMasterTable() {
      const tbody = document.getElementById('master-records-table-body');
      const paginationEl = document.getElementById('master-records-pagination');
      if (!tbody) return;

      const students = store.getStudents();
      let filtered = [];

      for (let i = 0; i < students.length; i++) {
        const s = students[i];
        if (this.masterClassFilter !== 'all' && s.classSection !== this.masterClassFilter) continue;
        if (this.masterSearchTerm) {
          const q = this.masterSearchTerm;
          const match = s.name.toLowerCase().includes(q) ||
                        s.classSection.toLowerCase().includes(q) ||
                        (s.rollNo && s.rollNo.toLowerCase().includes(q));
          if (!match) continue;
        }

        const metrics = store.getStudentMetrics(s.id);
        filtered.push({ student: s, metrics });
      }

      // Sorting
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
      const paginated = filtered.slice(startIndex, startIndex + this.recordsPageSize);

      if (paginated.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No student records found.</td></tr>`;
        if (paginationEl) paginationEl.innerHTML = '';
        return;
      }

      tbody.innerHTML = paginated.map(item => {
        const s = item.student;
        const r = item.metrics;
        return `
          <tr onclick="window.appController.openStudentProfile('${s.id}')">
            <td>
              <div style="font-weight: 600; color: var(--text-primary);">${escapeHtml(s.name)}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(s.guardianPhone || 'No Phone')}</div>
            </td>
            <td>
              <span class="role-badge role-badge-member">${escapeHtml(s.classSection)}</span>
              ${s.rollNo ? `<span style="font-size: 0.76rem; color: var(--text-muted); margin-left: 4px;">#${escapeHtml(s.rollNo)}</span>` : ''}
            </td>
            <td>
              <span class="violation-count-pill">${r.totalViolations}</span>
            </td>
            <td style="font-size: 0.82rem; color: var(--text-muted); white-space: nowrap;">
              ${r.lastViolationDate ? getRelativeDate(r.lastViolationDate) : '<span style="color:#10B981;">Clean</span>'}
            </td>
            <td style="min-width: 140px;">
              ${renderSeverityMeter(r.scorePercentage, r.barColor, r.status, r.statusClass)}
            </td>
            <td style="text-align: right;" onclick="event.stopPropagation();">
              <button class="btn btn-secondary btn-sm" onclick="window.appController.openStudentProfile('${s.id}')" title="View Full Profile">Profile</button>
            </td>
          </tr>
        `;
      }).join('');

      if (paginationEl) {
        paginationEl.innerHTML = `
          <div style="font-size: 0.82rem; color: var(--text-muted);">
            Showing <strong>${startIndex + 1}</strong> - <strong>${Math.min(startIndex + this.recordsPageSize, totalItems)}</strong> of <strong>${totalItems}</strong>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button class="btn btn-secondary btn-sm" ${this.recordsPage <= 1 ? 'disabled' : ''} onclick="window.appController.changeRecordsPage(${this.recordsPage - 1})">&larr; Prev</button>
            <span style="font-size: 0.82rem; font-weight: 600;">Page ${this.recordsPage} of ${totalPages}</span>
            <button class="btn btn-secondary btn-sm" ${this.recordsPage >= totalPages ? 'disabled' : ''} onclick="window.appController.changeRecordsPage(${this.recordsPage + 1})">Next &rarr;</button>
          </div>
        `;
      }
    }

    changeRecordsPage(newPage) {
      this.recordsPage = newPage;
      this.renderMasterTable();
    }

    openStudentProfile(studentId) {
      this.currentProfileStudentId = studentId;
      this.renderStudentProfile(studentId);
      openModal('student-profile-modal');
    }

    renderStudentProfile(studentId) {
      const student = store.getStudent(studentId);
      if (!student) return;

      const metrics = store.getStudentMetrics(studentId);
      const violations = store.getStudentViolations(studentId);
      const user = window.authManager.getCurrentUser();

      document.getElementById('profile-student-name').textContent = student.name;
      document.getElementById('profile-student-meta').textContent = `Class: ${student.classSection} · Roll: ${student.rollNo || 'N/A'} · Guardian: ${student.guardianPhone || 'N/A'}`;
      document.getElementById('profile-total-violations').textContent = metrics.totalViolations;
      document.getElementById('profile-score-percent').textContent = `${metrics.scorePercentage}%`;

      const meterFill = document.getElementById('profile-meter-fill');
      if (meterFill) {
        meterFill.style.transform = `scaleX(${(metrics.scorePercentage / 100).toFixed(3)})`;
        meterFill.style.backgroundColor = metrics.barColor;
      }

      const statusBadge = document.getElementById('profile-status-badge');
      if (statusBadge) {
        statusBadge.textContent = metrics.status;
        statusBadge.className = `meter-status-pill ${metrics.statusClass}`;
      }

      // Chronological History List
      const historyList = document.getElementById('profile-violations-history');
      if (historyList) {
        if (violations.length === 0) {
          historyList.innerHTML = `<p style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-style: italic;">No recorded infractions. Student has a completely clean disciplinary record.</p>`;
        } else {
          historyList.innerHTML = violations.map(v => {
            const canDelete = user.role === 'Admin';
            return `
              <div style="background: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-control); padding: 0.85rem 1rem; margin-bottom: 0.65rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
                  <div style="display: flex; align-items: center; gap: 0.45rem;">
                    <span class="meter-status-pill sev-${v.severity.toLowerCase()}-badge">${v.severity}</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${formatDateTime(v.timestamp)}</span>
                  </div>
                  ${canDelete ? `<button type="button" onclick="window.appController.handleDeleteViolation('${v.id}')" title="Admin delete violation" style="color: #EF4444; font-size: 1.1rem; line-height: 1;">&times;</button>` : ''}
                </div>
                <div style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.45; overflow-wrap: anywhere;" dir="auto">${escapeHtml(v.details)}</div>
                <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.35rem;">Recorded by: ${escapeHtml(v.memberName)} (${v.memberRole})</div>
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
            <p>Confidential Disciplinary Record & Behavioral Assessment</p>
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
          ${violations.length === 0 ? '<p>No disciplinary infractions on record. Clean conduct.</p>' : violations.map(v => `
            <div style="margin-bottom: 12px; border-bottom: 1px dotted #ccc; padding-bottom: 8px;">
              <div><strong>[${v.severity}]</strong> ${formatDateTime(v.timestamp)} — Recorded by ${escapeHtml(v.memberName)} (${v.memberRole})</div>
              <div style="margin-top: 4px;" dir="auto">${escapeHtml(v.details)}</div>
            </div>
          `).join('')}
        `;
      }
    }

    handleDeleteViolation(violationId) {
      showConfirmModal('Delete Violation Record', 'Are you sure you want to permanently delete this violation?', 'Delete', () => {
        store.deleteViolation(violationId);
        showToast('Violation record deleted', 'success');
        this.renderAll();
      });
    }

    handleAddStudentSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('new-std-name').value;
      const fatherName = document.getElementById('new-std-father')?.value || '';
      const classSection = document.getElementById('new-std-class').value;
      const rollNo = document.getElementById('new-std-roll').value;
      const guardianPhone = document.getElementById('new-std-phone').value;
      const notes = document.getElementById('new-std-notes').value;

      if (!name.trim() || !classSection.trim()) {
        showToast('Please enter full name and class/section', 'error');
        return;
      }

      const newStudent = store.addStudent({ name, fatherName, classSection, rollNo, guardianPhone, notes });
      document.getElementById('add-student-form').reset();
      closeModal('add-student-modal');
      this.populateStudentSelectDropdowns();

      // If this was an inline student addition during Add Violation, auto-select and restore draft!
      if (this.addViolationDraft) {
        const sNameInput = document.getElementById('v-student-name');
        if (sNameInput) sNameInput.value = newStudent.name;
        const sFatherInput = document.getElementById('v-father-name');
        if (sFatherInput) sFatherInput.value = newStudent.fatherName || '';
        const sPhoneInput = document.getElementById('v-parent-phone');
        if (sPhoneInput) sPhoneInput.value = newStudent.guardianPhone || '';
        this.setClassValue(newStudent.classSection || '');
        const stdId = document.getElementById('v-student-id');
        if (stdId) stdId.value = newStudent.id;
        const sel = document.getElementById('v-student-select');
        if (sel) sel.value = newStudent.id;

        if (this.addViolationDraft.details) {
          document.getElementById('violation-details-input').value = this.addViolationDraft.details;
        }
        if (this.addViolationDraft.severity) {
          this.selectSeverity(this.addViolationDraft.severity);
        }
        this.addViolationDraft = null;
        showToast(`Student ${newStudent.name} created and selected! Continuing draft.`, 'success');
        openModal('add-violation-modal');
      } else {
        showToast(`Student profile created: ${newStudent.name}`, 'success');
      }

      this.renderAll();
    }

    handleEditStudentSubmit(e) {
      e.preventDefault();
      const id = document.getElementById('edit-std-id').value;
      const name = document.getElementById('edit-std-name').value;
      const fatherName = document.getElementById('edit-std-father')?.value || '';
      const classSection = document.getElementById('edit-std-class').value;
      const rollNo = document.getElementById('edit-std-roll').value;
      const guardianPhone = document.getElementById('edit-std-phone').value;
      const notes = document.getElementById('edit-std-notes').value;

      store.updateStudent(id, { name, fatherName, classSection, rollNo, guardianPhone, notes });
      showToast('Student profile updated', 'success');
      closeModal('edit-student-modal');
      this.renderAll();
    }

    // --- Global Search Dropdown ---
    handleGlobalSearch(query) {
      const dropdown = document.getElementById('search-results-dropdown');
      const clearBtn = document.getElementById('search-clear-btn');
      if (!dropdown) return;

      const q = query.trim().toLowerCase();
      if (!q) {
        dropdown.classList.remove('active');
        if (clearBtn) clearBtn.style.display = 'none';
        return;
      }

      if (clearBtn) clearBtn.style.display = 'flex';

      const students = store.getStudents();
      const issues = store.getIssues();

      const matchedStudents = students.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.classSection.toLowerCase().includes(q) ||
        (s.rollNo && s.rollNo.toLowerCase().includes(q))
      ).slice(0, 4);

      const matchedIssues = issues.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      ).slice(0, 4);

      if (matchedStudents.length === 0 && matchedIssues.length === 0) {
        dropdown.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No students or issues matching "${escapeHtml(q)}"</div>`;
        dropdown.classList.add('active');
        return;
      }

      let html = '';
      if (matchedStudents.length > 0) {
        html += `<div class="search-group-header">Students (${matchedStudents.length})</div>`;
        html += matchedStudents.map(s => `
          <div class="search-item" onclick="window.appController.openStudentProfile('${s.id}'); document.getElementById('search-results-dropdown').classList.remove('active');">
            <div class="search-item-info">
              <h4>${escapeHtml(s.name)}</h4>
              <p>Class: ${escapeHtml(s.classSection)} ${s.rollNo ? '| Roll: ' + escapeHtml(s.rollNo) : ''}</p>
            </div>
            <button class="btn btn-secondary btn-sm">Profile</button>
          </div>
        `).join('');
      }

      if (matchedIssues.length > 0) {
        html += `<div class="search-group-header">Institute Issues (${matchedIssues.length})</div>`;
        html += matchedIssues.map(i => `
          <div class="search-item" onclick="window.appController.openIssueDetail('${i.id}'); document.getElementById('search-results-dropdown').classList.remove('active');">
            <div class="search-item-info">
              <h4>${escapeHtml(i.title)}</h4>
              <p>${escapeHtml(i.category)} · <span style="font-weight: 600; color: ${i.status === 'solved' ? '#16A34A' : '#DC2626'};">${i.status === 'solved' ? 'Solved' : 'Unsolved'}</span></p>
            </div>
            <button class="btn btn-secondary btn-sm">View</button>
          </div>
        `).join('');
      }

      dropdown.innerHTML = html;
      dropdown.classList.add('active');
    }

    // --- Staff Management ---
    renderStaffList() {
      const container = document.getElementById('staff-members-list');
      if (!container) return;

      const users = window.authManager.getUsers();
      const currentUser = window.authManager.getCurrentUser();
      const isAdmin = window.authManager.isAdmin();

      container.innerHTML = users.map(u => {
        const isCurrent = u.id === currentUser.id;
        const initials = u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        return `
          <div style="background: var(--bg-surface); border: 1px solid ${isCurrent ? 'var(--brand-primary)' : 'var(--border-color)'}; border-radius: var(--radius-control); padding: 0.75rem 1rem; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="member-avatar ${u.role === 'Admin' ? 'admin-avatar' : ''}">${initials}</div>
              <div>
                <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">${escapeHtml(u.name)} ${isCurrent ? '<span style="color: var(--brand-primary); font-size: 0.75rem;">(Active)</span>' : ''}</div>
                <div style="font-size: 0.76rem; color: var(--text-muted);">${escapeHtml(u.designation || u.role)} · @${escapeHtml(u.username)}</div>
              </div>
            </div>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              ${!isCurrent ? `<button class="btn btn-secondary btn-sm" onclick="window.authManager.switchUser('${u.id}'); window.appController.initAuthUI(); showToast('Switched user to ${escapeHtml(u.name)}', 'success');">Switch</button>` : ''}
              ${isAdmin && !isCurrent ? `<button class="btn btn-sm" style="color: #EF4444;" onclick="window.authManager.deleteMember('${u.id}'); window.appController.renderStaffList(); showToast('Staff member removed', 'success');" title="Remove staff account">&times;</button>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    handleRegisterMemberSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('new-member-name').value;
      const username = document.getElementById('new-member-username').value;
      const password = document.getElementById('new-member-password').value;
      const role = document.getElementById('new-member-role').value;
      const designation = document.getElementById('new-member-designation').value;

      const res = window.authManager.registerMember({ name, username, password, role, designation });
      if (res.success) {
        showToast(`Staff member registered: ${res.user.name}`, 'success');
        document.getElementById('new-member-form').reset();
        this.renderStaffList();
      } else {
        showToast(res.message, 'error');
      }
    }

    // --- CSV & JSON Exports ---
    exportMasterToCSV() {
      const students = store.getStudents();
      const headers = ['Student ID', 'Name', 'Class', 'Roll No', 'Guardian Phone', 'Total Violations', 'Disciplinary Status', 'Score %', 'Last Violation Date'];
      const rows = students.map(s => {
        const m = store.getStudentMetrics(s.id);
        return [s.id, s.name, s.classSection, s.rollNo, s.guardianPhone, m.totalViolations, m.status, m.scorePercentage + '%', m.lastViolationDate ? formatDateTime(m.lastViolationDate) : 'Clean'];
      });
      downloadCSV('Hadi_Master_Discipline_Sheet.csv', headers, rows);
      showToast('Master sheet exported to CSV', 'success');
    }

    exportViolationsToCSV() {
      const violations = store.getViolations();
      const headers = ['Violation ID', 'Student Name', 'Class', 'Severity', 'Details', 'Recorded By', 'Timestamp'];
      const rows = violations.map(v => [v.id, v.studentName, v.classSection, v.severity, v.details, v.memberName, formatDateTime(v.timestamp)]);
      downloadCSV('Hadi_Violations_Log.csv', headers, rows);
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
      downloadCSV('Hadi_Collaborative_Issues.csv', headers, rows);
      showToast('Issues and efforts exported to CSV', 'success');
    }

    downloadJSONBackup() {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store.data, null, 2));
      const a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', `Hadi_Discipline_Backup_${new Date().toISOString().slice(0, 10)}.json`);
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
            store.data = parsed;
            store.rebuildIndices();
            store.save('Restored full backup from JSON');
            showToast('Backup restored successfully!', 'success');
            closeModal('settings-modal');
            this.renderAll();
          } else {
            showToast('Invalid backup file format', 'error');
          }
        } catch (err) {
          showToast('Failed to parse JSON file', 'error');
        }
      };
      reader.readAsText(file);
    }

    handleCSVImport(e) {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          showToast('CSV file is empty or missing headers', 'error');
          return;
        }

        let imported = 0;
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map(p => p.replace(/^"|"$/g, '').trim());
          if (parts[0]) {
            store.addStudent({
              name: parts[0],
              classSection: parts[1] || 'General',
              rollNo: parts[2] || '',
              guardianPhone: parts[3] || ''
            });
            imported++;
          }
        }

        showToast(`Imported ${imported} students from CSV`, 'success');
        closeModal('settings-modal');
        this.renderAll();
      };
      reader.readAsText(file);
    }
  }

  function downloadCSV(filename, headers, rows) {
    const csvContent = [headers.map(h => `"${h}"`).join(',')].concat(
      rows.map(row => row.map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(','))
    ).join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Global Exposure
  window.store = store;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.showToast = showToast;

  document.addEventListener('DOMContentLoaded', () => {
    window.appController = new AppController();
  });
})();
