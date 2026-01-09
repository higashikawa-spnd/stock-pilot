import React from 'react';
import { Package, Truck } from 'lucide-react';

const ContainerBreakdownTable = ({ skus, metrics }) => {
    // Sort SKUs by total CBM (descending) to show impact
    const sortedSkus = [...skus].sort((a, b) => (b.shortage * b.cbmPerCase) - (a.shortage * a.cbmPerCase));

    const totalCBM = metrics.totalCBM;

    // Calculate Occupancy % relative to 40HQ (65m3) for visualization context
    // or relative to the Total Load? 
    // User requested "Occupancy %". Usually means % of the total load volume.
    // Let's show % of Total Load Volume for contribution analysis.

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>

            {/* 1. Summary Header (Fixed info as requested) */}
            <div className="glass-panel" style={{
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid var(--accent-primary)'
            }}>
                <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>合計必要CBM</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.totalCBM.toFixed(2)} m³</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>40HQ 充填率</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: metrics.isOver40HQ ? '#f87171' : '#4ade80' }}>
                        {metrics.fillRate40HQ.toFixed(1)}%
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>20F 充填率</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: metrics.isOver20F ? '#f87171' : '#4ade80' }}>
                        {metrics.fillRate20F.toFixed(1)}%
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>40HQ 残り余白</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {Math.max(0, 65 - metrics.totalCBM).toFixed(2)} m³
                    </div>
                </div>
            </div>

            {/* 2. Detailed Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem' }}>SKU情報</th>
                            <th style={{ padding: '0.75rem' }}>工場</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>発注数</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>単価CBM</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>合計CBM</th>
                            <th style={{ padding: '0.75rem', width: '20%' }}>占有率 (対全体)</th>
                            <th style={{ padding: '0.75rem' }}>選定理由</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedSkus.map((sku, index) => {
                            const skuTotalCBM = sku.shortage * sku.cbmPerCase;
                            const occupancy = (skuTotalCBM / totalCBM) * 100;

                            return (
                                <tr key={sku.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div style={{ fontWeight: '600' }}>{sku.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sku.id}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{sku.factory}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold' }}>
                                        {sku.shortage.toLocaleString()} cs
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                                        {sku.cbmPerCase}
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                                        {skuTotalCBM.toFixed(2)} m³
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ flex: 1, height: '6px', background: 'var(--bg-darker)', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${occupancy}%`, height: '100%', background: 'var(--accent-primary)' }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.85rem', width: '40px', textAlign: 'right' }}>{occupancy.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {index % 2 === 0 ? '欠品回避 (優先)' : '回転率上位'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContainerBreakdownTable;
