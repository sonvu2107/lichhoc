const scheduleData = {
8: { 
  1: [ 
    {
      name: "Triết học Mác - Lênin",
      time: "14:40 - 17:05",
      location: "Ngoài Trường - Online",
      teacher: "Đào Thị Mai",
    },

  ],
  2: [ 
    {
      name: "Triết học Mác - Lênin",
      time: "14:40 - 17:05",
      location: "Ngoài Trường - Online",
      teacher: "Đào Thị Mai",
    },
  ],
  4: [ 
    {
      name: "Kinh tế chính trị Mác - Lênin",
      time: "9:30 - 11:55",
      location: "Ngoài Trường - Online",
      teacher: "Đoàn Thị Hồng Lam",
    },
  ],
  5: [
    {
      name: "Triết học Mác - Lênin",
      time: "14:40 - 17:05",
      location: "Ngoài Trường - Online",
      teacher: "Đào Thị Mai",
    },
  ],
  8: [
    {
      name: "Triết học Mác - Lênin",
      time: "14:40 - 17:05",
      location: "Ngoài Trường - Online",
      teacher: "Đào Thị Mai",
    },
  ],
  9: [ 
    {
      name: "Triết học Mác - Lênin",
      time: "14:40 - 17:05",
      location: "Ngoài Trường - Online",
      teacher: "Đào Thị Mai",
    },
  ],
  12: [
    {
      name: "Triết học Mác - Lênin",
      time: "14:40 - 17:05",
      location: "Ngoài Trường - Online",
      teacher: "Đào Thị Mai",
    },
  ],
  15: [ 
    {
      name: "Triết học Mác - Lênin",
      time: "14:40 - 17:05",
      location: "Ngoài Trường - Online",
      teacher: "Đào Thị Mai",
    },
  ],
  16: [ 
    {
      name: "Triết học Mác - Lênin",
      time: "14:40 - 17:05",
      location: "Ngoài Trường - Online",
      teacher: "Đào Thị Mai",
    },
  ],
},

  9: { 
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
    16: [],
    17: [],
    18: [],
    19: [],
    20: [],
    21: [],
    22: [],
    23: [],
    24: [],
    25: [],
    26: [],
    27: [],
    28: [],
    29: [],
    30: [],
  }
};

const holidayData = {
  8: {
    
  },
  9: {
    
  }
};

let currentMonth = 8;
let currentCalendarMonth = 8;
let currentCalendarYear = 2025;
let settingsOpen = false;
let soundEnabled = true;
let notificationsEnabled = true;
let darkMode = false;

function playSound(type = 'click') {
  if (!soundEnabled) return;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch(type) {
    case 'click':
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
      break;
    case 'success':
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
      break;
    case 'error':
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      break;
  }
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

function showNotification(message, type = 'info', duration = 3000) {
  const toast = document.getElementById('notificationToast');
  const icon = toast.querySelector('.toast-icon');
  const messageEl = toast.querySelector('.toast-message');
  
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  
  icon.className = `toast-icon ${icons[type] || icons.info}`;
  messageEl.textContent = message;
  
  toast.className = `notification-toast show ${type}`;
  
  setTimeout(() => {
    hideNotification();
  }, duration);
  
  playSound(type === 'error' ? 'error' : 'success');
}

function hideNotification() {
  const toast = document.getElementById('notificationToast');
  toast.classList.remove('show');
}

function showLoading() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.add('show');
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.remove('show');
}

function showSchedule(month = currentMonth) {
  playSound('click');
  showLoading();
  
  setTimeout(() => {
    const dayInput = document.getElementById(month === 8 ? "dayInput" : "dayInput3");
    const day = parseInt(dayInput.value, 10);
    
    const scheduleOutput = document.getElementById(month === 8 ? "scheduleOutput" : "scheduleOutput3");
    const errorMessage = document.getElementById(month === 8 ? "errorMessage" : "errorMessage3");
    
    errorMessage.textContent = "";
    scheduleOutput.innerHTML = "";
    
    const maxDay = month === 8 ? 31 : 30;
    if (isNaN(day) || day < 1 || day > maxDay) {
      errorMessage.textContent = `Vui lòng nhập ngày hợp lệ (1-${maxDay})`;
      hideLoading();
      playSound('error');
      showNotification(`Ngày không hợp lệ! Vui lòng nhập từ 1-${maxDay}`, 'error');
      return;
    }
    
    const subjects = scheduleData[month]?.[day] || [];
    const holiday = holidayData[month]?.[day];
    
    if (subjects.length === 0) {
      if (holiday) {
        scheduleOutput.innerHTML = `
          <div class="holiday-notice">
            <i class="fas fa-calendar-times"></i>
            <strong>${holiday}</strong>
          </div>
        `;
      } else {
        scheduleOutput.innerHTML = `
          <div class="no-class-notice">
            <i class="fas fa-calendar-check"></i>
            <p>Không có môn học cho ngày này.</p>
            <small>Bạn có thể nghỉ ngơi hoặc tự học!</small>
          </div>
        `;
      }
    } else {
      scheduleOutput.innerHTML = `
        <div class="schedule-header">
          <h4><i class="fas fa-calendar-day"></i> Lịch học ngày ${day}/${month}</h4>
          <span class="class-count">${subjects.length} môn học</span>
        </div>
        <div class="subjects-list">
          ${subjects.map((subject, index) => `
            <div class="subject-card stagger-${(index % 5) + 1}">
              <div class="subject-header">
                <h5><i class="fas fa-book"></i> ${subject.name}</h5>
              </div>
              <div class="subject-details">
                <p><i class="fas fa-clock"></i> <strong>Thời gian:</strong> ${subject.time || 'Chưa xác định'}</p>
                <p><i class="fas fa-map-marker-alt"></i> <strong>Địa điểm:</strong> ${subject.location || 'Chưa xác định'}</p>
                <p><i class="fas fa-user-tie"></i> <strong>Giảng viên:</strong> ${subject.teacher}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      
      showNotification(`Tìm thấy ${subjects.length} môn học cho ngày ${day}/${month}`, 'success');
    }
    
    hideLoading();
    updateStats(month);
  }, 800);
}

