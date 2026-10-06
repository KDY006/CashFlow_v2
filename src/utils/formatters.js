/**
 * Các hàm tiện ích định dạng tiền tệ, ngày tháng và màu sắc đồng bộ với bản gốc CashFlow
 */

// 1. Thuật toán đồng bộ màu sắc danh mục
export function getCategoryColor(name) {
  if (!name) return '#999999';
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#F06292', 
    '#AED581', '#7986CB', '#4DB6AC', '#FFB74D', '#A1887F', 
    '#90A4AE', '#BA68C8', '#FF8A65', '#4DD0E1', '#81C784'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) { 
    hash = name.charCodeAt(i) + ((hash << 5) - hash); 
  }
  return colors[Math.abs(hash) % colors.length];
}

// 2. Format số tiền có dấu chấm (Ví dụ: 1000000 -> 1.000.000)
export function formatNumberInput(value) {
  if (!value) return "0";
  const raw = value.toString().replace(/\D/g, ""); 
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// 3. Format tiền tệ đầy đủ (Ví dụ: 120000 -> "120.000 đ")
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "0 đ";
  const num = Math.round(Number(amount));
  return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
}

// 4. Đọc số tiền thành chữ Tiếng Việt
export function readVietnameseNumber(number) {
  if (!number || number == 0) return "";
  const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const levels = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];
  
  function readThreeDigits(num, isFirst) {
    let hundred = Math.floor(num / 100); 
    let ten = Math.floor((num % 100) / 10); 
    let unit = num % 10; 
    let res = "";

    if (hundred > 0 || !isFirst) res += units[hundred] + " trăm ";
    if (ten > 1) { 
      res += units[ten] + " mươi "; 
      if (unit == 1) res += "mốt "; 
      else if (unit == 5) res += "lăm "; 
      else if (unit > 0) res += units[unit] + " "; 
    } else if (ten == 1) { 
      res += "mười "; 
      if (unit == 5) res += "lăm "; 
      else if (unit > 0) res += units[unit] + " "; 
    } else if (unit > 0) { 
      if (!isFirst || hundred > 0) res += "linh " + units[unit] + " "; 
      else res += units[unit] + " "; 
    }
    return res;
  }
  
  let str = ""; 
  let i = 0; 
  let temp = Math.abs(Math.round(number));

  do {
    let block = temp % 1000;
    if (block > 0) { 
      let s = readThreeDigits(block, temp < 1000); 
      str = s + levels[i] + " " + str; 
    }
    temp = Math.floor(temp / 1000); 
    i++;
  } while (temp > 0);

  const prefix = number < 0 ? "Âm " : "";
  const finalStr = str.trim();
  if (!finalStr) return "";
  return prefix + finalStr.charAt(0).toUpperCase() + finalStr.slice(1) + " đồng";
}

// 5. Format ngày giờ
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${time} ${date}`;
}

export function formatTimeOnly(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}
