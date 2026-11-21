/**
 * School Discipline Tracker - Multi-User Authentication & Role System
 * Roles: Admin (Full control, delete anything, manage staff) and Member
 * Tracks active member attribution on all operations with auto-timestamps.
 */

(function () {
  'use strict';

  const AUTH_USERS_KEY = 'hes_staff_members_v1';
  const ACTIVE_USER_KEY = 'hes_active_member_session';

  // Default pre-seeded staff accounts for immediate testing
  const DEFAULT_STAFF = [
    {
      id: 'usr-admin-1',
      name: 'Principal Muhammad Ali Hamdani',
      username: 'admin',
      password: 'admin123',
      role: 'Admin',
      designation: 'Principal & Chief Administrator'
    },
    {
      id: 'usr-member-1',
      name: 'Mr. Tariq Mehmood',
      username: 'tariq',
      password: 'teacher123',
      role: 'Member',
      designation: 'Senior Science Teacher'
    },
    {
      id: 'usr-member-2',
      name: 'Ms. Sadia Parveen',
      username: 'sadia',
      password: 'teacher123',
      role: 'Member',
      designation: 'Discipline In-charge'
    }
  ];

  class AuthManager {
    constructor() {
      this.listeners = [];
      this.users = this.loadUsers();
      this.currentUser = this.loadActiveSession();
    }

    loadUsers() {
      try {
        const stored = localStorage.getItem(AUTH_USERS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Error loading staff accounts:', e);
      }
      localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(DEFAULT_STAFF));
      return JSON.parse(JSON.stringify(DEFAULT_STAFF));
    }

    saveUsers() {
      try {
        localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(this.users));
      } catch (e) {
        console.error('Failed to save staff members:', e);
      }
    }

    loadActiveSession() {
      try {
        const stored = localStorage.getItem(ACTIVE_USER_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const found = this.users.find(u => u.id === parsed.id);
          if (found) return found;
        }
      } catch (e) {
        console.warn('Error loading active session:', e);
      }
      // Default to Principal Admin on first launch
      const defaultAdmin = this.users[0] || DEFAULT_STAFF[0];
      this.setActiveSession(defaultAdmin);
      return defaultAdmin;
    }

    setActiveSession(user) {
      this.currentUser = user;
      try {
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify({
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role
        }));
      } catch (e) {
        console.error('Error saving active session:', e);
      }
      this.notify();
    }

    subscribe(fn) {
      this.listeners.push(fn);
    }

    notify() {
      if (Array.isArray(this.listeners)) {
        this.listeners.forEach(fn => {
          try {
            fn(this.currentUser);
          } catch (e) {
            console.warn('Listener error in auth:', e);
          }
        });
      }
    }

    getCurrentUser() {
      return this.currentUser || this.users[0];
    }

    getUsers() {
      return this.users;
    }

    isAdmin() {
      const user = this.getCurrentUser();
      return Boolean(user && user.role === 'Admin');
    }

    canSolveIssue(issue) {
      if (!issue) return false;
      const user = this.getCurrentUser();
      if (!user) return false;
      return user.role === 'Admin' || user.id === issue.creatorId || user.name === issue.creatorName;
    }

    canEditEffort(effort) {
      if (!effort) return false;
      const user = this.getCurrentUser();
      if (!user) return false;
      return user.id === effort.memberId || user.name === effort.memberName;
    }

    canDeleteEffort(effort) {
      if (!effort) return false;
      const user = this.getCurrentUser();
      if (!user) return false;
      return user.role === 'Admin' || user.id === effort.memberId || user.name === effort.memberName;
    }

    canDeleteIssue(issue) {
      if (!issue) return false;
      const user = this.getCurrentUser();
      if (!user) return false;
      return user.role === 'Admin' || user.id === issue.creatorId;
    }

    canDeleteStudent() {
      return this.isAdmin();
    }

    login(username, password) {
      const normalizedUser = username.trim().toLowerCase();
      const user = this.users.find(u => 
        u.username.toLowerCase() === normalizedUser || 
        u.name.toLowerCase() === normalizedUser
      );

      if (!user) {
        return { success: false, message: 'Member account not found' };
      }

      if (user.password !== password) {
        return { success: false, message: 'Incorrect password' };
      }

      this.setActiveSession(user);
      return { success: true, user };
    }

    switchUser(userId) {
      const user = this.users.find(u => u.id === userId);
      if (user) {
        this.setActiveSession(user);
        return true;
      }
      return false;
    }

    registerMember({ name, username, password, role = 'Member', designation = '' }) {
      const normalized = username.trim().toLowerCase();
      if (this.users.some(u => u.username.toLowerCase() === normalized)) {
        return { success: false, message: 'Username is already taken' };
      }

      const newUser = {
        id: 'usr-' + Date.now(),
        name: name.trim(),
        username: normalized,
        password: password.trim(),
        role: role === 'Admin' ? 'Admin' : 'Member',
        designation: designation.trim() || (role === 'Admin' ? 'Administrator' : 'Staff Member')
      };

      this.users.push(newUser);
      this.saveUsers();
      return { success: true, user: newUser };
    }

    deleteMember(userId) {
      if (!this.isAdmin()) return false;
      if (this.users.length <= 1) return false;
      this.users = this.users.filter(u => u.id !== userId);
      this.saveUsers();
      if (this.currentUser && this.currentUser.id === userId) {
        this.setActiveSession(this.users[0]);
      }
      return true;
    }

    logout() {
      // Switch back to first user or clear
      if (this.users.length > 0) {
        this.setActiveSession(this.users[0]);
      }
    }
  }

  window.authManager = new AuthManager();
})();
