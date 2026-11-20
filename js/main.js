/**
 * FindIt AI - Core Application Logic & State Store (main.js)
 * Fully compliant with PRD requirements:
 * Pure HTML5, CSS3, Vanilla JavaScript.
 */

const STORAGE_KEY = 'findit_ai_master_state';

// Initial realistic seed dataset
const INITIAL_SEED_DATA = {
  currentUser: {
    id: 'usr_001',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+91 98765 43210',
    role: 'user',
    organization: 'City Central Tech Hub',
    avatar: 'AM',
    rewardPoints: 350,
    badges: [
      { id: 'b1', name: 'First Finder', icon: 'medal', earnedDate: '2026-10-12', desc: 'Reported and returned your first found item' },
      { id: 'b2', name: 'Helping Hand', icon: 'hand-heart', earnedDate: '2026-11-02', desc: 'Successfully helped reunite 3 belongings' },
      { id: 'b3', name: 'Super Finder', icon: 'shield-check', earnedDate: '2026-11-15', desc: 'Maintained 100% verified claim accuracy' }
    ]
  },
  adminUser: {
    id: 'adm_001',
    name: 'Sarah Jenkins',
    email: 'admin@findit.ai',
    role: 'admin',
    department: 'Campus Security & Operations'
  },
  registeredUsers: [
    { id: 'usr_001', name: 'Alex Morgan', email: 'alex.morgan@example.com', phone: '+91 98765 43210', role: 'user', reportsCount: 4, points: 350, status: 'Active' },
    { id: 'usr_002', name: 'Priya Patel', email: 'priya.patel@campus.edu', phone: '+91 98220 12345', role: 'user', reportsCount: 3, points: 200, status: 'Active' },
    { id: 'usr_003', name: 'Marcus Vance', email: 'marcus.v@tech.io', phone: '+91 97110 54321', role: 'user', reportsCount: 5, points: 420, status: 'Active' },
    { id: 'usr_004', name: 'David Chen', email: 'david.chen@gmail.com', phone: '+91 98450 99887', role: 'user', reportsCount: 2, points: 100, status: 'Active' },
    { id: 'usr_005', name: 'Elena Rostova', email: 'elena.r@design.co', phone: '+91 98334 55667', role: 'user', reportsCount: 1, points: 50, status: 'Active' },
    { id: 'usr_006', name: 'Suspicious Bot99', email: 'bot99@throwaway.net', phone: '+91 90000 00000', role: 'user', reportsCount: 0, points: 0, status: 'Suspended' }
  ],
  lostItems: [
    {
      id: 'LST-101',
      userId: 'usr_001',
      userName: 'Alex Morgan',
      name: 'Apple AirPods Pro 2 in MagSafe Case',
      category: 'Electronics',
      description: 'White wireless earbuds in charging case with a small scratch near the hinge and a green lanyard loop attached.',
      color: 'White',
      location: 'Central University Library - 2nd Floor Silent Study Area',
      date: '2026-11-18',
      time: '14:30',
      additionalDetails: 'Model A2968, engraving on back: "A.M."',
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=80',
      status: 'Active',
      reportedAt: '2026-11-18T15:00:00Z'
    },
    {
      id: 'LST-102',
      userId: 'usr_002',
      userName: 'Priya Patel',
      name: 'Fossil Vintage Brown Leather Wallet',
      category: 'Wallets & Bags',
      description: 'Men bifold brown leather wallet. Contains university student card, metro pass, and some cash notes.',
      color: 'Brown',
      location: 'Tech Hub Cafeteria - Booth 4',
      date: '2026-11-17',
      time: '12:45',
      additionalDetails: 'Fossil embossed logo at bottom corner, slight discoloration on the edge.',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
      status: 'Active',
      reportedAt: '2026-11-17T13:20:00Z'
    },
    {
      id: 'LST-103',
      userId: 'usr_001',
      userName: 'Alex Morgan',
      name: 'Titanium Gray iPhone 15 Pro',
      category: 'Electronics',
      description: 'Natural titanium finish iPhone with a dark matte bumper case. Noticeable hairline crack on the tempered glass screen protector.',
      color: 'Gray',
      location: 'City Metro Station Line 3 - Platform 2',
      date: '2026-11-16',
      time: '09:15',
      additionalDetails: 'Lock screen displays an aurora borealis photograph. Serial ends with 49K.',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      status: 'Matched',
      reportedAt: '2026-11-16T10:00:00Z'
    },
    {
      id: 'LST-104',
      userId: 'usr_004',
      userName: 'David Chen',
      name: 'Blue Hydro Flask 32oz Wide Mouth',
      category: 'Accessories',
      description: 'Cobalt blue insulated stainless steel water bottle covered with outdoor stickers including Yosemite & Patagonia.',
      color: 'Blue',
      location: 'Sports Complex Gym - Weight Room Bench',
      date: '2026-11-19',
      time: '17:00',
      additionalDetails: 'Small dent on bottom rim from a prior drop.',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
      status: 'Active',
      reportedAt: '2026-11-19T18:00:00Z'
    },
    {
      id: 'LST-105',
      userId: 'usr_005',
      userName: 'Elena Rostova',
      name: 'Keychain with Red Car Remote Fob & 3 Keys',
      category: 'Keys',
      description: 'Red silicone fob cover with three brass Yale keys on an aluminum climbing carabiner.',
      color: 'Red',
      location: 'West Campus Parking Lot B',
      date: '2026-11-15',
      time: '18:40',
      additionalDetails: 'One key has green identifier plastic cap.',
      image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
      status: 'Reunited',
      reportedAt: '2026-11-15T19:10:00Z'
    }
  ],
  foundItems: [
    {
      id: 'FND-201',
      userId: 'usr_003',
      userName: 'Marcus Vance',
      name: 'Apple AirPods Wireless Earbuds in White Case',
      category: 'Electronics',
      description: 'Found white AirPods charging case with earphones inside on the reading desk. Has a green cord attached.',
      color: 'White',
      location: 'Central University Library - Reading Hall 2',
      date: '2026-11-18',
      time: '16:00',
      custody: 'Handed to Library Security Counter Room 102',
      additionalDetails: 'Engraved initials visible on rear casing.',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      status: 'Claim Pending',
      reportedAt: '2026-11-18T16:30:00Z'
    },
    {
      id: 'FND-202',
      userId: 'usr_001',
      userName: 'Alex Morgan',
      name: 'Genuine Brown Leather Wallet with Cards',
      category: 'Wallets & Bags',
      description: 'Found a folded brown leather Fossil wallet near cafeteria seating. Identification cards kept safely inside.',
      color: 'Brown',
      location: 'Tech Hub Cafeteria - East Corner',
      date: '2026-11-17',
      time: '13:10',
      custody: 'In my personal possession (Ready for owner verification)',
      additionalDetails: 'Owner first name starts with P on student ID card.',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80',
      status: 'Approved for Handover',
      reportedAt: '2026-11-17T13:45:00Z'
    },
    {
      id: 'FND-203',
      userId: 'usr_002',
      userName: 'Priya Patel',
      name: 'Cobalt Blue Stainless Flask with Stickers',
      category: 'Accessories',
      description: 'Found a 32oz blue metal water bottle left by fitness benches. Has national park stickers all over.',
      color: 'Blue',
      location: 'Sports Complex Gym - Locker Room Entryway',
      date: '2026-11-19',
      time: '18:15',
      custody: 'Deposited at Gym Front Reception',
      additionalDetails: 'Bottom has slight ding.',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
      status: 'Under Review',
      reportedAt: '2026-11-19T18:40:00Z'
    },
    {
      id: 'FND-204',
      userId: 'usr_004',
      userName: 'David Chen',
      name: 'Gray Smartphone in Protective Bumper',
      category: 'Electronics',
      description: 'High-end titanium gray smartphone found on train seat. Screen protector is cracked.',
      color: 'Gray',
      location: 'City Metro Station Line 3 - Lost Property Box',
      date: '2026-11-16',
      time: '11:00',
      custody: 'Metro Station Master Office',
      additionalDetails: 'Battery is low, phone is locked with passcode.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600&auto=format&fit=crop&q=80',
      status: 'Active',
      reportedAt: '2026-11-16T11:30:00Z'
    }
  ],
  aiMatches: [
    {
      id: 'MCH-301',
      lostItemId: 'LST-101',
      foundItemId: 'FND-201',
      similarityScore: 96,
      matchGrade: 'High Match',
      clipVisualScore: 97,
      nlpSemanticScore: 95,
      locationScore: 98,
      dateScore: 94,
      aiModel: 'CLIP-ViT-B/32 + all-MiniLM-L6-v2',
      explanation: 'High visual alignment on white charging case with green lanyard; exact location & same day match at Central Library.',
      createdAt: '2026-11-18T16:35:00Z',
      status: 'Pending Verification'
    },
    {
      id: 'MCH-302',
      lostItemId: 'LST-102',
      foundItemId: 'FND-202',
      similarityScore: 92,
      matchGrade: 'High Match',
      clipVisualScore: 93,
      nlpSemanticScore: 91,
      locationScore: 95,
      dateScore: 96,
      aiModel: 'CLIP-ViT-B/32 + all-MiniLM-L6-v2',
      explanation: 'Brown bifold leather texture matched by Computer Vision; Tech Hub Cafeteria location and card description cross-validated.',
      createdAt: '2026-11-17T13:50:00Z',
      status: 'Claim Approved'
    },
    {
      id: 'MCH-303',
      lostItemId: 'LST-104',
      foundItemId: 'FND-203',
      similarityScore: 88,
      matchGrade: 'High Match',
      clipVisualScore: 89,
      nlpSemanticScore: 86,
      locationScore: 92,
      dateScore: 95,
      aiModel: 'CLIP-ViT-B/32 + all-MiniLM-L6-v2',
      explanation: 'Sticker pattern distribution and cobalt color hue matched; Gym location matches within 1 hour interval.',
      createdAt: '2026-11-19T18:45:00Z',
      status: 'Pending Verification'
    },
    {
      id: 'MCH-304',
      lostItemId: 'LST-103',
      foundItemId: 'FND-204',
      similarityScore: 81,
      matchGrade: 'Possible Match',
      clipVisualScore: 83,
      nlpSemanticScore: 79,
      locationScore: 85,
      dateScore: 88,
      aiModel: 'CLIP-ViT-B/32 + all-MiniLM-L6-v2',
      explanation: 'Titanium gray finish and cracked screen protector detected by visual model; metro line location correlates.',
      createdAt: '2026-11-16T11:35:00Z',
      status: 'Under Verification'
    }
  ],
  claims: [
    {
      id: 'CLM-501',
      foundItemId: 'FND-201',
      lostItemId: 'LST-101',
      claimantId: 'usr_001',
      claimantName: 'Alex Morgan',
      claimantEmail: 'alex.morgan@example.com',
      finderName: 'Marcus Vance',
      itemName: 'Apple AirPods Pro 2 in MagSafe Case',
      ownershipProof: 'Engraving "A.M." on rear; serial number invoice uploaded from Apple Store.',
      verificationAnswers: 'Left earbud has small cosmetic nick; green braided lanyard attached.',
      status: 'Under Verification', // Pending | Under Verification | Approved | Rejected | Returned
      submittedAt: '2026-11-18T17:00:00Z',
      adminNotes: 'Awaiting finder cross-check at Library Security Desk.'
    },
    {
      id: 'CLM-502',
      foundItemId: 'FND-202',
      lostItemId: 'LST-102',
      claimantId: 'usr_002',
      claimantName: 'Priya Patel',
      claimantEmail: 'priya.patel@campus.edu',
      finderName: 'Alex Morgan',
      itemName: 'Genuine Brown Leather Wallet with Cards',
      ownershipProof: 'Student ID card inside matches Priya Patel name & photo.',
      verificationAnswers: 'Metro card balance approx 450; family photo in inner compartment.',
      status: 'Approved',
      submittedAt: '2026-11-17T14:10:00Z',
      adminNotes: 'Ownership fully confirmed by ID match. Handover authorized.'
    },
    {
      id: 'CLM-503',
      foundItemId: 'FND-200',
      lostItemId: 'LST-105',
      claimantId: 'usr_005',
      claimantName: 'Elena Rostova',
      claimantEmail: 'elena.r@design.co',
      finderName: 'David Chen',
      itemName: 'Keychain with Red Car Remote Fob & 3 Keys',
      ownershipProof: 'Vehicle registration paperwork matching key fob code.',
      verificationAnswers: 'Green rubber cap on front door Yale key.',
      status: 'Returned',
      submittedAt: '2026-11-15T20:00:00Z',
      adminNotes: 'Successfully returned! 50 reward points awarded to David Chen.'
    }
  ],
  notifications: [
    {
      id: 'NTF-701',
      userId: 'usr_001',
      type: 'match',
      title: '🎯 High AI Match Discovered!',
      message: 'Found AirPods Pro at Central Library has a 96% similarity match with your lost report.',
      link: '../user/matches.html',
      isRead: false,
      timestamp: '15 mins ago'
    },
    {
      id: 'NTF-702',
      userId: 'usr_001',
      type: 'claim',
      title: '📋 Claim Status: Under Verification',
      message: 'Your claim request for AirPods Pro (CLM-501) is being reviewed by the custody desk.',
      link: '../user/my-claims.html',
      isRead: false,
      timestamp: '2 hours ago'
    },
    {
      id: 'NTF-703',
      userId: 'usr_001',
      type: 'reward',
      title: '🏆 Reward Points Received!',
      message: 'You earned +100 Finder Points for reporting and safeguarding the brown Fossil wallet!',
      link: '../user/rewards.html',
      isRead: true,
      timestamp: 'Yesterday'
    },
    {
      id: 'NTF-704',
      userId: 'usr_001',
      type: 'system',
      title: '🛡️ Safety Reminder',
      message: 'Never share private serial numbers or personal PINs publicly in item descriptions.',
      link: '../about.html',
      isRead: true,
      timestamp: '3 days ago'
    }
  ],
  leaderboard: [
    { rank: 1, name: 'Marcus Vance', points: 420, returnedCount: 5, badge: 'Community Hero', avatar: 'MV' },
    { rank: 2, name: 'Alex Morgan (You)', points: 350, returnedCount: 4, badge: 'Super Finder', avatar: 'AM' },
    { rank: 3, name: 'Priya Patel', points: 200, returnedCount: 3, badge: 'Helping Hand', avatar: 'PP' },
    { rank: 4, name: 'David Chen', points: 100, returnedCount: 2, badge: 'First Finder', avatar: 'DC' },
    { rank: 5, name: 'Elena Rostova', points: 50, returnedCount: 1, badge: 'First Finder', avatar: 'ER' }
  ]
};

