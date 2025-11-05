const dateDisplay = document.getElementById('current-date');
const balanceDisplay = document.getElementById('balance-display');
const balanceAmountEl = document.getElementById('balance-amount');
const waterStatsContainer = document.getElementById('water-stats-container');
const plantsListEl = document.getElementById('plants-list');
const fishListEl = document.getElementById('fish-list');
const consumablesListEl = document.getElementById('consumables-list');
const equipmentListEl = document.getElementById('equipment-list');
const harvestListEl = document.getElementById('harvest-list');
const fastForwardButton = document.getElementById('fast-forward-btn');
const crisisPopup = document.getElementById('crisis-popup');
const crisisTitleEl = document.getElementById('crisis-title');
const crisisDescriptionEl = document.getElementById('crisis-description');
const crisisOptionsEl = document.getElementById('crisis-options');
const gillPopup = document.getElementById('gill-popup');
const gillMessageEl = document.getElementById('gill-message');
const gillNextButton = document.getElementById('gill-next-btn');
const communityPopup = document.getElementById('community-popup');
const communityRequestListEl = document.getElementById('community-request-list');
const communityRequestEmptyEl = document.getElementById('community-request-empty');
const activeRequestButton = document.getElementById('active-request-btn');
const requestDetailPopup = document.getElementById('request-detail-popup');
const requestDetailTitleEl = document.getElementById('request-detail-title');
const requestDetailPostedByEl = document.getElementById('request-detail-posted-by');
const requestDetailDescriptionEl = document.getElementById('request-detail-description');
const requestDetailRequirementsEl = document.getElementById('request-detail-requirements');
const requestDetailRewardsEl = document.getElementById('request-detail-rewards');
const requestBackButton = document.getElementById('request-detail-back-btn');
const requestAcceptButton = document.getElementById('request-accept-btn');
const requestCompleteButton = document.getElementById('request-complete-btn');
const requestCompletePopup = document.getElementById('request-complete-popup');
const requestCompleteMessageEl = document.getElementById('request-complete-message');
const requestCompleteRewardsEl = document.getElementById('request-complete-rewards');
const requestCompleteCloseButton = document.getElementById('request-complete-close-btn');
const requestCompleteOkButton = document.getElementById('request-complete-ok-btn');

const DEFAULT_STARTING_BALANCE = 500;

const communityRequests = [
    {
        id: 'science-class-demo',
        title: 'Science Class Demo',
        postedBy: 'Mr. Chen',
        icon: '🎓',
        preview: 'Mr. Chen needs starter fish and plants for his biology class...',
        description: `My biology class is studying ecosystems and I want to set up a small aquaponics demonstration in our classroom. Could you donate some starter plants and maybe one small fish? The students would love to see the nitrogen cycle in action!`,
        requirements: [
            {
                type: 'harvest',
                itemKey: 'lettuce-harvest',
                quantity: 3,
                label: '3x Lettuce'
            },
            {
                type: 'harvest',
                itemKeys: ['goldfish-harvest', 'tilapia-harvest'],
                quantity: 1,
                label: '1x Fish (any species)'
            }
        ],
        rewards: {
            displayText: '+10 Reputation, Aquarium Heater (value $50)',
            equipment: [
                {
                    key: 'aquarium-heater',
                    icon: '🔥',
                    name: 'Aquarium Heater',
                    status: { label: 'Functioning', type: 'functioning', prefix: '✓' },
                    description: 'Used to increase water temperature. Can be useful to treat fish diseases, or during the winter months.'
                }
            ]
        },
        rewardPreview: '💰 +10 Reputation | 🎁 Gift',
        thankYouMessage: 'Thank you so much for your generous donation! My students are going to love learning about aquaponics with this setup. Here, take this. We bought this for the classroom tank but it\'s way too powerful for our little 10-gallon setup. Please take it—you\'ll actually use it!'
    }
];


