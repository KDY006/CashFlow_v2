import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { 
  INITIAL_CATEGORIES, 
  generateRealtimeTransactions,
  generateRealtimeBudgets,
  generateRealtimeDailyNotes,
  generateRealtimeAiInsights,
  INITIAL_TRANSACTIONS, 
  INITIAL_BUDGETS, 
  INITIAL_DAILY_NOTES, 
  INITIAL_AI_INSIGHTS 
} from '../data/seedData';
import { getFinancialAdvice, parseTransactionWithAI } from '../services/aiService';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.id : 1;

  // 1. Toast Notification State
  const [toasts, setToasts] = useState([]);
  const showToast = (message, isSuccess = true) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type: isSuccess ? 'success' : 'error' }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // 2. Categories State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('cashflow_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_CATEGORIES;
  });

  // 3. Transactions State (Tự động nâng cấp dữ liệu tháng 5 cũ sang thời gian thực)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('cashflow_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const isStuckInMay = Array.isArray(parsed) && parsed.length > 0 && parsed.every(t => typeof t.transaction_date === 'string' && t.transaction_date.startsWith('2026-05'));
        if (!isStuckInMay) {
          return parsed;
        }
      } catch (e) {}
    }
    const fresh = generateRealtimeTransactions();
    localStorage.setItem('cashflow_transactions', JSON.stringify(fresh));
    return fresh;
  });

  // 4. Budgets State (Tự động nâng cấp sang tháng hiện tại)
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('cashflow_budgets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const isStuckInMay = Array.isArray(parsed) && parsed.length > 0 && parsed.every(b => b.month === 5 && b.year === 2026);
        if (!isStuckInMay) {
          return parsed;
        }
      } catch (e) {}
    }
    const fresh = generateRealtimeBudgets();
    localStorage.setItem('cashflow_budgets', JSON.stringify(fresh));
    return fresh;
  });

  // 5. Daily Notes State
  const [dailyNotes, setDailyNotes] = useState(() => {
    const saved = localStorage.getItem('cashflow_daily_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const isStuckInMay = Array.isArray(parsed) && parsed.length > 0 && parsed.every(n => n.note_date?.startsWith('2026-05'));
        if (!isStuckInMay) {
          return parsed;
        }
      } catch (e) {}
    }
    const fresh = generateRealtimeDailyNotes();
    localStorage.setItem('cashflow_daily_notes', JSON.stringify(fresh));
    return fresh;
  });

  // 6. AI Insights / Chat History State
  const [aiInsights, setAiInsights] = useState(() => {
    const saved = localStorage.getItem('cashflow_ai_insights');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const isStuckInMay = Array.isArray(parsed) && parsed.length > 0 && parsed.every(a => a.created_at?.startsWith('2026-05'));
        if (!isStuckInMay) {
          return parsed;
        }
      } catch (e) {}
    }
    const fresh = generateRealtimeAiInsights();
    localStorage.setItem('cashflow_ai_insights', JSON.stringify(fresh));
    return fresh;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('cashflow_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('cashflow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('cashflow_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('cashflow_daily_notes', JSON.stringify(dailyNotes));
  }, [dailyNotes]);

  useEffect(() => {
    localStorage.setItem('cashflow_ai_insights', JSON.stringify(aiInsights));
  }, [aiInsights]);

  // Current User's Transactions
  const userTransactions = useMemo(() => {
    return transactions.filter(t => t.user_id === userId);
  }, [transactions, userId]);

  // CATEGORY OPERATIONS
  const addCategory = ({ name, type = 'expense', parent_id = null }) => {
    const newCat = {
      id: Date.now(),
      user_id: userId,
      parent_id: parent_id ? Number(parent_id) : null,
      name: name.trim(),
      type
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Đã thêm danh mục "${name}"`);
    return { status: true, data: newCat };
  };

  const deleteCategory = (id) => {
    // Không thể xóa nếu có giao dịch đang dùng
    const inUse = transactions.some(t => t.category_id === id);
    if (inUse) {
      showToast('Không thể xóa danh mục đang có giao dịch phát sinh!', false);
      return { status: false, message: 'Danh mục đang có giao dịch phát sinh' };
    }
    setCategories(prev => prev.filter(c => c.id !== id && c.parent_id !== id));
    showToast('Đã xóa danh mục thành công!');
    return { status: true };
  };

  const getCategoryTree = () => {
    const userOrGlobalCats = categories.filter(c => c.user_id === null || c.user_id === userId);
    const parents = userOrGlobalCats.filter(c => !c.parent_id);
    return parents.map(p => ({
      ...p,
      children: userOrGlobalCats.filter(c => c.parent_id === p.id)
    }));
  };

  // TRANSACTION OPERATIONS
  const addTransaction = ({ category_id, amount, transaction_date, note = '' }) => {
    const newT = {
      id: Date.now(),
      user_id: userId,
      category_id: Number(category_id),
      amount: Number(amount),
      transaction_date: transaction_date || new Date().toISOString().slice(0, 19).replace('T', ' '),
      note: note.trim()
    };
    setTransactions(prev => [newT, ...prev]);
    showToast('Đã thêm giao dịch thành công!');
    return { status: true, data: newT };
  };

  const updateTransaction = ({ id, category_id, amount, transaction_date, note = '' }) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === Number(id)) {
        return {
          ...t,
          category_id: Number(category_id),
          amount: Number(amount),
          transaction_date: transaction_date || t.transaction_date,
          note: note.trim()
        };
      }
      return t;
    }));
    showToast('Cập nhật giao dịch thành công!');
    return { status: true };
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== Number(id)));
    showToast('Đã xóa giao dịch.');
    return { status: true };
  };

  // BUDGET OPERATIONS
  const getBudgetsForMonth = (month, year) => {
    const m = Number(month);
    const y = Number(year);
    const list = budgets.filter(b => b.user_id === userId && b.month === m && b.year === y);

    return list.map(b => {
      const cat = categories.find(c => c.id === b.category_id);
      
      // Tính chi tiêu cho danh mục này trong tháng đó
      const spent = userTransactions
        .filter(t => {
          if (t.category_id !== b.category_id) return false;
          const tDate = new Date(t.transaction_date);
          return (tDate.getMonth() + 1) === m && tDate.getFullYear() === y;
        })
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const remain = Number(b.amount_limit) - spent;
      const progress = b.amount_limit > 0 ? Math.round((spent / Number(b.amount_limit)) * 100) : 0;

      return {
        ...b,
        category_name: cat ? cat.name : 'Danh mục',
        category_type: cat ? cat.type : 'expense',
        total_spent: spent,
        remain_amount: remain,
        progress_percentage: progress
      };
    });
  };

  const saveBudget = ({ id, category_id, amount_limit, month, year }) => {
    const m = Number(month);
    const y = Number(year);
    const catId = Number(category_id);
    const limit = Number(amount_limit);

    if (id) {
      setBudgets(prev => prev.map(b => b.id === Number(id) ? { ...b, amount_limit: limit } : b));
      showToast('Đã cập nhật hạn mức ngân sách!');
    } else {
      const existing = budgets.find(b => b.user_id === userId && b.category_id === catId && b.month === m && b.year === y);
      if (existing) {
        setBudgets(prev => prev.map(b => b.id === existing.id ? { ...b, amount_limit: limit } : b));
        showToast('Đã cập nhật ngân sách cho danh mục này!');
      } else {
        const newBudget = {
          id: Date.now(),
          user_id: userId,
          category_id: catId,
          amount_limit: limit,
          month: m,
          year: y
        };
        setBudgets(prev => [...prev, newBudget]);
        showToast('Đã tạo hũ ngân sách thành công!');
      }
    }
    return { status: true };
  };

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== Number(id)));
    showToast('Đã xóa hũ ngân sách!');
    return { status: true };
  };

  const clonePreviousMonthBudgets = (month, year) => {
    let prevM = Number(month) - 1;
    let prevY = Number(year);
    if (prevM < 1) {
      prevM = 12;
      prevY -= 1;
    }
    const prevList = budgets.filter(b => b.user_id === userId && b.month === prevM && b.year === prevY);
    if (prevList.length === 0) {
      showToast('Không có dữ liệu ngân sách tháng trước để sao chép!', false);
      return { status: false };
    }

    const currentList = budgets.filter(b => b.user_id === userId && b.month === Number(month) && b.year === Number(year));
    const toAdd = [];

    prevList.forEach(pb => {
      const already = currentList.find(cb => cb.category_id === pb.category_id);
      if (!already) {
        toAdd.push({
          id: Date.now() + Math.random(),
          user_id: userId,
          category_id: pb.category_id,
          amount_limit: pb.amount_limit,
          month: Number(month),
          year: Number(year)
        });
      }
    });

    if (toAdd.length > 0) {
      setBudgets(prev => [...prev, ...toAdd]);
      showToast(`Đã sao chép ${toAdd.length} ngân sách từ tháng trước!`);
    } else {
      showToast('Tất cả ngân sách đã được thiết lập đầy đủ!');
    }
    return { status: true };
  };

  // DAILY NOTE OPERATIONS
  const getNoteForDate = (dateStr) => {
    return dailyNotes.find(n => n.user_id === userId && n.note_date === dateStr);
  };

  const saveDailyNote = ({ note_date, content, pin_type = 'none' }) => {
    if (!content || !content.trim()) {
      setDailyNotes(prev => prev.filter(n => !(n.user_id === userId && n.note_date === note_date)));
      showToast('Đã xóa ghi chú của ngày.');
      return { status: true };
    }

    setDailyNotes(prev => {
      const idx = prev.findIndex(n => n.user_id === userId && n.note_date === note_date);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], content: content.trim(), pin_type };
        return copy;
      }
      return [...prev, { id: Date.now(), user_id: userId, note_date, content: content.trim(), pin_type }];
    });
    showToast('Đã lưu ghi chú ngày thành công!');
    return { status: true };
  };

  // AI ADVISOR OPERATIONS
  const checkAiCooldown = () => {
    const today = new Date().toISOString().slice(0, 10);
    const todayInsights = aiInsights.filter(a => a.user_id === userId && a.created_at.startsWith(today));
    const used = todayInsights.length;
    const max = 3;
    return {
      can_consult: used < max,
      used,
      max,
      hours_left: used >= max ? 6 : 0
    };
  };

  const consultAI = async (type) => {
    const cooldown = checkAiCooldown();
    if (!cooldown.can_consult) {
      showToast('Bạn đã dùng hết 3 lượt tư vấn trong ngày!', false);
      return { status: false, message: 'Hết lượt tư vấn' };
    }

    try {
      const answer = await getFinancialAdvice({
        type,
        transactions: userTransactions,
        categories
      });

      const newInsight = {
        id: Date.now(),
        user_id: userId,
        type,
        content: answer,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };

      setAiInsights(prev => [newInsight, ...prev]);
      showToast('Cố vấn AI đã phân tích xong!');
      return { status: true, data: newInsight };
    } catch (err) {
      showToast('Lỗi khi phân tích AI: ' + err.message, false);
      return { status: false, message: err.message };
    }
  };

  const resetToDemoData = () => {
    const freshTransactions = generateRealtimeTransactions().map(t => ({
      ...t,
      user_id: userId
    }));
    const freshBudgets = generateRealtimeBudgets().map(b => ({
      ...b,
      user_id: userId
    }));
    const freshNotes = generateRealtimeDailyNotes().map(n => ({
      ...n,
      user_id: userId
    }));
    const freshInsights = generateRealtimeAiInsights().map(i => ({
      ...i,
      user_id: userId
    }));

    setCategories(INITIAL_CATEGORIES);
    setTransactions(freshTransactions);
    setBudgets(freshBudgets);
    setDailyNotes(freshNotes);
    setAiInsights(freshInsights);

    localStorage.setItem('cashflow_categories', JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem('cashflow_transactions', JSON.stringify(freshTransactions));
    localStorage.setItem('cashflow_budgets', JSON.stringify(freshBudgets));
    localStorage.setItem('cashflow_daily_notes', JSON.stringify(freshNotes));
    localStorage.setItem('cashflow_ai_insights', JSON.stringify(freshInsights));

    showToast('Đã nạp lại toàn bộ dữ liệu mẫu theo thời gian thực hiện tại thành công!');
  };

  return (
    <DataContext.Provider value={{
      toasts,
      showToast,
      categories,
      transactions: userTransactions,
      allTransactions: transactions,
      budgets,
      dailyNotes,
      aiInsights: aiInsights.filter(a => a.user_id === userId),
      addCategory,
      deleteCategory,
      getCategoryTree,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      getBudgetsForMonth,
      saveBudget,
      deleteBudget,
      clonePreviousMonthBudgets,
      getNoteForDate,
      saveDailyNote,
      checkAiCooldown,
      consultAI,
      parseTransactionWithAI: (text) => parseTransactionWithAI(text, categories),
      resetToDemoData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
