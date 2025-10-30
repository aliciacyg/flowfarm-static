const dateDisplay = document.getElementById('current-date');
let currentDay = 15;
let currentSeason = 'Spring';

if (dateDisplay) {
    const dateText = dateDisplay.textContent.trim();
    const match = dateText.match(/Day\s+(\d+)\s*-\s*(.+)/i);
    if (match) {
        currentDay = parseInt(match[1], 10);
        currentSeason = match[2].trim();
    }
}

const fastForwardButton = document.getElementById('fast-forward-btn');
const crisisPopup = document.getElementById('crisis-popup');
const crisisTitleEl = document.getElementById('crisis-title');
const crisisDescriptionEl = document.getElementById('crisis-description');
const crisisOptionsEl = document.getElementById('crisis-options');

const defaultCrisisOptions = [
    'Option 1 stub',
    'Option 2 stub',
    'Option 3 stub'
];

// Add new crisis events keyed by day number.
const crisisEventsByDay = {
    16: {
        title: '⚠️ Crisis Event: Pump Pressure Spike',
        description: 'TODO: Describe the situation players face on day 16.',
        options: [
            'Option 1 stub',
            'Option 2 stub',
            'Option 3 stub'
        ]
    }
};

function openStats() {
    document.getElementById('stats-popup').classList.add('active');
}

function closeStats() {
    document.getElementById('stats-popup').classList.remove('active');
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('#stats-popup .tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('#stats-popup .tab').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

function openInventory() {
    document.getElementById('inventory-popup').classList.add('active');
}

function closeInventory() {
    document.getElementById('inventory-popup').classList.remove('active');
}

function switchInventoryTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('#inventory-popup .tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('#inventory-popup .tab').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

function openCommunityBoard() {
    document.getElementById('community-popup').classList.add('active');
}

function closeCommunityBoard() {
    document.getElementById('community-popup').classList.remove('active');
}

function openRequestDetail(requestId) {
    document.getElementById('request-detail-' + requestId).classList.add('active');
}

function closeRequestDetail(requestId) {
    document.getElementById('request-detail-' + requestId).classList.remove('active');
}

function advanceDay() {
    currentDay += 1;
    updateDayDisplay();
    triggerCrisisEvent(currentDay);
}

function updateDayDisplay() {
    if (dateDisplay) {
        dateDisplay.textContent = `Day ${currentDay} - ${currentSeason}`;
    }
}

function triggerCrisisEvent(day) {
    const crisisEvent = getCrisisEventForDay(day);
    openCrisis(crisisEvent);
}

function getCrisisEventForDay(day) {
    const configuredEvent = crisisEventsByDay[day];
    if (configuredEvent) {
        return configuredEvent;
    }

    return createDefaultCrisisEvent(day);
}

function createDefaultCrisisEvent(day) {
    return {
        title: '⚠️ Crisis Event',
        description: `TODO: Add the description for day ${day}'s crisis event.`,
        options: defaultCrisisOptions
    };
}

function openCrisis(eventData) {
    if (!crisisPopup || !crisisTitleEl || !crisisDescriptionEl || !crisisOptionsEl) {
        return;
    }

    crisisTitleEl.textContent = eventData.title || '⚠️ Crisis Event';
    crisisDescriptionEl.textContent = eventData.description || 'TODO: Add crisis details.';
    renderCrisisOptions(eventData.options);
    crisisPopup.classList.add('active');
}

function renderCrisisOptions(options) {
    if (!crisisOptionsEl) {
        return;
    }

    crisisOptionsEl.innerHTML = '';
    const normalizedOptions = normalizeOptions(options);

    normalizedOptions.forEach((option) => {
        const button = document.createElement('button');
        button.className = 'crisis-option';
        button.textContent = option.label;
        button.addEventListener('click', () => {
            if (typeof option.onSelect === 'function') {
                option.onSelect({ day: currentDay });
            }
            closeCrisis();
        });
        crisisOptionsEl.appendChild(button);
    });
}

function normalizeOptions(options) {
    const optionList = Array.isArray(options) ? options.slice(0, 3) : [];
    while (optionList.length < 3) {
        optionList.push(defaultCrisisOptions[optionList.length]);
    }

    return optionList.map((option, index) => {
        if (typeof option === 'string') {
            return { label: option };
        }

        return {
            label: option.label || defaultCrisisOptions[index],
            onSelect: option.onSelect
        };
    });
}

function closeCrisis() {
    if (crisisPopup) {
        crisisPopup.classList.remove('active');
    }
}

// Close popup when clicking outside
document.getElementById('stats-popup').addEventListener('click', function (e) {
    if (e.target === this) {
        closeStats();
    }
});

document.getElementById('community-popup').addEventListener('click', function (e) {
    if (e.target === this) {
        closeCommunityBoard();
    }
});

document.querySelectorAll('.request-detail').forEach(detail => {
    detail.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

document.getElementById('inventory-popup').addEventListener('click', function (e) {
    if (e.target === this) {
        closeInventory();
    }
});

if (fastForwardButton) {
    fastForwardButton.addEventListener('click', advanceDay);
}

if (crisisPopup) {
    crisisPopup.addEventListener('click', function (e) {
        if (e.target === this) {
            closeCrisis();
        }
    });
}

if (crisisOptionsEl) {
    crisisOptionsEl.innerHTML = '';
}

updateDayDisplay();
