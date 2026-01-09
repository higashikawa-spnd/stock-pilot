import React from 'react';

const EventSummaryTable = ({ events, metadata }) => {
    if (!events) return null;

    const rows = [
        {
            label: '⚠️ 欠品予測',
            date: events.stockoutDate || '-',
            qty: events.stockoutQty ? `${events.stockoutQty.toLocaleString()} 個不足` : '-',
            color: '#f87171',
            bg: 'rgba(239, 68, 68, 0.1)'
        },
        {
            label: '📉 最小在庫日',
            date: events.minStockDate || '-',
            qty: events.minStockLevel !== undefined ? `${events.minStockLevel.toLocaleString()} 個` : '-',
            color: '#fbbf24',
            bg: 'transparent'
        },
        {
            label: '🚚 次回入荷 (確定)',
            date: events.nextInboundDate || '未定',
            qty: events.nextInboundQty ? `${events.nextInboundQty.toLocaleString()} CS` : (events.nextInboundDate ? '数量未定' : '-'),
            color: '#4ade80',
            bg: 'rgba(74, 222, 128, 0.05)'
        },
        {
            label: '📦 次回大口出荷',
            date: events.nextLargeOutboundDate || 'なし',
            qty: events.nextLargeOutboundQty ? `${events.nextLargeOutboundQty.toLocaleString()} 個` : '-',
            color: '#94a3b8',
            bg: 'transparent'
        }
    ];

    return (
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>重要イベント・判断材料</h4>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', textAlign: 'left' }}>
                            <th style={{ padding: '0.5rem' }}>イベント</th>
                            <th style={{ padding: '0.5rem' }}>発生日</th>
                            <th style={{ padding: '0.5rem' }}>数量 / 状況</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: row.bg }}>
                                <td style={{ padding: '0.6rem 0.5rem', fontWeight: 'bold', color: row.color }}>{row.label}</td>
                                <td style={{ padding: '0.6rem 0.5rem' }}>{row.date}</td>
                                <td style={{ padding: '0.6rem 0.5rem' }}>{row.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventSummaryTable;
