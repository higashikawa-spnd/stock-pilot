import React from 'react';
import { Factory, Box, AlertCircle } from 'lucide-react';

const ScopeHeader = ({ scope }) => {
    return (
        <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderBottom: '1px solid var(--border-light)',
            padding: '0.75rem 0',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            fontSize: '0.9rem',
            color: 'var(--text-muted)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Factory size={16} color="var(--accent-primary)" />
                <span>対象工場: <b style={{ color: 'var(--text-main)' }}>中国寧波 第2工場グループ</b></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Box size={16} color="var(--accent-primary)" />
                <span>対象シリーズ: <b style={{ color: 'var(--text-main)' }}>車内快適・収納グッズ</b></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} />
                <span>制約: 混載可 (同工場グループ内)</span>
            </div>
        </div>
    );
};

export default ScopeHeader;
