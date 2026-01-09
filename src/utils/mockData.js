import { subDays, addDays, format } from 'date-fns';

const formatDate = (date) => format(date, 'MM/dd');

// --- 1. Metric Summary Calculation ---
export const getMetricSummary = (data) => {
    const next7Days = data.history.filter(d => d.type === 'future').slice(0, 7);
    const totalForecast = next7Days.reduce((acc, curr) => acc + curr.forecast, 0);
    const totalInbound = next7Days.reduce((acc, curr) => acc + (curr.inboundPlan || 0), 0);

    // Find min stock level in future (Limit to next 28 days for immediacy)
    const futureData = data.history.filter(d => d.type === 'future').slice(0, 28);
    const minStockEntry = futureData.reduce((prev, curr) => prev.stockLevel < curr.stockLevel ? prev : curr, futureData[0]);

    const lowestStock = minStockEntry.stockLevel;
    const criticalDate = minStockEntry.date;

    // Deficit is defined as Stock < 0 (Unable to fulfill demand)
    const maxShortage = lowestStock < 0 ? Math.abs(lowestStock) : 0;

    return {
        forecastWeek: totalForecast,
        inboundWeek: totalInbound,
        lowestStock: lowestStock,
        criticalDate: criticalDate,
        maxShortage: maxShortage,
        // Status is strictly based on being able to fulfill demand
        status: lowestStock < 0 ? 'critical' : (lowestStock < data.safetyStock ? 'warning' : 'ok')
    };
};

// --- 2. Inventory Simulation Data (Generic Logic) ---
export const getInventorySimulationData = () => {
    const today = new Date();
    const data = [];
    let currentStock = 2500; // Increased base stock for auto parts scale
    const safetyStock = 800;

    // Past 28 days
    for (let i = 28; i > 0; i--) {
        const date = subDays(today, i);
        const shipment = Math.floor(Math.random() * 150) + 50;
        const inbound = i % 14 === 0 ? 1200 : 0; // Less frequent inbound for auto parts?
        currentStock = currentStock - shipment + inbound;
        data.push({
            date: formatDate(date),
            type: 'past',
            shipmentActual: shipment,
            stockLevel: currentStock,
            inbound: inbound > 0 ? inbound : null,
            safetyStock,
        });
    }
    const currentStockSnapshot = currentStock;
    let simulatedStock = currentStockSnapshot;

    // Future 56 days
    for (let i = 0; i < 56; i++) {
        const date = addDays(today, i);
        let predictedDemand = Math.floor(Math.random() * 120) + 80;
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        if (isWeekend) predictedDemand += 60; // Higher sales on weekends for auto shops
        const confirmedOrder = i < 14 ? Math.floor(predictedDemand * 0.95) : null;

        // Introduce a gap where stock goes negative for demo
        // Simulating a container arrival that is slightly late or insufficient
        const scheduledInbound = i === 25 ? 2000 : 0;

        const outflow = confirmedOrder !== null ? confirmedOrder : predictedDemand;
        simulatedStock = simulatedStock - outflow + scheduledInbound;
        data.push({
            date: formatDate(date),
            type: 'future',
            orderConfirmed: confirmedOrder,
            forecast: predictedDemand,
            inboundPlan: scheduledInbound > 0 ? scheduledInbound : null,
            stockLevel: simulatedStock,
            safetyStock,
        });
    }

    return {
        history: data,
        currentStock: currentStockSnapshot,
        safetyStock,
    };
};

// --- 3. Scope & Constants ---
export const FACTORIES = [
    { id: 'ningbo_2', name: '中国寧波 第2工場グループ' },
    { id: 'vietnam_1', name: 'ベトナム ホーチミン第1工場' },
    { id: 'japan_kanto', name: '国内 関東提携工場' }
];

export const SERIES = [
    { id: 'car_interior', name: '車内快適・収納グッズ' },
    { id: 'outdoor', name: 'アウトドア・キャンプ用品' },
    { id: 'pet_care', name: 'ペットドライブ用品' }
];

