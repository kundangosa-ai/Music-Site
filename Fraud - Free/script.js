// Initial Mock Community Alerts Database
let communityAlerts = [
    {
        id: 1,
        category: "Mobile Money Scam",
        target: "+260 971 234567",
        description: "Caller claims to be network support asking for your PIN code reversal code to unblock your account.",
        date: "2026-09-28"
    },
    {
        id: 2,
        category: "Phishing Link",
        target: "secure-bank-login-verify.com",
        description: "Fake banking portal sent via SMS claiming your account is suspended and requesting credentials.",
        date: "2026-09-27"
    },
    {
        id: 3,
        category: "Fake Job Offer",
        target: "recruitment@global-jobs-tz.net",
        description: "Asking applicants to pay a 'processing fee' or 'medical clearance fee' before interview scheduling.",
        date: "2026-09-25"
    }
];

// DOM Elements
const analyzerInput = document.getElementById('analyzerInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearAnalyzerBtn = document.getElementById('clearAnalyzerBtn');
const analyzerResult = document.getElementById('analyzerResult');
const riskBadge = document.getElementById('riskBadge');
const threatScore = document.getElementById('threatScore');
const resultSummary = document.getElementById('resultSummary');
const indicatorList = document.getElementById('indicatorList');

const fraudReportForm = document.getElementById('fraudReportForm');
const alertsContainer = document.getElementById('alertsContainer');
const searchAlerts = document.getElementById('searchAlerts');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderAlerts(communityAlerts);
    setupEventListeners();
});

function setupEventListeners() {
    // Analyzer trigger
    analyzeBtn.addEventListener('click', performFraudAnalysis);
    
    // Clear analyzer
    clearAnalyzerBtn.addEventListener('click', () => {
        analyzerInput.value = '';
        analyzerResult.classList.add('hidden');
    });

    // Report form submission
    fraudReportForm.addEventListener('submit', handleNewReport);

    // Search / filter community alerts
    searchAlerts.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = communityAlerts.filter(alert => 
            alert.target.toLowerCase().includes(term) ||
            alert.category.toLowerCase().includes(term) ||
            alert.description.toLowerCase().includes(term)
        );
        renderAlerts(filtered);
    });
}

// 1. Heuristic Fraud Analysis Logic
function performFraudAnalysis() {
    const text = analyzerInput.value.trim().toLowerCase();
    
    if (!text) {
        alert('Please enter or paste some text/URL/number to analyze.');
        return;
    }

    let score = 0;
    let indicators = [];

    // Trigger keyword checks simulating an AI security model
    const scamKeywords = [
        { word: 'pin', weight: 30, label: 'Requests confidential PIN or password' },
        { word: 'password', weight: 30, label: 'Mentions account password' },
        { word: 'winner', weight: 25, label: 'Unsolicited lottery or prize win claim' },
        { word: 'congratulations', weight: 20, label: 'Prize/Award winning hook' },
        { word: 'fee', weight: 25, label: 'Demands upfront payment or fee' },
        { word: 'urgent', weight: 15, label: 'Uses artificial urgency pressure' },
        { word: 'blocked', weight: 20, label: 'Threatens account suspension or blocking' },
        { word: 'click', weight: 15, label: 'Directs user to click external links' },
        { word: 'http://', weight: 20, label: 'Contains unencrypted HTTP web link' },
        { word: 'lottery', weight: 30, label: 'Lottery scam terminology' },
        { word: 'airtel', weight: 10, label: 'Mentions mobile money service provider' },
        { word: 'mtn', weight: 10, label: 'Mentions mobile money service provider' },
        { word: 'zamtel', weight: 10, label: 'Mentions mobile money service provider' }
    ];

    scamKeywords.forEach(item => {
        if (text.includes(item.word)) {
            score += item.weight;
            indicators.push(item.label);
        }
    });

    // Check for phone number patterns
    const phoneRegex = /(\+?[0-9]{10,13})/g;
    if (phoneRegex.test(text)) {
        score += 15;
        indicators.push('Contains direct phone number contact');
    }

    // Cap score at 100
    score = Math.min(score, 100);

    // Determine Risk Level
    let riskLevel = 'Low';
    let riskClass = 'risk-low';
    let summaryText = 'This content appears relatively safe, but always exercise standard caution.';

    if (score >= 60) {
        riskLevel = 'High Risk (Likely Scam)';
        riskClass = 'risk-high';
        summaryText = 'Warning! Multiple high-risk fraud indicators detected. Do not send money, share PINs, or click links.';
    } else if (score >= 30) {
        riskLevel = 'Medium Risk (Suspicious)';
        riskClass = 'risk-medium';
        summaryText = 'Caution advised. This message contains suspicious elements commonly associated with social engineering.';
    }

    // Update UI Results
    riskBadge.className = `risk-badge ${riskClass}`;
    riskBadge.textContent = riskLevel;
    threatScore.textContent = `Threat Score: ${score}/100`;
    resultSummary.textContent = summaryText;

    // Populate indicator list
    indicatorList.innerHTML = '';
    if (indicators.length > 0) {
        indicators.forEach(ind => {
            const li = document.createElement('li');
            li.textContent = ind;
            indicatorList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No suspicious keywords or patterns recognized.';
        indicatorList.appendChild(li);
    }

    analyzerResult.classList.remove('hidden');
}

// 2. Handle New Community Report Submission
function handleNewReport(e) {
    e.preventDefault();

    const category = document.getElementById('scamType').value;
    const target = document.getElementById('scammerContact').value.trim();
    const description = document.getElementById('scamDescription').value.trim();
    const currentDate = new Date().toISOString().split('T')[0];

    const newAlert = {
        id: Date.now(),
        category,
        target,
        description,
        date: currentDate
    };

    // Add to array & re-render
    communityAlerts.unshift(newAlert);
    renderAlerts(communityAlerts);

    // Reset form
    fraudReportForm.reset();
    alert('Thank you! Your report has been successfully submitted and added to the community alert board.');
    
    // Scroll to alerts section
    document.getElementById('alerts').scrollIntoView({ behavior: 'smooth' });
}

// 3. Render Community Alerts Feed
function renderAlerts(alertsToRender) {
    alertsContainer.innerHTML = '';

    if (alertsToRender.length === 0) {
        alertsContainer.innerHTML = '<p class="no-alerts">No community alerts found matching your criteria.</p>';
        return;
    }

    alertsToRender.forEach(alert => {
        const card = document.createElement('div');
        card.className = 'alert-card';
        card.innerHTML = `
            <div class="alert-card-header">
                <span class="alert-category">${escapeHTML(alert.category)}</span>
                <span class="alert-date"><i class="fa-regular fa-calendar"></i> ${escapeHTML(alert.date)}</span>
            </div>
            <div class="alert-target"><i class="fa-solid fa-bullseye"></i> ${escapeHTML(alert.target)}</div>
            <p class="alert-desc">${escapeHTML(alert.description)}</p>
        `;
        alertsContainer.appendChild(card);
    });
}

// Utility to prevent XSS injection in user reports
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}