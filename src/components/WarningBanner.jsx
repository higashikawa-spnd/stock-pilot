import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { format, addDays } from 'date-fns';

const WarningBanner = ({ skus }) => {
    // Detect alerts from SKUs
    const alerts = (skus || []).filter(s => {
        // Mock logic: if shortage > 0, assume stockout coming soon
        return (s.shortage || 0) > 0;
    }).map(s => {
        // Generate a mock date based on shortage severity
        // Real app would use s.stockoutDate from simulation
        const daysUntil = Math.max(2, Math.floor(2000 / (s.shortage || 1)));
        const date = format(addDays(new Date(), daysUntil), 'MM/dd');
        return {
            id: s.id,
            name: s.name,
            date: date,
            qty: s.shortage
        };
    }).slice(0, 3); // Max 3 items to save space

    if (alerts.length === 0) return null;

    return (
        <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderLeft: '4px solid #ef4444',
            padding: '0.8rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5', fontWeight: 'bold', fontSize: '0.9rem' }}>
                <AlertTriangle size={16} />
                <span>在庫枯渇アラート</span>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {alerts.map(alert => (
                    <li key={alert.id} style={{ fontSize: '0.85rem', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
                        <span>• {alert.name}</span>
                        <span style={{ color: '#fca5a5' }}>
                            {alert.date} 枯渇予測 ({alert.qty}個不足)
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WarningBanner;
