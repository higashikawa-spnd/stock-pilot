import React from 'react';
import { ArrowRight, Minus, Plus, Equal } from 'lucide-react';

const Card = ({ label, value, sub, color = 'var(--text-main)' }) => (
    <div className="glass-panel" style={{ padding: '1.25rem', flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{label}</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: color }}>{value}</div>
        {sub && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{sub}</div>}
    </div>
);

const Operator = ({ icon: Icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.5rem', color: 'var(--text-muted)' }}>
        <Icon size={24} />
    </div>
);

const MetricSummary = (props) => {
    const { data } = props;
    // data: { currentStock, forecastWeek, inboundWeek, lowestStock, criticalDate, maxShortage }
    if (!data) return null;

    // Calculate a simplified "Gap" for display logic clarity (Current + Inbound - LowPoint = DemandCovered... rough approx)
    // Actually, visual equation: Current - Demand + Inbound = Result
    // Here we use the values from the period ending at criticalDate or just next 2 weeks generally? 
    // Let's stick to the props passed: "ForecastWeek" is 7 days. 
    // For the Equation to look right, we should probably show values that roughly equate. 
    // But strictly speaking, LowestStock is a point-in-time result, not a simple sum of the total period.
    // We will label it as "Future Trend Check".

    const isShortage = data.lowestStock < 0;

    if (props.compact) {
        return (
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>現在庫:</span>
                    <span style={{ fontWeight: 'bold' }}>{data.currentStock.toLocaleString()}</span>
                </div>
                <ArrowRight size={14} color="var(--text-muted)" />
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>最低予測:</span>
                    <span style={{ fontWeight: 'bold', color: isShortage ? '#f87171' : '#4ade80' }}>
                        {data.lowestStock.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: isShortage ? '#f87171' : '#4ade80', background: isShortage ? 'rgba(248,113,113,0.1)' : 'rgba(74,222,128,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        {isShortage ? '枯渇注意' : '適正'}
                    </span>
                </div>
            </div>
        );
    }

    // Original Full View (Keep for other uses or drilling down if needed later, though currently unused in main Dash)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>▼ 将来在庫シミュレーション (向こう2週間)</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch' }}>
                <Card
                    label="① 現在庫"
                    value={data.currentStock.toLocaleString()}
                    sub="実在庫数"
                />

                <Operator icon={Minus} />

                <Card
                    label="② 今後の受注・予測"
                    value={(data.forecastWeek * 2).toLocaleString()}
                    sub="向こう2週間の総需要"
                />

                <Operator icon={Plus} />

                <Card
                    label="③ 入荷予定 (発注済)"
                    value={data.inboundWeek.toLocaleString()}
                    sub="確定している入荷"
                />

                <Operator icon={Equal} />

                <div className="glass-panel" style={{
                    padding: '1.25rem',
                    flex: 1.2,
                    minWidth: '220px',
                    background: isShortage ? 'rgba(248, 113, 113, 0.15)' : 'rgba(74, 222, 128, 0.1)',
                    border: isShortage ? '1px solid #f87171' : '1px solid #4ade80'
                }}>
                    <div style={{ fontSize: '0.85rem', color: isShortage ? '#fca5a5' : '#86efac', marginBottom: '0.5rem' }}>
                        ④ {data.criticalDate ? `${data.criticalDate} 時点の予想在庫` : '予想最低在庫'}
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: isShortage ? '#f87171' : '#4ade80' }}>
                        {isShortage ? `▲ ${Math.abs(data.lowestStock).toLocaleString()}` : data.lowestStock.toLocaleString()} 個
                    </div>
                    <div style={{ fontSize: '0.9rem', color: isShortage ? '#fca5a5' : '#86efac', marginTop: '0.25rem' }}>
                        {isShortage
                            ? <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>在庫枯渇 (対応必須)</span>
                            : '需要に対して十分です'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricSummary;