// ================= State Management Helpers =================
function getState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveState(INITIAL_SEED_DATA);
    return INITIAL_SEED_DATA;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse state, resetting to initial seed', e);
    saveState(INITIAL_SEED_DATA);
    return INITIAL_SEED_DATA;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCurrentUser() {
  const state = getState();
  const sessionRole = sessionStorage.getItem('findit_session_role');
  if (sessionRole === 'admin') {
    return state.adminUser;
  }
  return state.currentUser;
}

function setCurrentUser(user) {
  const state = getState();
  state.currentUser = user;
  saveState(state);
}

function logout() {
  sessionStorage.removeItem('findit_session_role');
  sessionStorage.removeItem('findit_logged_in');
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    // Determine path back to login
    if (window.location.pathname.includes('/user/') || window.location.pathname.includes('/admin/')) {
      window.location.href = '../login.html';
    } else {
      window.location.href = 'login.html';
    }
  }, 400);
}

// ================= Toast Notification Helper =================
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconName = type === 'success' ? '✓' : type === 'danger' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';
  toast.innerHTML = `<span style="font-weight:700; font-size:1.1rem;">${iconName}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutToast 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ================= ID Generator =================
function generateId(prefix) {
  return `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
}

function formatDate(isoOrDateStr) {
  if (!isoOrDateStr) return 'N/A';
  try {
    const d = new Date(isoOrDateStr);
    if (isNaN(d.getTime())) return isoOrDateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return isoOrDateStr;
  }
}

