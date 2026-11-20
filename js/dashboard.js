/**
 * FindIt AI - User & Admin Dashboard Logic (dashboard.js)
 * Updates real-time metrics, activity stream, match previews
 */

document.addEventListener('DOMContentLoaded', () => {
  renderUserDashboardStats();
  renderAdminDashboardStats();
  renderRecentActivityTimeline();
});

function renderUserDashboardStats() {
  const lostCountEl = document.getElementById('stat-total-lost');
  const foundCountEl = document.getElementById('stat-total-found');
  const matchCountEl = document.getElementById('stat-ai-matches');
  const claimCountEl = document.getElementById('stat-pending-claims');
  const pointsEl = document.getElementById('stat-reward-points');
  const greetingEl = document.getElementById('user-greeting-name');

  if (!lostCountEl && !foundCountEl) return; // Not on user dashboard

  const state = getState();
  const user = getCurrentUser();

  if (greetingEl) {
    greetingEl.textContent = user.name || 'User';
  }

  // Count items associated with current user or overall
  const userLost = (state.lostItems || []).filter(item => item.userId === user.id);
  const userFound = (state.foundItems || []).filter(item => item.userId === user.id);
  const userClaims = (state.claims || []).filter(c => c.claimantId === user.id && (c.status === 'Pending' || c.status === 'Under Verification'));
  
  // Find matches relevant to user's lost reports
  const userLostIds = userLost.map(l => l.id);
  const userMatches = (state.aiMatches || []).filter(m => userLostIds.includes(m.lostItemId));

  if (lostCountEl) lostCountEl.textContent = userLost.length;
  if (foundCountEl) foundCountEl.textContent = userFound.length;
  if (matchCountEl) matchCountEl.textContent = userMatches.length;
  if (claimCountEl) claimCountEl.textContent = userClaims.length;
  if (pointsEl) pointsEl.textContent = `${user.rewardPoints || 0} pts`;

  // Render recent matches preview widget if element exists
  const matchesTeaserList = document.getElementById('dashboard-matches-teaser');
  if (matchesTeaserList) {
    if (userMatches.length === 0) {
      matchesTeaserList.innerHTML = `
        <div class="empty-table-state">
          <div class="empty-state-icon">🤖</div>
          <p>No new AI matches yet. Our Computer Vision & NLP models are continuously scanning incoming reports.</p>
        </div>
      `;
    } else {
      matchesTeaserList.innerHTML = userMatches.slice(0, 2).map(m => {
        const lost = state.lostItems.find(i => i.id === m.lostItemId) || {};
        const found = state.foundItems.find(i => i.id === m.foundItemId) || {};
        return `
          <div class="card card-hoverable" style="margin-bottom: 1rem; border-left: 4px solid var(--accent-neon);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.75rem;">
              <span class="badge ${m.similarityScore >= 80 ? 'badge-match-high' : 'badge-match-possible'}">
                AI Score: ${m.similarityScore}% (${m.matchGrade})
              </span>
              <span style="font-size:0.8rem; color:var(--text-muted);">${formatDate(m.createdAt)}</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-bottom: 1rem;">
              <div>
                <small style="color:var(--text-subtle); display:block;">Your Lost Item</small>
                <strong>${lost.name || 'Item'}</strong>
                <p style="font-size:0.8rem; margin:0;">📍 ${lost.location || ''}</p>
              </div>
              <div>
                <small style="color:var(--text-subtle); display:block;">Found Item Report</small>
                <strong>${found.name || 'Item'}</strong>
                <p style="font-size:0.8rem; margin:0;">📍 ${found.location || ''}</p>
              </div>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
              <a href="matches.html" class="btn btn-sm btn-outline">View Comparison</a>
              <a href="claim-item.html?id=${found.id}" class="btn btn-sm btn-primary">Claim This Item</a>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function renderAdminDashboardStats() {
  const totalUsersEl = document.getElementById('admin-stat-users');
  const totalLostEl = document.getElementById('admin-stat-lost');
  const totalFoundEl = document.getElementById('admin-stat-found');
  const totalMatchesEl = document.getElementById('admin-stat-matches');
  const pendingClaimsEl = document.getElementById('admin-stat-pending-claims');
  const reunitedCountEl = document.getElementById('admin-stat-reunited');

  if (!totalUsersEl) return; // Not on admin dashboard

  const state = getState();
  if (totalUsersEl) totalUsersEl.textContent = (state.registeredUsers || []).length;
  if (totalLostEl) totalLostEl.textContent = (state.lostItems || []).length;
  if (totalFoundEl) totalFoundEl.textContent = (state.foundItems || []).length;
  if (totalMatchesEl) totalMatchesEl.textContent = (state.aiMatches || []).length;
  
  const pending = (state.claims || []).filter(c => c.status === 'Pending' || c.status === 'Under Verification').length;
  if (pendingClaimsEl) pendingClaimsEl.textContent = pending;

  const returned = (state.claims || []).filter(c => c.status === 'Returned').length;
  if (reunitedCountEl) reunitedCountEl.textContent = returned;
}

function renderRecentActivityTimeline() {
  const container = document.getElementById('recent-activity-timeline');
  if (!container) return;

  const state = getState();
  const activities = [
    { title: 'AI Match Calculated', text: 'CLIP engine generated 96% match for AirPods Pro 2 at Library Desk.', time: '18 mins ago' },
    { title: 'Claim Under Review', text: 'Alex Morgan submitted ownership verification for Claim #CLM-501.', time: '1 hour ago' },
    { title: 'New Found Item Reported', text: 'Cobalt Blue Stainless Flask reported by Priya Patel at Sports Complex Gym.', time: '3 hours ago' },
    { title: 'Item Reunited & Points Awarded', text: 'Car Remote Fob was safely returned to Elena Rostova. +50 pts rewarded!', time: 'Yesterday' }
  ];

  container.innerHTML = activities.map(act => `
    <div class="timeline-entry">
      <div class="timeline-dot"></div>
      <div class="timeline-entry-content">
        <div class="timeline-entry-time">${act.time}</div>
        <strong style="color:var(--text-main); font-size:0.925rem;">${act.title}</strong>
        <p style="font-size:0.85rem; margin-top:0.25rem;">${act.text}</p>
      </div>
    </div>
  `).join('');
}
