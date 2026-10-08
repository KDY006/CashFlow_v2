/**
 * Dữ liệu mẫu chuẩn được đồng bộ theo THỜI GIAN THỰC (Real-Time Current Date/Month)
 * Tự động đồng bộ tháng và năm hiện tại của hệ thống thay vì cố định tháng 5/2026.
 */

export const INITIAL_CATEGORIES = [
  // Danh mục Cha (Chi tiêu)
  { id: 1, user_id: null, parent_id: null, name: 'Chi phí cố định', type: 'expense' },
  { id: 2, user_id: null, parent_id: null, name: 'Chi phí phát sinh', type: 'expense' },
  { id: 3, user_id: null, parent_id: null, name: 'Đầu tư tiết kiệm', type: 'expense' },
  { id: 4, user_id: null, parent_id: null, name: 'Chi tiêu - Sinh hoạt', type: 'expense' },
  
  // Danh mục Con của Chi phí cố định (id 1)
  { id: 5, user_id: null, parent_id: 1, name: 'Hóa đơn', type: 'expense' },
  { id: 6, user_id: null, parent_id: 1, name: 'Nhà cửa', type: 'expense' },
  { id: 7, user_id: null, parent_id: 1, name: 'Người thân', type: 'expense' },

  // Danh mục Con của Chi phí phát sinh (id 2)
  { id: 8, user_id: null, parent_id: 2, name: 'Mua sắm', type: 'expense' },
  { id: 9, user_id: null, parent_id: 2, name: 'Giải trí', type: 'expense' },
  { id: 10, user_id: null, parent_id: 2, name: 'Làm đẹp', type: 'expense' },
  { id: 11, user_id: null, parent_id: 2, name: 'Sức khỏe', type: 'expense' },
  { id: 12, user_id: null, parent_id: 2, name: 'Từ thiện', type: 'expense' },

  // Danh mục Con của Đầu tư tiết kiệm (id 3)
  { id: 13, user_id: null, parent_id: 3, name: 'Đầu tư', type: 'expense' },
  { id: 14, user_id: null, parent_id: 3, name: 'Học tập', type: 'expense' },

  // Danh mục Con của Chi tiêu - Sinh hoạt (id 4)
  { id: 15, user_id: null, parent_id: 4, name: 'Chợ, siêu thị', type: 'expense' },
  { id: 16, user_id: null, parent_id: 4, name: 'Ăn uống', type: 'expense' },
  { id: 17, user_id: null, parent_id: 4, name: 'Di chuyển', type: 'expense' },

  // Danh mục Thu nhập
  { id: 18, user_id: null, parent_id: null, name: 'Lương', type: 'income' },
  { id: 19, user_id: null, parent_id: null, name: 'Tiền Tip / Thưởng', type: 'income' },
  { id: 20, user_id: null, parent_id: null, name: 'Freelance', type: 'income' },
  { id: 21, user_id: null, parent_id: null, name: 'Thu nhập khác', type: 'income' }
];

