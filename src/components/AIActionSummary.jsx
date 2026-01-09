import React, { useEffect, useState } from 'react';
import { AlertOctagon, ArrowRight, Info } from 'lucide-react';
import { getInventorySimulationData, getMetricSummary } from '../utils/mockData.js';

const AIActionSummary = ({ onActionClick }) => {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        // Quick fetching of summary again locally or props could be passed. 
        // Ideally props, but for isolation here:
        const data = getInventorySimulationData();
        const metrics = getMetricSummary(data);
        setSummary(metrics);
    }, []);

    if (!summary) return null;

    return (
        <div className="glass-panel" style={{
            padding: '1rem',
            borderLeft: '4px solid #f87171',
            background: 'linear-gradient(90deg, rgba(248,113,113,0.1) 0%, rgba(15,23,42,0.8) 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ padding: '8px', background: '#f87171', borderRadius: '8px', color: '#fff', marginTop: '4px' }}>
                    <AlertOctagon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', lineHeight: '1.3', marginBottom: '0.5rem' }}>
                        {summary.maxShortage > 0
                            ? `このままでは ${summary.criticalDate} に在庫が枯渇します (${summary.maxShortage.toLocaleString()}個 不足)`
                            : '当面の在庫枯渇リスクはありません'}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-muted)' }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Info size={16} />
                            <span>
                                {summary.maxShortage > 0
                                    ? `主因: AI予測需要に対し、${summary.criticalDate}までの入荷予定が不足しています。`
                                    : '予測需要に対して十分な在庫と入荷予定があります。'}
                            </span>
                        </p>
                    </div>
                </div>
                {summary.maxShortage > 0 && (
                    <div style={{ alignSelf: 'center' }}>
                        <button
                            onClick={onActionClick}
                            className="btn-primary"
                            style={{
                                padding: '0.8rem 1.5rem',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                boxShadow: '0 4px 15px rgba(248, 113, 113, 0.4)'
                            }}
                        >
                            不足解消の発注案を確認する
                            <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIActionSummary;
