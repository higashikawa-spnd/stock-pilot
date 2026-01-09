import React from 'react';
// import SidePanel from './SidePanel'; // Removed
import ContainerBreakdownTable from './ContainerBreakdownTable';
import { Container, Truck } from 'lucide-react';

const ProgressBar = ({ label, value, max, color, isOver }) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                <span>{label} (Cap: {max} CBM)</span>
                <span style={{ fontWeight: 'bold', color: isOver ? '#f87171' : 'var(--text-main)' }}>
                    {value.toFixed(1)} CBM ({((value / max) * 100).toFixed(0)}%)
                </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--bg-darker)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: isOver ? '#f87171' : color,
                    transition: 'width 0.5s ease-out'
                }}></div>
            </div>
        </div>
    );
};

const ContainerOptimizer = ({ metrics, skus }) => {
    const [isAccordionOpen, setIsAccordionOpen] = React.useState(false);

    // Calculate max height for simple transition roughly
    const contentStyle = {
        maxHeight: isAccordionOpen ? '400px' : '0px',
        opacity: isAccordionOpen ? 1 : 0,
        overflowY: 'auto', // Enable internal scroll
        transition: 'all 0.3s ease-in-out',
        borderTop: isAccordionOpen ? '1px solid var(--border-light)' : 'none',
        marginTop: isAccordionOpen ? '1rem' : '0'
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
            {/* Top Row: Header & Visuals */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                {/* 1. Header & Recommendation */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Truck size={20} color="var(--accent-primary)" />
                        コンテナ換算シミュレーション
                    </h3>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '1rem',
                        borderRadius: '8px',
                        borderLeft: '3px solid var(--accent-primary)',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        marginBottom: '1rem'
                    }}>
                        <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '0.25rem' }}>AI推奨プラン:</strong>
                        {metrics.recommendation}
                    </div>
                    <button
                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--accent-primary)',
                            color: 'var(--accent-primary)',
                            padding: '0.4rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <Container size={16} />
                        {isAccordionOpen ? '内訳を閉じる' : 'コンテナ内訳を表示 (SKU別)'}
                    </button>
                </div>

                {/* 2. Visual Bars */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>不足分 ({metrics.totalCases} ケース) を解消するために必要なコンテナ設計:</p>
                    <ProgressBar
                        label="40ft HQ"
                        value={metrics.totalCBM}
                        max={65}
                        color="#4ade80"
                        isOver={metrics.isOver40HQ}
                    />

                    <ProgressBar
                        label="20ft"
                        value={metrics.totalCBM}
                        max={28}
                        color="#60a5fa"
                        isOver={metrics.isOver20F}
                    />
                </div>
            </div>

            {/* Inline Accordion for Breakdown */}
            <div style={contentStyle}>
                <div style={{ paddingTop: '1rem' }}>
                    <ContainerBreakdownTable skus={skus} metrics={metrics} />
                </div>
            </div>
        </div>
    );
};

export default ContainerOptimizer;
