import React, { useState } from 'react';
import { Calendar, Filter, Download } from 'lucide-react';

const ForecastChart = () => {
    // Mock data points
    const data = [40, 45, 60, 55, 70, 65, 80, 85, 90, 85, 100, 95];

    return (
        <div style={{ position: 'relative', height: '300px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '2%', padding: '20px 0' }}>
            {/* Grid lines */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0 }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ width: '100%', height: '1px', background: 'var(--border-light)' }}></div>
                ))}
            </div>

            {/* Bars */}
            {data.map((h, i) => (
                <div key={i} style={{
                    flex: 1,
                    height: `${h}%`,
                    background: 'linear-gradient(180deg, var(--accent-primary) 0%, rgba(6,182,212,0.2) 100%)',
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'height 0.5s ease-out'
                }}>
                    <div style={{
                        opacity: 0,
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--bg-card)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        border: '1px solid var(--border-light)'
                    }} className="hover-tooltip">{h * 10}</div>
                </div>
            ))}
            <style>{`
        div:hover > .hover-tooltip { opacity: 1 !important; }
      `}</style>
        </div>
    );
};

const DemandForecast = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="text-accent" style={{ fontSize: '1.5rem' }}>AI Demand Forecast Analysis</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="glass-panel text-accent" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
                        <Calendar size={16} /> This Month
                    </button>
                    <button className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
                        <Filter size={16} /> Filter
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Download size={16} /> Export Report
                    </button>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Category: Beverages</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Confidence Score: <span style={{ color: '#4ade80' }}>98.5%</span></p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>PROJECTED GROWTH</p>
                        <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>+14.2%</p>
                    </div>
                </div>

                <div style={{ flex: 1, width: '100%' }}>
                    <ForecastChart />
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                </div>
            </div>
        </div>
    );
};

export default DemandForecast;
