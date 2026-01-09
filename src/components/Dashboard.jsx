import React, { useEffect, useState } from 'react';
import {
    getSKUInventoryHistory,
    SimulationScope
} from '../utils/mockData.js';
import ScopeHeader from './ScopeHeader';
import ContainerOptimizer from './ContainerOptimizer';
import InventoryAnalysisPanel from './InventoryAnalysisPanel';
import WarningBanner from './WarningBanner';
import { CheckCircle, Search } from 'lucide-react';

const Dashboard = ({ onNavigate, skus, metrics, containerMetrics, handleSkuChange, updateOrderQty }) => {
    // Selection State
    const [selectedSkuId, setSelectedSkuId] = useState(null);
    const [selectedSkuHistory, setSelectedSkuHistory] = useState(null);

    // Initial Selection
    useEffect(() => {
        if (!selectedSkuId && skus && skus.length > 0) {
            setSelectedSkuId(skus[0].id);
        }
    }, [skus, selectedSkuId]);

    // Fetch History when Selection Changes
    useEffect(() => {
        if (selectedSkuId) {
            const history = getSKUInventoryHistory(selectedSkuId);
            setSelectedSkuHistory(history);
        }
    }, [selectedSkuId]);

    if (!metrics || !containerMetrics || !skus) return <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>Loading...</div>;

    // Validation: Ensure selected SKU exists in current list
    const selectedSku = skus.find(s => s.id === selectedSkuId) || skus[0];

    // If still no SKU, panic (shouldn't happen if skus has items)
    if (!selectedSku) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>

            {/* --- TOP ROW: Global Context (Scrollable if needed, but intended to be fixed height) --- */}
            <div style={{
                flex: '0 0 auto',
                padding: '1rem',
                borderBottom: '1px solid var(--border-light)',
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <ScopeHeader />
                <WarningBanner skus={skus} />
                <ContainerOptimizer metrics={containerMetrics} skus={skus} />
            </div >

            {/* --- BOTTOM ROW: Operation (Split View) --- */}
            < div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* LEFT: SKU List (Scrollable) */}
                < div style={{
                    width: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid var(--border-light)',
                    background: 'rgba(0,0,0,0.2)'
                }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Search size={16} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>対象商品を選択 ({skus.length})</span>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {skus.map(sku => (
                            <div
                                key={sku.id}
                                onClick={() => setSelectedSkuId(sku.id)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    background: selectedSkuId === sku.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                    borderLeft: selectedSkuId === sku.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                    <div style={{ fontWeight: selectedSkuId === sku.id ? 'bold' : 'normal', fontSize: '0.9rem' }}>
                                        {sku.name}
                                    </div>
                                    {sku.isOrdering && (
                                        <CheckCircle size={14} color="var(--accent-primary)" />
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span>{sku.id}</span>
                                    <span>{sku.orderQty.toLocaleString()} cs</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div >

                {/* RIGHT: Graph & Controls */}
                < div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', overflowY: 'hidden' }}>
                    {selectedSku && selectedSkuHistory ? (
                        <>
                            {/* Control Bar */}
                            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{selectedSku.name}</h2>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{selectedSku.id}</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        発注ロット: <span style={{ color: '#fff' }}>{selectedSku.orderLotCs}CS</span> /
                                        MOQ: <span style={{ color: '#fff' }}>{selectedSku.moqCs}CS</span> /
                                        入数: <span style={{ color: '#fff' }}>{selectedSku.caseSize}個/CS</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedSku.isOrdering}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                // If turning on, set to at least MOQ or 0 if shortage is 0 but user forces it (though shortage usually dictates default)
                                                // If turning off, set qty to 0 physically or just ignore in calculation? 
                                                // User logic: isOrdering just enables the input. 
                                                handleSkuChange(selectedSku.id, 'isOrdering', checked);
                                            }}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.9rem' }}>発注対象にする</span>
                                    </label>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.9rem' }}>発注数:</span>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <button
                                                onClick={() => updateOrderQty(selectedSku.id, 'decrement')}
                                                disabled={!selectedSku.isOrdering}
                                                style={{
                                                    padding: '0.3rem 0.6rem',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: '1px solid var(--border-light)',
                                                    borderRight: 'none',
                                                    borderRadius: '4px 0 0 4px',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    opacity: !selectedSku.isOrdering ? 0.5 : 1
                                                }}
                                            >-</button>
                                            <input
                                                type="text"
                                                value={isNaN(selectedSku.orderQty) ? '-' : `${selectedSku.orderQty} CS`}
                                                readOnly
                                                disabled={!selectedSku.isOrdering}
                                                style={{
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid var(--border-light)',
                                                    color: 'var(--text-main)',
                                                    padding: '0.3rem 0.5rem',
                                                    width: '80px',
                                                    textAlign: 'center',
                                                    opacity: selectedSku.isOrdering ? 1 : 0.5
                                                }}
                                            />
                                            <button
                                                onClick={() => updateOrderQty(selectedSku.id, 'increment')}
                                                disabled={!selectedSku.isOrdering}
                                                style={{
                                                    padding: '0.3rem 0.6rem',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: '1px solid var(--border-light)',
                                                    borderLeft: 'none',
                                                    borderRadius: '0 4px 4px 0',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    opacity: !selectedSku.isOrdering ? 0.5 : 1
                                                }}
                                            >+</button>
                                        </div>
                                    </div>
                                    {selectedSku.isOrdering && selectedSku.orderQty < selectedSku.moqCs && selectedSku.orderQty > 0 && (
                                        <span style={{ fontSize: '0.8rem', color: '#f87171' }}>MOQ未満</span>
                                    )}
                                </div>
                            </div>

                            {/* Analysis Panel (Graph + Events) */}
                            <InventoryAnalysisPanel
                                historyData={selectedSkuHistory.history}
                                skuName={selectedSkuHistory.skuName}
                                events={selectedSkuHistory.events}
                                metadata={selectedSkuHistory.metadata}
                            />
                        </>
                    ) : (
                        <div className="flex-center" style={{ height: '100%' }}>読み込み中...</div>
                    )}
                </div >
            </div >

            {/* Global Update of Body to allow scroll if vertical space is small, but hidden on layout */}
            < style > {`
                body { overflow-y: auto; }
            `}</style >
        </div >
    );
};

export default Dashboard;
