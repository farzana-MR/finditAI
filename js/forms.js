/**
 * FindIt AI - Forms, Real-Time Studio Preview & AI Processing Simulation (forms.js)
 * Implements interactive category selection, color swatches, drag-and-drop upload,
 * live preview synchronization, dynamic AI readiness scoring, and futuristic neural scan modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  initImageDropzone();
  initReportLostStudio();
  initReportFoundForm();
  initClaimItemForm();
});

let currentUploadedImageBase64 = null;
let currentUploadedFileName = 'item-photo.jpg';
let currentUploadedFileSize = '1.2 MB';

// ================= Image Dropzone & Preview Studio =================
function initImageDropzone() {
  const dropzone = document.getElementById('image-dropzone');
  const fileInput = document.getElementById('item-image-input');
  const previewCard = document.getElementById('dropzone-preview-card');
  const previewImg = document.getElementById('image-preview-img');
  const removeBtn = document.getElementById('remove-image-btn');
  const fileNameEl = document.getElementById('dropzone-file-name');
  const fileSizeEl = document.getElementById('dropzone-file-size');

  // Live preview mockup elements
  const liveImg = document.getElementById('live-preview-img');
  const livePlaceholder = document.getElementById('live-preview-placeholder');

  if (!dropzone || !fileInput) return;

  // Drag over styling
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-over');
    });
  });

  // Handle dropped file
  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      handleImageFile(files[0]);
    }
  });

  // Handle manual file browse
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageFile(e.target.files[0]);
    }
  });

  // Remove preview
  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentUploadedImageBase64 = null;
      fileInput.value = '';
      if (previewCard) previewCard.classList.remove('active');
      dropzone.style.display = 'block';

      // Reset Live Preview
      if (liveImg) {
        liveImg.src = '';
        liveImg.style.display = 'none';
      }
      if (livePlaceholder) {
        livePlaceholder.style.display = 'flex';
      }

      updateAIReadinessScore();
      if (typeof showToast === 'function') {
        showToast('Photo removed.', 'info');
      }
    });
  }

  function handleImageFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      if (typeof showToast === 'function') {
        showToast('Please upload a valid image file (JPG, PNG, or WEBP).', 'danger');
      }
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      if (typeof showToast === 'function') {
        showToast('Image size exceeds 5MB limit. Please upload a smaller photo.', 'danger');
      }
      return;
    }

    currentUploadedFileName = file.name;
    currentUploadedFileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    const reader = new FileReader();
    reader.onload = (event) => {
      currentUploadedImageBase64 = event.target.result;
      
      // Update dropzone preview card
      if (previewImg) previewImg.src = currentUploadedImageBase64;
      if (fileNameEl) fileNameEl.textContent = currentUploadedFileName;
      if (fileSizeEl) fileSizeEl.textContent = currentUploadedFileSize;
      if (previewCard) previewCard.classList.add('active');
      dropzone.style.display = 'none';

      // Update Live Preview Mockup
      if (liveImg) {
        liveImg.src = currentUploadedImageBase64;
        liveImg.style.display = 'block';
      }
      if (livePlaceholder) {
        livePlaceholder.style.display = 'none';
      }

      updateAIReadinessScore();

      if (typeof showToast === 'function') {
        showToast('Photo ingested! CLIP ViT-B/32 ready.', 'success');
      }
    };
    reader.readAsDataURL(file);
  }
}

// ================= Report Lost Item Studio & Live Sync =================
function initReportLostStudio() {
  const form = document.getElementById('report-lost-form');
  if (!form) return;

  // Set today's date default
  const dateInput = document.getElementById('lost-date');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Bind Category Grid Picker
  const categoryTiles = document.querySelectorAll('#category-picker-grid .category-tile');
  const hiddenSelect = document.getElementById('lost-category');
  const liveCatTag = document.getElementById('live-preview-cat-text');

  categoryTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      categoryTiles.forEach(t => t.classList.remove('active'));
      tile.classList.add('active');
      const catVal = tile.getAttribute('data-category');
      if (hiddenSelect) hiddenSelect.value = catVal;
      if (liveCatTag) liveCatTag.textContent = catVal.toUpperCase();
      updateAIReadinessScore();
    });
  });

  // Bind Color Swatches
  const colorChips = document.querySelectorAll('#color-swatches-wrap .color-swatch-chip');
  const colorInput = document.getElementById('lost-color');
  const liveColorDot = document.getElementById('live-preview-swatch-dot');
  const liveColorText = document.getElementById('live-preview-color-text');

  const colorHexMap = {
    'White': '#ffffff',
    'Black': '#0f172a',
    'Gray': '#64748b',
    'Brown': '#854d0e',
    'Blue': '#2563eb',
    'Red': '#dc2626',
    'Green': '#059669',
    'Gold': '#d97706'
  };

  colorChips.forEach(chip => {
    chip.addEventListener('click', () => {
      colorChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const colorVal = chip.getAttribute('data-color');
      if (colorInput) {
        colorInput.value = colorVal;
        colorInput.dispatchEvent(new Event('input'));
      }
      if (liveColorDot) {
        liveColorDot.style.background = colorHexMap[colorVal] || '#059669';
      }
      if (liveColorText) {
        liveColorText.textContent = colorVal;
      }
      updateAIReadinessScore();
    });
  });

  // Live Sync Inputs with Preview
  const nameInput = document.getElementById('lost-name');
  const liveTitle = document.getElementById('live-preview-title');
  if (nameInput && liveTitle) {
    nameInput.addEventListener('input', (e) => {
      liveTitle.textContent = e.target.value.trim() || 'Apple AirPods Pro 2 in MagSafe Case';
      updateAIReadinessScore();
    });
  }

  const descInput = document.getElementById('lost-description');
  const liveDesc = document.getElementById('live-preview-desc');
  const charCountEl = document.getElementById('char-count-text');
  const charCounterBar = document.getElementById('char-counter-bar');

  if (descInput) {
    descInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      const count = e.target.value.length;
      if (liveDesc) {
        liveDesc.textContent = val || 'Provide a detailed description of your item to help the community and AI identify it...';
      }
      if (charCountEl) {
        charCountEl.textContent = `${count} character${count === 1 ? '' : 's'}`;
      }
      if (charCounterBar) {
        if (count >= 40) {
          charCounterBar.classList.add('valid');
        } else {
          charCounterBar.classList.remove('valid');
        }
      }
      updateAIReadinessScore();
    });
  }

  const locInput = document.getElementById('lost-location');
  const liveLoc = document.getElementById('live-preview-location');
  if (locInput && liveLoc) {
    locInput.addEventListener('input', (e) => {
      liveLoc.textContent = e.target.value.trim() || 'Central University Library - 2nd Fl';
      updateAIReadinessScore();
    });
  }

  if (dateInput) {
    const liveDate = document.getElementById('live-preview-date');
    dateInput.addEventListener('change', (e) => {
      if (liveDate && typeof formatDate === 'function') {
        liveDate.textContent = formatDate(e.target.value);
      }
    });
  }

  // Initial calculation
  updateAIReadinessScore();

  // ================= Form Submission with Futuristic Modal =================
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('lost-name').value.trim();
    const category = document.getElementById('lost-category').value;
    const color = document.getElementById('lost-color').value.trim();
    const location = document.getElementById('lost-location').value.trim();
    const date = document.getElementById('lost-date').value;
    const time = document.getElementById('lost-time')?.value || '14:30';
    const description = document.getElementById('lost-description').value.trim();
    const additionalDetails = document.getElementById('lost-details')?.value.trim() || '';

    if (!name || !category || !color || !location || !date || !description) {
      if (typeof showToast === 'function') {
        showToast('Please fill out all required fields marked with *.', 'danger');
      }
      return;
    }

    const photo = currentUploadedImageBase64 || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';

    // Launch Neural Scan Modal Experience
    const modal = document.getElementById('neural-scan-modal');
    const scanningContent = document.getElementById('neural-scanning-content');
    const successContent = document.getElementById('neural-success-content');
    const headline = document.getElementById('neural-match-headline');

    if (modal) {
      modal.classList.add('active');
    }

    // Step-by-step radar terminal animation
    const step1 = document.getElementById('log-step-1');
    const step2 = document.getElementById('log-step-2');
    const step3 = document.getElementById('log-step-3');
    const step4 = document.getElementById('log-step-4');

    setTimeout(() => {
      if (step1) { step1.classList.remove('active'); step1.classList.add('done'); }
      if (step2) step2.classList.add('active');
    }, 450);

    setTimeout(() => {
      if (step2) { step2.classList.remove('active'); step2.classList.add('done'); }
      if (step3) step3.classList.add('active');
    }, 900);

    setTimeout(() => {
      if (step3) { step3.classList.remove('active'); step3.classList.add('done'); }
      if (step4) step4.classList.add('active');
    }, 1350);

    setTimeout(() => {
      // Process and save to State
      const state = typeof getState === 'function' ? getState() : { lostItems: [], foundItems: [], aiMatches: [], notifications: [] };
      const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : { id: 'USR-101', name: 'Alex Morgan' };

      const newLostItem = {
        id: typeof generateId === 'function' ? generateId('LST') : 'LST-' + Math.floor(100 + Math.random() * 900),
        userId: currentUser.id,
        userName: currentUser.name,
        name,
        category,
        description,
        color,
        location,
        date,
        time,
        additionalDetails,
        image: photo,
        status: 'Active',
        reportedAt: new Date().toISOString()
      };

      state.lostItems.unshift(newLostItem);

      // Perform AI Matching
      let matchCount = 0;
      if (state.foundItems && state.foundItems.length > 0) {
        state.foundItems.forEach(found => {
          const scores = typeof calculateAIMatchScores === 'function' 
            ? calculateAIMatchScores(newLostItem, found)
            : { similarityScore: 88, matchGrade: 'Grade A', clipVisualScore: 91, nlpSemanticScore: 85, locationScore: 90, dateScore: 85, aiModel: 'CLIP ViT-B/32 + BERT' };

          if (scores.similarityScore >= 60) {
            matchCount++;
            state.aiMatches.unshift({
              id: typeof generateId === 'function' ? generateId('MCH') : 'MCH-' + Math.floor(100 + Math.random() * 900),
              lostItemId: newLostItem.id,
              foundItemId: found.id,
              similarityScore: scores.similarityScore,
              matchGrade: scores.matchGrade,
              clipVisualScore: scores.clipVisualScore,
              nlpSemanticScore: scores.nlpSemanticScore,
              locationScore: scores.locationScore,
              dateScore: scores.dateScore,
              aiModel: scores.aiModel,
              explanation: `Multimodal neural network matched visual embeddings and keyword semantics with found item "${found.name}".`,
              createdAt: new Date().toISOString(),
              status: 'Pending Verification'
            });
          }
        });
      }

      // Add Notification
      if (matchCount > 0) {
        state.notifications.unshift({
          id: typeof generateId === 'function' ? generateId('NTF') : 'NTF-' + Math.floor(100 + Math.random() * 900),
          userId: currentUser.id,
          type: 'match',
          title: `🎯 ${matchCount} Possible AI Match${matchCount > 1 ? 'es' : ''} Found!`,
          message: `Our neural models identified ${matchCount} found item report(s) resembling your lost "${name}".`,
          link: 'matches.html',
          isRead: false,
          timestamp: 'Just now'
        });
      }

      if (typeof saveState === 'function') {
        saveState(state);
      }

      // Switch Modal to Success State
      if (scanningContent) scanningContent.style.display = 'none';
      if (successContent) {
        successContent.style.display = 'block';
        if (headline) {
          headline.textContent = matchCount > 0 
            ? `${matchCount} High-Confidence Match${matchCount > 1 ? 'es' : ''} Found!`
            : 'Belonging Registered & AI Monitoring Active';
        }
      }

      // Smooth redirect
      setTimeout(() => {
        window.location.href = matchCount > 0 ? 'matches.html' : 'my-lost-items.html';
      }, 1600);

    }, 1800);
  });
}

// Dynamic AI Match Readiness Diagnostic Calculator
function updateAIReadinessScore() {
  const nameVal = document.getElementById('lost-name')?.value.trim() || '';
  const descVal = document.getElementById('lost-description')?.value.trim() || '';
  const locVal = document.getElementById('lost-location')?.value.trim() || '';
  const colorVal = document.getElementById('lost-color')?.value.trim() || '';
  const hasPhoto = !!currentUploadedImageBase64;

  let score = 0;

  // Identity: +20%
  const checkIdentity = document.getElementById('check-identity');
  if (nameVal.length >= 3) {
    score += 20;
    if (checkIdentity) checkIdentity.classList.add('completed');
  } else {
    if (checkIdentity) checkIdentity.classList.remove('completed');
  }

  // Photo: +30%
  const checkPhoto = document.getElementById('check-photo');
  if (hasPhoto) {
    score += 30;
    if (checkPhoto) checkPhoto.classList.add('completed');
  } else {
    if (checkPhoto) checkPhoto.classList.remove('completed');
  }

  // Color: +15%
  const checkColor = document.getElementById('check-color');
  if (colorVal.length >= 2) {
    score += 15;
    if (checkColor) checkColor.classList.add('completed');
  } else {
    if (checkColor) checkColor.classList.remove('completed');
  }

  // Location: +15%
  const checkLoc = document.getElementById('check-location');
  if (locVal.length >= 4) {
    score += 15;
    if (checkLoc) checkLoc.classList.add('completed');
  } else {
    if (checkLoc) checkLoc.classList.remove('completed');
  }

  // Description: +20%
  const checkDesc = document.getElementById('check-description');
  if (descVal.length >= 20) {
    score += 20;
    if (checkDesc) checkDesc.classList.add('completed');
  } else {
    if (checkDesc) checkDesc.classList.remove('completed');
  }

  // Clamp score
  score = Math.min(100, Math.max(10, score));

  const percentEl = document.getElementById('ai-readiness-percent');
  const barEl = document.getElementById('ai-readiness-bar');

  if (percentEl) percentEl.textContent = `${score}%`;
  if (barEl) {
    barEl.style.width = `${score}%`;
    if (score >= 80) {
      barEl.style.background = 'linear-gradient(90deg, #10b981 0%, #00e676 100%)';
    } else if (score >= 50) {
      barEl.style.background = 'linear-gradient(90deg, #06b6d4 0%, #10b981 100%)';
    } else {
      barEl.style.background = 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)';
    }
  }
}

// ================= Report Found Item Form =================
function initReportFoundForm() {
  const form = document.getElementById('report-found-form');
  if (!form) return;

  const dateInput = document.getElementById('found-date');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('found-name').value.trim();
    const category = document.getElementById('found-category').value;
    const color = document.getElementById('found-color').value.trim();
    const location = document.getElementById('found-location').value.trim();
    const date = document.getElementById('found-date').value;
    const time = document.getElementById('found-time')?.value || '12:00';
    const custody = document.getElementById('found-custody')?.value.trim() || 'In my personal possession';
    const description = document.getElementById('found-description').value.trim();
    const additionalDetails = document.getElementById('found-details')?.value.trim() || '';

    if (!name || !category || !color || !location || !date || !description) {
      if (typeof showToast === 'function') {
        showToast('Please fill out all required fields.', 'danger');
      }
      return;
    }

    const photo = currentUploadedImageBase64 || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80';

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Ingesting & Running AI Cross-Match...</span>`;
    }

    setTimeout(() => {
      const state = typeof getState === 'function' ? getState() : { lostItems: [], foundItems: [], aiMatches: [], notifications: [] };
      const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : { id: 'USR-101', name: 'Alex Morgan' };

      const newFoundItem = {
        id: typeof generateId === 'function' ? generateId('FND') : 'FND-' + Math.floor(100 + Math.random() * 900),
        userId: currentUser.id,
        userName: currentUser.name,
        name,
        category,
        description,
        color,
        location,
        date,
        time,
        custody,
        additionalDetails,
        image: photo,
        status: 'Active',
        reportedAt: new Date().toISOString()
      };

      state.foundItems.unshift(newFoundItem);

      // Award points
      currentUser.rewardPoints = (currentUser.rewardPoints || 0) + 25;
      state.currentUser = currentUser;

      // Cross match against lost items
      let matchCount = 0;
      if (state.lostItems && state.lostItems.length > 0) {
        state.lostItems.forEach(lost => {
          const scores = typeof calculateAIMatchScores === 'function'
            ? calculateAIMatchScores(lost, newFoundItem)
            : { similarityScore: 85, matchGrade: 'Grade A', clipVisualScore: 89, nlpSemanticScore: 82, locationScore: 85, dateScore: 80, aiModel: 'CLIP ViT-B/32 + BERT' };

          if (scores.similarityScore >= 60) {
            matchCount++;
            state.aiMatches.unshift({
              id: typeof generateId === 'function' ? generateId('MCH') : 'MCH-' + Math.floor(100 + Math.random() * 900),
              lostItemId: lost.id,
              foundItemId: newFoundItem.id,
              similarityScore: scores.similarityScore,
              matchGrade: scores.matchGrade,
              clipVisualScore: scores.clipVisualScore,
              nlpSemanticScore: scores.nlpSemanticScore,
              locationScore: scores.locationScore,
              dateScore: scores.dateScore,
              aiModel: scores.aiModel,
              explanation: `Multimodal AI matched visual embeddings and keyword semantics with lost item "${lost.name}".`,
              createdAt: new Date().toISOString(),
              status: 'Pending Verification'
            });
          }
        });
      }

      state.notifications.unshift({
        id: typeof generateId === 'function' ? generateId('NTF') : 'NTF-' + Math.floor(100 + Math.random() * 900),
        userId: currentUser.id,
        type: 'reward',
        title: '🌟 +25 Finder Points Awarded!',
        message: 'Thank you for reporting a found item and being a helpful community hero!',
        link: 'rewards.html',
        isRead: false,
        timestamp: 'Just now'
      });

      if (typeof saveState === 'function') {
        saveState(state);
      }

      if (typeof showToast === 'function') {
        showToast('Found item reported! Thank you for helping reunite belongings.', 'success');
      }

      setTimeout(() => {
        window.location.href = 'my-found-items.html';
      }, 700);
    }, 1200);
  });
}

// ================= Claim Item Form =================
function initClaimItemForm() {
  const form = document.getElementById('claim-item-form');
  if (!form) return;

  const urlParams = new URLSearchParams(window.location.search);
  const foundItemId = urlParams.get('id');
  const state = typeof getState === 'function' ? getState() : { foundItems: [] };
  const foundItem = state.foundItems ? state.foundItems.find(i => i.id === foundItemId) : null;

  if (foundItem) {
    const itemTitleEl = document.getElementById('claim-target-title');
    const itemLocEl = document.getElementById('claim-target-location');
    const itemDateEl = document.getElementById('claim-target-date');
    const itemImgEl = document.getElementById('claim-target-img');

    if (itemTitleEl) itemTitleEl.textContent = foundItem.name;
    if (itemLocEl) itemLocEl.textContent = `Found at: ${foundItem.location}`;
    if (itemDateEl && typeof formatDate === 'function') itemDateEl.textContent = `Date: ${formatDate(foundItem.date)}`;
    if (itemImgEl) itemImgEl.src = foundItem.image;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ownershipProof = document.getElementById('claim-proof-details').value.trim();
    const verificationAnswers = document.getElementById('claim-verification-answers').value.trim();
    const agreement = document.getElementById('claim-agreement-check').checked;

    if (!ownershipProof || !verificationAnswers) {
      if (typeof showToast === 'function') {
        showToast('Please provide your ownership proof and verification answers.', 'danger');
      }
      return;
    }

    if (!agreement) {
      if (typeof showToast === 'function') {
        showToast('Please accept the ownership declaration and anti-fraud terms.', 'danger');
      }
      return;
    }

    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : { id: 'USR-101', name: 'Alex Morgan', email: 'alex@example.com' };
    const newClaim = {
      id: typeof generateId === 'function' ? generateId('CLM') : 'CLM-' + Math.floor(100 + Math.random() * 900),
      foundItemId: foundItem ? foundItem.id : 'FND-201',
      lostItemId: 'N/A',
      claimantId: currentUser.id,
      claimantName: currentUser.name,
      claimantEmail: currentUser.email,
      finderName: foundItem ? foundItem.userName : 'Community Member',
      itemName: foundItem ? foundItem.name : 'Claimed Belonging',
      ownershipProof,
      verificationAnswers,
      status: 'Under Verification',
      submittedAt: new Date().toISOString(),
      adminNotes: 'Verification submission pending administrator or finder cross-check.'
    };

    state.claims.unshift(newClaim);

    if (foundItem) {
      foundItem.status = 'Claim Pending';
    }

    state.notifications.unshift({
      id: typeof generateId === 'function' ? generateId('NTF') : 'NTF-' + Math.floor(100 + Math.random() * 900),
      userId: currentUser.id,
      type: 'claim',
      title: '📋 Claim Request Submitted',
      message: `Your ownership claim for "${newClaim.itemName}" has been lodged and is under review.`,
      link: 'my-claims.html',
      isRead: false,
      timestamp: 'Just now'
    });

    if (typeof saveState === 'function') {
      saveState(state);
    }
    if (typeof showToast === 'function') {
      showToast('Claim request lodged successfully! Redirecting to My Claims...', 'success');
    }

    setTimeout(() => {
      window.location.href = 'my-claims.html';
    }, 800);
  });
}