// Game State Object
const gameState = {
    day: 1,
    balance: DEFAULT_STARTING_BALANCE,
    waterStats: [
        {
            key: 'ammonia',
            label: 'Ammonia (NH₃)',
            value: 0.4,
            unit: 'ppm',
            safeRangeDisplay: '0-0.5 ppm',
            minValue: 0,
            maxValue: 2,
            ranges: {
                safe: [0, 0.5],
                warning: [0.6, 1.0]
                // Outside set ranges is danger
            }
        },
        {
            key: 'nitrite',
            label: 'Nitrite (NO₂⁻)',
            value: 0.1,
            unit: 'ppm',
            safeRangeDisplay: '0-0.5 ppm',
            minValue: 0,
            maxValue: 2,
            ranges: {
                safe: [0, 0.5],
                warning: [0.6, 1.0]
            }
        },
        {
            key: 'nitrate',
            label: 'Nitrate (NO₃⁻)',
            value: 45,
            unit: 'ppm',
            safeRangeDisplay: '40-80 ppm',
            minValue: 0,
            maxValue: 150,
            ranges: {
                safe: [40, 80],
                warning: [20, 100]
            }
        },
        {
            key: 'ph',
            label: 'pH Level',
            value: 7.0,
            unit: '',
            safeRangeDisplay: '6.8-7.2',
            minValue: 6.0,
            maxValue: 8.0,
            ranges: {
                safe: [6.8, 7.2],
                warning: [6.5, 7.5]
            }
        },
        {
            key: 'temperature',
            label: 'Temperature',
            value: 68,
            unit: '°F',
            safeRangeDisplay: '68-75°F',
            minValue: 60,
            maxValue: 85,
            ranges: {
                safe: [68, 75],
                warning: [65, 80]
            }
        },
        {
            key: 'dissolved-oxygen',
            label: 'Dissolved Oxygen',
            value: 8.5,
            unit: 'mg/L',
            safeRangeDisplay: '>5 mg/L',
            minValue: 0,
            maxValue: 10,
            ranges: {
                safe: [6, 10],
                warning: [5, 10]
            }
        }
    ],
    plants: [
        {
            key: 'lettuce',
            icon: '🥬',
            name: 'Lettuce',
            quantity: 5,
            daysToHarvest: 8
        },
        {
            key: 'tomato',
            icon: '🍅',
            name: 'Tomato',
            quantity: 3,
            daysToHarvest: 21
        },
        {
            key: 'basil',
            icon: '🌿',
            name: 'Basil',
            quantity: 2,
            daysToHarvest: 0
        },
        {
            key: 'strawberry',
            icon: '🍓',
            name: 'Strawberry',
            quantity: 5,
            daysToHarvest: 14
        }
    ],
    fish: [
        {
            key: 'goldfish-1',
            icon: '🐟',
            name: 'Goldfish #1',
            species: 'Common Goldfish',
            size: 12,
            age: 120,
            healthPercent: 95,
            healthLabel: 'Healthy'
        },
        {
            key: 'goldfish-2',
            icon: '🐟',
            name: 'Goldfish #2',
            species: 'Common Goldfish',
            size: 10,
            age: 90,
            healthPercent: 85,
            healthLabel: 'Healthy'
        },
        {
            key: 'tilapia-1',
            icon: '🐠',
            name: 'Tilapia #1',
            species: 'Nile Tilapia',
            size: 18,
            age: 150,
            healthPercent: 70,
            healthLabel: 'Stressed - pH too low',
            healthColor: '#ff9800'
        }
    ],
    inventory: {
        consumables: [
            {
                key: 'fish-feed',
                icon: '🫘',
                name: 'Fish Feed',
                quantityLabel: '500g remaining',
                description: 'Standard pellet feed for goldfish and tilapia'
            },
            {
                key: 'calcium-carbonate',
                icon: '🧪',
                name: 'Calcium Carbonate',
                quantityLabel: '500g',
                description: 'Slowly raises pH over several days'
            },
            {
                key: 'phosphoric-acid',
                icon: '🧪',
                name: 'Phosphoric Acid',
                quantityLabel: '100mL',
                description: 'Lowers pH when levels are too high'
            },
            {
                key: 'probiotic-supplement',
                icon: '🧪',
                name: 'Probiotic Supplement',
                quantityLabel: '3 doses',
                description: 'Helps establish nitrogen cycle and break down waste'
            },
            {
                key: 'aquarium-salt',
                icon: '🐟',
                name: 'Aquarium Salt',
                quantityLabel: '1kg',
                description: 'Used for treating fish diseases (harmful to plants)'
            },
            {
                key: 'iron-supplement',
                icon: '🌱',
                name: 'Iron Supplement',
                quantityLabel: '200mL',
                description: 'Prevents iron deficiency in plants'
            }
        ],
        equipment: [
            {
                key: 'air-pump',
                icon: '💨',
                name: 'Air Pump',
                status: { label: 'Functioning', type: 'functioning', prefix: '✓' },
                description: 'Provides oxygen to fish and beneficial bacteria'
            },
            {
                key: 'water-pump',
                icon: '🔄',
                name: 'Water Pump',
                status: { label: 'Functioning', type: 'functioning', prefix: '✓' },
                description: 'Circulates water from fish tank to plant beds'
            },
            {
                key: 'filter',
                icon: '🧹',
                name: 'Filter',
                status: { label: 'Needs Cleaning', type: 'needs-repair', prefix: '⚠' },
                description: 'Removes solid waste particles from water'
            },
            {
                key: 'grow-light',
                icon: '💡',
                name: 'Grow Light (LED)',
                status: { label: 'Functioning', type: 'functioning', prefix: '✓' },
                description: 'Provides light for plant photosynthesis'
            },
            {
                key: 'monitoring-equipment',
                icon: '📊',
                name: 'Monitoring Equipment',
                status: { label: 'Functioning', type: 'functioning', prefix: '✓' },
                description: 'Digital monitor for water parameters'
            }
        ],
        harvest: [
            { key: 'lettuce-harvest', icon: '🥬', name: 'Lettuce', quantity: 0 },
            { key: 'tomato-harvest', icon: '🍅', name: 'Tomato', quantity: 0 },
            { key: 'basil-harvest', icon: '🌿', name: 'Basil', quantity: 0 },
            { key: 'strawberry-harvest', icon: '🍓', name: 'Strawberry', quantity: 0 },
            { key: 'goldfish-harvest', icon: '🐟', name: 'Goldfish', quantity: 1 },
            { key: 'tilapia-harvest', icon: '🐠', name: 'Tilapia', quantity: 1 }
        ]
    },

    activeEffects: [],

    communityRequests: [...communityRequests],

    activeCommunityRequest: null
};

