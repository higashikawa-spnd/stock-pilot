import React from 'react';
import { Database, Save } from 'lucide-react';

const ProductMaster = ({ skus, handleSkuChange }) => {

    // Simple inline edit for now. In real app, maybe local state + save button.
    // For this mock, we update immediately but show "Edit Mode" feel.

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Database size={20} />
                    商品マスタ管理
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ※ 変更は即時反映されます
                </div>
            </div>

            <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'rgba(15, 23, 42, 0.95)', zIndex: 10 }}>
                            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', width: '30%' }}>商品情報</th>
                                <th style={{ padding: '1rem', width: '15%' }}>カテゴリ</th>
                                <th style={{ padding: '1rem', width: '10%' }}>発注ロット (CS)</th>
                                <th style={{ padding: '1rem', width: '10%' }}>MOQ (CS)</th>
                                <th style={{ padding: '1rem', width: '10%' }}>入数 (pcs)</th>
                                <th style={{ padding: '1rem', width: '15%' }}>容積 (m³/CS)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {skus.map(sku => (
                                <tr key={sku.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{sku.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sku.id}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.8rem' }}>
                                            {sku.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <input
                                            type="number"
                                            value={sku.orderLotCs}
                                            onChange={(e) => handleSkuChange(sku.id, 'orderLotCs', parseInt(e.target.value) || 0)}
                                            style={{ width: '100%', padding: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', color: '#fff', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <input
                                            type="number"
                                            value={sku.moqCs}
                                            onChange={(e) => handleSkuChange(sku.id, 'moqCs', parseInt(e.target.value) || 0)}
                                            style={{ width: '100%', padding: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', color: '#fff', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <input
                                            type="number"
                                            value={sku.caseSize}
                                            onChange={(e) => handleSkuChange(sku.id, 'caseSize', parseInt(e.target.value) || 0)}
                                            style={{ width: '100%', padding: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', color: '#fff', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <input
                                            type="number"
                                            step="0.001"
                                            value={sku.cbmPerCase}
                                            onChange={(e) => handleSkuChange(sku.id, 'cbmPerCase', parseFloat(e.target.value) || 0)}
                                            style={{ width: '100%', padding: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', color: '#fff', borderRadius: '4px' }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductMaster;
