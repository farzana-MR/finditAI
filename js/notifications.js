/**
 * FindIt AI - Notification System Logic (notifications.js)
 * Displays in-app notifications, unread badges, mark-as-read, filter tabs
 */

document.addEventListener('DOMContentLoaded', () => {
  renderNotificationsPage();
  renderDropdownNotifications();
});

function renderNotificationsPage() {
  const container = document.getElementById('notifications-full-list');
  const markAllBtn = document.getElementById('mark-all-read-btn');
  const tabs = document.querySelectorAll('.notif-filter-tab');

  if (!container) return; // Not on notifications page

  let currentFilter = 'all';

  function displayList() {
    const state = getState();
    let list = state.notifications || [];

    if (currentFilter !== 'all') {
      list = list.filter(n => n.type === currentFilter);
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-table-state">
          <div class="empty-state-icon">🔔</div>
          <h3>No notifications here</h3>
          <p>You're all caught up! New matches, claim status updates, and rewards will appear here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => `
      <div class="card ${item.isRead ? '' : 'card-hoverable'}" style="margin-bottom: 0.85rem; ${item.isRead ? 'opacity: 0.85;' : 'border-left: 4px solid var(--primary); background: #fdfdfd;'}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem;">
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom: 0.35rem;">
              <strong style="color:var(--text-main); font-size:1rem;">${item.title}</strong>
              ${!item.isRead ? '<span class="badge badge-primary" style="font-size:0.65rem;">NEW</span>' : ''}
            </div>
            <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom: 0.5rem;">${item.message}</p>
            <div style="display:flex; align-items:center; gap:1rem; font-size:0.8rem; color:var(--text-subtle);">
              <span>🕒 ${item.timestamp}</span>
              ${item.link ? `<a href="${item.link}" style="font-weight:600; color:var(--primary);">View Details →</a>` : ''}
            </div>
          </div>
          <div style="display:flex; gap:0.5rem;">
            ${!item.isRead ? `
              <button onclick="markNotificationRead('${item.id}')" class="btn btn-sm btn-secondary" title="Mark as Read">
                ✓
              </button>
            ` : ''}
            <button onclick="deleteNotification('${item.id}')" class="btn btn-sm btn-secondary" title="Delete" style="color:var(--danger);">
              ✕
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Filter tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter') || 'all';
      displayList();
    });
  });

  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      const state = getState();
      state.notifications.forEach(n => n.isRead = true);
      saveState(state);
      displayList();
      initGlobalHeaderWidgets();
      showToast('All notifications marked as read', 'info');
    });
  }

  window.markNotificationRead = function(id) {
    const state = getState();
    const item = state.notifications.find(n => n.id === id);
    if (item) {
      item.isRead = true;
      saveState(state);
      displayList();
      initGlobalHeaderWidgets();
    }
  };

  window.deleteNotification = function(id) {
    const state = getState();
    state.notifications = state.notifications.filter(n => n.id !== id);
    saveState(state);
    displayList();
    initGlobalHeaderWidgets();
    showToast('Notification removed', 'info');
  };

  displayList();
}

function renderDropdownNotifications() {
  const dropdownList = document.getElementById('dropdown-notifications-list');
  if (!dropdownList) return;

  const state = getState();
  const list = state.notifications || [];

  if (list.length === 0) {
    dropdownList.innerHTML = '<div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">No recent notifications</div>';
    return;
  }

  dropdownList.innerHTML = list.slice(0, 4).map(item => `
    <div class="dropdown-notif-item ${item.isRead ? '' : 'unread'}">
      <div style="font-size:1.1rem; line-height:1;">
        ${item.type === 'match' ? '🎯' : item.type === 'reward' ? '⭐' : item.type === 'claim' ? '📋' : '🔔'}
      </div>
      <div style="flex:1;">
        <div style="font-weight:600; font-size:0.85rem; color:var(--text-main); margin-bottom:0.15rem;">
          ${item.title}
        </div>
        <p style="font-size:0.775rem; color:var(--text-muted); margin-bottom:0.25rem; line-height:1.3;">
          ${item.message}
        </p>
        <span style="font-size:0.7rem; color:var(--text-subtle);">${item.timestamp}</span>
      </div>
    </div>
  `).join('');
}
