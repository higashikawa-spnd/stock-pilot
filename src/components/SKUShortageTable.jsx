import React from 'react';
import { AlertCircle } from 'lucide-react';

const SKUShortageTable = ({ skus }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} color="#f87171" />
                在庫不足の内訳 (SKU別)
            </h3>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', textAlign: 'left' }}>
                            <th style={{ padding: '0.5rem' }}>SKU名</th>
                            <th style={{ padding: '0.5rem' }}>工場</th>
                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>不足数 (ケース)</th>
                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>ケース容積</th>
                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>必要CBM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skus.map(sku => (
                            <tr key={sku.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                    <div style={{ fontWeight: '600' }}>{sku.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sku.id}</div>
                                </td>
                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{sku.factory}</td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 'bold' }}>{sku.shortage.toLocaleString()}</td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: 'var(--text-muted)' }}>{sku.cbmPerCase} m³</td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                    {(sku.shortage * sku.cbmPerCase).toFixed(2)} m³
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SKUShortageTable;