// Add new crisis events keyed by day number.
const crisisEventsByDay = {
    5: {
        title: '⚠️ Crisis Event: pH drop!',
        description: 'Your pH has dropped to 6.0 overnight. Plants can still grow, but fish are becoming stressed.',
        options: [
            {
                id: 'calcium-carbonate-choice',
                label: 'Add Calcium Carbonate (- $15)',
                description: 'This will slowly buffer the pH up over a few days',
                cost: 15,
                immediate: {},
                delayed: {},
                gillMessage: ``
            },
            {
                id: 'baking-soda-choice',
                label: 'Add Baking Soda (- $10)',
                description: 'Quick fix. Will not last, and could stress the fish if overused.',
                cost: 10,
                immediate: {},
                delayed: {},
                gillMessage: ``
            },
            {
                id: 'sell-fish-choice',
                label: 'Sell Half Your Fish (+ $30)',
                description: 'Reduces bioload and acid production. Will also lower nutrient levels for plants.',
                cost: -30,
                immediate: {},
                delayed: {},
                gillMessage: ``
            },
            {
                id: 'wait-and-monitor-choice',
                label: 'Wait and Monitor',
                description: 'You risk stressed fish and poor plant growth if pH remains low.',
                cost: 0,
                immediate: {},
                delayed: {},
                gillMessage: ``
            }
        ]
    },
    10: {
        title: '⚠️ Crisis Event: Ammonia buildup!',
        description: 'You overfed the fish yesterday and ammonia levels are climbing to dangerous levels.',
        options: [
            {
                id: 'water-change-choice',
                label: 'Perform 50% Water Change (- $10)',
                description: 'Dilutes ammonia concentration quickly, but stressful for fish.',
                cost: 10,
                immediate: {},
                delayed: {},
                gillMessage: `Explain what dilution means and why it helps.`
            },
            {
                id: 'add-beneficial-bacteria-choice',
                label: 'Add Beneficial Bacteria (- $25)',
                description: 'Helps break down ammonia and improve water quality over time.',
                cost: 25,
                immediate: {},
                delayed: {},
                gillMessage: `Beneficial bacteria help convert harmful ammonia into less toxic substances.`
            },
            {
                id: 'skip-feeding-choice',
                label: 'Skip Feeding',
                description: 'Avoid adding more ammonia by not feeding the fish for a couple of days. Slow recovery.',
                cost: 0,
                immediate: {},
                delayed: {},
                gillMessage: ``
            }
        ]
    },
    13: {
        title: '⚠️ Crisis Event: Power Outage!',
        description: 'A storm knocked out power for 6 hours. Your pump stopped running and oxygen levels dropped.',
        options: [
            {
                id: 'manual-aeration-choice',
                label: 'Use Manual Aeration (- $30)',
                description: 'Use a battery-powered aerator to increase oxygen levels temporarily.',
                cost: 30,
                immediate: {},
                delayed: {},
                gillMessage: ``
            },
            {
                id: 'backup-generator-choice',
                label: 'Buy a Backup Generator (- $150)',
                description: 'Prevents future issues.',
                cost: 150,
                immediate: {},
                delayed: {},
                gillMessage: ``
            },
            {
                id: 'do-nothing-power-choice',
                label: 'Do Nothing',
                description: 'Chance of losing 10-20% of fish due to low oxygen.',
                cost: 0,
                immediate: {},
                delayed: {},
                gillMessage: ``
            }
        ]
    },
    17: {
        title: '⚠️ Crisis Event: Root Rot Outbreak!',
        description: 'Several of your plants are showing signs of root rot due to poor water circulation.',
        options: [
            {
                id: 'remove-affected-plants-choice',
                label: 'Remove Affected Plants (- $0)',
                description: 'Lose 5 plants but save the system.',
                cost: 0,
                immediate: {},
                delayed: {},
                gillMessage: `Description about how diseases spread in plants`
            },
            {
                id: 'hydrogen-peroxide-choice',
                label: 'Treat with Hydrogen Peroxide (- $20)',
                description: 'May save some plants, but will stress the fish',
                cost: 20,
                immediate: {},
                delayed: {},
                gillMessage: ``
            }
        ]
    },
    20: {
        title: '⚠️ Crisis Event: Fish Disease Spotted!',
        description: 'You notice white spots (ich) on several fish. It\'s spreading quickly.',
        options: [
            {
                id: 'quarantine-choice',
                label: 'Quarantine Affected Fish',
                description: 'Lose the sick fish but save the rest.',
                cost: 0,
                immediate: {},
                delayed: {},
                gillMessage: ``
            },
            {
                id: 'aquarine-salt-choice',
                label: 'Treat with Aquarium Salt (- $25)',
                description: 'Cures the fish, but might kill some plants.',
                cost: 25,
                immediate: {},
                delayed: {},
                gillMessage: ``
            },
            {
                id: 'raise-temperature-choice',
                label: 'Raise Temperature Gradually to 82-86°F ',
                description: 'Mr. Chen\'s gift is coming in handy! This will cure the fish, but stress the plants slightly.',
                cost: 0,
                immediate: {},
                delayed: {},
                gillMessage: ``
            },
            {
                id: 'do-nothing-disease-choice',
                label: 'Do Nothing',
                description: 'Chance of losing 50-70% of fish stock due to disease. Plants stay healthy.',
                cost: 0,
                immediate: {},
                delayed: {},
                gillMessage: ``
            }
        ]
    },
    30: {
        title: '⚠️ Crisis Event: Pest Infestation!',
        description: 'Aphids have appeared on your plants and are multiplying rapidly.',
        options: [
            {
                id: 'introduce-ladybugs-choice',
                label: 'Introduce Ladybugs (- $40)',
                description: 'Organic pest control. Safe for plants and fish. Will take 3 days. Some plants may be damaged in the meantime.',
                cost: 40,
                immediate: {},
                delayed: {},
                gillMessage: ``
            },
            {
                id: 'manual-removal-choice',
                label: 'Manual Removal (- $0)',
                description: 'Physically remove aphids from plants. Labor-intensive but immediate and no cost.',
                cost: 0,
                immediate: {},
                delayed: {},
                gillMessage: `This would not be free or convenient with a larger system`
            },
            {
                id: 'remove-infected-plants-choice',
                label: 'Remove Infected Plants (- $0)',
                description: 'Lose 30% of plants but eliminate pests completely.',
                cost: 0,
                immediate: {},
                delayed: {},
                gillMessage: ``
            }
        ]
    }
};

// Gill's daily messages
const gillMessagesByDay = {
    1: [
        `Hey there! I'm Gill. I'm here to guide you through your aquaponics journey.`,
        `Aquaponics is all about teamwork: fish provide nutrients for plants, and plants clean the water for fish.`,
        `For now, you're going to be in charge of this small deep-water culture tank. You can learn more about the details of these aquaponics terms in help tab in your own time. Right now, let's talk about running your system.`,
        `Most days, you don't have to do much. Just do these three things daily: feed the fish, check your water stats, and the health of your fish and plants.`,
        `Sometimes, unexpected things happen. Aquaponics systems can be sensitive and involve trial and error. Don't worry and believe in yourself!`,
        `That's all for now. I'll check in again tomorrow. Explore a bit, and have fun!`
    ],
    2: [
        `See? Pretty easy, right? Just a few simple tasks each day to keep your aquaponics system running smoothly.`,
        `Most days are going to be like this. But every so often, something unexpected might happen.`,
    ]
};

let activeGillMessages = [];
let activeGillIndex = 0;

let currentRequestContext = null;


// Stats popup management
//
//
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
// -------------------------------------------------------------------------

// Inventory popup management
//
//
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
// -------------------------------------------------------------------------

// Community board popup management and functionality
//
//
function openCommunityBoard() {
    if (!communityPopup) {
        return;
    }

    renderCommunityBoard();
    communityPopup.classList.add('active');
}

function closeCommunityBoard() {
    if (communityPopup) {
        communityPopup.classList.remove('active');
    }
}

function renderCommunityBoard() {
    if (!communityRequestListEl) {
        return;
    }

    communityRequestListEl.innerHTML = '';
    const availableRequests = gameState.communityRequests;

    if (!availableRequests.length) {
        if (communityRequestEmptyEl) {
            communityRequestEmptyEl.style.display = 'block';
        }
        return;
    }

    if (communityRequestEmptyEl) {
        communityRequestEmptyEl.style.display = 'none';
    }

    availableRequests.forEach((request) => {
        const item = document.createElement('div');
        item.className = 'request-item';
        item.dataset.requestId = request.id;

        const header = document.createElement('div');
        header.className = 'request-header';

        const title = document.createElement('div');
        title.className = 'request-title';
        const icon = request.icon ? `${request.icon} ` : '';
        title.textContent = `${icon}${request.title}`;

        const status = document.createElement('div');
        status.className = 'request-status';
        status.textContent = 'AVAILABLE';

        header.appendChild(title);
        header.appendChild(status);

        const preview = document.createElement('div');
        preview.className = 'request-preview';
        preview.textContent = request.preview || '';

        const reward = document.createElement('div');
        reward.className = 'request-reward';
        const rewardText = request.rewardPreview
            || (request.rewards && request.rewards.displayText)
            || '';
        reward.textContent = rewardText;

        item.appendChild(header);
        item.appendChild(preview);
        item.appendChild(reward);

        item.addEventListener('click', () => {
            openRequestDetail(request.id, 'board');
        });

        communityRequestListEl.appendChild(item);
    });
}