export function generateRandomTempPassword(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateRealtimeUsers() {
  return [
    {
      id: 1,
      full_name: 'Nguyễn Văn Duy',
      email: 'nvduy180706@gmail.com',
      dob: '2004-07-18',
      gender: 'Nam',
      avatar_url: '/avatars/avatar_6a01bbbe83e2f_1778498494.jpg',
      password: '123456',
      is_first_login: 0,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      last_ai_consult_at: null
    },
    {
      id: 5,
      full_name: 'Lê Văn Quý',
      email: 'kdyforwork@gmail.com',
      dob: '2004-05-11',
      gender: 'Nam',
      avatar_url: '',
      password: '123456',
      is_first_login: 0,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      last_ai_consult_at: null
    }
  ];
}

export function generateRealtimeTransactions() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate(); // Ngày hiện tại trong tháng

  const rawList = [
    { id: 3, user_id: 1, category_id: 16, amount: 45000, origDay: 1, time: '12:00:00', note: 'Ăn trưa bún bò' },
    { id: 4, user_id: 1, category_id: 16, amount: 120000, origDay: 2, time: '19:30:00', note: 'Ăn tối với bạn bè' },
    { id: 5, user_id: 1, category_id: 17, amount: 60000, origDay: 3, time: '08:00:00', note: 'Đổ xăng xe máy' },
    { id: 6, user_id: 1, category_id: 15, amount: 450000, origDay: 4, time: '17:45:00', note: 'Đi siêu thị Coopmart mua đồ ăn tuần' },
    { id: 7, user_id: 1, category_id: 16, amount: 35000, origDay: 6, time: '07:30:00', note: 'Cà phê sáng' },
    { id: 8, user_id: 1, category_id: 5, amount: 100000, origDay: 2, time: '10:00:00', note: 'Đóng tiền điện tháng trước' },
    { id: 10, user_id: 1, category_id: 8, amount: 850000, origDay: 7, time: '20:15:00', note: 'Mua áo sơ mi và quần jean mới' },
    { id: 11, user_id: 1, category_id: 9, amount: 150000, origDay: 8, time: '21:00:00', note: 'Xem phim rạp CGV' },
    { id: 12, user_id: 1, category_id: 11, amount: 250000, origDay: 9, time: '10:30:00', note: 'Mua thuốc cảm cúm' },
    { id: 13, user_id: 1, category_id: 13, amount: 2000000, origDay: 2, time: '08:00:00', note: 'Chuyển tiền vào quỹ chứng khoán' },
    { id: 14, user_id: 1, category_id: 14, amount: 500000, origDay: 8, time: '15:00:00', note: 'Mua khóa học lập trình Web' },
    { id: 15, user_id: 1, category_id: 16, amount: 30000, origDay: 9, time: '12:50:00', note: 'Ăn trưa căn tin' },
    { id: 16, user_id: 1, category_id: 17, amount: 30000, origDay: 10, time: '14:39:00', note: 'Đổ xăng' },
    { id: 26, user_id: 1, category_id: 17, amount: 6000, origDay: 11, time: '21:35:00', note: 'Bus' },
    { id: 27, user_id: 1, category_id: 16, amount: 15000, origDay: 11, time: '21:35:00', note: 'Ăn tối cơm chay' },
    { id: 28, user_id: 1, category_id: 8, amount: 50000, origDay: 11, time: '21:36:00', note: 'Chụp ảnh thẻ' },
    { id: 30, user_id: 1, category_id: 16, amount: 32000, origDay: 1, time: '08:47:00', note: 'Ăn sáng 2 ổ bánh mì' },
    { id: 31, user_id: 1, category_id: 16, amount: 12000, origDay: 1, time: '20:49:00', note: 'Mua nước mía' },
    { id: 32, user_id: 1, category_id: 16, amount: 18000, origDay: 11, time: '22:02:00', note: 'Ăn vặt đêm' },
    { id: 33, user_id: 1, category_id: 16, amount: 10000, origDay: 12, time: '07:02:00', note: 'Ăn sáng' },
    { id: 34, user_id: 1, category_id: 18, amount: 4172490, origDay: 6, time: '07:37:00', note: 'Lương tháng SSMC' },
    { id: 35, user_id: 1, category_id: 17, amount: 30000, origDay: 12, time: '07:53:00', note: 'Đổ xăng' },
    { id: 36, user_id: 1, category_id: 8, amount: 56000, origDay: 12, time: '08:37:00', note: 'Mua áo' }
  ];

  const maxOrigDay = 12;
  return rawList.map(item => {
    let dayNum = item.origDay;
    if (currentDay < maxOrigDay) {
      dayNum = Math.max(1, Math.min(currentDay, Math.round((item.origDay / maxOrigDay) * currentDay)));
    }
    const dayStr = String(dayNum).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    return {
      id: item.id,
      user_id: item.user_id,
      category_id: item.category_id,
      amount: item.amount,
      transaction_date: `${year}-${monthStr}-${dayStr} ${item.time}`,
      note: item.note
    };
  });
}

