import React, { useState } from 'react';
import { Package, AlertTriangle, Check, X } from 'lucide-react';

const OrderItem = ({ sku, name, currentStock, suggested, reason, confidence, onApprove, onReject }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 2fr 100px',
        gap: '1rem',
        padding: '1rem',
        borderBottom: '1px solid var(--border-light)',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.02)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '8px', background: 'var(--bg-darker)', borderRadius: '6px' }}>
                <Package size={20} color="var(--text-muted)" />
            </div>
            <div>
                <div style={{ fontWeight: '600' }}>{name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sku}</div>
            </div>
        </div>

        <div style={{ fontSize: '0.9rem' }}>{currentStock} 個</div>

        <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>
            {suggested} 個
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {reason}
            <div style={{ fontSize: '0.75rem', marginTop: '2px', color: '#666' }}>信頼度: {confidence}%</div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
                onClick={onApprove}
                className="btn-primary"
                style={{
                    padding: '0',
                    width: '32px', height: '32px',
                    background: '#4ade80', color: '#111',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="発注確定">
                <Check size={18} />
            </button>
            <button
                onClick={onReject}
                style={{
                    border: '1px solid var(--border-light)', background: 'transparent', color: '#f87171',
                    borderRadius: 'var(--radius-sm)', width: '32px', height: '32px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                }}
                title="見送り">
                <X size={18} />
            </button>
        </div>
    </div>
);

import { getSKUData } from '../utils/mockData';

const OrderingInterface = () => {
    // Initialize with data from our centralized mock source
    const [orders, setOrders] = useState(() => {
        const skus = getSKUData();
        return skus.map((sku, index) => ({
            id: index + 1,
            sku: sku.id,
            name: sku.name,
            currentStock: Math.floor(sku.shortage * 0.2), // Simulate low stock
            suggested: sku.shortage,
            reason: index % 2 === 0 ? '欠品リスクあり (安全在庫割れ)' : 'シーズン需要増 (AI予測)',
            confidence: 90 + Math.floor(Math.random() * 9)
        }));
    });

    const handleApprove = (id) => {
        // In a real app, this would send an API request
        setOrders(orders.filter(o => o.id !== id));
    };

    const handleReject = (id) => {
        setOrders(orders.filter(o => o.id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="text-accent" style={{ fontSize: '1.5rem' }}>発注推奨リスト</h2>
                <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', border: '1px solid #fbbf24', background: 'rgba(251, 191, 36, 0.1)' }}>
                    <AlertTriangle size={16} color="#fbbf24" />
                    <span style={{ fontSize: '0.9rem', color: '#fbbf24' }}>15:00までに判断が必要な品目: {orders.length}件</span>
                </div>
            </div>

            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Table Header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 2fr 100px',
                    gap: '1rem',
                    padding: '1rem',
                    borderBottom: '1px solid var(--border-light)',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    background: 'rgba(0,0,0,0.2)'
                }}>
                    <div>商品情報</div>
                    <div>現在庫</div>
                    <div>AI提案数</div>
                    <div>提案理由</div>
                    <div>操作</div>
                </div>

                {/* List */}
                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {orders.length === 0 ? (
                        <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>すべて処理済みです</div>
                    ) : (
                        orders.map(order => (
                            <OrderItem
                                key={order.id}
                                {...order}
                                onApprove={() => handleApprove(order.id)}
                                onReject={() => handleReject(order.id)}
                            />
                        ))
                    )}
                </div>

                {/* Footer Actions */}
                {orders.length > 0 && (
                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button className="glass-panel" style={{ padding: '0.8rem 1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>全件見送り</button>
                        <button className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>一括承認</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderingInterface;