function getRequirementLabel(requirement) {
    if (!requirement) {
        return '';
    }

    if (requirement.label) {
        return requirement.label;
    }

    const quantityText = typeof requirement.quantity === 'number'
        ? `${requirement.quantity}x `
        : '';

    if (requirement.itemKey) {
        return `${quantityText}${requirement.itemKey}`;
    }

    if (Array.isArray(requirement.itemKeys) && requirement.itemKeys.length > 0) {
        const combined = requirement.itemKeys.join(' / ');
        return `${quantityText}${combined}`;
    }

    return quantityText.trim();
}

function openRequestDetail(requestId, context = 'board') {
    if (!requestDetailPopup) {
        return;
    }

    let requestData = null;

    if (context === 'active') {
        requestData = gameState.activeCommunityRequest && gameState.activeCommunityRequest.id === requestId
            ? gameState.activeCommunityRequest
            : null;
    } else {
        requestData = gameState.communityRequests.find((entry) => entry.id === requestId) || null;
    }

    if (!requestData) {
        showNoActiveRequestMessage();
        requestDetailPopup.classList.add('active');
        currentRequestContext = null;
        return;
    }

    currentRequestContext = { requestId, context };
    populateRequestDetail(requestData, context);
    requestDetailPopup.classList.add('active');
}

function populateRequestDetail(request, context) {
    if (!requestDetailTitleEl || !requestDetailPostedByEl || !requestDetailDescriptionEl || !requestDetailRewardsEl) {
        return;
    }

    requestDetailTitleEl.textContent = request.title || 'Community Request';
    requestDetailPostedByEl.textContent = request.postedBy ? `Posted by: ${request.postedBy}` : '';
    requestDetailDescriptionEl.textContent = request.description || '';

    if (requestDetailRequirementsEl) {
        requestDetailRequirementsEl.innerHTML = '';
        if (Array.isArray(request.requirements) && request.requirements.length > 0) {
            request.requirements.forEach((requirement) => {
                const li = document.createElement('li');
                li.textContent = getRequirementLabel(requirement);
                requestDetailRequirementsEl.appendChild(li);
            });
        }
    }

    const rewardDisplay = request.rewards && request.rewards.displayText
        ? request.rewards.displayText
        : '';
    requestDetailRewardsEl.textContent = rewardDisplay;

    if (requestAcceptButton) {
        if (context === 'board') {
            const hasActive = Boolean(gameState.activeCommunityRequest);
            requestAcceptButton.style.display = 'inline-block';
            requestAcceptButton.disabled = hasActive;
        } else if (context === 'active') {
            requestAcceptButton.remove();
        } else {
            requestAcceptButton.style.display = 'none';
        }
    }

    if (requestCompleteButton) {
        if (context === 'active') {
            requestCompleteButton.style.display = 'inline-block';
            const canComplete = canCompleteRequest(request);
            requestCompleteButton.disabled = !canComplete;
        } else {
            requestCompleteButton.style.display = 'none';
        }
    }
}

function canCompleteRequest(request = null) {
    const targetRequest = request || gameState.activeCommunityRequest;
    if (!targetRequest) {
        return false;
    }

    if (!Array.isArray(targetRequest.requirements) || targetRequest.requirements.length === 0) {
        return true;
    }

    return targetRequest.requirements.every((requirement) => isRequirementMet(requirement));
}

function isRequirementMet(requirement) {
    if (!requirement) {
        return true;
    }

    switch (requirement.type) {
        case 'harvest':
            return isHarvestRequirementMet(requirement);
        default:
            return true;
    }
}

function isHarvestRequirementMet(requirement) {
    const requiredQuantity = Math.max(0, Number(requirement.quantity) || 0);
    if (requiredQuantity === 0) {
        return true;
    }

    const keys = Array.isArray(requirement.itemKeys) && requirement.itemKeys.length > 0
        ? requirement.itemKeys
        : requirement.itemKey
            ? [requirement.itemKey]
            : [];

    if (keys.length === 0) {
        return false;
    }

    const totalAvailable = keys.reduce((total, itemKey) => total + getHarvestQuantity(itemKey), 0);
    return totalAvailable >= requiredQuantity;
}

function getHarvestItem(itemKey) {
    if (!itemKey) {
        return null;
    }
    return gameState.inventory.harvest.find((entry) => entry.key === itemKey) || null;
}

function getHarvestQuantity(itemKey) {
    const item = getHarvestItem(itemKey);
    if (!item || typeof item.quantity !== 'number') {
        return 0;
    }
    return item.quantity;
}

function consumeCommunityRequestRequirements(request) {
    if (!request || !Array.isArray(request.requirements)) {
        return;
    }

    request.requirements.forEach((requirement) => {
        if (!requirement) {
            return;
        }

        if (requirement.type === 'harvest') {
            consumeHarvestRequirement(requirement);
        }
    });
}

function consumeHarvestRequirement(requirement) {
    const requiredQuantity = Math.max(0, Number(requirement.quantity) || 0);
    if (requiredQuantity === 0) {
        return;
    }

    const keys = Array.isArray(requirement.itemKeys) && requirement.itemKeys.length > 0
        ? requirement.itemKeys
        : requirement.itemKey
            ? [requirement.itemKey]
            : [];

    if (keys.length === 0) {
        return;
    }

    let remaining = requiredQuantity;
    keys.forEach((itemKey) => {
        if (remaining <= 0) {
            return;
        }

        const item = getHarvestItem(itemKey);
        if (!item || typeof item.quantity !== 'number' || item.quantity <= 0) {
            return;
        }

        const deduction = Math.min(item.quantity, remaining);
        item.quantity -= deduction;
        remaining -= deduction;
    });
}

