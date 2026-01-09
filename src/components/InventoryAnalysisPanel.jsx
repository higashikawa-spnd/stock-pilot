import React from 'react';
import InventoryBalanceChart from './InventoryBalanceChart';
import EventSummaryTable from './EventSummaryTable';

const InventoryAnalysisPanel = ({ historyData, skuName, events, metadata }) => {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {/* Upper: Chart (Flexible Height) */}
            <div style={{ flex: 1, minHeight: '300px', marginBottom: '1rem' }}>
                <InventoryBalanceChart
                    data={historyData}
                    skuName={skuName}
                    events={events}
                />
            </div>

            {/* Lower: Event Summary (Fixed/Auto Height) */}
            <div style={{ flexShrink: 0 }}>
                <EventSummaryTable events={events} metadata={metadata} />
            </div>
        </div>
    );
};

export default InventoryAnalysisPanel;
