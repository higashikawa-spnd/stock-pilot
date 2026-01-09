import React from 'react';
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    ReferenceArea
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel" style={{ padding: '1rem', backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid var(--border-light)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                <p className="label" style={{ fontWeight: 'bold', marginBottom: '0.5rem', borderBottom: '1px solid #333', paddingBottom: '4px' }}>{label}</p>
                {payload.map((pld) => (
                    <div key={pld.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: pld.color }}></div>
                            <span style={{ color: '#aaa' }}>{pld.name}</span>
                        </div>
                        <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{pld.value !== undefined && pld.value !== null ? pld.value.toLocaleString() : '-'}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const InventoryBalanceChart = ({ data, skuName, events }) => {
    const [debugMode, setDebugMode] = React.useState(false);

    // --- 1. Robust Fallback & Validation ---
    // ALWAYS use displayData for rendering, never 'data' directly
    let displayData = data;
    let isFallback = false;

    // Check if data is valid array with length
    if (!Array.isArray(displayData) || displayData.length === 0) {
        isFallback = true;
        // Generate fallback
        displayData = Array.from({ length: 90 }, (_, i) => ({
            date: `FB-${i}`,
            inventoryActual: i < 30 ? 100 - i : null,
            inventoryProjected: i >= 30 ? 70 - (i - 30) : null,
            demandForecast: 1,
            // Legacy support for safe rendering if mixed
            stockLevel: 100 - i,
            type: i < 30 ? 'past' : 'future'
        }));
    }

    // --- 2. Calculate Domain & Stats for Debug ---
    // Collect all finite values for Y-axis domain
    const allValues = displayData.flatMap(d => [d.inventoryActual, d.inventoryProjected].filter(v => Number.isFinite(v)));
    let minVal = allValues.length > 0 ? Math.min(...allValues) : 0;
    let maxVal = allValues.length > 0 ? Math.max(...allValues) : 100;

    // Add buffer if min==max
    if (minVal === maxVal) {
        minVal -= 10;
        maxVal += 10;
    }

    // Validation Counts for Debug
    const actualCount = displayData.filter(d => Number.isFinite(d.inventoryActual)).length;
    const projectedCount = displayData.filter(d => Number.isFinite(d.inventoryProjected)).length;
    const forecastCount = displayData.filter(d => Number.isFinite(d.demandForecast)).length;

    // Identify transition (Future start)
    const futureStartIndex = displayData.findIndex(d => d.type === 'future' || d.inventoryProjected !== null);
    const transitionDate = futureStartIndex > 0 ? displayData[futureStartIndex].date : null;

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '320px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Debug Toggle */}
            <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}>
                <button
                    onClick={() => setDebugMode(!debugMode)}
                    style={{ fontSize: '0.7rem', background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid #666', padding: '4px 8px', cursor: 'pointer', borderRadius: '4px' }}
                >
                    {debugMode ? 'Hide Debug' : 'Debug'}
                </button>
            </div>

            {/* Debug View */}
            {debugMode && (
                <div style={{
                    position: 'absolute', top: '30px', right: 0, width: '320px', maxHeight: '400px',
                    overflow: 'auto', background: 'rgba(0,0,0,0.95)', color: '#0f0', fontSize: '0.75rem',
                    padding: '12px', zIndex: 20, border: '1px solid #0f0', borderRadius: '4px',
                    fontFamily: 'monospace'
                }}>
                    <strong style={{ color: '#fff', borderBottom: '1px solid #666', display: 'block', marginBottom: '4px' }}>DEBUG: Data Analysis</strong>
                    <p>SKU: {skuName}</p>
                    <p>Rows: {displayData.length} (Fallback: {isFallback ? 'YES' : 'NO'})</p>
                    <p>Date Range: {displayData[0]?.date} ~ {displayData[displayData.length - 1]?.date}</p>
                    <p style={{ color: '#3b82f6' }}>Actual Points: {actualCount}</p>
                    <p style={{ color: '#a78bfa' }}>Projected Points: {projectedCount}</p>
                    <p style={{ color: '#94a3b8' }}>Forecast Points: {forecastCount}</p>
                    <p>Y-Domain: [{minVal}, {maxVal}]</p>
                    <div style={{ marginTop: '8px', borderTop: '1px dashed #444', paddingTop: '4px' }}>
                        <span style={{ color: '#fff' }}>First 3 Rows:</span>
                        <pre>{JSON.stringify(displayData.slice(0, 3), null, 2)}</pre>
                    </div>
                </div>
            )}

            {isFallback && (
                <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', color: '#f87171', background: 'rgba(0,0,0,0.8)', padding: '1rem', borderRadius: '8px', zIndex: 5, textAlign: 'center', border: '1px solid #f87171' }}>
                    <p style={{ fontWeight: 'bold' }}>⚠️ データ不足によりフォールバック表示中</p>
                    <span style={{ fontSize: '0.8rem', color: '#ccc' }}>Debugボタンで詳細を確認してください</span>
                </div>
            )}

            <div style={{ marginBottom: '0.5rem', paddingLeft: '1rem', borderLeft: '3px solid var(--accent-primary)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>表示中:</span> <span style={{ fontWeight: 'bold' }}>{skuName || 'Loading...'}</span>
            </div>

            <ResponsiveContainer width="100%" height="90%">
                <ComposedChart
                    data={displayData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />

                    {/* Forecast Zone Highlight */}
                    {transitionDate && (
                        <ReferenceArea x1={transitionDate} x2={displayData[displayData.length - 1].date} fill="#a78bfa" fillOpacity={0.05} />
                    )}

                    <XAxis
                        dataKey="date"
                        scale="point"
                        padding={{ left: 10, right: 10 }}
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#334155' }}
                        minTickGap={30}
                    />
                    <YAxis
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        domain={[minVal < 0 ? minVal : 'auto', 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}
                        verticalAlign="bottom"
                        height={36}
                    />

                    <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />

                    {/* Event Markers */}
                    {events?.stockoutDate && (
                        <ReferenceLine x={events.stockoutDate} stroke="#ef4444" label={{ position: 'insideTopRight', value: '欠品!!', fill: '#ef4444', fontSize: 12, fontWeight: 'bold' }} />
                    )}
                    {events?.nextInboundDate && (
                        <ReferenceLine x={events.nextInboundDate} stroke="#4ade80" strokeDasharray="3 3" label={{ position: 'top', value: '入荷', fill: '#4ade80', fontSize: 10 }} />
                    )}

                    {/* 1. ACTUAL (Past) */}
                    <Line
                        type="monotone"
                        dataKey="inventoryActual"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={false}
                        name="在庫実績"
                        isAnimationActive={false}
                        connectNulls={true}
                    />

                    {/* 2. PROJECTED (Future) */}
                    <Line
                        type="monotone"
                        dataKey="inventoryProjected"
                        stroke="#a78bfa"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={false} // Clean forecast line
                        name="在庫予測"
                        connectNulls={true}
                    />

                    {/* 3. FORECAST DEMAND (Area) */}
                    <Area
                        type="monotone"
                        dataKey="demandForecast"
                        fill="#94a3b8"
                        stroke="none"
                        fillOpacity={0.1}
                        name="予測需要"
                        connectNulls={true}
                    />

                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default InventoryBalanceChart;