function addEquipmentRewards(rewards) {
    if (!rewards || typeof rewards !== 'object') {
        return [];
    }

    const equipmentRewards = Array.isArray(rewards.equipment) ? rewards.equipment : [];
    if (!equipmentRewards.length) {
        return [];
    }

    const newlyAdded = [];
    equipmentRewards.forEach((rewardItem) => {
        if (!rewardItem) {
            return;
        }

        const clonedItem = {
            ...rewardItem,
            status: rewardItem.status ? { ...rewardItem.status } : { label: 'Functioning', type: 'functioning', prefix: '✓' }
        };

        if (!clonedItem.key) {
            clonedItem.key = `reward-equipment-${Date.now()}`;
        }

        let uniqueKey = clonedItem.key;
        let suffix = 1;
        while (gameState.inventory.equipment.some((existing) => existing.key === uniqueKey)) {
            suffix += 1;
            uniqueKey = `${clonedItem.key}-${suffix}`;
        }
        clonedItem.key = uniqueKey;

        gameState.inventory.equipment.push(clonedItem);
        newlyAdded.push(clonedItem);
    });

    if (newlyAdded.length > 0) {
        renderEquipment();
    }

    return newlyAdded;
}

function updateRequestCompletionButtonState() {
    if (!requestCompleteButton) {
        return;
    }

    const hasActiveRequest = Boolean(gameState.activeCommunityRequest);
    if (!hasActiveRequest) {
        requestCompleteButton.disabled = true;
        return;
    }

    requestCompleteButton.disabled = !canCompleteRequest();
}

function closeRequestDetail() {
    if (requestDetailPopup) {
        requestDetailPopup.classList.remove('active');
    }
    currentRequestContext = null;
}

function handleAcceptRequest() {
    if (!currentRequestContext || currentRequestContext.context !== 'board') {
        return;
    }

    if (gameState.activeCommunityRequest) {
        return;
    }

    const index = gameState.communityRequests.findIndex((request) => request.id === currentRequestContext.requestId);
    if (index === -1) {
        return;
    }

    const [acceptedRequest] = gameState.communityRequests.splice(index, 1);
    gameState.activeCommunityRequest = acceptedRequest;

    renderCommunityBoard();
    updateActiveRequestButtonVisibility();
    openRequestDetail(acceptedRequest.id, 'active');
}

function updateActiveRequestButtonVisibility() {
    if (!activeRequestButton) {
        return;
    }

    const hasActiveRequest = Boolean(gameState.activeCommunityRequest);
    activeRequestButton.style.display = hasActiveRequest ? '' : 'none';
}

function openActiveRequest() {
    if (gameState.activeCommunityRequest) {
        openRequestDetail(gameState.activeCommunityRequest.id, 'active');
        return;
    }

    if (!requestDetailPopup) {
        return;
    }

    showNoActiveRequestMessage();
    currentRequestContext = null;
    requestDetailPopup.classList.add('active');
}

function showNoActiveRequestMessage() {
    if (!requestDetailTitleEl || !requestDetailDescriptionEl || !requestDetailRewardsEl) {
        return;
    }

    requestDetailTitleEl.textContent = 'No Active Request';
    requestDetailPostedByEl.textContent = '';
    requestDetailDescriptionEl.textContent = 'Visit the community board to accept a new community request.';
    if (requestDetailRequirementsEl) {
        requestDetailRequirementsEl.innerHTML = '';
    }

    requestDetailRewardsEl.textContent = '';

    if (requestAcceptButton) {
        requestAcceptButton.style.display = 'none';
    }

    if (requestCompleteButton) {
        requestCompleteButton.style.display = 'none';
    }

    updateActiveRequestButtonVisibility();
}

function handleCompleteRequest() {
    const activeRequest = gameState.activeCommunityRequest;
    if (!activeRequest) {
        return;
    }

    if (!canCompleteRequest(activeRequest)) {
        updateRequestCompletionButtonState();
        return;
    }

    consumeCommunityRequestRequirements(activeRequest);
    const equipmentRewards = addEquipmentRewards(activeRequest.rewards);

    renderInventory();

    gameState.activeCommunityRequest = null;
    currentRequestContext = null;

    updateActiveRequestButtonVisibility();
    renderCommunityBoard();
    updateRequestCompletionButtonState();
    closeRequestDetail();
    showRequestCompletionPopup(activeRequest, { equipment: equipmentRewards });
}

function showRequestCompletionPopup(request, rewardsGranted) {
    if (!requestCompletePopup || !requestCompleteMessageEl || !requestCompleteRewardsEl) {
        return;
    }

    const title = request.title || 'Community Request';
    const postedBy = request.postedBy ? ` for ${request.postedBy}` : '';
    const thankYouText = request.thankYouMessage;
    requestCompleteMessageEl.textContent = thankYouText;

    requestCompleteRewardsEl.innerHTML = '';

    const rewardSummaryText = request.rewards && request.rewards.displayText
        ? request.rewards.displayText
        : 'Rewards delivered.';

    const summaryParagraph = document.createElement('p');
    summaryParagraph.className = 'reward-summary';
    summaryParagraph.textContent = `Rewards: ${rewardSummaryText}`;
    requestCompleteRewardsEl.appendChild(summaryParagraph);

    const equipmentList = Array.isArray(rewardsGranted && rewardsGranted.equipment)
        ? rewardsGranted.equipment
        : [];

    if (equipmentList.length > 0) {
        const listHeader = document.createElement('p');
        listHeader.className = 'reward-details-header';
        listHeader.textContent = 'New equipment added to your inventory:';
        requestCompleteRewardsEl.appendChild(listHeader);

        const list = document.createElement('ul');
        list.className = 'reward-list';
        equipmentList.forEach((item) => {
            const li = document.createElement('li');
            const icon = item.icon ? `${item.icon} ` : '';
            li.textContent = `${icon}${item.name}`;
            list.appendChild(li);
        });
        requestCompleteRewardsEl.appendChild(list);
    }

    requestCompletePopup.classList.add('active');
}

function closeRequestCompletionPopup() {
    if (requestCompletePopup) {
        requestCompletePopup.classList.remove('active');
    }
}
// -------------------------------------------------------------------------

// Gill guide popup management
//
//
function openGill(day) {
    if (!gillPopup || !gillMessageEl) {
        return;
    }

    const messageEntry = gillMessagesByDay[day];
    if (!messageEntry) {
        return;
    }

    activeGillMessages = Array.isArray(messageEntry) ? messageEntry.slice() : [messageEntry];
    activeGillIndex = 0;
    renderGillMessage();
    updateGillControls();
    gillPopup.classList.add('active');
}

function closeGill() {
    if (gillPopup) {
        gillPopup.classList.remove('active');
    }

    activeGillMessages = [];
    activeGillIndex = 0;
    renderGillMessage();
    updateGillControls();
}

function renderGillMessage() {
    if (!gillMessageEl) {
        return;
    }

    if (activeGillMessages.length === 0) {
        gillMessageEl.textContent = '';
        return;
    }

    gillMessageEl.textContent = activeGillMessages[activeGillIndex];
}

