import React from 'react';
import { ShoppingCart, Send, Package, AlertTriangle } from 'lucide-react';
import ContainerOptimizer from './ContainerOptimizer';

const OrderOperations = ({ skus, containerMetrics, updateOrderQty, onBack }) => {
    const orderingSkus = skus.filter(s => s.isOrdering);

    // Mock Submit Handler
    const handleSubmit = () => {
        alert("発注データを送信しました (Mock)");
        onBack();
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShoppingCart size={20} />
                    発注業務
                </h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={onBack} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-muted)', borderRadius: '4px', cursor: 'pointer' }}>
                        戻る
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={orderingSkus.length === 0}
                        style={{ padding: '0.5rem 1.5rem', background: 'var(--accent-primary)', border: 'none', color: '#fff', borderRadius: '4px', cursor: orderingSkus.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: orderingSkus.length === 0 ? 0.5 : 1 }}
                    >
                        <Send size={16} />
                        発注確定
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', gap: '1rem', overflow: 'hidden' }}>
                {/* Left: SKU List */}
                <div className="glass-panel" style={{ flex: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', fontWeight: 'bold' }}>
                        発注対象商品 ({orderingSkus.length})
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {orderingSkus.length === 0 ? (
                            <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)', flexDirection: 'column', gap: '1rem' }}>
                                <ShoppingCart size={48} opacity={0.2} />
                                <p>発注対象の商品がありません</p>
                                <button onClick={onBack} style={{ color: 'var(--accent-primary)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                                    在庫一覧から選択する
                                </button>
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead style={{ position: 'sticky', top: 0, background: 'rgba(15, 23, 42, 0.95)', zIndex: 10 }}>
                                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>
                                        <th style={{ padding: '1rem' }}>商品名 / SKU</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>発注数 (CS)</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>容積 / 個数</th>
                                        <th style={{ padding: '1rem' }}>ステータス</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderingSkus.map(sku => (
                                        <tr key={sku.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 'bold' }}>{sku.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sku.id}</div>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                    <button onClick={() => updateOrderQty(sku.id, 'decrement')} style={{ padding: '4px 8px', background: '#333', border: '1px solid #555', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                                                    <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 'bold', fontSize: '1rem' }}>{sku.orderQty}</span>
                                                    <button onClick={() => updateOrderQty(sku.id, 'increment')} style={{ padding: '4px 8px', background: '#333', border: '1px solid #555', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '4px' }}>Lot: {sku.orderLotCs}</div>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <div>{(sku.orderQty * sku.cbmPerCase).toFixed(2)} m³</div>
                                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{sku.orderQty * sku.caseSize} pcs</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                {sku.orderQty < sku.moqCs && (
                                                    <span style={{ color: '#f87171', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <AlertTriangle size={12} /> MOQ未満
                                                    </span>
                                                )}
                                                {sku.orderQty >= sku.moqCs && <span style={{ color: '#4ade80', fontSize: '0.8rem' }}>OK</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Right: Container Summary */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <ContainerOptimizer metrics={containerMetrics} skus={skus} />

                    <div className="glass-panel" style={{ marginTop: '1rem', padding: '1.5rem', flex: 1 }}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>発注前チェック</h4>
                        <ul style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingLeft: '1.2rem', color: '#ccc' }}>
                            <li>コンテナ積載率は適切ですか？ (80%以上推奨)</li>
                            <li>MOQ割れの商品はありせんか？</li>
                            <li>緊急度の高い欠品商品は含まれていますか？</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderOperations;