function switchMonth(month) {
  playSound('click');
  currentMonth = month;
  
  document.querySelectorAll('.month-toggle').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-month="${month}"]`).classList.add('active');
  
  const cardInner = document.getElementById('cardInner');
  if (month === 9) {
    cardInner.classList.add('flipped');
  } else {
    cardInner.classList.remove('flipped');
  }
  
  updateQuickDates(month);
  
  const scheduleOutput = document.getElementById(month === 8 ? "scheduleOutput" : "scheduleOutput3");
  const errorMessage = document.getElementById(month === 8 ? "errorMessage" : "errorMessage3");
  scheduleOutput.innerHTML = "";
  errorMessage.textContent = "";
  
  showNotification(`Chuyển sang tháng ${month}`, 'info');
}

function updateStats(month) {
  const data = scheduleData[month] || {};
  let totalClasses = 0;
  let totalHours = 0;
  let subjects = new Set();
  
  Object.values(data).forEach(daySchedule => {
    if (Array.isArray(daySchedule)) {
      totalClasses += daySchedule.length;
      daySchedule.forEach(subject => {
        subjects.add(subject.name);
        if (subject.time && subject.time !== ' ') {
          const timeMatch = subject.time.match(/(\d+):(\d+)\s*-\s*(\d+):(\d+)/);
          if (timeMatch) {
            const startHour = parseInt(timeMatch[1]) + parseInt(timeMatch[2]) / 60;
            const endHour = parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 60;
            totalHours += endHour - startHour;
          } else {
            totalHours += 4; 
          }
        } else {
          totalHours += 4; 
        }
      });
    }
  });
  
  document.getElementById(`totalClasses${month}`).textContent = `${totalClasses} buổi học`;
  document.getElementById(`totalHours${month}`).textContent = `${Math.round(totalHours)} giờ`;
  
  document.getElementById('totalSubjects').textContent = subjects.size;
  document.getElementById('avgHoursPerDay').textContent = Math.round(totalHours / 30 * 10) / 10;
  document.getElementById('weeklyAverage').textContent = Math.round(totalClasses / 4 * 10) / 10;
  document.getElementById('attendanceRate').textContent = '95%'; // Mock data
}

function updateQuickDates(month) {
  const data = scheduleData[month] || {};
  const quickDates = Object.keys(data).filter(day => 
    Array.isArray(data[day]) && data[day].length > 0
  ).slice(0, 6); 
  
  const container = document.getElementById(`quickDates${month}`);
  container.innerHTML = quickDates.map(day => 
    `<button class="quick-date-btn" onclick="selectQuickDate(${day}, ${month})">${day}</button>`
  ).join('');
}

function selectQuickDate(day, month) {
  playSound('click');
  const dayInput = document.getElementById(month === 8 ? "dayInput" : "dayInput3");
  dayInput.value = day;
  showSchedule(month);
}

function exportSchedule(month) {
  playSound('click');
  const data = scheduleData[month] || {};
  let exportText = `LỊCH HỌC THÁNG ${month}/2025\n\n`;
  
  Object.entries(data).forEach(([day, subjects]) => {
    if (Array.isArray(subjects) && subjects.length > 0) {
      exportText += `Ngày ${day}/${month}:\n`;
      subjects.forEach(subject => {
        exportText += `- ${subject.name} (${subject.time}) - ${subject.teacher}\n`;
      });
      exportText += '\n';
    }
  });
  
  const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lich-hoc-thang-${month}-2025.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showNotification('Đã xuất lịch học thành công!', 'success');
}

function shareSchedule() {
  playSound('click');
  if (navigator.share) {
    navigator.share({
      title: 'Lịch Học Thông Minh',
      text: 'Chia sẻ lịch học của tôi',
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showNotification('Đã sao chép link chia sẻ!', 'success');
    });
  }
}

function showCalendarView(month) {
  playSound('click');
  currentCalendarMonth = month;
  document.getElementById('modalMonthTitle').textContent = month;
  document.getElementById('calendarTitle').textContent = `Tháng ${month}, ${currentCalendarYear}`;
  generateCalendar();
  showModal('calendarModal');
}

function showStatistics(month) {
  playSound('click');
  document.getElementById('statsMonthTitle').textContent = month;
  updateStats(month);
  showModal('statisticsModal');
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('show');
}

function closeModal(modalId) {
  playSound('click');
  const modal = document.getElementById(modalId);
  modal.classList.remove('show');
}

function generateCalendar() {
  const grid = document.getElementById('calendarGrid');
  const daysInMonth = currentCalendarMonth === 8 ? 31 : 30;
  const data = scheduleData[currentCalendarMonth] || {};
  
  grid.innerHTML = '';
  
  const dayHeaders = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  dayHeaders.forEach(day => {
    const header = document.createElement('div');
    header.textContent = day;
    header.className = 'calendar-header-day';
    grid.appendChild(header);
  });
  
  const firstDay = new Date(currentCalendarYear, currentCalendarMonth - 1, 1).getDay();
  
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    grid.appendChild(emptyDay);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement('div');
    dayEl.textContent = day;
    dayEl.className = 'calendar-day';
    
    if (data[day] && Array.isArray(data[day]) && data[day].length > 0) {
      dayEl.classList.add('has-class');
      dayEl.title = `${data[day].length} môn học`;
    }
    
    dayEl.onclick = () => selectCalendarDay(day);
    grid.appendChild(dayEl);
  }
}

function selectCalendarDay(day) {
  playSound('click');
  const dayInput = document.getElementById(currentCalendarMonth === 8 ? "dayInput" : "dayInput3");
  dayInput.value = day;
  closeModal('calendarModal');
  showSchedule(currentCalendarMonth);
}

function changeCalendarMonth(direction) {
  playSound('click');
  currentCalendarMonth += direction;
  
  if (currentCalendarMonth < 1) {
    currentCalendarMonth = 12;
    currentCalendarYear--;
  } else if (currentCalendarMonth > 12) {
    currentCalendarMonth = 1;
    currentCalendarYear++;
  }
  
  document.getElementById('calendarTitle').textContent = `Tháng ${currentCalendarMonth}, ${currentCalendarYear}`;
  generateCalendar();
}

function toggleSettings() {
  playSound('click');
  const panel = document.getElementById('settingsPanel');
  settingsOpen = !settingsOpen;
  
  if (settingsOpen) {
    panel.classList.add('open');
  } else {
    panel.classList.remove('open');
  }
}

function updateCurrentDate() {
  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh'
  };
  
  document.getElementById('currentDate').textContent = 
    now.toLocaleDateString('vi-VN', options);
}

document.addEventListener("DOMContentLoaded", function () {
  updateCurrentDate();
  setInterval(updateCurrentDate, 60000); 
  
  updateQuickDates(8);
  updateQuickDates(9);
  
  updateStats(8);
  updateStats(9);
  
  const dayInput8 = document.getElementById("dayInput");
  const dayInput9 = document.getElementById("dayInput3");
  
  if (dayInput8) {
    dayInput8.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        showSchedule(8);
      }
    });
  }
  
  if (dayInput9) {
    dayInput9.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        showSchedule(9);
      }
    });
  }
  
  const card = document.getElementById("cardInner");
  if (card) {
    card.addEventListener("dblclick", function () {
      const isFlipped = card.classList.contains("flipped");
      switchMonth(isFlipped ? 8 : 9);
    });
  }
  
  const darkModeToggle = document.getElementById('darkModeToggle');
  const soundToggle = document.getElementById('soundToggle');
  const notificationToggle = document.getElementById('notificationToggle');
  
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', function() {
      darkMode = this.checked;
      document.body.classList.toggle('dark-mode', darkMode);
      playSound('click');
      showNotification(`Chế độ tối: ${darkMode ? 'Bật' : 'Tắt'}`, 'info');
    });
  }
  
  if (soundToggle) {
    soundToggle.addEventListener('change', function() {
      soundEnabled = this.checked;
      showNotification(`Âm thanh: ${soundEnabled ? 'Bật' : 'Tắt'}`, 'info');
    });
  }
  
  if (notificationToggle) {
    notificationToggle.addEventListener('change', function() {
      notificationsEnabled = this.checked;
      playSound('click');
      showNotification(`Thông báo: ${notificationsEnabled ? 'Bật' : 'Tắt'}`, 'info');
    });
  }
  
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      closeModal(event.target.id);
    }
  });
  
  document.addEventListener('click', function(event) {
    const settingsPanel = document.getElementById('settingsPanel');
    if (settingsOpen && !settingsPanel.contains(event.target)) {
      toggleSettings();
    }
  });
  
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const openModal = document.querySelector('.modal.show');
      if (openModal) {
        closeModal(openModal.id);
      } else if (settingsOpen) {
        toggleSettings();
      }
    }
    
    if (event.key === '1' && !event.target.matches('input')) {
      event.preventDefault();
      switchMonth(8);
    }
    if (event.key === '2' && !event.target.matches('input')) {
      event.preventDefault();
      switchMonth(9);
    }
    
    if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
      event.preventDefault();
      exportSchedule(currentMonth);
    }
    
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      shareSchedule();
    }
  });
  
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
  });
  
  document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        switchMonth(currentMonth === 8 ? 9 : 8);
      } else {
        switchMonth(currentMonth === 9 ? 8 : 9);
      }
    }
  }
  
  loadPreferences();
  
  setInterval(savePreferences, 5000);
  
  setTimeout(() => {
    showNotification('Chào mừng đến với lịch học!', 'success', 4000);
  }, 1000);
  
  const staggerElements = document.querySelectorAll('.stats-display .stat-item');
  staggerElements.forEach((el, index) => {
    el.classList.add(`stagger-${index + 1}`);
  });
});

function savePreferences() {
  const preferences = {
    darkMode,
    soundEnabled,
    notificationsEnabled,
    currentMonth,
    lastVisit: new Date().toISOString()
  };
  
  try {
    window.appPreferences = preferences;
  } catch (error) {
    console.log('Cannot save preferences - localStorage not available');
  }
}

function loadPreferences() {
  try {
    const preferences = window.appPreferences || {};
    
    darkMode = preferences.darkMode || false;
    soundEnabled = preferences.soundEnabled !== false; 
    notificationsEnabled = preferences.notificationsEnabled !== false; 
    currentMonth = preferences.currentMonth || 8;
    
    document.body.classList.toggle('dark-mode', darkMode);
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    const soundToggle = document.getElementById('soundToggle');
    const notificationToggle = document.getElementById('notificationToggle');
    
    if (darkModeToggle) darkModeToggle.checked = darkMode;
    if (soundToggle) soundToggle.checked = soundEnabled;
    if (notificationToggle) notificationToggle.checked = notificationsEnabled;
    
    if (currentMonth === 9) {
      switchMonth(9);
    }
    
  } catch (error) {
    console.log('Cannot load preferences');
  }
}

function formatTime(timeStr) {
  if (!timeStr || timeStr === ' ') return 'Chưa xác định';
  return timeStr;
}

function getSubjectIcon(subjectName) {
  const icons = {
    'Triết học Mác - Lênin': 'fas fa-brain',
    'Kinh tế chính trị Mác - Lênin': 'fas fa-chart-line',
  };
  
  for (const [subject, icon] of Object.entries(icons)) {
    if (subjectName.includes(subject)) {
      return icon;
    }
  }
  
  return 'fas fa-book';
}

function getRandomMotivationalQuote() {
  const quotes = [
    "Học tập là kho báu sẽ theo chủ nhân của nó đi khắp nơi!",
    "Kiến thức là sức mạnh, hãy tiếp tục học hỏi!",
    "Mỗi ngày học một điều mới là mỗi ngày tiến bộ!",
    "Thành công đến từ sự chuẩn bị và nỗ lực không ngừng!",
    "Hôm nay khó khăn, ngày mai sẽ tốt đẹp hơn!",
    "Triết học giúp ta hiểu về thế giới và bản thân!",
    "Kinh tế chính trị là nền tảng hiểu biết xã hội!"
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedSearch = debounce((month) => {
  showSchedule(month);
}, 300);

let clickCount = 0;
function handleTitleClick() {
  clickCount++;
  if (clickCount === 5) {
    showNotification(getRandomMotivationalQuote(), 'info', 5000);
    clickCount = 0;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const titles = document.querySelectorAll('.title');
  titles.forEach(title => {
    title.addEventListener('click', handleTitleClick);
    title.style.cursor = 'pointer';
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

window.showSchedule = showSchedule;
window.switchMonth = switchMonth;
window.selectQuickDate = selectQuickDate;
window.exportSchedule = exportSchedule;
window.shareSchedule = shareSchedule;
window.showCalendarView = showCalendarView;
window.showStatistics = showStatistics;
window.closeModal = closeModal;
window.toggleSettings = toggleSettings;
window.changeCalendarMonth = changeCalendarMonth;
window.hideNotification = hideNotification;