export const getSimulationScope = (factoryId, seriesId) => {
    const factory = FACTORIES.find(f => f.id === factoryId) || FACTORIES[0];
    const series = SERIES.find(s => s.id === seriesId) || SERIES[0];
    return {
        factoryName: factory.name,
        productSeries: series.name,
        totalSKUs: 6, // Mock count
        constraints: '混載可 (同工場グループ内)',
    };
};
// Legacy export for specific imports if needed, though mostly replaced by dynamic call
export const SimulationScope = getSimulationScope('ningbo_2', 'car_interior');

// --- 4. SKU Data (Dynamic based on Series) ---
export const getSKUData = (factoryId = 'ningbo_2', seriesId = 'car_interior') => {
    // Generate different mock data based on Series ID
    if (seriesId === 'outdoor') {
        return [
            { id: 'OD-TN-001', name: 'ワンタッチテント 3人用', category: 'テント', shortage: 200, cbmPerCase: 0.08, caseSize: 4, orderLotCs: 10, moqCs: 20, factory: '寧波第2', lifecycle: '季節', turnoverRate: '高' },
            { id: 'OD-CH-005', name: '折りたたみアウトドアチェア', category: 'チェア', shortage: 50, cbmPerCase: 0.12, caseSize: 6, orderLotCs: 5, moqCs: 10, factory: '寧波第2', lifecycle: '定番', turnoverRate: '中' },
            { id: 'OD-TB-102', name: 'アルミロールテーブル M', category: 'テーブル', shortage: 150, cbmPerCase: 0.05, caseSize: 8, orderLotCs: 10, moqCs: 30, factory: '寧波第2', lifecycle: '準定番', turnoverRate: '中' },
            { id: 'OD-BBQ-99', name: 'ポータブルBBQグリル', category: 'グリル', shortage: 0, cbmPerCase: 0.06, caseSize: 4, orderLotCs: 5, moqCs: 10, factory: '寧波第2', lifecycle: '季節', turnoverRate: '低' },
        ];
    }

    if (seriesId === 'pet_care') {
        return [
            { id: 'PT-ST-001', name: 'ペット用 ドライブシート 撥水', category: 'シート', shortage: 300, cbmPerCase: 0.03, caseSize: 20, orderLotCs: 10, moqCs: 20, factory: '寧波第2', lifecycle: '定番', turnoverRate: '高' },
            { id: 'PT-CG-002', name: '折りたたみペットケージ M', category: 'ケージ', shortage: 80, cbmPerCase: 0.15, caseSize: 1, orderLotCs: 5, moqCs: 5, factory: '寧波第2', lifecycle: '定番', turnoverRate: '中' },
            { id: 'PT-BL-044', name: 'ふわふわペットブランケット', category: '寝具', shortage: 0, cbmPerCase: 0.08, caseSize: 30, orderLotCs: 2, moqCs: 10, factory: '寧波第2', lifecycle: '季節', turnoverRate: '高' },
        ];
    }

    // Default: Car Interior
    return [
        {
            id: 'NK-DH-001',
            name: '車内用 ドリンクホルダー スリムタイプ',
            category: 'ドリンクホルダー',
            shortage: 450,
            cbmPerCase: 0.025,
            caseSize: 24, // pcs/case
            orderLotCs: 10, // cases
            moqCs: 20, // cases
            factory: '寧波第2',
            lifecycle: '季節',
            turnoverRate: '高'
        },
        {
            id: 'NK-ST-102',
            name: '運転席用 低反発シートクッション BK',
            category: 'シート・クッション',
            shortage: 120,
            cbmPerCase: 0.12,
            caseSize: 10,
            orderLotCs: 6,
            moqCs: 12,
            factory: '寧波第2',
            lifecycle: '定番',
            turnoverRate: '高'
        },
        {
            id: 'NK-TB-210',
            name: 'トランク用 折りたたみ収納ボックス L',
            category: 'トランク収納',
            shortage: 320,
            cbmPerCase: 0.045,
            caseSize: 12,
            orderLotCs: 20,
            moqCs: 40,
            factory: '寧波第2',
            lifecycle: '準定番',
            turnoverRate: '中'
        },
        {
            id: 'NK-SS-305',
            name: 'フロントガラス用 サンシェード（Mサイズ）',
            category: 'サンシェード',
            shortage: 600,
            cbmPerCase: 0.015,
            caseSize: 50,
            orderLotCs: 10,
            moqCs: 20,
            factory: '寧波第2',
            lifecycle: '季節',
            turnoverRate: '高'
        },
        {
            id: 'NK-HL-055',
            name: 'LEDヘッドライトバルブ H4 Hi/Lo',
            category: 'ライト・ランプ',
            shortage: 0, // No shortage
            cbmPerCase: 0.008,
            caseSize: 40,
            orderLotCs: 5,
            moqCs: 10,
            factory: '寧波第2',
            lifecycle: '定番',
            turnoverRate: '中'
        }, {
            id: 'NK-USB-88',
            name: '急速充電 USBカーチャージャー 2ポート',
            category: '電子機器',
            shortage: 0,
            cbmPerCase: 0.005,
            caseSize: 100,
            orderLotCs: 5,
            moqCs: 10,
            factory: '寧波第2',
            lifecycle: '定番',
            turnoverRate: '高'
        }
    ];
};