function updateGillControls() {
    if (!gillNextButton) {
        return;
    }

    if (activeGillMessages.length === 0) {
        gillNextButton.textContent = 'Close';
        return;
    }

    const hasMore = activeGillIndex < activeGillMessages.length - 1;
    gillNextButton.textContent = hasMore ? 'Next' : 'Close';
}

function handleGillNext() {
    if (activeGillMessages.length === 0) {
        closeGill();
        return;
    }

    const hasMore = activeGillIndex < activeGillMessages.length - 1;
    if (hasMore) {
        activeGillIndex += 1;
        renderGillMessage();
        updateGillControls();
        return;
    }

    closeGill();
}
// -------------------------------------------------------------------------

// Game day advancement
//
//
function advanceDay() {
    // Store old values for animation comparison
    const oldDay = gameState.day;

    // Increment day
    gameState.day += 1;

    // Create transition effect
    createDayTransition();

    // Update display after brief delay to sync with transition
    setTimeout(() => {
        updateDayDisplay();
        processDelayedEffects();
        applyFilterMaintenanceRules();

        // Show Gill's message 
        if (gillMessagesByDay[gameState.day]) {
            openGill(gameState.day);
        }
        // Check for crisis event
        if (crisisEventsByDay[gameState.day]) {
            triggerCrisisEvent(gameState.day);
        }
    }, 300);
}

