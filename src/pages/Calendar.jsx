import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export default function Calendar() {
  const { transactions, categories, dailyNotes, saveDailyNote, showToast } = useData();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());

  // Note Modal State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [notePinType, setNotePinType] = useState('none');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-indexed

  const changeMonth = (diff) => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + diff);
    setCurrentDate(next);
    setSelectedDay(1);
  };

  // Tính số ngày và ngày bắt đầu của tháng (Thứ 2 = 0)
  const calendarDays = useMemo(() => {
    const totalDays = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
    // Chuyển Chủ nhật (0) thành 6, Thứ 2 (1) thành 0
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days = [];
    // Padding trước
    for (let i = 0; i < startOffset; i++) {
      days.push({ empty: true, key: `empty-${i}` });
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Tìm các giao dịch trong ngày
      let dayIncome = 0;
      let dayExpense = 0;
      const dayTrans = transactions.filter(t => t.transaction_date.startsWith(dateStr));
      
      dayTrans.forEach(t => {
        const cat = categories.find(c => c.id === t.category_id);
        if (cat?.type === 'income') dayIncome += Number(t.amount);
        else dayExpense += Number(t.amount);
      });

      // Tìm note
      const note = dailyNotes.find(n => n.note_date === dateStr);

      days.push({
        empty: false,
        day,
        dateStr,
        dayIncome,
        dayExpense,
        transactions: dayTrans,
        note
      });
    }

    return days;
  }, [currentYear, currentMonth, transactions, categories, dailyNotes]);

  // Tổng thu, chi tháng hiện tại
  const { monthIncome, monthExpense } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const prefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    transactions.forEach(t => {
      if (t.transaction_date.startsWith(prefix)) {
        const cat = categories.find(c => c.id === t.category_id);
        if (cat?.type === 'income') inc += Number(t.amount);
        else exp += Number(t.amount);
      }
    });
    return { monthIncome: inc, monthExpense: exp };
  }, [transactions, categories, currentYear, currentMonth]);

  const monthNet = monthIncome - monthExpense;

  // Selected Date Info
  const selectedDateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const selectedDayData = useMemo(() => {
    return calendarDays.find(d => !d.empty && d.day === selectedDay);
  }, [calendarDays, selectedDay]);

  const handleOpenNoteModal = () => {
    const existing = selectedDayData?.note;
    setNoteContent(existing ? existing.content : '');
    setNotePinType(existing ? existing.pin_type : 'none');
    setShowNoteModal(true);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    saveDailyNote({
      note_date: selectedDateStr,
      content: noteContent,
      pin_type: notePinType
    });
    setShowNoteModal(false);
  };

  return (
    <div className="main-content-container">
      {/* Header & Month Navigator */}
      <div className="page-header-row">
        <h2 className="page-title">
          <i className="bi bi-calendar3 text-primary"></i>
          <span>Lịch Tài Chính</span>
        </h2>

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

          <span style={{ minWidth: '140px', textAlign: 'center', fontWeight: 700, fontSize: '1rem', color: '#10b981' }}>
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

          <button
            type="button"
            onClick={() => {
              const now = new Date();
              setCurrentDate(now);
              setSelectedDay(now.getDate());
            }}
            title="Về ngày hôm nay"
            style={{
              border: 'none', background: '#ecfdf5', color: '#059669',
              fontWeight: 700, fontSize: '0.8rem', padding: '6px 12px',
              borderRadius: '20px', marginLeft: '6px', cursor: 'pointer'
            }}
          >
            Hôm nay
          </button>
        </div>
      </div>

      {/* 3 Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
        <div style={{
          padding: '14px', borderRadius: '14px', background: '#ecfdf5',
          border: '1.5px solid #a7f3d0'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>THU NHẬP</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>{formatCurrency(monthIncome)}</div>
        </div>

        <div style={{
          padding: '14px', borderRadius: '14px', background: '#fef2f2',
          border: '1.5px solid #fecaca'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', marginBottom: '4px' }}>CHI TIÊU</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>{formatCurrency(monthExpense)}</div>
        </div>

        <div style={{
          padding: '14px', borderRadius: '14px', background: '#eff6ff',
          border: '1.5px solid #bfdbfe'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', marginBottom: '4px' }}>CHÊNH LỆCH</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: monthNet >= 0 ? '#10b981' : '#dc2626' }}>
            {formatCurrency(monthNet)}
          </div>
        </div>
      </div>

      {/* Grid Layout: Calendar on Left, Details on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Calendar View */}
        <div className="card-box" style={{ padding: '16px' }}>
          {/* Day of Week Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '8px' }}>
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((h, i) => (
              <div key={h} style={{
                fontWeight: 700, fontSize: '0.82rem',
                color: i === 5 ? '#3b82f6' : i === 6 ? '#ef4444' : '#64748b'
              }}>
                {h}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {calendarDays.map((cell, idx) => {
              if (cell.empty) {
                return (
                  <div key={cell.key || idx} style={{
                    minHeight: '88px', borderRadius: '12px',
                    background: '#f8fafc', opacity: 0.4
                  }}></div>
                );
              }

              const isSelected = selectedDay === cell.day;
              const isToday = (
                new Date().getDate() === cell.day &&
                new Date().getMonth() + 1 === currentMonth &&
                new Date().getFullYear() === currentYear
              );

              return (
                <div
                  key={cell.day}
                  onClick={() => setSelectedDay(cell.day)}
                  style={{
                    minHeight: '88px', padding: '6px',
                    borderRadius: '12px', background: '#ffffff',
                    border: isSelected ? '2px solid #3b82f6' : isToday ? '2px solid #10b981' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#eff6ff' : isToday ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer', position: 'relative',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Day Number & Note pin icon */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{
                        fontWeight: 800, fontSize: '0.95rem',
                        color: isSelected ? '#2563eb' : isToday ? '#10b981' : '#1e293b'
                      }}>
                        {cell.day}
                      </span>
                      {isToday && (
                        <span style={{
                          fontSize: '0.62rem', background: '#d1fae5', color: '#047857',
                          padding: '1px 5px', borderRadius: '6px', fontWeight: 700
                        }}>
                          Nay
                        </span>
                      )}
                    </div>

                    {cell.note && (
                      <span title={cell.note.content} style={{ color: '#f59e0b', fontSize: '0.85rem' }}>
                        📌
                      </span>
                    )}
                  </div>

                  {/* Amounts */}
                  <div style={{ marginTop: '8px', textAlign: 'right' }}>
                    {cell.dayIncome > 0 && (
                      <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: '#059669', lineHeight: 1.2 }}>
                        +{cell.dayIncome >= 1000000 ? `${(cell.dayIncome / 1000000).toFixed(1)}tr` : `${Math.round(cell.dayIncome / 1000)}k`}
                      </span>
                    )}
                    {cell.dayExpense > 0 && (
                      <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: '#dc2626', lineHeight: 1.2 }}>
                        -{cell.dayExpense >= 1000000 ? `${(cell.dayExpense / 1000000).toFixed(1)}tr` : `${Math.round(cell.dayExpense / 1000)}k`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details on Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Daily Note Card */}
          <div className="card-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              background: '#fef3c7', padding: '12px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="bi bi-sticky-fill"></i>
                <span>Ghi chú ngày {selectedDay}/{currentMonth}/{currentYear}</span>
              </span>

              <button
                type="button"
                onClick={handleOpenNoteModal}
                style={{
                  background: '#d97706', color: '#ffffff',
                  border: 'none', borderRadius: '20px',
                  padding: '4px 14px', fontSize: '0.78rem',
                  fontWeight: 700, cursor: 'pointer'
                }}
              >
                Lưu / Sửa
              </button>
            </div>

            <div style={{ padding: '16px' }}>
              {selectedDayData?.note?.content ? (
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b', whiteSpace: 'pre-wrap' }}>
                    {selectedDayData.note.content}
                  </p>
                  {selectedDayData.note.pin_type !== 'none' && (
                    <span style={{
                      display: 'inline-block', marginTop: '8px',
                      fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px',
                      backgroundColor: '#fef3c7', color: '#b45309', fontWeight: 700
                    }}>
                      Ghim lặp lại: {selectedDayData.note.pin_type === 'weekly' ? 'Hàng tuần' : 'Hàng tháng'}
                    </span>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                  Không có ghi chú nào cho ngày này. Bấm "Lưu / Sửa" để thêm nhắc nhở!
                </p>
              )}
            </div>
          </div>

          {/* Transactions on Selected Day */}
          <div className="card-box">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '14px', color: '#0f172a' }}>
              Giao dịch trong ngày ({selectedDayData?.transactions?.length || 0})
            </h3>

            {selectedDayData?.transactions?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedDayData.transactions.map(t => {
                  const cat = categories.find(c => c.id === t.category_id);
                  const isExpense = cat?.type === 'expense';

                  return (
                    <div key={t.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 14px', borderRadius: '12px',
                      background: '#f8fafc', border: '1px solid #f1f5f9'
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{cat?.name}</div>
                        {t.note && <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{t.note}</div>}
                      </div>

                      <div style={{
                        fontWeight: 800, fontSize: '0.95rem',
                        color: isExpense ? '#ef4444' : '#10b981'
                      }}>
                        {isExpense ? '-' : '+'}{formatCurrency(t.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                <i className="bi bi-clock-history" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
                <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Không có giao dịch nào phát sinh.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily Note Modal */}
      {showNoteModal && (
        <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-box">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                Ghi chú ngày <span style={{ color: '#3b82f6' }}>{selectedDay}/{currentMonth}/{currentYear}</span>
              </h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowNoteModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="modal-body-box">
              <div className="form-group-field">
                <textarea
                  className="input-custom"
                  rows="4"
                  placeholder="Nhập nội dung ghi chú... (Để trống và bấm Lưu để xóa ghi chú)"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  autoFocus
                ></textarea>
              </div>

              <div className="form-group-field" style={{
                background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '20px'
              }}>
                <label className="form-label-custom" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="bi bi-pin-angle-fill"></i>
                  <span>TÙY CHỌN GHIM</span>
                </label>
                <select
                  className="input-custom"
                  value={notePinType}
                  onChange={(e) => setNotePinType(e.target.value)}
                  style={{ background: '#ffffff', fontWeight: 600 }}
                >
                  <option value="none">Chỉ lưu cho ngày này</option>
                  <option value="weekly">Ghim lặp lại hàng tuần</option>
                  <option value="monthly">Ghim lặp lại hàng tháng</option>
                </select>
              </div>

              <button type="submit" className="btn-action-primary" style={{ background: '#3b82f6' }}>
                <span>Lưu ghi chú</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
