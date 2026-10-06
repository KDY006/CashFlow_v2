import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { formatCurrency, formatNumberInput, readVietnameseNumber } from '../utils/formatters';

export default function Budgets() {
  const { 
    categories, 
    getCategoryTree, 
    addCategory, 
    deleteCategory, 
    getBudgetsForMonth, 
    saveBudget, 
    deleteBudget, 
    clonePreviousMonthBudgets, 
    showToast 
  } = useData();

  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'budgets'

  // Month navigation for Budgets
  const [currentDate, setCurrentDate] = useState(new Date('2026-05-01'));

  const changeMonth = (diff) => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + diff);
    setCurrentDate(next);
  };

  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Add Category Modal State
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState('expense');
  const [catParentId, setCatParentId] = useState('');

  // Add/Edit Budget Modal State
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [budgetCategoryId, setBudgetCategoryId] = useState('');
  const [budgetDisplayAmount, setBudgetDisplayAmount] = useState('');
  const [budgetRawAmount, setBudgetRawAmount] = useState(0);

  const categoryTree = getCategoryTree();
  const parentCategories = categories.filter(c => !c.parent_id && c.type === 'expense');

  // Month Budgets list
  const monthBudgets = useMemo(() => {
    return getBudgetsForMonth(currentMonth, currentYear);
  }, [getBudgetsForMonth, currentMonth, currentYear]);

  // Handle Create Category
  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      showToast('Vui lòng nhập tên danh mục!', false);
      return;
    }
    addCategory({
      name: catName,
      type: catType,
      parent_id: catType === 'expense' ? (catParentId || null) : null
    });
    setCatName('');
    setShowAddCatModal(false);
  };

  // Open Budget Modal for adding or editing
  const handleOpenBudgetModal = (existing = null) => {
    if (existing) {
      setEditingBudgetId(existing.id);
      setBudgetCategoryId(existing.category_id);
      setBudgetDisplayAmount(formatNumberInput(existing.amount_limit));
      setBudgetRawAmount(Number(existing.amount_limit));
    } else {
      setEditingBudgetId(null);
      // Default to first expense category not budgeted yet
      const firstAvailable = categories.find(c => c.type === 'expense' && !monthBudgets.some(b => b.category_id === c.id));
      setBudgetCategoryId(firstAvailable ? firstAvailable.id : categories[0]?.id || '');
      setBudgetDisplayAmount('');
      setBudgetRawAmount(0);
    }
    setShowBudgetModal(true);
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    if (!budgetRawAmount || budgetRawAmount <= 0) {
      showToast('Vui lòng nhập hạn mức lớn hơn 0!', false);
      return;
    }
    if (!budgetCategoryId) {
      showToast('Vui lòng chọn danh mục áp dụng!', false);
      return;
    }

    saveBudget({
      id: editingBudgetId,
      category_id: budgetCategoryId,
      amount_limit: budgetRawAmount,
      month: currentMonth,
      year: currentYear
    });

    setShowBudgetModal(false);
  };

  return (
    <div className="main-content-container">
      {/* Page Header */}
      <div className="page-header-row">
        <h2 className="page-title">
          <i className="bi bi-grid-1x2-fill text-primary"></i>
          <span>Danh Mục & Ngân Sách</span>
        </h2>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <div className="pill-tab-group" style={{ maxWidth: '400px', width: '100%' }}>
          <button
            type="button"
            className={`pill-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <i className="bi bi-tags-fill"></i>
            <span>Quản lý Danh mục</span>
          </button>
          <button
            type="button"
            className={`pill-tab-btn ${activeTab === 'budgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('budgets')}
          >
            <i className="bi bi-safe2-fill"></i>
            <span>Lập Ngân sách</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CATEGORY MANAGEMENT */}
      {activeTab === 'categories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button 
              type="button" 
              className="btn-add-global"
              style={{ background: '#3b82f6', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
              onClick={() => setShowAddCatModal(true)}
            >
              <i className="bi bi-plus-lg"></i>
              <span>Tạo danh mục mới</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {categoryTree.map(parent => (
              <div key={parent.id} className="card-box">
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '12px', height: '12px', borderRadius: '50%',
                      backgroundColor: parent.type === 'income' ? '#10b981' : '#ef4444'
                    }}></span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      {parent.name}
                    </h3>
                  </div>

                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px',
                    backgroundColor: parent.type === 'income' ? '#ecfdf5' : '#fef2f2',
                    color: parent.type === 'income' ? '#059669' : '#dc2626'
                  }}>
                    {parent.type === 'income' ? 'Thu nhập' : 'Nhóm Chi'}
                  </span>
                </div>

                {/* Children */}
                {parent.children && parent.children.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {parent.children.map(child => (
                      <div key={child.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderRadius: '10px',
                        background: '#f8fafc', border: '1px solid #f1f5f9'
                      }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{child.name}</span>
                        <button
                          type="button"
                          onClick={() => deleteCategory(child.id)}
                          style={{
                            border: 'none', background: 'transparent',
                            color: '#94a3b8', cursor: 'pointer', padding: '4px'
                          }}
                          title="Xóa danh mục"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', padding: '10px 0' }}>
                    {parent.type === 'income' ? 'Danh mục thu nhập trực tiếp' : 'Chưa có danh mục con'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BUDGET JARS MANAGEMENT */}
      {activeTab === 'budgets' && (
        <div>
          {/* Controls: Month selector & Add budget */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: '16px', marginBottom: '24px'
          }}>
            {/* Month Navigator */}
            <div style={{
              display: 'flex', alignItems: 'center', background: '#ffffff',
              borderRadius: '30px', padding: '4px 8px', border: '1px solid #e2e8f0',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <button 
                type="button" 
                onClick={() => changeMonth(-1)}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                  background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              <span style={{ minWidth: '130px', textAlign: 'center', fontWeight: 700, fontSize: '1rem', color: '#10b981' }}>
                Tháng {currentMonth}/{currentYear}
              </span>

              <button 
                type="button" 
                onClick={() => changeMonth(1)}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                  background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-add-global"
                style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', boxShadow: 'none' }}
                onClick={() => clonePreviousMonthBudgets(currentMonth, currentYear)}
                title="Sao chép từ tháng trước"
              >
                <i className="bi bi-copy"></i>
                <span>Sao chép tháng trước</span>
              </button>

              <button 
                type="button" 
                className="btn-add-global"
                onClick={() => handleOpenBudgetModal()}
              >
                <i className="bi bi-plus-lg"></i>
                <span>Lập Hũ Ngân Sách</span>
              </button>
            </div>
          </div>

          {/* Budget List */}
          {monthBudgets.length === 0 ? (
            <div className="card-box" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <i className="bi bi-safe2" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
              <p style={{ marginTop: '10px', fontSize: '0.95rem' }}>Chưa có hũ ngân sách nào cho Tháng {currentMonth}/{currentYear}.</p>
              <button 
                type="button" 
                className="btn-action-primary" 
                style={{ display: 'inline-flex', width: 'auto', padding: '10px 24px', marginTop: '16px' }}
                onClick={() => handleOpenBudgetModal()}
              >
                <i className="bi bi-plus-lg"></i>
                <span>Tạo Hũ Đầu Tiên</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {monthBudgets.map(b => {
                const isOver = b.remain_amount < 0;
                return (
                  <div key={b.id} className="card-box" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                          {b.category_name}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                          Hạn mức tháng {currentMonth}/{currentYear}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenBudgetModal(b)}
                          style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            border: '1px solid #e2e8f0', background: '#f8fafc',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: '#3b82f6'
                          }}
                          title="Sửa hạn mức"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Xóa ngân sách cho "${b.category_name}"?`)) {
                              deleteBudget(b.id);
                            }
                          }}
                          style={{
                            width: '32px', height: '32px', borderRadius: '8px',
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

                    {/* Progress details */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                        <span style={{ color: '#64748b' }}>Đã chi tiêu:</span>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>{formatCurrency(b.total_spent)}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '8px' }}>
                        <span style={{ color: '#64748b' }}>Hạn mức:</span>
                        <span style={{ fontWeight: 800, color: '#10b981' }}>{formatCurrency(b.amount_limit)}</span>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, b.progress_percentage)}%`,
                          height: '100%',
                          backgroundColor: isOver ? '#ef4444' : b.progress_percentage > 80 ? '#f59e0b' : '#10b981',
                          transition: 'width 0.3s'
                        }}></div>
                      </div>
                    </div>

                    {/* Footer badge */}
                    <div style={{
                      padding: '8px 12px', borderRadius: '10px',
                      backgroundColor: isOver ? '#fee2e2' : '#ecfdf5',
                      color: isOver ? '#dc2626' : '#059669',
                      fontWeight: 700, fontSize: '0.82rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span>{isOver ? '⚠️ Đã vượt hạn mức:' : '✅ Khả dụng còn lại:'}</span>
                      <span>{formatCurrency(Math.abs(b.remain_amount))}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {showAddCatModal && (
        <div className="modal-overlay" onClick={() => setShowAddCatModal(false)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-box">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Tạo danh mục mới</h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowAddCatModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="modal-body-box">
              <div className="form-group-field">
                <label className="form-label-custom">LOẠI DANH MỤC</label>
                <select 
                  className="input-custom" 
                  value={catType} 
                  onChange={(e) => setCatType(e.target.value)}
                >
                  <option value="expense">Chi tiêu (Đỏ)</option>
                  <option value="income">Thu nhập (Xanh)</option>
                </select>
              </div>

              {catType === 'expense' && (
                <div className="form-group-field">
                  <label className="form-label-custom">THUỘC NHÓM CHA</label>
                  <select 
                    className="input-custom"
                    value={catParentId}
                    onChange={(e) => setCatParentId(e.target.value)}
                  >
                    <option value="">-- Tạo thành nhóm cha mới --</option>
                    {parentCategories.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group-field" style={{ marginBottom: '24px' }}>
                <label className="form-label-custom">TÊN DANH MỤC</label>
                <input 
                  type="text" 
                  className="input-custom"
                  placeholder="Ví dụ: Tiền điện, Netflix, Lương thưởng..."
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-action-primary">
                <span>Lưu danh mục</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT BUDGET MODAL */}
      {showBudgetModal && (
        <div className="modal-overlay" onClick={() => setShowBudgetModal(false)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-box">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {editingBudgetId ? 'Chỉnh sửa Hũ Ngân Sách' : `Lập Ngân Sách Tháng ${currentMonth}/${currentYear}`}
              </h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowBudgetModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="modal-body-box">
              <div className="form-group-field">
                <label className="form-label-custom">DANH MỤC ÁP DỤNG</label>
                <select
                  className="input-custom"
                  value={budgetCategoryId}
                  onChange={(e) => setBudgetCategoryId(e.target.value)}
                  disabled={!!editingBudgetId}
                  required
                >
                  {categoryTree.map(parent => {
                    if (parent.type !== 'expense') return null;
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

              <div className="form-group-field" style={{ marginBottom: '24px' }}>
                <label className="form-label-custom">HẠN MỨC TỐI ĐA (VNĐ)</label>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  background: '#f8fafc', border: '2px solid #e2e8f0',
                  borderRadius: '16px', padding: '6px 16px'
                }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginRight: '8px' }}>₫</span>
                  <input
                    type="text"
                    value={budgetDisplayAmount}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      setBudgetDisplayAmount(formatNumberInput(raw));
                      setBudgetRawAmount(raw ? parseInt(raw, 10) : 0);
                    }}
                    placeholder="0"
                    style={{
                      border: 'none', background: 'transparent',
                      fontSize: '1.6rem', fontWeight: 800,
                      color: '#10b981', width: '100%',
                      textAlign: 'right', outline: 'none'
                    }}
                    required
                  />
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#10b981', marginTop: '4px', fontWeight: 600 }}>
                  {readVietnameseNumber(budgetRawAmount)}
                </div>
              </div>

              <button type="submit" className="btn-action-primary">
                <span>Lưu Hũ Ngân Sách</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
