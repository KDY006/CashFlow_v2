import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';

export default function AIAdvisor() {
  const { aiInsights, consultAI, checkAiCooldown } = useData();
  const [loadingType, setLoadingType] = useState(null);
  const chatContainerRef = useRef(null);

  const cooldown = checkAiCooldown();
  const maxRequests = cooldown.max;
  const usedRequests = cooldown.used;
  const canChat = cooldown.can_consult;

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [aiInsights, loadingType]);

  const handleCommand = async (type) => {
    if (!canChat || loadingType) return;
    setLoadingType(type);
    await consultAI(type);
    setLoadingType(null);
  };

  const commandLabelMap = {
    warning: 'Cảnh báo lãng phí',
    advice: 'Lời khuyên tiết kiệm',
    forecast: 'Dự báo tài chính',
    summary: 'Tóm tắt tổng quan'
  };

  // Group messages by date
  const groupedInsights = React.useMemo(() => {
    const map = {};
    // Sort oldest to newest for chronological chat
    const sorted = [...aiInsights].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    sorted.forEach(item => {
      const date = item.created_at?.slice(0, 10) || 'Hôm nay';
      if (!map[date]) map[date] = [];
      map[date].push(item);
    });
    return map;
  }, [aiInsights]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 65px)', background: '#f0f2f5'
    }}>
      {/* Header */}
      <div style={{
        background: '#ffffff', padding: '14px 24px',
        borderBottom: '1px solid #e2e8f0', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: '#2563eb', color: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(37,99,235,0.2)'
            }}>
              <i className="bi bi-robot"></i>
            </div>
            <span style={{
              position: 'absolute', bottom: '2px', right: '2px',
              width: '12px', height: '12px', borderRadius: '50%',
              backgroundColor: canChat ? '#10b981' : '#ef4444',
              border: '2px solid #ffffff'
            }}></span>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Cố vấn CashFlow AI
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
              Phân tích chuyên sâu tự động (Tối đa {maxRequests} lượt / 24h)
            </div>
          </div>
        </div>

        {/* Quota Badge */}
        <div style={{
          padding: '6px 14px', borderRadius: '20px',
          backgroundColor: canChat ? '#eff6ff' : '#fee2e2',
          color: canChat ? '#2563eb' : '#dc2626',
          border: `1px solid ${canChat ? '#bfdbfe' : '#fecaca'}`,
          fontSize: '0.82rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <i className="bi bi-lightning-charge-fill"></i>
          <span>Còn lại: {Math.max(0, maxRequests - usedRequests)}/{maxRequests} lượt</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div 
        ref={chatContainerRef}
        style={{
          flex: 1, overflowY: 'auto', padding: '24px 16px',
          display: 'flex', flexDirection: 'column', gap: '20px',
          maxWidth: '860px', width: '100%', margin: '0 auto'
        }}
      >
        {/* Welcome message */}
        <div style={{ display: 'flex', gap: '12px', maxWidth: '85%' }}>
          <div style={{
            background: '#ffffff', padding: '16px 20px', borderRadius: '18px',
            borderBottomLeftRadius: '4px', border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)', fontSize: '0.92rem', lineHeight: 1.6
          }}>
            <span style={{ fontWeight: 800, color: '#2563eb', display: 'block', fontSize: '0.82rem', marginBottom: '4px' }}>
              🤖 CashFlow AI
            </span>
            Xin chào! Trí tuệ nhân tạo đã kết nối thành công với sổ giao dịch của bạn.
            Hãy chọn một lệnh bên dưới để tôi bắt đầu phân tích nhé!
          </div>
        </div>

        {/* Grouped history */}
        {Object.entries(groupedInsights).map(([date, items]) => (
          <React.Fragment key={date}>
            <div style={{ textAlign: 'center', margin: '10px 0' }}>
              <span style={{
                background: '#e2e8f0', color: '#64748b', fontSize: '0.75rem',
                fontWeight: 700, padding: '4px 14px', borderRadius: '12px'
              }}>
                📅 {date}
              </span>
            </div>

            {items.map(item => (
              <React.Fragment key={item.id}>
                {/* User Prompt Bubble */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    background: '#2563eb', color: '#ffffff',
                    padding: '12px 18px', borderRadius: '18px', borderBottomRightRadius: '4px',
                    fontWeight: 600, fontSize: '0.9rem', maxWidth: '80%',
                    boxShadow: '0 2px 6px rgba(37,99,235,0.2)'
                  }}>
                    <i className="bi bi-person-fill" style={{ marginRight: '6px' }}></i>
                    {commandLabelMap[item.type] || 'Tương tác AI'}
                  </div>
                </div>

                {/* AI Response Bubble */}
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  <div style={{
                    background: '#ffffff', padding: '18px 22px', borderRadius: '18px',
                    borderBottomLeftRadius: '4px', border: '1px solid #e2e8f0',
                    borderLeft: '4px solid #2563eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)', fontSize: '0.92rem', lineHeight: 1.65,
                    width: '100%'
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '8px', marginBottom: '12px'
                    }}>
                      <span style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.85rem' }}>
                        <i className="bi bi-robot" style={{ marginRight: '6px' }}></i>
                        Cố vấn Tài chính
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {item.created_at?.slice(11, 16) || ''}
                      </span>
                    </div>

                    <div 
                      style={{ color: '#1e293b' }}
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}

        {/* Loading Bubble */}
        {loadingType && (
          <div style={{ display: 'flex', gap: '12px', maxWidth: '85%' }}>
            <div style={{
              background: '#ffffff', padding: '16px 20px', borderRadius: '18px',
              border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px',
              color: '#2563eb', fontWeight: 600, fontSize: '0.9rem'
            }}>
              <i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }}></i>
              <span>Cố vấn AI đang rà soát dữ liệu thu chi của bạn...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Command Buttons */}
      <div style={{
        background: '#ffffff', padding: '16px 24px',
        borderTop: '1px solid #e2e8f0', zIndex: 10
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{
            fontSize: '0.78rem', fontWeight: 700, color: '#64748b',
            marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            <i className="bi bi-terminal-fill" style={{ marginRight: '6px' }}></i>
            CHỌN LỆNH ĐỂ PHÂN TÍCH
          </div>

          {!canChat && (
            <div style={{
              background: '#fee2e2', color: '#dc2626', padding: '8px 16px',
              borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600,
              textAlign: 'center', marginBottom: '10px'
            }}>
              <i className="bi bi-hourglass-split" style={{ marginRight: '6px' }}></i>
              Bạn đã dùng hết {maxRequests} lượt hôm nay. Vui lòng quay lại sau!
            </div>
          )}

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px'
          }}>
            <button
              type="button"
              className="btn-action-primary"
              style={{
                background: '#ffffff', color: '#dc2626',
                border: '2px solid #fca5a5', padding: '10px 14px', fontSize: '0.88rem',
                boxShadow: 'none'
              }}
              disabled={!canChat || !!loadingType}
              onClick={() => handleCommand('warning')}
            >
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>Cảnh báo</span>
            </button>

            <button
              type="button"
              className="btn-action-primary"
              style={{
                background: '#ffffff', color: '#059669',
                border: '2px solid #6ee7b7', padding: '10px 14px', fontSize: '0.88rem',
                boxShadow: 'none'
              }}
              disabled={!canChat || !!loadingType}
              onClick={() => handleCommand('advice')}
            >
              <i className="bi bi-lightbulb-fill"></i>
              <span>Lời khuyên</span>
            </button>

            <button
              type="button"
              className="btn-action-primary"
              style={{
                background: '#ffffff', color: '#2563eb',
                border: '2px solid #93c5fd', padding: '10px 14px', fontSize: '0.88rem',
                boxShadow: 'none'
              }}
              disabled={!canChat || !!loadingType}
              onClick={() => handleCommand('forecast')}
            >
              <i className="bi bi-graph-up-arrow"></i>
              <span>Dự báo</span>
            </button>

            <button
              type="button"
              className="btn-action-primary"
              style={{
                background: '#ffffff', color: '#475569',
                border: '2px solid #cbd5e1', padding: '10px 14px', fontSize: '0.88rem',
                boxShadow: 'none'
              }}
              disabled={!canChat || !!loadingType}
              onClick={() => handleCommand('summary')}
            >
              <i className="bi bi-file-earmark-text-fill"></i>
              <span>Tóm tắt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