export function generateRealtimeBudgets() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear -= 1;
  }

  const baseLimits = [
    { id: 2, category_id: 16, amount_limit: 3000000 },
    { id: 3, category_id: 15, amount_limit: 2000000 },
    { id: 4, category_id: 17, amount_limit: 1000000 },
    { id: 5, category_id: 5,  amount_limit: 1500000 },
    { id: 6, category_id: 6,  amount_limit: 3000000 },
    { id: 7, category_id: 8,  amount_limit: 2000000 },
    { id: 8, category_id: 9,  amount_limit: 1000000 },
    { id: 9, category_id: 13, amount_limit: 5000000 }
  ];

  const currentBudgets = baseLimits.map(b => ({
    id: b.id,
    user_id: 1,
    category_id: b.category_id,
    amount_limit: b.amount_limit,
    month: month,
    year: year
  }));

  const prevBudgets = baseLimits.map((b, idx) => ({
    id: 100 + idx,
    user_id: 1,
    category_id: b.category_id,
    amount_limit: b.amount_limit,
    month: prevMonth,
    year: prevYear
  }));

  return [...currentBudgets, ...prevBudgets];
}

export function generateRealtimeDailyNotes() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(Math.min(now.getDate(), 6)).padStart(2, '0');
  return [
    { id: 11, user_id: 1, note_date: `${year}-${month}-${day}`, content: 'Nhận lương tháng', pin_type: 'none' }
  ];
}

export function generateRealtimeAiInsights() {
  const now = new Date();
  const timeStr = now.toISOString().slice(0, 19).replace('T', ' ');
  return [
    {
      id: 67,
      user_id: 1,
      type: 'warning',
      created_at: timeStr,
      content: `<b>TỔNG QUÁT:</b><br>
Tình hình tài chính của bạn đang ở mức <b>BÁO ĐỘNG ĐỎ</b>. Bạn đang chi tiêu vượt thu với tổng chi (4.849.000 đ) cao hơn tổng thu (4.172.490 đ), dẫn đến thâm hụt 676.510 đ.<br><br>
<b>CỤ THỂ:</b><br>
<ul>
<li><b>Đầu tư quá đà:</b> Khoản chi 2.000.000 đ vào chứng khoán chiếm gần 48% thu nhập, gây áp lực lên dòng tiền hàng ngày.</li>
<li><b>Mua sắm thiếu kiểm soát:</b> Bạn đã chi 956.000 đ cho mua sắm (áo quần, ảnh thẻ), chiếm 23% thu nhập.</li>
<li><b>Chi phí phát sinh:</b> Các khoản ăn vặt dù nhỏ lẻ nhưng cộng dồn lại tạo gánh nặng.</li>
</ul><br>
<b>KẾT LUẬN:</b><br>
Bạn cần thực hiện ngay 3 hành động: <b>(1) Dừng mua sắm không thiết yếu</b>, <b>(2) Điều chỉnh lại tỷ lệ đầu tư</b>, <b>(3) Thiết lập hạn mức chi tiêu hàng ngày</b>.`
    },
    {
      id: 68,
      user_id: 1,
      type: 'summary',
      created_at: timeStr,
      content: `<b>TỔNG QUÁT:</b><br>
Tài chính của bạn đang ở trạng thái <b>thâm hụt nhẹ</b> trong tháng.<br><br>
<b>CỤ THỂ:</b><br>
<ul>
<li>Tổng thu: 4.172.490 đ | Tổng chi: 4.849.000 đ (Thâm hụt: 676.510 đ).</li>
<li>Khoản chi lớn nhất: Đầu tư chứng khoán (2.000.000 đ), chiếm gần 50% thu nhập.</li>
<li>Mua sắm & Giải trí: Chiếm tỷ trọng cao (hơn 1 triệu đ) so với tổng thu nhập.</li>
</ul><br>
<b>KẾT LUẬN:</b><br>
Bạn đang tích lũy đầu tư rất tích cực nhưng cần cân đối dòng tiền tiền mặt hàng ngày để tránh thâm hụt ngân sách.`
    }
  ];
}

// Initial exported constants dynamically evaluated
export const INITIAL_USERS = generateRealtimeUsers();
export const INITIAL_TRANSACTIONS = generateRealtimeTransactions();
export const INITIAL_BUDGETS = generateRealtimeBudgets();
export const INITIAL_DAILY_NOTES = generateRealtimeDailyNotes();
export const INITIAL_AI_INSIGHTS = generateRealtimeAiInsights();
