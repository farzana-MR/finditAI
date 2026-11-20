/**
 * FindIt AI - Elegant Search & Multi-Criteria Filter (search.js)
 * Implements real-time filtering with luxury spacing, custom segmented
 * status controls, quick category chips, and SVG iconography.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSearchAndFilter();
});

function initSearchAndFilter() {
  const searchInput = document.getElementById('search-keyword-input');
  const categorySelect = document.getElementById('search-category-select');
  const colorSelect = document.getElementById('search-color-select');
  const locationInput = document.getElementById('search-location-input');
  const clearBtn = document.getElementById('search-clear-filters-btn');
  const resultsGrid = document.getElementById('search-results-grid');
  const countBadge = document.getElementById('search-results-count');

  if (!resultsGrid) return; // Not on search page

  let activeStatus = 'all'; // 'all', 'lost', 'found'
  let activeCategory = 'all';

  // Quick category chips
  const categoryChips = document.querySelectorAll('.category-chip');
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-category') || 'all';
      if (categorySelect) categorySelect.value = activeCategory;
      executeFilter();
    });
  });

  // Segmented status buttons (All / Lost / Found)
  const statusPills = document.querySelectorAll('.status-segment-btn');
  statusPills.forEach(pill => {
    pill.addEventListener('click', () => {
      statusPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeStatus = pill.getAttribute('data-status') || 'all';
      executeFilter();
    });
  });

  function executeFilter() {
    const state = getState();
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const cat = categorySelect ? categorySelect.value : activeCategory;
    const color = colorSelect ? colorSelect.value.toLowerCase() : 'all';
    const location = (locationInput ? locationInput.value : '').toLowerCase().trim();

    // Sync active category if changed via dropdown
    if (categorySelect && cat !== activeCategory) {
      activeCategory = cat;
      categoryChips.forEach(c => {
        if (c.getAttribute('data-category') === cat) c.classList.add('active');
        else c.classList.remove('active');
      });
    }

    // Combine lost and found items
    let allItems = [
      ...(state.lostItems || []).map(i => ({ ...i, itemType: 'lost' })),
      ...(state.foundItems || []).map(i => ({ ...i, itemType: 'found' }))
    ];

    const filtered = allItems.filter(item => {
      // Keyword search in name or description
      if (query) {
        const textBlob = `${item.name} ${item.description || ''} ${item.additionalDetails || ''}`.toLowerCase();
        if (!textBlob.includes(query)) return false;
      }

      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Status filter
      if (activeStatus !== 'all' && item.itemType !== activeStatus) {
        return false;
      }

      // Color filter
      if (color !== 'all' && (!item.color || item.color.toLowerCase() !== color)) {
        return false;
      }

      // Location filter
      if (location && !item.location.toLowerCase().includes(location)) {
        return false;
      }

      return true;
    });

    if (countBadge) {
      countBadge.innerHTML = `<span>⚡</span> <strong>${filtered.length}</strong> item${filtered.length === 1 ? '' : 's'} found`;
    }

    renderItemsGrid(filtered, resultsGrid);
  }

  // Bind input listeners
  [searchInput, locationInput].forEach(el => {
    if (el) el.addEventListener('input', executeFilter);
  });

  [categorySelect, colorSelect].forEach(el => {
    if (el) el.addEventListener('change', executeFilter);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (locationInput) locationInput.value = '';
      if (categorySelect) categorySelect.value = 'all';
      if (colorSelect) colorSelect.value = 'all';
      activeStatus = 'all';
      activeCategory = 'all';

      categoryChips.forEach(c => {
        if (c.getAttribute('data-category') === 'all') c.classList.add('active');
        else c.classList.remove('active');
      });

      statusPills.forEach(p => {
        if (p.getAttribute('data-status') === 'all') p.classList.add('active');
        else p.classList.remove('active');
      });

      executeFilter();
      showToast('Filters reset to default', 'info');
    });
  }

  // Initial load
  executeFilter();
}

function renderItemsGrid(items, container) {
  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-table-state" style="grid-column: 1 / -1; padding: 4.5rem 1.5rem;">
        <div style="width:68px; height:68px; border-radius:50%; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem; font-size:1.75rem;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <h3 style="font-size:1.4rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">No matching belongings found</h3>
        <p style="color:var(--text-muted); max-width:440px; margin:0 auto 1.5rem; font-size:0.95rem;">
          Try adjusting your search query, selecting "All Items", or clearing applied location filters.
        </p>
        <button onclick="document.getElementById('search-clear-filters-btn').click()" class="btn btn-secondary btn-sm">
          Reset Search Filters
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => {
    const isLost = item.itemType === 'lost';
    const statusLabel = isLost ? 'LOST' : 'FOUND';
    const statusColor = isLost ? '#e11d48' : '#059669';
    const dotColor = isLost ? '#f43f5e' : '#10b981';

    // Check if matches exist
    const state = getState();
    const hasMatch = (state.aiMatches || []).some(m => m.lostItemId === item.id || m.foundItemId === item.id);

    return `
      <div class="item-card card-hoverable">
        <!-- Media Container -->
        <div class="item-card-media">
          <img src="${item.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'}" alt="${item.name}" loading="lazy">
          
          <!-- Top Left Status Badge -->
          <div class="item-status-overlay">
            <div class="glass-status-pill">
              <span class="live-dot" style="background:${dotColor}; box-shadow:0 0 8px ${dotColor};"></span>
              <span style="color:${statusColor}; font-weight:700; letter-spacing:0.06em;">${statusLabel}</span>
            </div>
          </div>

          <!-- Top Right AI Match Badge (if any) -->
          ${hasMatch ? `
            <div style="position:absolute; top:0.85rem; right:0.85rem; z-index:2;">
              <span class="glass-status-pill" style="color:var(--primary); font-weight:700; border-color:rgba(16,185,129,0.4);">
                ⚡ AI MATCH
              </span>
            </div>
          ` : ''}

          <!-- Bottom Right Date Pill -->
          <div class="item-date-overlay">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>${formatDate(item.date)}</span>
          </div>
        </div>

        <!-- Body Content -->
        <div class="item-card-body">
          <div class="item-category-tag">
            ${item.category}
          </div>
          
          <h3 class="item-card-title" title="${item.name}">${item.name}</h3>
          
          <p class="item-card-desc">
            ${item.description || 'No additional description provided.'}
          </p>

          <!-- Clean Info Box -->
          <div class="item-meta-box">
            <div class="meta-line">
              <div class="meta-icon-wrapper">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <span class="meta-text" title="${item.location}">${item.location}</span>
            </div>

            <div class="meta-line">
              <div class="meta-icon-wrapper">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>
              </div>
              <span class="meta-text">Colour: <strong>${item.color || 'Unspecified'}</strong></span>
            </div>
          </div>

          <!-- Card Footer with Actions -->
          <div class="item-card-footer">
            <div class="reporter-chip">
              <div class="reporter-avatar">${(item.userName || 'User').substring(0, 2).toUpperCase()}</div>
              <span class="reporter-name">${item.userName || 'Community'}</span>
            </div>

            <div style="display:flex; align-items:center; gap:0.5rem;">
              <a href="item-details.html?id=${item.id}&type=${item.itemType}" class="btn-card-details">
                Details
              </a>
              ${!isLost ? `
                <a href="claim-item.html?id=${item.id}" class="btn-card-claim">
                  Claim
                </a>
              ` : `
                <a href="matches.html" class="btn-card-match">
                  Matches
                </a>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