// ================= Simulated AI Matching Engine (CLIP + NLP) =================
/**
 * Calculates simulated CLIP visual similarity, NLP semantic similarity,
 * location proximity and date proximity to produce a multi-factor score.
 * Fully transparent as requested by the PRD.
 */
function calculateAIMatchScores(lostItem, foundItem) {
  // Category match is mandatory for high match
  const catMatch = (lostItem.category || '').toLowerCase() === (foundItem.category || '').toLowerCase();
  
  // Color match
  const colorMatch = (lostItem.color || '').toLowerCase() === (foundItem.color || '').toLowerCase();

  // Location similarity (token overlap)
  const l1Words = (lostItem.location || '').toLowerCase().split(/\s+/);
  const l2Words = (foundItem.location || '').toLowerCase().split(/\s+/);
  const locCommon = l1Words.filter(w => w.length > 3 && l2Words.includes(w)).length;
  const locationScore = locCommon > 0 ? Math.min(98, 75 + locCommon * 10) : 60;

  // Visual CLIP simulation (based on category + color match + random visual variance)
  let clipVisualScore = 65;
  if (catMatch && colorMatch) {
    clipVisualScore = Math.floor(88 + Math.random() * 10);
  } else if (catMatch) {
    clipVisualScore = Math.floor(75 + Math.random() * 10);
  } else {
    clipVisualScore = Math.floor(45 + Math.random() * 15);
  }

  // NLP Sentence Transformers simulation
  const t1 = (lostItem.name + ' ' + (lostItem.description || '')).toLowerCase();
  const t2 = (foundItem.name + ' ' + (foundItem.description || '')).toLowerCase();
  const tokens1 = t1.split(/\s+/).filter(x => x.length > 3);
  const tokens2 = t2.split(/\s+/).filter(x => x.length > 3);
  const shared = tokens1.filter(t => tokens2.includes(t)).length;
  const nlpSemanticScore = Math.min(97, Math.max(55, 65 + shared * 8));

  // Date proximity
  let dateScore = 85;
  try {
    const d1 = new Date(lostItem.date);
    const d2 = new Date(foundItem.date);
    const diffDays = Math.abs((d1 - d2) / (1000 * 60 * 60 * 24));
    dateScore = diffDays <= 1 ? 96 : diffDays <= 3 ? 90 : diffDays <= 7 ? 80 : 65;
  } catch (e) {
    dateScore = 80;
  }

  // Combined weighted score:
  // Visual (CLIP): 40%
  // Semantic (NLP): 30%
  // Location: 20%
  // Date: 10%
  const totalScore = Math.round(
    (clipVisualScore * 0.40) +
    (nlpSemanticScore * 0.30) +
    (locationScore * 0.20) +
    (dateScore * 0.10)
  );

  let matchGrade = 'Low Match';
  if (totalScore >= 80) {
    matchGrade = 'High Match';
  } else if (totalScore >= 65) {
    matchGrade = 'Possible Match';
  }

  return {
    similarityScore: totalScore,
    matchGrade,
    clipVisualScore,
    nlpSemanticScore,
    locationScore,
    dateScore,
    aiModel: 'CLIP-ViT-B/32 + all-MiniLM-L6-v2'
  };
}

// Global UI initializer (Notification Bell Dropdown & User Pill)
document.addEventListener('DOMContentLoaded', () => {
  initGlobalHeaderWidgets();
  initMobileSidebarToggle();
});

function initGlobalHeaderWidgets() {
  const bellBtn = document.getElementById('notification-bell-btn');
  const dropdown = document.getElementById('notification-dropdown');
  const unreadCountBadge = document.getElementById('unread-notif-count');

  if (bellBtn && dropdown) {
    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  }

  // Update notification counts in real-time
  const state = getState();
  const unreads = (state.notifications || []).filter(n => !n.isRead).length;
  if (unreadCountBadge) {
    unreadCountBadge.textContent = unreads;
    unreadCountBadge.style.display = unreads > 0 ? 'flex' : 'none';
  }
}

function initMobileSidebarToggle() {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.querySelector('.sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }
}
