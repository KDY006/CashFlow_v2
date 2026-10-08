import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { formatNumberInput, readVietnameseNumber } from '../utils/formatters';

export default function GlobalAddModal({ isOpen, onClose }) {
  const { getCategoryTree, addTransaction, parseTransactionWithAI, showToast } = useData();

  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'ai'
  const [displayAmount, setDisplayAmount] = useState('');
  const [rawAmount, setRawAmount] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [note, setNote] = useState('');

  // AI Tab State
  const [aiText, setAiText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Initialize current local date-time on modal open
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setTransactionDate(now.toISOString().slice(0, 16));
      setDisplayAmount('');
      setRawAmount(0);
      setNote('');
      setAiText('');
      setActiveTab('manual');

      // Chọn danh mục mặc định
      const tree = getCategoryTree();
      const firstChild = tree.find(p => p.children && p.children.length > 0)?.children[0];
      if (firstChild) {
        setCategoryId(firstChild.id);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categoryTree = getCategoryTree();

  const handleAmountChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    setDisplayAmount(formatNumberInput(rawVal));
    setRawAmount(rawVal ? parseInt(rawVal, 10) : 0);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!rawAmount || rawAmount <= 0) {
      showToast('Vui lòng nhập số tiền hợp lệ lớn hơn 0!', false);
      return;
    }
    if (!categoryId) {
      showToast('Vui lòng chọn danh mục giao dịch!', false);
      return;
    }

    addTransaction({
      category_id: categoryId,
      amount: rawAmount,
      transaction_date: transactionDate ? transactionDate.replace('T', ' ') + ':00' : undefined,
      note
    });

    onClose();
  };

  const handleAiParse = async () => {
    if (!aiText.trim()) {
      showToast('Vui lòng nhập câu miêu tả chi tiêu của bạn!', false);
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await parseTransactionWithAI(aiText);
      if (result && result.amount) {
        // Tự động lưu giao dịch được trích xuất
        addTransaction({
          category_id: result.category_id || 16,
          amount: result.amount,
          transaction_date: transactionDate ? transactionDate.replace('T', ' ') + ':00' : undefined,
          note: result.note || aiText
        });
        showToast(`AI đã trích xuất: ${result.amount.toLocaleString('vi-VN')} đ cho ${result.note || 'giao dịch'}`);
        onClose();
      } else {
        showToast('AI không hiểu dữ liệu này. Hãy thử nhập câu cụ thể hơn!', false);
      }
    } catch (err) {
      showToast('Lỗi khi phân tích AI: ' + err.message, false);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#ecfdf5', color: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              <i className="bi bi-wallet2"></i>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Ghi chép giao dịch</h3>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Tab pills */}
        <div style={{ padding: '0 24px 14px' }}>
          <div className="pill-tab-group">
            <button 
              type="button" 
              className={`pill-tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
              onClick={() => setActiveTab('manual')}
            >
              <i className="bi bi-pencil-square"></i>
              <span>Nhập thủ công</span>
            </button>
            <button 
              type="button" 
              className={`pill-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              <i className="bi bi-stars" style={{ color: '#f59e0b' }}></i>
              <span>AI Phân tích</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body-box" style={{ paddingTop: 0 }}>
          {activeTab === 'manual' ? (
            <form onSubmit={handleManualSubmit}>
              {/* Amount input */}
              <div className="form-group-field">
                <label className="form-label-custom">SỐ TIỀN (VNĐ)</label>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  background: '#f8fafc', border: '2px solid #e2e8f0',
                  borderRadius: '16px', padding: '6px 16px',
                  transition: 'all 0.2s'
                }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginRight: '8px' }}>₫</span>
                  <input
                    type="text"
                    className="amount-input"
                    value={displayAmount}
                    onChange={handleAmountChange}
                    placeholder="0"
                    style={{
                      border: 'none', background: 'transparent',
                      fontSize: '1.6rem', fontWeight: 800,
                      color: '#10b981', width: '100%',
                      textAlign: 'right', outline: 'none'
                    }}
                    autoFocus
                  />
                </div>
                <div style={{
                  textAlign: 'right', fontSize: '0.78rem',
                  fontStyle: 'italic', color: '#10b981',
                  minHeight: '20px', marginTop: '4px', fontWeight: 600
                }}>
                  {readVietnameseNumber(rawAmount)}
                </div>
              </div>

              {/* Category */}
              <div className="form-group-field">
                <label className="form-label-custom">DANH MỤC GIAO DỊCH</label>
                <select
                  className="input-custom"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Chọn danh mục --</option>
                  {categoryTree.map(parent => {
                    if (parent.type === 'income') {
                      return (
                        <option key={parent.id} value={parent.id}>
                          🟢 {parent.name} (Thu nhập)
                        </option>
                      );
                    }
                    return (
                      <optgroup key={parent.id} label={`🔴 ${parent.name}`}>
                        {parent.children?.map(child => (
                          <option key={child.id} value={child.id}>
                            {child.name}
                          </option>
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
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  required
                />
              </div>

              {/* Note */}
              <div className="form-group-field" style={{ marginBottom: '24px' }}>
                <label className="form-label-custom">GHI CHÚ THÊM</label>
                <textarea
                  className="input-custom"
                  rows="2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Ăn trưa bún bò, cà phê cùng đồng nghiệp..."
                ></textarea>
              </div>

              <button type="submit" className="btn-action-primary">
                <i className="bi bi-check2-circle"></i>
                <span>Lưu Giao Dịch</span>
              </button>
            </form>
          ) : (
            <div>
              <div style={{ textAlign: 'center', margin: '10px 0 20px' }}>
                <div style={{
                  width: '70px', height: '70px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                  color: '#2563eb', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', boxShadow: '0 8px 20px rgba(37,99,235,0.15)',
                  marginBottom: '12px'
                }}>
                  <i className="bi bi-robot"></i>
                </div>
                <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>
                  Tự động nhận diện giao dịch
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.82rem', padding: '0 10px' }}>
                  Gõ tự nhiên điều bạn vừa chi tiêu (VD: <i>Đổ xăng 60k</i>, <i>Ăn sáng phở cuốn 45k</i>, <i>1 củ mua đồ</i>). AI sẽ tự hiểu và lưu ngay!
                </p>
              </div>

              <div className="form-group-field" style={{ marginBottom: '12px' }}>
                <textarea
                  className="input-custom"
                  rows="3"
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  placeholder="Ví dụ: Đổ xăng xe máy 60k, ăn trưa 45k..."
                  style={{
                    borderRadius: '16px',
                    borderColor: '#93c5fd',
                    padding: '14px',
                    fontSize: '0.95rem'
                  }}
                  autoFocus
                ></textarea>
              </div>

              {/* Quick Suggestion Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                {['Đổ xăng 60k', 'Ăn trưa bún bò 45k', 'Tiền điện 650k', 'Mua áo sơ mi 350k', 'Nhận lương freelance 5 củ'].map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setAiText(chip)}
                    style={{
                      border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1d4ed8',
                      borderRadius: '14px', padding: '4px 10px', fontSize: '0.75rem',
                      fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s'
                    }}
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              <button 
                type="button" 
                className="btn-action-primary"
                style={{ background: '#2563eb' }}
                onClick={handleAiParse}
                disabled={isAiLoading || !aiText.trim()}
              >
                {isAiLoading ? (
                  <>
                    <i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }}></i>
                    <span>Đang phân tích thông minh...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-magic"></i>
                    <span>Trích xuất & Thêm nhanh</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
