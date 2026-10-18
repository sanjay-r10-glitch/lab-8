/**
 * Lab 8: Cross-Page User Information Display Script
 * Parses URL query parameters and Web Storage to render dynamic profile cards.
 */

document.addEventListener('DOMContentLoaded', () => {
  const profileContainer = document.getElementById('profileContainer');
  const historySection = document.getElementById('historySection');
  const historyTableBody = document.getElementById('historyTableBody');
  const btnClearHistory = document.getElementById('btnClearHistory');

  /**
   * Extract User Data from Query Params or Storage
   */
  function getUserData() {
    const params = new URLSearchParams(window.location.search);
    
    // Check if query params exist and contain at least fullName
    if (params.has('fullName') && params.get('fullName').trim() !== '') {
      const code = params.get('countryCode') || '+91';
      const mob = params.get('mobile') || '';
      return {
        id: params.get('id') || 'USR-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        fullName: params.get('fullName'),
        gender: params.get('gender') || 'Not specified',
        countryCode: code,
        mobile: mob,
        fullMobile: mob ? `${code} ${mob}` : 'Not provided',
        email: params.get('email') || 'Not provided',
        city: params.get('city') || 'Not provided',
        state: params.get('state') || 'Not provided',
        country: params.get('country') || 'Not provided',
        submittedAt: params.get('submittedAt') || new Date().toLocaleString()
      };
    }

    // Fallback 1: sessionStorage
    try {
      const sessionData = sessionStorage.getItem('capturedUserData');
      if (sessionData) return JSON.parse(sessionData);
    } catch (e) {
      console.warn('Session storage error:', e);
    }

    // Fallback 2: localStorage
    try {
      const localData = localStorage.getItem('capturedUserData');
      if (localData) return JSON.parse(localData);
    } catch (e) {
      console.warn('Local storage error:', e);
    }

    return null;
  }

  /**
   * Helper: Generate user initials for avatar
   */
  function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /**
   * Helper: Escape HTML to avoid XSS
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Render the User Profile Card
   */
  function renderProfile(user) {
    if (!user) {
      renderEmptyState();
      return;
    }

    const initials = getInitials(user.fullName);
    const genderIcon = user.gender === 'Male' ? '♂' : user.gender === 'Female' ? '♀' : '⚧';
    const fullMobile = user.fullMobile || `${user.countryCode || ''} ${user.mobile || ''}`.trim();
    const telLink = `tel:${fullMobile.replace(/\s+/g, '')}`;

    profileContainer.innerHTML = `
      <article class="glass-card profile-card" id="printableCard">
        <!-- Banner Header -->
        <div class="profile-header-banner"></div>

        <div class="profile-content">
          <!-- Meta row with avatar and basic titles -->
          <div class="profile-meta-row">
            <div class="avatar-badge-wrap">
              <div class="user-avatar" title="${escapeHtml(user.fullName)}">
                <span>${escapeHtml(initials)}</span>
                <span class="avatar-indicator" title="Active Record"></span>
              </div>
              <div class="user-title-wrap">
                <h2>${escapeHtml(user.fullName)}</h2>
                <div class="user-subtitle">
                  <span class="pill-badge pill-purple">
                    <span>${genderIcon}</span> ${escapeHtml(user.gender)}
                  </span>
                  <span class="pill-badge pill-cyan">
                    ID: ${escapeHtml(user.id || 'N/A')}
                  </span>
                </div>
              </div>
            </div>

            <div style="color: var(--text-dim); font-size: 0.85rem; text-align: right;">
              <div>Captured On</div>
              <strong style="color: var(--text-muted);">${escapeHtml(user.submittedAt || 'Recent')}</strong>
            </div>
          </div>

          <!-- Captured Information Grid -->
          <div class="details-grid">
            
            <!-- 1. Full Name -->
            <div class="info-item">
              <div class="info-item-icon icon-purple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div class="info-content">
                <div class="info-label">Full Name</div>
                <div class="info-val">${escapeHtml(user.fullName)}</div>
              </div>
            </div>

            <!-- 2. Gender -->
            <div class="info-item">
              <div class="info-item-icon icon-pink">
                <span style="font-size: 1.2rem;">${genderIcon}</span>
              </div>
              <div class="info-content">
                <div class="info-label">Gender</div>
                <div class="info-val">${escapeHtml(user.gender)}</div>
              </div>
            </div>

            <!-- 3. Mobile Number -->
            <div class="info-item">
              <div class="info-item-icon icon-emerald">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div class="info-content">
                <div class="info-label">Mobile Number</div>
                <div class="info-val">
                  <a href="${telLink}" title="Call">${escapeHtml(fullMobile)}</a>
                </div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="copyText('${escapeHtml(fullMobile)}', 'Mobile number copied!')" title="Copy Mobile">
                Copy
              </button>
            </div>

            <!-- 4. Email ID -->
            <div class="info-item">
              <div class="info-item-icon icon-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div class="info-content">
                <div class="info-label">Mail ID</div>
                <div class="info-val">
                  <a href="mailto:${escapeHtml(user.email)}" title="Send email">${escapeHtml(user.email)}</a>
                </div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="copyText('${escapeHtml(user.email)}', 'Email copied!')" title="Copy Email">
                Copy
              </button>
            </div>

            <!-- 5. City -->
            <div class="info-item">
              <div class="info-item-icon icon-amber">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path></svg>
              </div>
              <div class="info-content">
                <div class="info-label">City</div>
                <div class="info-val">${escapeHtml(user.city)}</div>
              </div>
            </div>

            <!-- 6. State -->
            <div class="info-item">
              <div class="info-item-icon icon-cyan">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line></svg>
              </div>
              <div class="info-content">
                <div class="info-label">State</div>
                <div class="info-val">${escapeHtml(user.state)}</div>
              </div>
            </div>

            <!-- 7. Country -->
            <div class="info-item">
              <div class="info-item-icon icon-purple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </div>
              <div class="info-content">
                <div class="info-label">Country</div>
                <div class="info-val">${escapeHtml(user.country)}</div>
              </div>
            </div>

            <!-- Full Address Summary -->
            <div class="info-item">
              <div class="info-item-icon icon-emerald">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div class="info-content">
                <div class="info-label">Formatted Address</div>
                <div class="info-val" style="font-size: 0.95rem;">
                  ${escapeHtml(user.city)}, ${escapeHtml(user.state)}, ${escapeHtml(user.country)}
                </div>
              </div>
            </div>

          </div>

          <!-- Profile Actions -->
          <div class="profile-actions">
            <a href="index.html?edit=true" class="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit Information
            </a>

            <button type="button" class="btn btn-secondary" onclick="window.print()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Print / Save PDF
            </button>

            <button type="button" class="btn btn-secondary" id="btnCopyJson">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copy JSON
            </button>

            <a href="index.html" class="btn btn-primary" style="margin-left: auto;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Register Another
            </a>
          </div>

        </div>
      </article>
    `;

    // Attach listener for copy json
    document.getElementById('btnCopyJson').addEventListener('click', () => {
      const jsonStr = JSON.stringify(user, null, 2);
      navigator.clipboard.writeText(jsonStr).then(() => {
        showToast('Profile data copied to clipboard as JSON!', 'success');
      }).catch(() => {
        showToast('Unable to copy to clipboard.', 'error');
      });
    });
  }

  /**
   * Render Empty State if no submission data found
   */
  function renderEmptyState() {
    profileContainer.innerHTML = `
      <section class="glass-card empty-state">
        <div class="empty-icon">📋</div>
        <h3>No Profile Data Found</h3>
        <p>No user information was detected from URL parameters or storage. Please fill out the registration form first.</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="index.html" class="btn btn-primary">
            Go to Registration Form
          </a>
          <button id="btnLoadDemo" class="btn btn-secondary">
            Load Demo Profile
          </button>
        </div>
      </section>
    `;

    document.getElementById('btnLoadDemo').addEventListener('click', () => {
      const demoUser = {
        id: 'USR-DEMO77',
        fullName: 'Aarav Singhania',
        gender: 'Male',
        countryCode: '+91',
        mobile: '98200 88990',
        fullMobile: '+91 98200 88990',
        email: 'aarav.singhania@example.in',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        submittedAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
      };
      renderProfile(demoUser);
      showToast('Demo profile loaded!', 'info');
    });
  }

  /**
   * Render History Table if submissions exist
   */
  function renderHistory() {
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('userSubmissionsHistory')) || [];
    } catch (e) {
      history = [];
    }

    if (history.length > 0) {
      historySection.style.display = 'block';
      historyTableBody.innerHTML = history.map((item, index) => `
        <tr>
          <td><strong>${escapeHtml(item.fullName)}</strong></td>
          <td>${escapeHtml(item.gender)}</td>
          <td>${escapeHtml(item.fullMobile || item.mobile)}</td>
          <td><a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a></td>
          <td>${escapeHtml(item.city)}, ${escapeHtml(item.country)}</td>
          <td style="color: var(--text-dim); font-size: 0.8rem;">${escapeHtml(item.submittedAt || '')}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="viewHistoryItem(${index})">
              View
            </button>
          </td>
        </tr>
      `).join('');
    } else {
      historySection.style.display = 'none';
    }
  }

  // Clear history handler
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all saved submissions?')) {
        localStorage.removeItem('userSubmissionsHistory');
        renderHistory();
        showToast('History cleared.', 'info');
      }
    });
  }

  // Global helper for viewing a specific history item
  window.viewHistoryItem = (index) => {
    try {
      const history = JSON.parse(localStorage.getItem('userSubmissionsHistory')) || [];
      if (history[index]) {
        renderProfile(history[index]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast(`Displaying record for ${history[index].fullName}`, 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Global helper for copying text
  window.copyText = (text, message) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message || 'Copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy to clipboard', 'error');
    });
  };

  /**
   * Toast helper
   */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Initial initialization
  const currentUser = getUserData();
  renderProfile(currentUser);
  renderHistory();
});