// --- 5. Container Calculation Logic ---
export const calculateContainerMetrics = (skus) => {
    let totalCBM = 0;
    let totalCases = 0;

    skus.forEach(sku => {
        // Use orderQty if editing, otherwise fallback to default shortage
        // If isOrdering is explicitly false, skip (count as 0)
        if (sku.hasOwnProperty('isOrdering') && !sku.isOrdering) {
            return;
        }

        const quantity = sku.hasOwnProperty('orderQty') ? sku.orderQty : sku.shortage;

        totalCases += quantity;
        totalCBM += quantity * sku.cbmPerCase;
    });

    const cap40HQ = 65; // m3
    const cap20F = 28;  // m3

    const fillRate40HQ = (totalCBM / cap40HQ) * 100;
    const fillRate20F = (totalCBM / cap20F) * 100;

    let recommendation = '';

    // Logic to generate recommendation text
    if (totalCBM > cap40HQ) {
        recommendation = `40HQ × 1本では足りません (${(totalCBM - cap40HQ).toFixed(1)} m³超過)。20Fを追加するか、優先度の低いSKUをカットしてください。`;
    } else if (fillRate40HQ > 80) {
        recommendation = '40HQ × 1本への積載が最適です。充填率も良好です。';
    } else if (totalCBM > cap20F) {
        recommendation = `20Fには入り切りません。40HQで混載するか、数量を増やして40HQを埋めることを推奨します。`;
    } else {
        recommendation = '20F × 1本で十分です。';
    }

    return {
        totalCBM,
        totalCases,
        fillRate40HQ: Math.min(fillRate40HQ, 100),
        fillRate20F: Math.min(fillRate20F, 100),
        isOver40HQ: totalCBM > cap40HQ,
        isOver20F: totalCBM > cap20F,
        recommendation
    };
};

