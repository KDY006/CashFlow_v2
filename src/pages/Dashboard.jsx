import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { formatCurrency, readVietnameseNumber, getCategoryColor } from '../utils/formatters';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { transactions, categories, getBudgetsForMonth } = useData();

  // Filter State: 'month' | 'year' | 'week'
  const [filterType, setFilterType] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date('2026-05-12T00:00:00'));
  const [mainTab, setMainTab] = useState('expense'); // 'expense' | 'income'
  const [subTab, setSubTab] = useState('child'); // 'child' | 'parent'

  // Time navigation
  const changeTime = (direction) => {
    const next = new Date(currentDate);
    if (filterType === 'month') {
      next.setMonth(next.getMonth() + direction);
    } else if (filterType === 'year') {
      next.setFullYear(next.getFullYear() + direction);
    } else if (filterType === 'week') {
      next.setDate(next.getDate() + direction * 7);
    }
    setCurrentDate(next);
  };

  const timeDisplay = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth() + 1;
    if (filterType === 'month') return `Tháng ${m}/${y}`;
    if (filterType === 'year') return `Năm ${y}`;
    // Week
    const d = currentDate.getDate();
    return `Tuần ngày ${d}/${m}/${y}`;
  }, [filterType, currentDate]);

  // Lọc giao dịch theo khoảng thời gian được chọn
  const filteredTransactions = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();

    return transactions.filter(t => {
      const d = new Date(t.transaction_date);
      if (filterType === 'month') {
        return d.getFullYear() === y && d.getMonth() === m;
      }
      if (filterType === 'year') {
        return d.getFullYear() === y;
      }
      if (filterType === 'week') {
        // 7 ngày xung quanh
        const start = new Date(currentDate);
        start.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Thứ 2
        start.setHours(0,0,0,0);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23,59,59,999);
        return d >= start && d <= end;
      }
      return true;
    });
  }, [transactions, filterType, currentDate]);

  // Tổng thu & Tổng chi
  const { totalExpense, totalIncome } = useMemo(() => {
    let exp = 0;
    let inc = 0;
    filteredTransactions.forEach(t => {
      const cat = categories.find(c => c.id === t.category_id);
      if (cat?.type === 'income') {
        inc += Number(t.amount);
      } else {
        exp += Number(t.amount);
      }
    });
    return { totalExpense: exp, totalIncome: inc };
  }, [filteredTransactions, categories]);

  const netCashflow = totalIncome - totalExpense;

  // Dữ liệu Biểu đồ So sánh Thu & Chi theo tháng của năm
  const barChartData = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    const monthlyIncome = Array(12).fill(0);
    const monthlyExpense = Array(12).fill(0);

    transactions.forEach(t => {
      const d = new Date(t.transaction_date);
      if (d.getFullYear() === currentYear) {
        const monthIdx = d.getMonth();
        const cat = categories.find(c => c.id === t.category_id);
        if (cat?.type === 'income') {
          monthlyIncome[monthIdx] += Number(t.amount);
        } else {
          monthlyExpense[monthIdx] += Number(t.amount);
        }
      }
    });

    return {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      datasets: [
        {
          label: 'Thu nhập',
          data: monthlyIncome,
          backgroundColor: '#10b981',
          borderRadius: 6
        },
        {
          label: 'Chi tiêu',
          data: monthlyExpense,
          backgroundColor: '#ef4444',
          borderRadius: 6
        }
      ]
    };
  }, [transactions, categories, currentDate]);

  // Dữ liệu Cơ cấu phân bổ (Doughnut Chart)
  const categoryAllocation = useMemo(() => {
    const isExpense = mainTab === 'expense';
    const relevant = filteredTransactions.filter(t => {
      const cat = categories.find(c => c.id === t.category_id);
      return isExpense ? cat?.type === 'expense' : cat?.type === 'income';
    });

    const grouped = {};

    relevant.forEach(t => {
      const cat = categories.find(c => c.id === t.category_id);
      if (!cat) return;

      let key = cat.name;
      if (subTab === 'parent' && cat.parent_id) {
        const parent = categories.find(c => c.id === cat.parent_id);
        key = parent ? parent.name : cat.name;
      }

      grouped[key] = (grouped[key] || 0) + Number(t.amount);
    });

    const total = Object.values(grouped).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

    const labels = sorted.map(item => item[0]);
    const data = sorted.map(item => item[1]);
    const colors = labels.map(name => getCategoryColor(name));

    return {
      total,
      items: sorted.map(([name, amount], idx) => ({
        name,
        amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
        color: colors[idx]
      })),
      chartData: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      }
    };
  }, [filteredTransactions, categories, mainTab, subTab]);

  // Ngân sách của tháng hiện tại
  const monthBudgets = useMemo(() => {
    const m = currentDate.getMonth() + 1;
    const y = currentDate.getFullYear();
    return getBudgetsForMonth(m, y);
  }, [getBudgetsForMonth, currentDate]);

  return (
    <div className="main-content-container">
      {/* Header & Filter */}
      <div className="page-header-row">
        <h2 className="page-title">
          <i className="bi bi-house-door text-primary"></i>
          <span>Tổng Quan</span>
        </h2>

        {/* Time Selector */}
        <div style={{
          display: 'flex', alignItems: 'center', background: '#ffffff',
          borderRadius: '30px', padding: '4px 8px', border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              border: 'none', background: 'transparent', fontWeight: 700,
              color: '#3b82f6', outline: 'none', cursor: 'pointer', padding: '4px 8px'
            }}
          >
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid #e2e8f0', paddingLeft: '8px' }}>
            <button 
              type="button" 
              onClick={() => changeTime(-1)}
              style={{
                width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <i className="bi bi-chevron-left" style={{ fontSize: '0.8rem' }}></i>
            </button>

            <span style={{ minWidth: '130px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
              {timeDisplay}
            </span>

            <button 
              type="button" 
              onClick={() => changeTime(1)}
              style={{
                width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <i className="bi bi-chevron-right" style={{ fontSize: '0.8rem' }}></i>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Summary Tab Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Chi tiêu */}
        <button 
          type="button" 
          className={`stat-tab-btn ${mainTab === 'expense' ? 'expense-active' : ''}`}
          onClick={() => setMainTab('expense')}
        >
          <h6><i className="bi bi-arrow-up-circle-fill" style={{ marginRight: '6px' }}></i>Chi tiêu</h6>
          <div className="stat-amount" style={{ color: mainTab === 'expense' ? '#ef4444' : '#1e293b' }}>
            {formatCurrency(totalExpense)}
          </div>
          <div className="stat-words" style={{ color: '#ef4444' }}>
            {readVietnameseNumber(totalExpense)}
          </div>
        </button>

        {/* Thu nhập */}
        <button 
          type="button" 
          className={`stat-tab-btn ${mainTab === 'income' ? 'income-active' : ''}`}
          onClick={() => setMainTab('income')}
        >
          <h6><i className="bi bi-arrow-down-circle-fill" style={{ marginRight: '6px' }}></i>Thu nhập</h6>
          <div className="stat-amount" style={{ color: mainTab === 'income' ? '#10b981' : '#1e293b' }}>
            {formatCurrency(totalIncome)}
          </div>
          <div className="stat-words" style={{ color: '#10b981' }}>
            {readVietnameseNumber(totalIncome)}
          </div>
        </button>

        {/* Chênh lệch */}
        <div className="stat-tab-btn" style={{ cursor: 'default', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <h6><i className="bi bi-calculator" style={{ marginRight: '6px' }}></i>Chênh lệch</h6>
          <div className="stat-amount" style={{ color: netCashflow >= 0 ? '#10b981' : '#ef4444' }}>
            {formatCurrency(netCashflow)}
          </div>
          <div className="stat-words" style={{ color: '#64748b' }}>
            {readVietnameseNumber(netCashflow)}
          </div>
        </div>
      </div>

      {/* Comparison Bar Chart */}
      <div className="card-box" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="bi bi-bar-chart-line-fill" style={{ color: '#3b82f6' }}></i>
          <span>Biểu đồ so sánh Thu & Chi theo tháng (Năm {currentDate.getFullYear()})</span>
        </h3>
        <div style={{ height: '240px' }}>
          <Bar 
            data={barChartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } }
            }} 
          />
        </div>
      </div>

      {/* 2 Columns: Allocation & Budgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Doughnut / Category breakdown */}
        <div className="card-box">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-pie-chart-fill" style={{ color: '#3b82f6' }}></i>
            <span>Cơ cấu phân bổ ({mainTab === 'expense' ? 'Chi tiêu' : 'Thu nhập'})</span>
          </h3>

          <div style={{ height: '220px', position: 'relative', marginBottom: '20px' }}>
            {categoryAllocation.total > 0 ? (
              <Doughnut 
                data={categoryAllocation.chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }
                }} 
              />
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: '#94a3b8'
              }}>
                <i className="bi bi-pie-chart" style={{ fontSize: '2.5rem', opacity: 0.3 }}></i>
                <span style={{ fontSize: '0.88rem', marginTop: '6px' }}>Chưa có giao dịch trong kỳ</span>
              </div>
            )}
          </div>

          {/* Subtab Parent / Child */}
          <div className="pill-tab-group" style={{ marginBottom: '16px' }}>
            <button 
              type="button" 
              className={`pill-tab-btn ${subTab === 'child' ? 'active' : ''}`}
              onClick={() => setSubTab('child')}
            >
              Danh mục con
            </button>
            <button 
              type="button" 
              className={`pill-tab-btn ${subTab === 'parent' ? 'active' : ''}`}
              onClick={() => setSubTab('parent')}
            >
              Danh mục cha
            </button>
          </div>

          {/* Category List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categoryAllocation.items.map((item, idx) => (
              <div key={idx} style={{ paddingBottom: '8px', borderBottom: '1px dashed #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }}></span>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatCurrency(item.amount)}</span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '6px' }}>({item.percentage}%)</span>
                  </div>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.percentage}%`, height: '100%', backgroundColor: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Health Overview */}
        <div className="card-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="bi bi-safe2-fill" style={{ color: '#f59e0b' }}></i>
              <span>Tình hình ngân sách ({timeDisplay})</span>
            </h3>
            <NavLink to="/budgets" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#3b82f6' }}>
              Xem tất cả
            </NavLink>
          </div>

          {monthBudgets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <i className="bi bi-safe2" style={{ fontSize: '2.5rem', opacity: 0.3 }}></i>
              <p style={{ fontSize: '0.88rem', marginTop: '8px' }}>Chưa lập hũ ngân sách cho tháng này</p>
              <NavLink to="/budgets" className="btn-action-primary" style={{ display: 'inline-flex', width: 'auto', padding: '8px 20px', fontSize: '0.85rem', marginTop: '12px' }}>
                Lập ngân sách ngay
              </NavLink>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {monthBudgets.map(b => {
                const isOver = b.remain_amount < 0;
                return (
                  <div key={b.id} style={{
                    padding: '12px 14px', borderRadius: '12px',
                    border: '1px solid #f1f5f9', background: '#f8fafc'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{b.category_name}</span>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700,
                        padding: '2px 8px', borderRadius: '12px',
                        backgroundColor: isOver ? '#fee2e2' : '#d1fae5',
                        color: isOver ? '#ef4444' : '#059669'
                      }}>
                        {isOver ? `Vượt ${formatCurrency(Math.abs(b.remain_amount))}` : `Còn ${formatCurrency(b.remain_amount)}`}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: '6px' }}>
                      <span>Đã chi: <b>{formatCurrency(b.total_spent)}</b></span>
                      <span>Hạn mức: <b>{formatCurrency(b.amount_limit)}</b></span>
                    </div>

                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(100, b.progress_percentage)}%`,
                        height: '100%',
                        backgroundColor: isOver ? '#ef4444' : b.progress_percentage > 80 ? '#f59e0b' : '#10b981'
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
