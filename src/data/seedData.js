/**
 * Dữ liệu mẫu chuẩn được trích xuất chính xác 100% từ cashflow_db.sql
 */

export const INITIAL_USERS = [
  {
    id: 1,
    full_name: 'Nguyễn Văn Duy',
    email: 'nvduy180706@gmail.com',
    avatar_url: '/avatars/avatar_6a01bbbe83e2f_1778498494.jpg',
    password: '123456',
    is_first_login: 0,
    created_at: '2026-04-28 21:47:09',
    last_ai_consult_at: '2026-05-12 19:24:10'
  },
  {
    id: 5,
    full_name: 'Lê Văn Quý',
    email: 'kdyforwork@gmail.com',
    avatar_url: '',
    password: '123456',
    is_first_login: 0,
    created_at: '2026-05-11 19:06:08',
    last_ai_consult_at: null
  }
];

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

export const INITIAL_TRANSACTIONS = [
  { id: 3, user_id: 1, category_id: 16, amount: 45000, transaction_date: '2026-05-01 12:00:00', note: 'Ăn trưa bún bò' },
  { id: 4, user_id: 1, category_id: 16, amount: 120000, transaction_date: '2026-05-02 19:30:00', note: 'Ăn tối với bạn bè' },
  { id: 5, user_id: 1, category_id: 17, amount: 60000, transaction_date: '2026-05-03 08:00:00', note: 'Đổ xăng xe máy' },
  { id: 6, user_id: 1, category_id: 15, amount: 450000, transaction_date: '2026-05-04 17:45:00', note: 'Đi siêu thị Coopmart mua đồ ăn tuần' },
  { id: 7, user_id: 1, category_id: 16, amount: 35000, transaction_date: '2026-05-06 07:30:00', note: 'Cà phê sáng' },
  { id: 8, user_id: 1, category_id: 5, amount: 100000, transaction_date: '2026-05-02 10:00:00', note: 'Đóng tiền điện tháng 4' },
  { id: 10, user_id: 1, category_id: 8, amount: 850000, transaction_date: '2026-05-07 20:15:00', note: 'Mua áo sơ mi và quần jean mới' },
  { id: 11, user_id: 1, category_id: 9, amount: 150000, transaction_date: '2026-05-08 21:00:00', note: 'Xem phim rạp CGV' },
  { id: 12, user_id: 1, category_id: 11, amount: 250000, transaction_date: '2026-05-09 10:30:00', note: 'Mua thuốc cảm cúm' },
  { id: 13, user_id: 1, category_id: 13, amount: 2000000, transaction_date: '2026-05-02 08:00:00', note: 'Chuyển tiền vào quỹ chứng khoán' },
  { id: 14, user_id: 1, category_id: 14, amount: 500000, transaction_date: '2026-05-08 15:00:00', note: 'Mua khóa học lập trình Web' },
  { id: 15, user_id: 1, category_id: 16, amount: 30000, transaction_date: '2026-05-09 22:50:00', note: 'Ăn trưa căn tin' },
  { id: 16, user_id: 1, category_id: 17, amount: 30000, transaction_date: '2026-05-10 22:39:00', note: 'Đổ xăng' },
  { id: 26, user_id: 1, category_id: 17, amount: 6000, transaction_date: '2026-05-11 21:35:00', note: 'Bus' },
  { id: 27, user_id: 1, category_id: 16, amount: 15000, transaction_date: '2026-05-11 21:35:00', note: 'Ăn tối cơm chay' },
  { id: 28, user_id: 1, category_id: 8, amount: 50000, transaction_date: '2026-05-11 21:36:00', note: 'Chụp ảnh thẻ' },
  { id: 30, user_id: 1, category_id: 16, amount: 32000, transaction_date: '2026-05-01 08:47:00', note: 'Ăn sáng 2 ổ bánh mì' },
  { id: 31, user_id: 1, category_id: 16, amount: 12000, transaction_date: '2026-05-01 20:49:00', note: 'Mua nước mía' },
  { id: 32, user_id: 1, category_id: 16, amount: 18000, transaction_date: '2026-05-11 22:02:00', note: 'Ăn vặt đêm' },
  { id: 33, user_id: 1, category_id: 16, amount: 10000, transaction_date: '2026-05-12 07:02:00', note: 'Ăn sáng' },
  { id: 34, user_id: 1, category_id: 18, amount: 4172490, transaction_date: '2026-05-06 07:37:00', note: 'Lương tháng 4 SSMC' },
  { id: 35, user_id: 1, category_id: 17, amount: 30000, transaction_date: '2026-05-12 07:53:00', note: 'Đổ xăng' },
  { id: 36, user_id: 1, category_id: 8, amount: 56000, transaction_date: '2026-05-12 08:37:00', note: 'Mua áo' }
];

export const INITIAL_BUDGETS = [
  { id: 2, user_id: 1, category_id: 16, amount_limit: 3000000, month: 5, year: 2026 },
  { id: 3, user_id: 1, category_id: 15, amount_limit: 2000000, month: 5, year: 2026 },
  { id: 4, user_id: 1, category_id: 17, amount_limit: 1000000, month: 5, year: 2026 },
  { id: 5, user_id: 1, category_id: 5,  amount_limit: 1500000, month: 5, year: 2026 },
  { id: 6, user_id: 1, category_id: 6,  amount_limit: 3000000, month: 5, year: 2026 },
  { id: 7, user_id: 1, category_id: 8,  amount_limit: 2000000, month: 5, year: 2026 },
  { id: 8, user_id: 1, category_id: 9,  amount_limit: 1000000, month: 5, year: 2026 },
  { id: 9, user_id: 1, category_id: 13, amount_limit: 5000000, month: 5, year: 2026 }
];

export const INITIAL_DAILY_NOTES = [
  { id: 11, user_id: 1, note_date: '2026-05-06', content: 'Nhận lương', pin_type: 'none' }
];

export const INITIAL_AI_INSIGHTS = [
  {
    id: 67,
    user_id: 1,
    type: 'warning',
    created_at: '2026-05-13 00:23:59',
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
    created_at: '2026-05-13 00:24:10',
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