function createDayTransition() {
    // Create overlay element for fade effect
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.4);
        pointer-events: none;
        z-index: 9998;
        animation: dayTransitionFade 300ms ease-in-out;
    `;
    document.body.appendChild(overlay);

    // Play sound effect
    // playSound('dayAdvance');

    // Remove overlay after animation
    setTimeout(() => overlay.remove(), 300);
}

function applyFilterMaintenanceRules() {
    if (gameState.day % 7 !== 0) {
        return;
    }

    const filter = gameState.inventory.equipment.find((item) => item.key === 'filter');
    if (!filter) {
        return;
    }

    const alreadyNeedsCleaning = filter.status.label === 'Needs Cleaning';
    if (alreadyNeedsCleaning) {
        return;
    }

    filter.status = { label: 'Needs Cleaning', type: 'needs-repair', prefix: '⚠' };
    renderEquipment();
}

function updateDayDisplay() {
    if (dateDisplay) {
        dateDisplay.textContent = `Day ${gameState.day}`;
    }
}

// Balance management
function updateBalanceDisplay() {
    if (!balanceAmountEl) {
        return;
    }
    balanceAmountEl.textContent = gameState.balance.toLocaleString('en-US');
}

function setBalance(amount) {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
        return gameState.balance;
    }
    gameState.balance = amount;
    updateBalanceDisplay();
    return gameState.balance;
}

function adjustBalance(delta) {
    if (typeof delta !== 'number' || Number.isNaN(delta)) {
        return gameState.balance;
    }
    return setBalance(gameState.balance + delta);
}
// -------------------------------------------------------------------------

// Rendering functions until line 559
//
//
function renderGameState() {
    renderWaterStats();
    renderPlants();
    renderFish();
    renderInventory();
}

// Helper function to calculate status class
function getStatusClass(value, ranges) {
    const [safeMin, safeMax] = ranges.safe;
    const [warningMin, warningMax] = ranges.warning;

    if (value >= safeMin && value <= safeMax) {
        return 'safe';
    }
    if (value >= warningMin && value <= warningMax) {
        return 'warning';
    }
    return 'danger';
}

function renderWaterStats() {
    if (!waterStatsContainer) {
        return;
    }

    waterStatsContainer.innerHTML = '';

    gameState.waterStats.forEach((stat) => {
        const row = document.createElement('div');
        row.className = 'stat-row';

        const labelEl = document.createElement('div');
        labelEl.className = 'stat-label';
        labelEl.textContent = stat.label;

        const barEl = document.createElement('div');
        barEl.className = 'stat-bar';

        const fillEl = document.createElement('div');

        const statusClass = getStatusClass(stat.value, stat.ranges);
        fillEl.className = `stat-fill ${statusClass}`;

        const percent = ((stat.value - stat.minValue) / (stat.maxValue - stat.minValue)) * 100;
        fillEl.style.width = `${Math.max(0, Math.min(100, percent))}%`;

        barEl.appendChild(fillEl);

        const valueEl = document.createElement('div');
        valueEl.className = 'stat-value';
        valueEl.textContent = `${stat.value}${stat.unit} (Optimal: ${stat.safeRangeDisplay})`;

        row.appendChild(labelEl);
        row.appendChild(barEl);
        row.appendChild(valueEl);
        waterStatsContainer.appendChild(row);
    });
}

function renderPlants() {
    if (!plantsListEl) {
        return;
    }

    plantsListEl.innerHTML = '';
    gameState.plants.forEach((plant) => {
        const item = document.createElement('div');
        item.className = 'plant-item';

        const title = document.createElement('h4');
        title.textContent = `${plant.icon} ${plant.name}`;

        const info = document.createElement('div');
        info.className = 'plant-info';
        const harvestText = plant.daysToHarvest <= 0
            ? 'Ready to harvest!'
            : `${plant.daysToHarvest} days`;
        info.innerHTML = `<strong>Quantity:</strong> ${plant.quantity} plants<br>
            <strong>Days until harvest:</strong> ${harvestText}`;

        item.appendChild(title);
        item.appendChild(info);
        plantsListEl.appendChild(item);
    });
}

function renderFish() {
    if (!fishListEl) {
        return;
    }

    fishListEl.innerHTML = '';
    gameState.fish.forEach((fish) => {
        const item = document.createElement('div');
        item.className = 'fish-item';

        const title = document.createElement('h4');
        title.textContent = `${fish.icon} ${fish.name}`;

        const info = document.createElement('div');
        info.className = 'fish-info';
        info.innerHTML = `<strong>Species:</strong> ${fish.species}<br>
            <strong>Size:</strong> ${fish.size} cm<br>
            <strong>Age:</strong> ${fish.age} days`;

        const healthBar = document.createElement('div');
        healthBar.className = 'health-bar-small';

        const healthFill = document.createElement('div');
        healthFill.className = 'health-fill';
        healthFill.style.width = `${fish.healthPercent}%`;
        if (fish.healthColor) {
            healthFill.style.background = fish.healthColor;
        } else {
            healthFill.style.background = '';
        }
        healthBar.appendChild(healthFill);

        const healthText = document.createElement('div');
        healthText.className = 'stat-value';
        healthText.textContent = `Health: ${fish.healthPercent}% (${fish.healthLabel})`;

        item.appendChild(title);
        item.appendChild(info);
        item.appendChild(healthBar);
        item.appendChild(healthText);
        fishListEl.appendChild(item);
    });
}

function renderInventory() {
    renderConsumables();
    renderEquipment();
    renderHarvest();
    updateRequestCompletionButtonState();
}

function renderConsumables() {
    if (!consumablesListEl) {
        return;
    }

    consumablesListEl.innerHTML = '';
    gameState.inventory.consumables.forEach((item) => {
        const container = document.createElement('div');
        container.className = 'inventory-item';

        const header = document.createElement('div');
        header.className = 'item-header';

        const name = document.createElement('h4');
        name.textContent = `${item.icon} ${item.name}`;

        const quantity = document.createElement('span');
        quantity.className = 'item-quantity';
        quantity.textContent = item.quantityLabel;

        header.appendChild(name);
        header.appendChild(quantity);

        const description = document.createElement('div');
        description.className = 'item-info';
        description.textContent = item.description;

        container.appendChild(header);
        container.appendChild(description);
        consumablesListEl.appendChild(container);
    });
}

function renderEquipment() {
    if (!equipmentListEl) {
        return;
    }

    equipmentListEl.innerHTML = '';
    gameState.inventory.equipment.forEach((item) => {
        const container = document.createElement('div');
        container.className = `equipment-item ${item.status.type}`;

        const header = document.createElement('div');
        header.className = 'equipment-header';

        const name = document.createElement('h4');
        name.textContent = `${item.icon} ${item.name}`;

        const statusBadge = document.createElement('span');
        statusBadge.className = `status-badge ${item.status.type}`;
        statusBadge.textContent = `${item.status.prefix} ${item.status.label}`;

        header.appendChild(name);
        header.appendChild(statusBadge);

        const description = document.createElement('div');
        description.className = 'equipment-info';
        description.textContent = item.description;

        container.appendChild(header);

        if (item.key === 'filter') {
            const contentRow = document.createElement('div');
            contentRow.className = 'equipment-content';

            contentRow.appendChild(description);

            const actionContainer = document.createElement('div');
            actionContainer.className = 'equipment-actions';

            const cleanButton = document.createElement('button');
            cleanButton.className = 'equipment-action-btn';
            cleanButton.textContent = 'Clean Filter';

            const isFunctioning = item.status.label === 'Functioning';
            cleanButton.disabled = isFunctioning;

            cleanButton.addEventListener('click', () => {
                item.status = { label: 'Functioning', type: 'functioning', prefix: '✓' };
                renderEquipment();
            });

            actionContainer.appendChild(cleanButton);
            contentRow.appendChild(actionContainer);
            container.appendChild(contentRow);
        } else {
            container.appendChild(description);
        }

        equipmentListEl.appendChild(container);
    });
}

function renderHarvest() {
    if (!harvestListEl) {
        return;
    }

    harvestListEl.innerHTML = '';
    gameState.inventory.harvest.forEach((item) => {
        const container = document.createElement('div');
        container.className = 'harvest-item';

        const icon = document.createElement('div');
        icon.className = 'harvest-icon';
        icon.textContent = item.icon;

        const name = document.createElement('div');
        name.className = 'harvest-name';
        name.textContent = item.name;

        const quantity = document.createElement('div');
        quantity.className = 'harvest-quantity';
        quantity.textContent = item.quantity;

        container.appendChild(icon);
        container.appendChild(name);
        container.appendChild(quantity);
        harvestListEl.appendChild(container);
    });
}
// -------------------------------------------------------------------------


// Update functions until line 620
// 
//
function updateWaterStat(key, updates) {
    const stat = gameState.waterStats.find((entry) => entry.key === key);
    if (!stat) {
        return null;
    }

    Object.assign(stat, updates);
    renderWaterStats();
    return stat;
}

function updatePlant(key, updates) {
    const plant = gameState.plants.find((entry) => entry.key === key);
    if (!plant) {
        return null;
    }

    Object.assign(plant, updates);
    renderPlants();
    return plant;
}

function updateFish(key, updates) {
    const fish = gameState.fish.find((entry) => entry.key === key);
    if (!fish) {
        return null;
    }

    Object.assign(fish, updates);
    renderFish();
    return fish;
}

function updateInventoryItem(listName, key, updates) {
    const list = gameState.inventory[listName];
    if (!Array.isArray(list)) {
        return null;
    }

    const item = list.find((entry) => entry.key === key);
    if (!item) {
        return null;
    }

    Object.assign(item, updates);
    renderInventory();
    return item;
}
// -------------------------------------------------------------------------


// Crisis event system
//
//
function triggerCrisisEvent(day) {
    const crisisEvent = getCrisisEventForDay(day);
    if (crisisEvent) {
        openCrisis(crisisEvent);
    }
}

function getCrisisEventForDay(day) {
    return crisisEventsByDay[day] || null;
}

function openCrisis(eventData) {
    if (!crisisPopup || !crisisTitleEl || !crisisDescriptionEl || !crisisOptionsEl) {
        return;
    }

    crisisTitleEl.textContent = eventData.title;
    crisisDescriptionEl.textContent = eventData.description;
    renderCrisisOptions(eventData.options);
    crisisPopup.classList.add('active');
}

function renderCrisisOptions(options) {
    if (!crisisOptionsEl) {
        return;
    }

    crisisOptionsEl.innerHTML = '';

    options.forEach((option) => {
        const button = document.createElement('button');
        button.className = 'crisis-option';

        let label = option.label;
        button.textContent = label;

        button.addEventListener('click', () => {
            handleCrisisChoice(option);
        });

        crisisOptionsEl.appendChild(button);
    });
}

function showGillMessage(message) {
    if (!gillPopup || !gillMessageEl) {
        return;
    }
    
    activeGillMessages = [message];
    activeGillIndex = 0;
    renderGillMessage();
    updateGillControls();
    gillPopup.classList.add('active');
}

function updateFishHealthLabel(fish) {
    if (fish.healthPercent >= 80) {
        fish.healthLabel = 'Healthy';
        fish.healthColor = undefined;
    } else if (fish.healthPercent >= 50) {
        fish.healthLabel = 'Stressed';
        fish.healthColor = '#ff9800';
    } else if (fish.healthPercent > 0) {
        fish.healthLabel = 'Critical';
        fish.healthColor = '#f44336';
    } else {
        fish.healthLabel = 'Dead';
        fish.healthColor = '#666';
    }
}


function applyEffects(effects) {
    // Apply water stat changes
    if (effects.waterStats) {
        Object.entries(effects.waterStats).forEach(([key, change]) => {
            const stat = gameState.waterStats.find(s => s.key === key);
            if (stat) {
                stat.value = Math.max(stat.minValue, Math.min(stat.maxValue, stat.value + change));
            }
        });
        renderWaterStats();
    }
    
    // Apply fish changes
    if (effects.fish) {
        if (typeof effects.fish.removeCount === 'number') {
            const count = Math.min(effects.fish.removeCount, gameState.fish.length);
            gameState.fish.splice(0, count);
        }
        
        if (typeof effects.fish.healthChange === 'number') {
            gameState.fish.forEach(fish => {
                fish.healthPercent = Math.max(0, Math.min(100, fish.healthPercent + effects.fish.healthChange));
                updateFishHealthLabel(fish);
            });
        }
        
        if (typeof effects.fish.removePercent === 'number') {
            const removeCount = Math.floor(gameState.fish.length * effects.fish.removePercent);
            gameState.fish.splice(0, removeCount);
        }
        
        renderFish();
    }
    
    // Apply plant changes
    if (effects.plants) {
        if (typeof effects.plants.removeCount === 'number') {
            let remaining = Math.min(effects.plants.removeCount, 
                gameState.plants.reduce((sum, p) => sum + p.quantity, 0));
            
            for (let plant of gameState.plants) {
                if (remaining <= 0) break;
                if (plant.quantity > 0) {
                    const toRemove = Math.min(plant.quantity, remaining);
                    plant.quantity -= toRemove;
                    remaining -= toRemove;
                }
            }
        }
        
        if (typeof effects.plants.removePercent === 'number') {
            gameState.plants.forEach(plant => {
                const removeCount = Math.floor(plant.quantity * effects.plants.removePercent);
                plant.quantity = Math.max(0, plant.quantity - removeCount);
            });
        }
        
        renderPlants();
    }
    
    // Apply equipment changes
    if (effects.equipment) {
        Object.entries(effects.equipment).forEach(([key, updates]) => {
            const item = gameState.inventory.equipment.find(e => e.key === key);
            if (item && updates) {
                Object.assign(item, updates);
            }
        });
        renderEquipment();
    }
    
    // Apply inventory changes
    if (effects.inventory) {
        Object.entries(effects.inventory).forEach(([key, updates]) => {
            const item = gameState.inventory.consumables.find(i => i.key === key);
            if (item && updates) {
                Object.assign(item, updates);
            }
        });
        renderConsumables();
    }
}

function storeDelayedEffect(delayedEffect, effectId) {
    if (!gameState.activeEffects) {
        gameState.activeEffects = [];
    }
    
    gameState.activeEffects.push({
        id: effectId,
        effects: delayedEffect,
        daysRemaining: delayedEffect.daysDelay
    });
}

function closeCrisis() {
    if (crisisPopup) {
        crisisPopup.classList.remove('active');
    }
}

function handleCrisisChoice(option) {
    // Close crisis popup first
    closeCrisis();

    // Apply cost/balance changes
    if (typeof option.cost === 'number') {
        adjustBalance(-option.cost);
    }

    // Apply immediate effects
    if (option.immediate && Object.keys(option.immediate).length > 0) {
        applyEffects(option.immediate);
    }

    // Store delayed effects if any
    if (option.delayed && Object.keys(option.delayed).length > 0) {
        storeDelayedEffect(option.delayed, option.id);
    }

    // Show Gill's educational message 
    if (option.gillMessage && option.gillMessage.trim()) {

        showGillMessage(option.gillMessage);

    }
}

function processDelayedEffects() {
    if (!gameState.activeEffects || gameState.activeEffects.length === 0) {
        return;
    }
    
    const effectsToApply = [];
    const remainingEffects = [];
    
    gameState.activeEffects.forEach(effect => {
        effect.daysRemaining -= 1;
        
        if (effect.daysRemaining <= 0) {
            effectsToApply.push(effect.effects);
        } else {
            remainingEffects.push(effect);
        }
    });
    
    gameState.activeEffects = remainingEffects;
    
    effectsToApply.forEach(effects => {
        applyEffects(effects);
    });
}



// -------------------------------------------------------------------------


// Close popups when clicking outside
//
//
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

if (requestDetailPopup) {
    requestDetailPopup.addEventListener('click', function (e) {
        if (e.target === requestDetailPopup) {
            closeRequestDetail();
        }
    });
}

document.getElementById('inventory-popup').addEventListener('click', function (e) {
    if (e.target === this) {
        closeInventory();
    }
});
// -------------------------------------------------------------------------


if (fastForwardButton) {
    fastForwardButton.addEventListener('click', advanceDay);
}

if (gillNextButton) {
    gillNextButton.addEventListener('click', handleGillNext);
}

if (crisisPopup) {
    crisisPopup.addEventListener('click', function (e) {
        if (e.target === this) {
            closeCrisis();
        }
    });
}

if (gillPopup) {
    gillPopup.addEventListener('click', function (e) {
        if (e.target === this) {
            closeGill();
        }
    });
}

if (crisisOptionsEl) {
    crisisOptionsEl.innerHTML = '';
}

if (requestBackButton) {
    requestBackButton.addEventListener('click', closeRequestDetail);
}

if (requestAcceptButton) {
    requestAcceptButton.addEventListener('click', handleAcceptRequest);
}

if (requestCompleteButton) {
    requestCompleteButton.addEventListener('click', handleCompleteRequest);
}

if (requestCompleteCloseButton) {
    requestCompleteCloseButton.addEventListener('click', closeRequestCompletionPopup);
}

if (requestCompleteOkButton) {
    requestCompleteOkButton.addEventListener('click', closeRequestCompletionPopup);
}

if (requestCompletePopup) {
    requestCompletePopup.addEventListener('click', function (e) {
        if (e.target === this) {
            closeRequestCompletionPopup();
        }
    });
}

updateDayDisplay();
updateBalanceDisplay();
renderGameState();
renderCommunityBoard();
updateActiveRequestButtonVisibility();
applyFilterMaintenanceRules();

// Show Gill's welcome message on day 1
if (gameState.day === 1) {
    openGill(1);
}

if (typeof window !== 'undefined') {
    window.setBalance = setBalance;
    window.adjustBalance = adjustBalance;
    window.getCurrentBalance = () => gameState.balance;
    window.gameState = gameState;
    window.renderGameState = renderGameState;
    window.updateWaterStat = updateWaterStat;
    window.updatePlant = updatePlant;
    window.updateFish = updateFish;
    window.updateInventoryItem = updateInventoryItem;
}