// --- 6. Robust SKU Simulation (New strict schema) ---
export const simulateSkuInventory = (skuId) => {
    // 1. Resolve SKU (Fallback if missing)
    const skus = getSKUData();
    const sku = skus.find(s => s.id === skuId) || skus[0];

    // 2. Constants for Simulation
    const PAST_DAYS = 30;
    const FUTURE_DAYS = 90;
    const TOTAL_DAYS = PAST_DAYS + FUTURE_DAYS;
    const today = new Date(); // Fixed for session? ideal is fixed, but Date() ok for mock.

    // Initial Stock (Back-calculate)
    // If shortage > 0, we want current stock to be low ~ PAST_DAYS * DailyConsumption
    // If no shortage, we want it high.
    // Let's set a Target Current Stock based on shortage status.
    const isShortage = (sku.shortage || 0) > 0;
    const dailyConsumption = 30; // approx
    let currentStockTarget = isShortage ? 50 : 1000;

    // We will simulate from START (Past 30 days ago) to END (Future 90 days)
    // To land on currentStockTarget at index=30 (Today), startStock = currentStockTarget - TotalIncoming + TotalOutgoing
    // Simplified: Just run forward simulation.

    let stock = currentStockTarget + (PAST_DAYS * dailyConsumption) - (Math.floor(PAST_DAYS / 14) * 800);
    // This is messy. Let's precise run.
    stock = isShortage ? 300 : 2500;

    const points = [];
    const events = {
        stockoutDate: null,
        minStockDate: null,
        minStockLevel: Infinity,
        nextInboundDate: null,
        nextLargeOutboundDate: null
    };

    for (let i = 0; i < TOTAL_DAYS; i++) {
        // Timeline offset: i=0 is 30 days ago. i=30 is Today.
        const dayOffset = i - PAST_DAYS;
        const dateObj = addDays(today, dayOffset);
        const dateStr = formatDate(dateObj);
        const isPast = dayOffset < 0;
        const isFuture = dayOffset >= 0;

        // Daily Events
        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
        let demand = Math.floor(Math.random() * 20) + 10; // Base Demand
        if (isWeekend) demand += 15;

        // Arrivals (Every 2 weeks approx)
        let arrival = 0;
        const cycleDay = (i % 20);
        if (cycleDay === 0 && i !== 0) {
            arrival = isShortage ? 0 : 800; // If shortage, maybe delay arrival
        }
        // Force a specific arrival for shortage recovery in future
        if (isShortage && dayOffset === 25) {
            arrival = 1000;
            events.nextInboundDate = dateStr;
        }
        if (!isShortage && isFuture && arrival > 0 && !events.nextInboundDate) {
            events.nextInboundDate = dateStr;
        }

        // Shipments (Past: Actual, Future: Planned)
        let shipment = demand; // Simplification: Demand is met 100% normally
        // If stock is low, shipment might be capped (lost sales), but for inventory chart usually we plot demand.
        // Let's assume Shipment = Demand for stock calculation.

        // Large outbound event mock
        if (dayOffset === 10 && !isShortage) {
            shipment += 300;
            if (isFuture) events.nextLargeOutboundDate = dateStr;
        }

        // Calculate Stock End of Day
        stock = stock + arrival - shipment;

        // Recording stats for future
        if (isFuture) {
            if (stock < 0 && !events.stockoutDate) {
                events.stockoutDate = dateStr;
            }
            if (stock < events.minStockLevel) {
                events.minStockLevel = stock;
                events.minStockDate = dateStr;
            }
        }

        // Build Data Point (Strict Schema)
        points.push({
            date: dateStr,
            inventoryActual: isPast ? stock : null,
            inventoryProjected: isFuture ? stock : null,
            demandForecast: isFuture ? demand : null,
            arrivals: arrival > 0 ? arrival : null,
            shipments: shipment > 0 ? shipment : null, // For markers if needed
            type: isPast ? 'past' : 'future', // Helper
            stockLevel: stock // Legacy support if needed, but per spec prefer specific keys
        });
    }

    // fallback check
    if (points.length === 0) {
        // Should never happen loop logic 0 to 120.
        // But if loop fails:
        return { history: generateFallback(sku.id), skuName: sku.name, events };
    }

    return {
        skuId: sku.id,
        skuName: sku.name,
        history: points,
        // Calculate metadata
        metadata: {
            currentStock: points[PAST_DAYS].inventoryProjected || points[PAST_DAYS - 1].inventoryActual || 0,
            minStock: events.minStockLevel === Infinity ? 0 : events.minStockLevel
        },
        events
    };
};

// Emergency Generator
const generateFallback = (id) => {
    return Array.from({ length: 60 }, (_, i) => ({
        date: formatDate(addDays(new Date(), i)),
        inventoryActual: null,
        inventoryProjected: 100 - i,
        demandForecast: 1,
        type: 'future',
        stockLevel: 100 - i
    }));
};

// Alias for compatibility if still used by old code
export const getSKUInventoryHistory = simulateSkuInventory;
