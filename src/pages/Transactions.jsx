import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDateTime, getCategoryColor, formatNumberInput, readVietnameseNumber } from '../utils/formatters';

export default function Transactions() {
  const { transactions, categories, updateTransaction, deleteTransaction, getCategoryTree, showToast } = useData();

  // Filters & Search
  const [mainTab, setMainTab] = useState('expense'); // 'expense' | 'income'
  const [parentFilter, setParentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('date_desc');

  // Edit Modal State
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editAmountDisplay, setEditAmountDisplay] = useState('');
  const [editRawAmount, setEditRawAmount] = useState(0);
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNote, setEditNote] = useState('');

  // Parent Categories for Tabs
  const parentCategories = useMemo(() => {
    return categories.filter(c => !c.parent_id && c.type === mainTab);
  }, [categories, mainTab]);

  // Totals for top cards
  const { totalExpense, totalIncome } = useMemo(() => {
    let exp = 0;
    let inc = 0;
    transactions.forEach(t => {
      const cat = categories.find(c => c.id === t.category_id);
      if (cat?.type === 'income') inc += Number(t.amount);
      else exp += Number(t.amount);
    });
    return { totalExpense: exp, totalIncome: inc };
  }, [transactions, categories]);

  // Filtered and Sorted Transactions
  const displayedTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const cat = categories.find(c => c.id === t.category_id);
        if (!cat) return false;

        // Check type (expense vs income)
        if (cat.type !== mainTab) return false;

        // Check parent filter
        if (parentFilter !== 'all') {
          const parentId = Number(parentFilter);
          if (cat.id !== parentId && cat.parent_id !== parentId) return false;
        }

        // Check search term
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchNote = t.note?.toLowerCase().includes(term);
          const matchCat = cat.name.toLowerCase().includes(term);
          if (!matchNote && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'date_desc') return new Date(b.transaction_date) - new Date(a.transaction_date);
        if (sortOrder === 'date_asc') return new Date(a.transaction_date) - new Date(b.transaction_date);
        if (sortOrder === 'amount_desc') return Number(b.amount) - Number(a.amount);
        if (sortOrder === 'amount_asc') return Number(a.amount) - Number(b.amount);
        return 0;
      });
  }, [transactions, categories, mainTab, parentFilter, searchTerm, sortOrder]);

  const handleOpenEdit = (t) => {
    setEditingTransaction(t);
    setEditAmountDisplay(formatNumberInput(t.amount));
    setEditRawAmount(Number(t.amount));
    setEditCategoryId(t.category_id);
    const formattedDate = t.transaction_date ? t.transaction_date.slice(0, 16).replace(' ', 'T') : '';
    setEditDate(formattedDate);
    setEditNote(t.note || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editRawAmount || editRawAmount <= 0) {
      showToast('Vui lòng nhập số tiền hợp lệ!', false);
      return;
    }

    updateTransaction({
      id: editingTransaction.id,
      category_id: editCategoryId,
      amount: editRawAmount,
      transaction_date: editDate ? editDate.replace('T', ' ') + ':00' : undefined,
      note: editNote
    });

    setEditingTransaction(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      deleteTransaction(id);
    }
  };

  const categoryTree = getCategoryTree();

  return (
    <div className="main-content-container">
      {/* Page Header */}
      <div className="page-header-row">
        <h2 className="page-title">
          <i className="bi bi-journals text-primary"></i>
          <span>Sổ Giao Dịch</span>
        </h2>
      </div>

      {/* Main Tab Cards: Expense & Income */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <button 
          type="button" 
          className={`stat-tab-btn ${mainTab === 'expense' ? 'expense-active' : ''}`}
          onClick={() => { setMainTab('expense'); setParentFilter('all'); }}
        >
          <h6><i className="bi bi-arrow-up-circle-fill" style={{ marginRight: '6px' }}></i>Chi tiêu</h6>
          <div className="stat-amount" style={{ color: mainTab === 'expense' ? '#ef4444' : '#1e293b' }}>
            {formatCurrency(totalExpense)}
          </div>
        </button>

        <button 
          type="button" 
          className={`stat-tab-btn ${mainTab === 'income' ? 'income-active' : ''}`}
          onClick={() => { setMainTab('income'); setParentFilter('all'); }}
        >
          <h6><i className="bi bi-arrow-down-circle-fill" style={{ marginRight: '6px' }}></i>Thu nhập</h6>
          <div className="stat-amount" style={{ color: mainTab === 'income' ? '#10b981' : '#1e293b' }}>
            {formatCurrency(totalIncome)}
          </div>
        </button>
      </div>

      {/* Parent Category Filter Pills */}
      {mainTab === 'expense' && (
        <div style={{
          display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '12px',
          marginBottom: '16px', scrollbarWidth: 'none'
        }}>
          <button
            type="button"
            className={`pill-tab-btn ${parentFilter === 'all' ? 'active' : ''}`}
            onClick={() => setParentFilter('all')}
            style={{
              padding: '6px 18px', whiteSpace: 'nowrap',
              border: parentFilter === 'all' ? '1px solid #3b82f6' : '1px solid #e2e8f0',
              background: parentFilter === 'all' ? '#3b82f6' : '#ffffff',
              color: parentFilter === 'all' ? '#ffffff' : '#64748b'
            }}
          >
            Tất cả
          </button>
          {parentCategories.map(p => (
            <button
              key={p.id}
              type="button"
              className={`pill-tab-btn ${parentFilter === String(p.id) ? 'active' : ''}`}
              onClick={() => setParentFilter(String(p.id))}
              style={{
                padding: '6px 18px', whiteSpace: 'nowrap',
                border: parentFilter === String(p.id) ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                background: parentFilter === String(p.id) ? '#3b82f6' : '#ffffff',
                color: parentFilter === String(p.id) ? '#ffffff' : '#64748b'
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Search & Sort Bar */}
      <div className="card-box" style={{ padding: '12px 16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
            <input
              type="text"
              placeholder="Tìm theo tên danh mục, ghi chú..."
              className="input-custom"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '38px', paddingRight: searchTerm ? '38px' : '16px', background: '#f8fafc' }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer'
                }}
                title="Xóa tìm kiếm"
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}
          </div>

          <div style={{ width: '180px' }}>
            <select
              className="input-custom"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ background: '#f8fafc', fontWeight: 600 }}
            >
              <option value="date_desc">Mới nhất trước</option>
              <option value="date_asc">Cũ nhất trước</option>
              <option value="amount_desc">Số tiền cao nhất</option>
              <option value="amount_asc">Số tiền thấp nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {displayedTransactions.length === 0 ? (
        <div className="card-box" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <i className="bi bi-inbox" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
          <p style={{ marginTop: '10px', fontSize: '0.95rem' }}>Không tìm thấy giao dịch nào phù hợp.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayedTransactions.map(t => {
            const cat = categories.find(c => c.id === t.category_id);
            const isExpense = cat?.type === 'expense';
            const catColor = getCategoryColor(cat?.name || '');

            return (
              <div 
                key={t.id} 
                className="card-box"
                style={{
                  padding: '16px 20px', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between',
                  gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  {/* Category icon dot */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    backgroundColor: `${catColor}15`, color: catColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', fontWeight: 800, flexShrink: 0
                  }}>
                    <i className={isExpense ? "bi bi-arrow-up-right" : "bi bi-arrow-down-left"}></i>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                        {cat ? cat.name : 'Danh mục khác'}
                      </span>
                      <span style={{
                        fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px',
                        backgroundColor: `${catColor}20`, color: catColor, fontWeight: 700
                      }}>
                        {isExpense ? 'Chi tiêu' : 'Thu nhập'}
                      </span>
                    </div>

                    {t.note && (
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                        {t.note}
                      </div>
                    )}

                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
                      <i className="bi bi-clock" style={{ marginRight: '4px' }}></i>
                      {formatDateTime(t.transaction_date)}
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.1rem', fontWeight: 800,
                      color: isExpense ? '#ef4444' : '#10b981'
                    }}>
                      {isExpense ? '-' : '+'}{formatCurrency(t.amount)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(t)}
                      style={{
                        width: '34px', height: '34px', borderRadius: '8px',
                        border: '1px solid #e2e8f0', background: '#f8fafc',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#3b82f6'
                      }}
                      title="Chỉnh sửa"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      style={{
                        width: '34px', height: '34px', borderRadius: '8px',
                        border: '1px solid #fee2e2', background: '#fef2f2',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#ef4444'
                      }}
                      title="Xóa"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <div className="modal-overlay" onClick={() => setEditingTransaction(null)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-box">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-pencil-square" style={{ color: '#3b82f6' }}></i>
                <span>Chỉnh sửa Giao dịch</span>
              </h3>
              <button type="button" className="btn-close-modal" onClick={() => setEditingTransaction(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="modal-body-box">
              {/* Amount */}
              <div className="form-group-field">
                <label className="form-label-custom">SỐ TIỀN (VNĐ)</label>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  background: '#f8fafc', border: '2px solid #e2e8f0',
                  borderRadius: '16px', padding: '6px 16px'
                }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3b82f6', marginRight: '8px' }}>₫</span>
                  <input
                    type="text"
                    value={editAmountDisplay}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      setEditAmountDisplay(formatNumberInput(raw));
                      setEditRawAmount(raw ? parseInt(raw, 10) : 0);
                    }}
                    style={{
                      border: 'none', background: 'transparent',
                      fontSize: '1.6rem', fontWeight: 800,
                      color: '#3b82f6', width: '100%',
                      textAlign: 'right', outline: 'none'
                    }}
                    required
                  />
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#3b82f6', marginTop: '4px', fontWeight: 600 }}>
                  {readVietnameseNumber(editRawAmount)}
                </div>
              </div>

              {/* Category */}
              <div className="form-group-field">
                <label className="form-label-custom">DANH MỤC GIAO DỊCH</label>
                <select
                  className="input-custom"
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  required
                >
                  {categoryTree.map(parent => {
                    if (parent.type === 'income') {
                      return <option key={parent.id} value={parent.id}>🟢 {parent.name} (Thu nhập)</option>;
                    }
                    return (
                      <optgroup key={parent.id} label={`🔴 ${parent.name}`}>
                        {parent.children?.map(child => (
                          <option key={child.id} value={child.id}>{child.name}</option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              {/* Date */}
              <div className="form-group-field">
                <label className="form-label-custom">THỜI GIAN</label>
                <input
                  type="datetime-local"
                  className="input-custom"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  required
                />
              </div>

              {/* Note */}
              <div className="form-group-field" style={{ marginBottom: '24px' }}>
                <label className="form-label-custom">GHI CHÚ THÊM</label>
                <textarea
                  className="input-custom"
                  rows="2"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn-action-primary" style={{ background: '#3b82f6' }}>
                <i className="bi bi-check-lg"></i>
                <span>Cập nhật Giao dịch</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
