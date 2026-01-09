import React, { useState, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, ShoppingCart, Settings, Box, Database } from 'lucide-react';

import Dashboard from './components/Dashboard';
import OrderOperations from './components/OrderOperations';
import ProductMaster from './components/ProductMaster';
import {
  getInventorySimulationData,
  getMetricSummary,
  getSKUData,
  calculateContainerMetrics
} from './utils/mockData.js';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- Global State ---
  const [data, setData] = useState(null); // Simulation Data (Global Context)
  const [metrics, setMetrics] = useState(null); // Key KPIs
  const [containerMetrics, setContainerMetrics] = useState(null); // Container Calc
  const [skus, setSkus] = useState(null); // SKU Master & Order State

  // --- Initialization ---
  useEffect(() => {
    const simulation = getInventorySimulationData();
    const summary = getMetricSummary(simulation);
    const skuData = getSKUData();

    // Initialize with Smart Order Defaults
    const initializedSkus = skuData.map(s => {
      const shortage = s.shortage || 0;
      const lot = s.orderLotCs || 1;
      const moq = s.moqCs || 0;

      let initialQty = 0;
      let isOrdering = false;

      if (shortage > 0) {
        isOrdering = true;
        const rawShortageCs = shortage;
        const lotAdjusted = Math.ceil(rawShortageCs / lot) * lot;
        initialQty = Math.max(lotAdjusted, moq);
      }

      return {
        ...s,
        isOrdering,
        orderQty: initialQty
      };
    });

    const cMetrics = calculateContainerMetrics(initializedSkus);

    setData(simulation.history);
    setMetrics({ ...summary, currentStock: simulation.currentStock, safetyStock: simulation.safetyStock });
    setSkus(initializedSkus);
    setContainerMetrics(cMetrics);
  }, []);

  // --- Handlers (Lifted from Dashboard) ---

  const handleSkuChange = (id, field, value) => {
    const newSkus = skus.map(s => {
      if (s.id === id) {
        if (field === 'isOrdering' && value === true) {
          const lot = s.orderLotCs || 1;
          const moq = s.moqCs || 0;
          const defaultStart = Math.max(lot, moq);
          return { ...s, isOrdering: true, orderQty: s.orderQty > 0 ? s.orderQty : defaultStart };
        }
        return { ...s, [field]: value };
      }
      return s;
    });
    setSkus(newSkus);
    setContainerMetrics(calculateContainerMetrics(newSkus));
  };

  const updateOrderQty = (skuId, mode) => {
    const sku = skus.find(s => s.id === skuId);
    if (!sku) return;

    const current = sku.orderQty || 0;
    const lot = sku.orderLotCs || 1;
    const moq = sku.moqCs || 0;

    let next;
    if (mode === 'increment') {
      if (current === 0) {
        next = Math.max(lot, moq);
      } else {
        next = current + lot;
      }
    } else {
      next = current - lot;
      if (next < moq) next = 0;
    }
    next = Math.max(0, next);

    handleSkuChange(skuId, 'orderQty', next);
  };

  // --- Navigation & Routing ---
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '在庫・需給確認' },
    { id: 'ordering', icon: ShoppingCart, label: '発注業務' },
    { id: 'master', icon: Database, label: '商品マスタ' },
  ];

  const renderContent = () => {
    // Show Loading
    if (!skus || !metrics) return <div className="flex-center" style={{ height: '100%', color: '#aaa' }}>System Initializing...</div>;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard
          onNavigate={setActiveTab}
          skus={skus}
          metrics={metrics}
          containerMetrics={containerMetrics}
          handleSkuChange={handleSkuChange}
          updateOrderQty={updateOrderQty}
        />;
      case 'ordering':
        return <OrderOperations
          skus={skus}
          containerMetrics={containerMetrics}
          updateOrderQty={updateOrderQty}
          onBack={() => setActiveTab('dashboard')}
        />;
      case 'master':
        return <ProductMaster
          skus={skus}
          handleSkuChange={handleSkuChange}
        />;
      default: return <div>Not Found</div>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="glass-panel" style={{
        margin: '0.5rem 1rem',
        padding: '0.8rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: '5px',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--accent-primary)', borderRadius: '6px' }}></div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            AI Demand<span className="text-accent">Flow</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>拠点: <b>関東物流センター</b></span>
          <span>Status: <span style={{ color: '#4ade80' }}>Online</span></span>
        </div>
      </header>

      <div className="page-container" style={{ display: 'flex', gap: '1rem', flex: 1, padding: '0 1rem 1rem 1rem', overflow: 'hidden' }}>
        {/* Sidebar Nav */}
        <nav className="glass-panel" style={{ width: '220px', padding: '1rem', height: 'fit-content', flexShrink: 0 }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: activeTab === item.id ? 'var(--accent-glow)' : 'transparent',
                    border: '1px solid transparent',
                    borderColor: activeTab === item.id ? 'var(--accent-primary)' : 'transparent',
                    borderRadius: 'var(--radius-sm)',
                    color: activeTab === item.id ? 'var(--text-main)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    fontSize: '0.9rem'
                  }}
                >
                  <item.icon size={18} color={activeTab === item.id ? 'var(--accent-primary)' : 'currentColor'} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
