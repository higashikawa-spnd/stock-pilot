import React, { useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';

const SidePanel = ({ isOpen, onClose, title, children, footerActions }) => {
    // 1. Lock Body Scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div style={{ position: 'relative', zIndex: 1000 }}>
            {/* 2. Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(2px)',
                    animation: 'fadeIn 0.2s ease-out'
                }}
            />

            {/* 3. Panel */}
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                height: '100vh',
                width: '100%',
                maxWidth: '600px',
                background: '#0f172a', // Dark Slate
                borderLeft: '1px solid var(--border-light)',
                boxShadow: '-4px 0 20px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1001,
                animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: 'translateX(0)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-card)'
                }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'var(--text-main)',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content (Scrollable) */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {children}
                </div>

                {/* Footer (Fixed) */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid var(--border-light)',
                    background: 'var(--bg-card)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '1rem'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.6rem 1.25rem',
                            background: 'transparent',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-muted)',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        閉じる
                    </button>
                    {footerActions}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            `}</style>
        </div>
    );
};

export default SidePanel;
