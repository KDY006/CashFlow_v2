/**
 * Dịch vụ Trí tuệ Nhân tạo CashFlow AI
 * Hỗ trợ phân tích ngôn ngữ tự nhiên (NLP Transaction Parsing)
 * và Cố vấn tài chính chuyên sâu (Financial Advisory Engine & Gemini API)
 */

export async function parseTransactionWithAI(text, categories = []) {
  if (!text || !text.trim()) {
    throw new Error('Vui lòng nhập nội dung giao dịch.');
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Nếu người dùng cấu hình GEMINI_API_KEY trong .env
  if (apiKey) {
    try {
      const prompt = `
      Câu người dùng nhập: "${text}"
      Danh mục khả dụng: ${JSON.stringify(categories.map(c => ({ id: c.id, name: c.name, type: c.type })))}

      Nhiệm vụ: Trích xuất Số tiền (amount), ID danh mục phù hợp nhất (category_id), và Ghi chú ngắn gọn (note).
      Nhận diện các từ lóng: "50k" = 50000, "1 củ" = 1000000, "2 lít" = 200000, "nửa củ" = 500000, "200 ngàn" = 200000, "100k" = 100000.
      BẮT BUỘC trả về định dạng JSON thuần túy (Không bọc bằng markdown hay bất kỳ ký tự nào khác):
      {"amount": 50000, "category_id": 16, "note": "Ghi chú ngắn gọn"}
      `;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          const parsed = JSON.parse(candidate);
          if (parsed && parsed.amount) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local NLP parser:", err);
    }
  }

  // BỘ PHÂN TÍCH TỰ NHIÊN NỘI BỘ THÔNG MINH (Offline / Zero-Config fallback)
  return parseTransactionLocally(text, categories);
}

function parseTransactionLocally(text, categories) {
  const normalized = text.toLowerCase().trim();
  let amount = 0;

  // Nhận diện số tiền kèm đơn vị
  // 1 củ, 2 củ, 1.5 củ
  const cuMatch = normalized.match(/([\d.,]+)\s*(củ|triệu|tr)/);
  if (cuMatch) {
    const val = parseFloat(cuMatch[1].replace(',', '.'));
    amount = Math.round(val * 1000000);
  }

  // 50k, 50 k, 50 ngàn, 50 nghìn
  if (!amount) {
    const kMatch = normalized.match(/([\d.,]+)\s*(k|ngàn|nghìn|lít)/);
    if (kMatch) {
      const val = parseFloat(kMatch[1].replace(',', '.'));
      const mult = kMatch[2] === 'lít' ? 100000 : 1000;
      amount = Math.round(val * mult);
    }
  }

  // Số thuần túy (ví dụ: 50000, 50.000, 100,000)
  if (!amount) {
    const numMatch = normalized.match(/\b\d{1,3}(?:[.,]\d{3})+\b/) || normalized.match(/\b\d{4,9}\b/);
    if (numMatch) {
      amount = parseInt(numMatch[0].replace(/[.,]/g, ''), 10);
    }
  }

  // Dự đoán danh mục thông minh theo từ khóa
  let matchedCategoryId = null;
  const keywordMap = [
    { catName: 'Ăn uống', keywords: ['ăn', 'cơm', 'phở', 'bún', 'bánh mì', 'trưa', 'sáng', 'tối', 'uống', 'cà phê', 'cafe', 'trà sữa', 'nước mía', 'lẩu', 'vặt'] },
    { catName: 'Di chuyển', keywords: ['xăng', 'đổ xăng', 'xe', 'bus', 'grab', 'be', 'giao thông', 'sửa xe', 'gửi xe', 'vé xe'] },
    { catName: 'Chợ, siêu thị', keywords: ['siêu thị', 'chợ', 'coopmart', 'winmart', 'bách hóa', 'mua đồ ăn', 'thực phẩm', 'rau'] },
    { catName: 'Mua sắm', keywords: ['mua', 'quần', 'áo', 'giày', 'dép', 'shopee', 'lazada', 'tiki', 'ảnh thẻ', 'chụp ảnh'] },
    { catName: 'Giải trí', keywords: ['phim', 'cgv', 'game', 'du lịch', 'karaoke', 'bida', 'chơi'] },
    { catName: 'Hóa đơn', keywords: ['điện', 'nước', 'wifi', 'internet', 'net', 'hóa đơn', 'tiền mạng'] },
    { catName: 'Nhà cửa', keywords: ['thuê nhà', 'tiền trọ', 'phòng trọ', 'nội thất'] },
    { catName: 'Sức khỏe', keywords: ['thuốc', 'khám', 'bệnh', 'nha khoa', 'cảm cúm', 'vitamin'] },
    { catName: 'Đầu tư', keywords: ['chứng khoán', 'cổ phiếu', 'vàng', 'crypto', 'tiết kiệm', 'quỹ'] },
    { catName: 'Học tập', keywords: ['khóa học', 'sách', 'học phí', 'khóa', 'lập trình'] },
    { catName: 'Lương', keywords: ['lương', 'tiền công', 'nhận lương', 'salary'] },
    { catName: 'Freelance', keywords: ['freelance', 'dự án', 'code dạo', 'khách trả'] },
    { catName: 'Tiền Tip / Thưởng', keywords: ['thưởng', 'tip', 'bonus'] }
  ];

  for (const item of keywordMap) {
    if (item.keywords.some(kw => normalized.includes(kw))) {
      const found = categories.find(c => c.name.toLowerCase() === item.catName.toLowerCase());
      if (found) {
        matchedCategoryId = found.id;
        break;
      }
    }
  }

  // Nếu không tìm thấy, gán danh mục mặc định
  if (!matchedCategoryId) {
    const defaultExpense = categories.find(c => c.id === 16 || c.name === 'Ăn uống');
    matchedCategoryId = defaultExpense ? defaultExpense.id : (categories[0]?.id || 16);
  }

  // Làm sạch câu để tạo note
  let cleanNote = text
    .replace(/[\d.,]+\s*(củ|triệu|tr|k|ngàn|nghìn|lít|đ|vnd)?/gi, '')
    .trim();
  if (!cleanNote) cleanNote = text.trim();

  return {
    amount: amount || 50000,
    category_id: matchedCategoryId,
    note: cleanNote
  };
}

/**
 * Cố vấn tài chính AI dựa trên giao dịch thực tế
 */
export async function getFinancialAdvice({ type, transactions = [], categories = [] }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const totalIn = transactions
    .filter(t => {
      const cat = categories.find(c => c.id === t.category_id);
      return cat?.type === 'income';
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalOut = transactions
    .filter(t => {
      const cat = categories.find(c => c.id === t.category_id);
      return cat?.type === 'expense';
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const cmdMap = {
    warning: 'Hãy tìm ra các điểm bất thường, các khoản chi tiêu không hợp lý và đưa ra CẢNH BÁO nghiêm túc để tối ưu tài chính.',
    advice: 'Hãy phân tích số liệu và đưa ra LỜI KHUYÊN hữu ích, thực tế để giúp tiết kiệm dòng tiền.',
    forecast: 'Dựa vào thói quen này, hãy DỰ BÁO tình hình tài chính cuối tháng và các khoản chi sắp tới.',
    summary: 'Hãy TÓM TẮT siêu ngắn gọn tình hình thu chi và thói quen tiêu dùng trong tháng.'
  };

  if (apiKey) {
    try {
      const prompt = `
      Bạn là Cố vấn Tài chính AI của hệ thống CashFlow.
      Tổng thu: ${totalIn.toLocaleString('vi-VN')} đ | Tổng chi: ${totalOut.toLocaleString('vi-VN')} đ
      Chi tiết các giao dịch gần đây: ${JSON.stringify(transactions.slice(0, 20))}

      Nhiệm vụ: ${cmdMap[type] || cmdMap.summary}
      Yêu cầu trình bày:
      1. Xưng hô "Tôi" (Trợ lý AI) và "Bạn" (Người dùng).
      2. Câu trả lời phải NGẮN GỌN, súc tích và bắt buộc chia làm 3 phần rõ rệt:
         - <b>TỔNG QUÁT:</b> (Nhận xét nhanh về tình hình tài chính hiện tại)
         - <b>CỤ THỂ:</b> (Liệt kê các điểm đáng chú ý hoặc con số quan trọng)
         - <b>KẾT LUẬN:</b> (Lời khuyên hoặc dự báo ngắn gọn)
      3. Format kết quả bằng HTML thuần (dùng <b>, <br>, <ul>, <li>). 
      4. KHÔNG bọc kết quả trong markdown (\`\`\`html).
      `;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (res.ok) {
        const data = await res.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          return candidate.replace(/```html|```/g, '').trim();
        }
      }
    } catch (err) {
      console.warn("Gemini AI API call error, using local expert engine:", err);
    }
  }

  // MÁY PHÂN TÍCH CHUYÊN GIA TỰ ĐỘNG (Local Expert Engine)
  return generateExpertLocalAdvice(type, totalIn, totalOut, transactions, categories);
}

function generateExpertLocalAdvice(type, totalIn, totalOut, transactions, categories) {
  const balance = totalIn - totalOut;
  const inStr = totalIn.toLocaleString('vi-VN') + ' đ';
  const outStr = totalOut.toLocaleString('vi-VN') + ' đ';
  const balStr = Math.abs(balance).toLocaleString('vi-VN') + ' đ';

  // Thống kê nhóm chi tiêu nhiều nhất
  const catSpending = {};
  transactions.forEach(t => {
    const cat = categories.find(c => c.id === t.category_id);
    if (cat?.type === 'expense') {
      catSpending[cat.name] = (catSpending[cat.name] || 0) + Number(t.amount);
    }
  });

  const topCats = Object.entries(catSpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const topCatText = topCats.length > 0 
    ? topCats.map(([name, amt]) => `<li><b>${name}:</b> ${amt.toLocaleString('vi-VN')} đ</li>`).join('')
    : '<li>Chưa ghi nhận chi tiêu nổi bật.</li>';

  if (type === 'warning') {
    if (balance < 0) {
      return `<b>TỔNG QUÁT:</b><br>
Tình hình tài chính của Bạn đang ở mức <b>CẢNH BÁO THÂM HỤT</b>. Tổng chi (${outStr}) đang vượt quá tổng thu (${inStr}), dẫn đến âm ngân sách <b>${balStr}</b>.<br><br>
<b>CỤ THỂ:</b><br>
<ul>
${topCatText}
<li>Dòng tiền bị âm có thể ảnh hưởng trực tiếp đến quỹ dự phòng khẩn cấp của bạn.</li>
</ul><br>
<b>KẾT LUẬN:</b><br>
Hãy tạm dừng ngay các khoản mua sắm và giải trí tùy ý, đồng thời tập trung cân đối lại các khoản chi sinh hoạt thiết yếu trong những ngày tới!`;
    } else {
      return `<b>TỔNG QUÁT:</b><br>
Dòng tiền của Bạn đang ở mức <b>an toàn tương đối</b> với số dư thặng dư <b>${balStr}</b>. Tuy nhiên, vẫn có các hạng mục cần tối ưu để gia tăng tỷ lệ tích lũy.<br><br>
<b>CỤ THỂ:</b><br>
<ul>
${topCatText}
<li>Tổng thu: ${inStr} | Tổng chi: ${outStr}</li>
<li>Tỷ lệ chi tiêu trên thu nhập đang ở mức ${totalIn > 0 ? Math.round((totalOut/totalIn)*100) : 0}%.</li>
</ul><br>
<b>KẾT LUẬN:</b><br>
Chú ý kiểm soát hạn mức chi tiêu cho các nhóm chiếm tỷ trọng lớn để bảo toàn khoản thặng dư này.`;
    }
  }

  if (type === 'advice') {
    return `<b>TỔNG QUÁT:</b><br>
Tôi nhận thấy Bạn đang duy trì thói quen ghi chép tài chính rất đều đặn. Đây là bước đầu tiên cực kỳ quan trọng để làm chủ tài chính cá nhân.<br><br>
<b>CỤ THỂ:</b><br>
<ul>
<li>Tổng thu hiện tại: <span style="color:#10b981;"><b>${inStr}</b></span></li>
<li>Tổng chi hiện tại: <span style="color:#ef4444;"><b>${outStr}</b></span></li>
${topCatText}
</ul><br>
<b>KẾT LUẬN:</b><br>
Lời khuyên thiết thực: Bạn nên trích ngay 15% - 20% thu nhập ngay khi nhận về vào quỹ tiết kiệm hoặc đầu tư tự động trước khi phân bổ vào các khoản chi sinh hoạt thường ngày.`;
  }

  if (type === 'forecast') {
    const projectedDays = 30;
    const now = new Date();
    const currentDay = Math.max(1, now.getDate());
    const dailyAvgExpense = totalOut / currentDay;
    const estimatedMonthEndExpense = Math.round(dailyAvgExpense * projectedDays);

    return `<b>TỔNG QUÁT:</b><br>
Dựa trên tốc độ chi tiêu hiện tại (trung bình ~${Math.round(dailyAvgExpense).toLocaleString('vi-VN')} đ/ngày), Tôi đưa ra dự báo dòng tiền cuối kỳ cho Bạn.<br><br>
<b>CỤ THỂ:</b><br>
<ul>
<li>Chi tiêu dự kiến đến cuối tháng: <b>${estimatedMonthEndExpense.toLocaleString('vi-VN')} đ</b>.</li>
<li>Tổng thu nhập ghi nhận: <b>${inStr}</b>.</li>
<li>Chênh lệch ước tính: <b>${(totalIn - estimatedMonthEndExpense).toLocaleString('vi-VN')} đ</b>.</li>
</ul><br>
<b>KẾT LUẬN:</b><br>
${(totalIn - estimatedMonthEndExpense) >= 0 
  ? 'Nếu tiếp tục duy trì tiến độ này, Bạn sẽ kết thúc tháng với một khoản tích lũy an toàn và tích cực!' 
  : 'Cần hạ thấp mức chi trung bình mỗi ngày khoảng 15-20% để tránh nguy cơ cạn kiệt số dư vào những ngày cuối tháng.'}`;
  }

  // summary (Mặc định)
  return `<b>TỔNG QUÁT:</b><br>
Bức tranh tài chính tổng thể của Bạn đang có tổng thu <span style="color:#10b981;"><b>${inStr}</b></span> và tổng chi <span style="color:#ef4444;"><b>${outStr}</b></span>.<br><br>
<b>CỤ THỂ:</b><br>
<ul>
<li>Số dư ròng khả dụng: <b>${balStr}</b> (${balance >= 0 ? 'Thặng dư' : 'Thâm hụt'}).</li>
${topCatText}
<li>Tổng số lượng giao dịch đã thực hiện: <b>${transactions.length}</b> giao dịch.</li>
</ul><br>
<b>KẾT LUẬN:</b><br>
Hãy tiếp tục cập nhật mọi chi tiêu phát sinh để Cố vấn AI có thể đưa ra các phân tích và cảnh báo chính xác nhất cho Bạn.`;
}
