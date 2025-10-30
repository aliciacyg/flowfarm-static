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

const DEFAULT_STARTING_BALANCE = 20;


// Game State Object
const gameState = {
    day: 1,
    balance: DEFAULT_STARTING_BALANCE,
    waterStats: [
        {
            key: 'ammonia',
            label: 'Ammonia (NH₃)',
            displayValue: '0.7 ppm',
            safeRange: 'Safe: 0-0.5 ppm',
            percent: 75,
            statusClass: 'danger'
        },
        {
            key: 'nitrite',
            label: 'Nitrite (NO₂⁻)',
            displayValue: '0.1 ppm',
            safeRange: 'Safe: 0-0.5 ppm',
            percent: 20,
            statusClass: ''
        },
        {
            key: 'nitrate',
            label: 'Nitrate (NO₃⁻)',
            displayValue: '30 ppm',
            safeRange: 'Optimal: 40-80 ppm',
            percent: 60,
            statusClass: 'warning'
        },
        {
            key: 'ph',
            label: 'pH Level',
            displayValue: '6.5',
            safeRange: 'Safe: 6.8-7.2',
            percent: 55,
            statusClass: 'warning'
        },
        {
            key: 'temperature',
            label: 'Temperature',
            displayValue: '65°F',
            safeRange: 'Optimal: 65°F',
            percent: 50,
            statusClass: ''
        },
        {
            key: 'dissolved-oxygen',
            label: 'Dissolved Oxygen',
            displayValue: '8.5 mg/L',
            safeRange: 'Safe: >5 mg/L',
            percent: 85,
            statusClass: ''
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
        }
    ],
    fish: [
        {
            key: 'goldfish-1',
            icon: '🐟',
            name: 'Goldfish #1',
            species: 'Common Goldfish',
            size: '12 cm',
            age: '120 days',
            healthPercent: 95,
            healthLabel: 'Healthy'
        },
        {
            key: 'goldfish-2',
            icon: '🐟',
            name: 'Goldfish #2',
            species: 'Common Goldfish',
            size: '10 cm',
            age: '90 days',
            healthPercent: 85,
            healthLabel: 'Healthy'
        },
        {
            key: 'tilapia-1',
            icon: '🐠',
            name: 'Tilapia #1',
            species: 'Nile Tilapia',
            size: '18 cm',
            age: '150 days',
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
                quantityLabel: '250g remaining',
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
            { key: 'lettuce-harvest', icon: '🥬', name: 'Lettuce', quantity: 12 },
            { key: 'tomato-harvest', icon: '🍅', name: 'Tomato', quantity: 0 },
            { key: 'basil-harvest', icon: '🌿', name: 'Basil', quantity: 8 },
            { key: 'goldfish-harvest', icon: '🐟', name: 'Goldfish', quantity: 2 },
            { key: 'tilapia-harvest', icon: '🐠', name: 'Tilapia', quantity: 0 }
        ]
    },

    activeEffects: [],

    activeCommunityRequests: []
};

// Stubs for crisis event system
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

// Gill's daily messages
const gillMessagesByDay = {
    1: [
        `Hey there! I'm Gill. I'm here to guide you through your aquaponics journey.`,
        `Welcome to FlowFarm! I'll pop up each day with a quick check-in and some tips.`,
        `Aquaponics is all about teamwork: fish provide nutrients for plants, and plants clean the water for fish.`,
        `Start by exploring your Stats and Inventory panels. Your system is counting on you!`
    ]
};

let activeGillMessages = [];
let activeGillIndex = 0;


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

// Community board popup management
//
//
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
    gameState.day += 1;
    updateDayDisplay();
    
    // Show Gill's message first if available for this day
    if (gillMessagesByDay[gameState.day]) {
        openGill(gameState.day);
    }
    
    triggerCrisisEvent(gameState.day);
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
        fillEl.className = 'stat-fill';
        if (stat.statusClass) {
            fillEl.classList.add(stat.statusClass);
        }
        fillEl.style.width = `${stat.percent}%`;
        barEl.appendChild(fillEl);

        const valueEl = document.createElement('div');
        valueEl.className = 'stat-value';
        valueEl.textContent = `${stat.displayValue} (${stat.safeRange})`;

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
            <strong>Size:</strong> ${fish.size}<br>
            <strong>Age:</strong> ${fish.age}`;

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
        container.appendChild(description);
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
                option.onSelect({ day: gameState.day });
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

updateDayDisplay();
updateBalanceDisplay();
renderGameState();

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
