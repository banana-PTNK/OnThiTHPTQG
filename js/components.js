// MTKL Components - Logic render giao diện động cho Single Page Application

const MTKL_Components = {
    utilEscapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag));
    },
    utilFormatText(str) {
        if (!str) return '';
        let escaped = this.utilEscapeHTML(str).replace(/`/g, ''); // Xóa backtick
        
        // Render Markdown Tables
        const lines = escaped.split('\n');
        let inTable = false;
        let htmlLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line.startsWith('|') && line.endsWith('|')) {
                if (!inTable) {
                    htmlLines.push('<div style="overflow-x:auto;"><table class="md-table">');
                    inTable = true;
                }
                if (line.match(/^\|[-:\| ]+\|$/)) continue; // skip separators
                let cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
                htmlLines.push('<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>');
            } else {
                if (inTable) {
                    htmlLines.push('</table></div>');
                    inTable = false;
                }
                htmlLines.push(lines[i]);
            }
        }
        if (inTable) htmlLines.push('</table></div>');
        
        return htmlLines.join('<br>').replace(/<\/table><\/div><br>/g, '</table></div>').replace(/<table class="md-table"><br>/g, '<table class="md-table">').replace(/<\/tr><br>/g, '</tr>');
    },

    // -------------------------------------------------------------
    // 1. RENDER TRANG CHỦ (HOME)
    // -------------------------------------------------------------
    renderHome(container) {
        // Lấy số liệu thống kê thực tế từ LocalStorage
        const reviewedCount = localStorage.getItem('mtkl_stat_reviewed') || '4';
        const resolvedCount = localStorage.getItem('mtkl_stat_resolved') || '0';
        const streakCount = localStorage.getItem('mtkl_streak') || '3';
        
        // Tính số câu sai còn tồn đọng
        const activeMistakes = MTKL_DB.getMistakes().filter(m => !m.isResolved).length;

        container.innerHTML = `
            <!-- Hero Section -->
            <section class="hero">
                <div class="container hero-grid">
                    <div class="hero-text-box">
                        <div class="hero-badge">📚 Ứng dụng ôn thi Tin học THPTQG tốt nhất</div>
                        <h1 class="hero-title">Turn Your Mistakes<br><span style="color:var(--primary-darker)">Into Mastery</span></h1>
                        <p class="hero-subtitle">Học thông minh qua lỗi sai. Chụp ảnh câu hỏi làm sai, số hóa đề bài và luyện tập lặp đi lặp lại để khắc sâu kiến thức thi THPTQG.</p>
                        <div class="hero-actions">
                            <button class="btn btn-primary" id="heroStartLearningBtn">Bắt đầu học ngay</button>
                            <button class="btn btn-secondary" id="heroSeeDemoBtn">Xem Demo ôn tập</button>
                        </div>
                    </div>
                    <div class="hero-mockup-wrapper">
                        <div class="flat-mockup">
                            <div class="mockup-header">
                                <div class="mockup-dot"></div>
                                <div class="mockup-dot"></div>
                                <div class="mockup-dot"></div>
                            </div>
                            <div class="mockup-content">
                                <h4 style="margin-bottom: 12px; font-size: 0.95rem; border-bottom: 2px solid var(--border-dark); padding-bottom: 6px;">🎯 ĐANG ÔN TẬP</h4>
                                <div style="background-color: var(--bg-color); border: 2px solid var(--border-dark); padding: 10px; border-radius: var(--radius-sm); margin-bottom: 10px; font-size:0.8rem;">
                                    <strong>Câu hỏi:</strong> Trong SQL, từ khóa nào dùng để loại bỏ các dòng trùng lặp trong kết quả truy vấn?
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.75rem;">
                                    <div style="background-color: var(--primary-light); border: 1.5px solid var(--border-dark); padding: 6px; text-align: center; font-weight: bold; border-radius: 4px;">A. DISTINCT</div>
                                    <div style="background: var(--bg-color); border: 1.5px solid var(--border-dark); padding: 6px; text-align: center; border-radius: 4px;">B. UNIQUE</div>
                                    <div style="background: var(--bg-color); border: 1.5px solid var(--border-dark); padding: 6px; text-align: center; border-radius: 4px;">C. GROUP BY</div>
                                    <div style="background: var(--bg-color); border: 1.5px solid var(--border-dark); padding: 6px; text-align: center; border-radius: 4px;">D. DELETE</div>
                                </div>
                                <div style="margin-top: 12px; background-color: var(--warning-bg); border: 1.5px solid var(--border-dark); padding: 6px; border-radius: 4px; font-size: 0.7rem; font-style: italic;">
                                    💡 <strong>Ghi chú của bạn:</strong> "Đừng nhầm UNIQUE trong khai báo bảng với DISTINCT trong câu lệnh SELECT nhé!"
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            
            <!-- Countdown Section -->
            <section class="container" style="margin-top: -20px; margin-bottom: 20px; position: relative; z-index: 5;">
                <div class="countdown-wrapper" style="background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); padding: 24px 32px; border-radius: var(--radius-lg); box-shadow: 4px 4px 0 var(--border-dark); border: 2px solid var(--border-dark); display: flex; justify-content: space-between; align-items: center; color: white; flex-wrap: wrap; gap: 20px;">
                    <div class="countdown-info">
                        <h3 style="margin-bottom: 8px; font-size: 1.5rem; text-shadow: 1px 1px 0 rgba(0,0,0,0.2);">⏰ Đếm ngược kì thi THPTQG 2026</h3>
                        <p style="opacity: 0.9; margin: 0; font-size: 0.95rem; font-weight: 600;" id="currentDateTime">Hôm nay: --/--/---- --:--:--</p>
                    </div>
                    <div class="countdown-timer" style="display: flex; gap: 12px;">
                        <div class="time-box" style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); color: #e11d48; padding: 12px 24px; border-radius: 12px; text-align: center; border: 2px solid #fff; min-width: 90px; box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4); transform: scale(1.15); transform-origin: center right;">
                            <div id="cd-days" style="font-size: 2.8rem; font-weight: 900; font-family: monospace; text-shadow: 1px 1px 0 rgba(255,255,255,0.5); line-height: 1;">--</div>
                            <div style="font-size: 0.85rem; text-transform: uppercase; font-weight: 800; letter-spacing: 1.5px; margin-top: 6px;">Ngày</div>
                        </div>
                        <div class="time-box" style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 12px 16px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.3); min-width: 75px;">
                            <div id="cd-hours" style="font-size: 1.8rem; font-weight: 800; font-family: monospace; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">--</div>
                            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; opacity: 0.9;">Giờ</div>
                        </div>
                        <div class="time-box" style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 12px 16px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.3); min-width: 75px;">
                            <div id="cd-mins" style="font-size: 1.8rem; font-weight: 800; font-family: monospace; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">--</div>
                            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; opacity: 0.9;">Phút</div>
                        </div>
                        <div class="time-box" style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 12px 16px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.3); min-width: 75px;">
                            <div id="cd-secs" style="font-size: 1.8rem; font-weight: 800; font-family: monospace; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">--</div>
                            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; opacity: 0.9;">Giây</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Social Proof Section -->
            <section class="trust-stats"
>
                <div class="container stats-grid">
                    <div class="stat-card">
                        <div class="stat-num">${reviewedCount}</div>
                        <div class="stat-label">Câu hỏi đã lưu lỗi sai</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-num">+${reviewedCount > 0 ? Math.round((resolvedCount / reviewedCount) * 100) : 0}%</div>
                        <div class="stat-label">Tỷ lệ sửa sai thành công</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-num">${streakCount} Ngày</div>
                        <div class="stat-label">Chuỗi học tập liên tiếp (Streak)</div>
                    </div>
                </div>
            </section>

            <!-- Quick Practice Config Panel (UX Yêu cầu) -->
            <section class="container" style="margin-top: 80px;">
                <div class="practice-panel" id="practiceSetupPanel">
                    <h2 class="text-center" style="font-size: 2rem; margin-bottom: 12px;">⚡ Luyện tập lại câu hỏi sai</h2>
                    <p class="text-center text-muted" style="margin-bottom: 36px; max-width: 600px; margin-left: auto; margin-right: auto;">
                        Cấu hình buổi ôn tập cá nhân hóa dựa trên những câu hỏi bạn đã tải lên hệ thống. Bạn có <strong class="text-danger" id="homeActiveMistakesNum">${activeMistakes}</strong> câu sai chưa sửa.
                    </p>
                    
                    <div class="practice-panel-grid">
                        <div class="config-form">
                            <div class="config-group">
                                <label>1. Chọn chủ đề kiến thức</label>
                                <select class="config-select" id="practiceTopic">
                                    <option value="all">Tất cả chủ đề Tin học</option>
                                    ${TIN_HOC_TOPICS.map(t => `<option value="${t.id}">${t.name} (${t.grade})</option>`).join('')}
                                </select>
                            </div>
                            
                            <div class="config-group">
                                <label>2. Định dạng câu hỏi</label>
                                <div class="options-chips" id="practiceTypeChips">
                                    <button type="button" class="chip-btn active" data-value="all">Tất cả</button>
                                    <button type="button" class="chip-btn" data-value="mcq">Trắc nghiệm ABCD</button>
                                    <button type="button" class="chip-btn" data-value="tf">Đúng / Sai THPTQG</button>
                                </div>
                            </div>
                        </div>

                        <div class="config-form">
                            <div class="config-group">
                                <label>3. Số lượng câu hỏi ôn tập</label>
                                <div class="options-chips" id="practiceLimitChips">
                                    <button type="button" class="chip-btn active" data-value="5">5 câu</button>
                                    <button type="button" class="chip-btn" data-value="10">10 câu</button>
                                    <button type="button" class="chip-btn" data-value="15">15 câu</button>
                                    <button type="button" class="chip-btn" data-value="all">Toàn bộ câu sai</button>
                                </div>
                            </div>

                            <div class="config-group">
                                <label>4. Giới hạn thời gian làm bài</label>
                                <div class="options-chips" id="practiceTimeChips">
                                    <button type="button" class="chip-btn active" data-value="300">5 phút</button>
                                    <button type="button" class="chip-btn" data-value="600">10 phút</button>
                                    <button type="button" class="chip-btn" data-value="900">15 phút</button>
                                    <button type="button" class="chip-btn" data-value="0">Không giới hạn</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 36px;">
                        <button class="btn btn-primary" style="padding: 12px 36px; font-size: 1.1rem;" id="startPracticeBtn">🚀 Bắt đầu luyện tập ngay</button>
                    </div>
                </div>
            </section>

            <!-- Features Section -->
            <section class="features-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Tính năng giúp bạn bứt phá điểm Tin học</h2>
                        <p class="section-desc">Được thiết kế chuyên biệt để học sinh THPTQG làm quen với cấu trúc đề thi mới và nhớ lâu hơn gấp 4 lần.</p>
                    </div>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon-wrapper">📸</div>
                            <h3>Chụp & Tải câu sai lên</h3>
                            <p>Chụp lại câu hỏi làm sai trên giấy hoặc đề thi thử, tải lên để lưu trữ vĩnh viễn.</p>
                            <a href="#review-sets" class="feature-link">Trải nghiệm tải lên &rarr;</a>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon-wrapper">✨</div>
                            <h3>Tự động làm nét đề</h3>
                            <p>Công nghệ xử lý hình ảnh mô phỏng giúp làm rõ nét văn bản, sơ đồ CSDL và các đoạn code.</p>
                            <a href="#review-sets" class="feature-link">Xem công cụ &rarr;</a>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon-wrapper">🤖</div>
                            <h3>AI OCR số hóa cực chuẩn</h3>
                            <p>Quét ký tự tự động chuyển đổi ảnh đề thi thành chữ viết, giúp bạn dễ dàng rà soát và chỉnh sửa.</p>
                            <a href="#review-sets" class="feature-link">Tìm hiểu thêm &rarr;</a>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon-wrapper">📝</div>
                            <h3>Ghi chú tự nhắc lỗi sai</h3>
                            <p>Tự ghi lại nguyên nhân sai sót dưới dạng Sticky Note hiển thị ngay khi làm lại bài.</p>
                            <a href="#review-sets" class="feature-link">Xem ghi chú mẫu &rarr;</a>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon-wrapper">📊</div>
                            <h3>Theo dõi điểm yếu CSDL/Web</h3>
                            <p>Phân tích chi tiết bạn đang sai nhiều ở SQL hay HTML/CSS để tập trung ôn tập đúng hướng.</p>
                            <a href="#progress" class="feature-link">Xem tiến độ &rarr;</a>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon-wrapper">⚔️</div>
                            <h3>Đúng/Sai THPTQG thế hệ mới</h3>
                            <p>Luyện tập trực quan định dạng câu hỏi Đúng/Sai (gồm 4 ý a, b, c, d) cập nhật theo chuẩn thi Bộ GD&ĐT.</p>
                            <a href="#review-sets" class="feature-link">Luyện tập &rarr;</a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Learning Flow Showcase (Alternating Layout) -->
            <section class="flow-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Quy trình học tập "Chụp - Quét - Master"</h2>
                        <p class="section-desc">Không còn nỗi lo ghi chép thủ công. Hãy để MTKL đồng hành cùng bạn sửa từng lỗi sai.</p>
                    </div>
                    <div class="flow-step-container">
                        <!-- Step 1 -->
                        <div class="flow-row">
                            <div class="flow-text-box">
                                <span class="flow-number">Bước 1</span>
                                <h3>Chụp đề bài câu hỏi làm sai</h3>
                                <p>Khi làm bài trên lớp, làm đề thi thử mà gặp câu hỏi khó hoặc bị làm sai, bạn chỉ cần dùng điện thoại chụp ảnh lại câu hỏi đó.</p>
                            </div>
                            <div class="flow-visual">
                                <div style="text-align: center; color: var(--text-secondary);">
                                    <div style="font-size: 4rem; margin-bottom: 10px;">📸</div>
                                    <p style="font-weight: 700; color: var(--text-primary);">Chụp ảnh bằng điện thoại hoặc chụp màn hình máy tính</p>
                                    <span style="font-size:0.8rem; background: var(--bg-tertiary); padding: 4px 8px; border-radius: 4px; margin-top:8px; display:inline-block; border:1px solid var(--border-dark);">Độ phân giải gốc được giữ nguyên</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Step 2 -->
                        <div class="flow-row">
                            <div class="flow-visual">
                                <div style="text-align: center; width: 100%;">
                                    <div style="font-size: 3.5rem; margin-bottom: 10px;">⚡</div>
                                    <p style="font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Công nghệ Image Sharpening + AI OCR</p>
                                    <div style="max-width: 300px; margin: 0 auto; background: var(--bg-secondary); border: 2px solid var(--border-dark); padding: 8px; border-radius: 6px; font-size: 0.75rem; text-align: left; font-family: monospace;">
                                        <span style="color:var(--success-color)">[SUCCESS]</span> Quét ảnh thành công:<br>
                                        "CREATE TABLE HOC_SINH..."
                                    </div>
                                </div>
                            </div>
                            <div class="flow-text-box">
                                <span class="flow-number">Bước 2</span>
                                <h3>Làm nét & Trích xuất ký tự</h3>
                                <p>Hệ thống tự động chạy bộ lọc xử lý hình ảnh tăng độ nét. Ngay sau đó, mô-đun AI OCR sẽ chuyển đổi văn bản trong ảnh thành dạng text số để phân loại chủ đề và cấu hình đáp án.</p>
                            </div>
                        </div>

                        <!-- Step 3 -->
                        <div class="flow-row">
                            <div class="flow-text-box">
                                <span class="flow-number">Bước 3</span>
                                <h3>Luyện tập lặp lại ngắt quãng</h3>
                                <p>Làm lại câu hỏi đó ngay trên hệ thống. MTKL sẽ liên tục hiển thị lại các câu bạn đã làm sai kèm theo các lưu ý ghi chú cá nhân cho đến khi bạn hoàn toàn làm chủ kiến thức đó.</p>
                            </div>
                            <div class="flow-visual">
                                <div style="text-align: center; color: var(--text-secondary);">
                                    <div style="font-size: 4rem; margin-bottom: 10px;">🔥</div>
                                    <p style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Luyện tập thường xuyên</p>
                                    <p style="font-size: 0.85rem;">Xóa sạch câu sai - Tự tin đạt điểm 9, 10 môn Tin học THPTQG</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Mid-page CTA -->
            <section class="container">
                <div class="cta-banner">
                    <div class="cta-banner-content">
                        <h2>Sẵn sàng biến sai sót thành điểm 10?</h2>
                        <p>Học từ chính sai lầm của bản thân là con đường ngắn nhất dẫn đến thành công. Đăng ký tài khoản và bắt đầu ôn tập Tin học THPTQG ngay hôm nay.</p>
                        <div class="cta-banner-actions">
                            <button class="btn btn-primary" id="ctaRegisterBtn">Đăng ký miễn phí</button>
                            <button class="btn btn-secondary" id="ctaAboutBtn">Tìm hiểu phương pháp</button>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Đăng ký sự kiện tương tác trên Trang chủ
        this.registerHomeEvents();
    },

    registerHomeEvents() {
        // Sự kiện chuyển trang
        document.getElementById('heroStartLearningBtn').addEventListener('click', () => {
            window.location.hash = '#review-sets';
        });
        
        
        // Start Countdown Timer
        if (app.homeCountdownInterval) {
            clearInterval(app.homeCountdownInterval);
        }
        const targetDate = new Date('2026-06-11T00:00:00').getTime(); // Ngày 11/06/2026
        
        const updateCountdown = () => {
            const now = new Date();
            
            const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
            const dow = daysOfWeek[now.getDay()];
            const d = String(now.getDate()).padStart(2, '0');
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const y = now.getFullYear();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            
            const currText = document.getElementById('currentDateTime');
            if (currText) {
                currText.innerText = 'Hôm nay: ' + dow + ', ngày ' + d + '/' + m + '/' + y + ' - ' + hh + ':' + mm + ':' + ss;
            }

            const distance = targetDate - now.getTime();
            
            if (distance < 0) {
                if (document.getElementById('cd-days')) {
                    document.getElementById('cd-days').innerText = '00';
                    document.getElementById('cd-hours').innerText = '00';
                    document.getElementById('cd-mins').innerText = '00';
                    document.getElementById('cd-secs').innerText = '00';
                }
                clearInterval(app.homeCountdownInterval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (document.getElementById('cd-days')) {
                document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
                document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
                document.getElementById('cd-mins').innerText = String(minutes).padStart(2, '0');
                document.getElementById('cd-secs').innerText = String(seconds).padStart(2, '0');
            }
        };

        updateCountdown();
        app.homeCountdownInterval = setInterval(updateCountdown, 1000);

        document.getElementById('heroSeeDemoBtn').addEventListener('click', () => {
            // Luyện tập thử 5 câu hỏi ngẫu nhiên trong hệ thống
            this.startPracticeSession('all', 'all', '5', '300');
        });

        document.getElementById('ctaAboutBtn').addEventListener('click', () => {
            window.location.hash = '#about';
        });

        const isLogged = localStorage.getItem('mtkl_user_logged') === 'true';
        document.getElementById('ctaRegisterBtn').addEventListener('click', () => {
            if (isLogged) {
                window.location.hash = '#review-sets';
            } else {
                app.openAuthModal('register');
            }
        });

        // Thiết lập sự kiện click cho các chip chọn loại câu hỏi, giới hạn, thời gian
        this.setupChipsGroup('practiceTypeChips');
        this.setupChipsGroup('practiceLimitChips');
        this.setupChipsGroup('practiceTimeChips');

        // Bấm nút bắt đầu ôn tập
        document.getElementById('startPracticeBtn').addEventListener('click', () => {
            const topic = document.getElementById('practiceTopic').value;
            const type = this.getSelectedChipValue('practiceTypeChips');
            const limit = this.getSelectedChipValue('practiceLimitChips');
            const time = this.getSelectedChipValue('practiceTimeChips');
            
            this.startPracticeSession(topic, type, limit, time);
        });
    },

    setupChipsGroup(groupId) {
        const container = document.getElementById(groupId);
        if (!container) return;
        const chips = container.querySelectorAll('.chip-btn');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
            });
        });
    },

    getSelectedChipValue(groupId) {
        const container = document.getElementById(groupId);
        if (!container) return 'all';
        const activeChip = container.querySelector('.chip-btn.active');
        return activeChip ? activeChip.getAttribute('data-value') : 'all';
    },

    startPracticeSession(topic, type, limit, time) {
        // Chuyển sang practice page và truyền tham số cấu hình qua state
        app.practiceConfig = { topic, type, limit, time: parseInt(time) };
        localStorage.removeItem('mtkl_practice_session');
        window.location.hash = '#practice';
    },

    // -------------------------------------------------------------
    // 2. RENDER BỘ CÂU HỎI ÔN TẬP (REVIEW SETS)
    // -------------------------------------------------------------
    renderReviewSets(container) {
        // Kiểm tra xem đã đăng nhập chưa
        const isLogged = app.state.isLogged;
        if (!isLogged) {
            container.innerHTML = `
                <div class="container text-center" style="padding: 100px 0;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
                    <h2>Vui lòng đăng nhập để sử dụng tính năng này</h2>
                    <p class="text-muted" style="margin-bottom: 30px;">Bạn cần đăng nhập để quản lý và ôn tập các câu hỏi làm sai của riêng mình.</p>
                    <button class="btn btn-primary" onclick="app.openAuthModal('login')">Đăng nhập ngay</button>
                </div>
            `;
            return;
        }

        const activeMistakes = MTKL_DB.getActiveMistakesCount();
        const allQuestions = MTKL_DB.getAllQuestions();
        const uploadedQuestions = MTKL_DB.getUploadedQuestions();

        container.innerHTML = `
            <div class="container" style="padding-top: 40px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid var(--border-dark); padding-bottom: 20px;">
                    <div>
                        <h2 style="font-size: 2.2rem; margin-bottom: 6px;">📚 Hộp Câu Hỏi Sai</h2>
                        <p class="text-muted">Nơi lưu trữ các câu hỏi bạn làm sai để ôn tập lại định kỳ.</p>
                    </div>
                    <button class="btn btn-primary" id="goToUploadBtn">➕ Tải câu sai lên</button>
                </div>

                <div style="background-color: var(--primary-light); border: 2px solid var(--border-dark); padding: 20px; border-radius: var(--radius-md); margin-bottom: 40px; display: flex; align-items: center; justify-content: space-between; box-shadow: 3px 3px 0 var(--border-dark);">
                    <div style="display: flex; gap: 24px; align-items: center;">
                        <span style="font-size: 2.5rem;">📁</span>
                        <div>
                            <h4 style="font-size: 1.15rem; margin-bottom: 4px;">Câu hỏi cá nhân của bạn</h4>
                            <p class="text-muted" style="font-size: 0.9rem;">Bạn đã tải lên <strong>${uploadedQuestions.length}</strong> câu hỏi cá nhân.</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-secondary" id="manageCustomBtn" ${uploadedQuestions.length === 0 ? 'disabled' : ''}>✏️ Quản lý / Sửa</button>
                        <button class="btn btn-primary" id="practiceCustomBtn" ${uploadedQuestions.length === 0 ? 'disabled' : ''}>Luyện câu đã tải</button>
                    </div>
                </div>

                <h3 style="font-size: 1.5rem; margin-bottom: 20px;">Phân loại theo chuyên đề Tin học</h3>
                <div class="review-sets-grid">
                    ${TIN_HOC_TOPICS.map(t => `
                    <div class="set-card">
                        <div class="set-header">
                            <div class="set-title-group">
                                <h3>${t.name}</h3>
                                <span style="font-size: 0.8rem; background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-dark); margin-top: 4px; display: inline-block;">${t.grade}</span>
                            </div>
                            <span class="set-badge-count ${!activeMistakes[t.id] || activeMistakes[t.id].total === 0 ? 'zero' : ''}">${activeMistakes[t.id]?.total || 0} câu sai</span>
                        </div>
                        <p class="set-card-desc">${t.desc}</p>
                        <div class="set-meta-info">
                            <span>Độ khó: Đa dạng</span>
                            <span>${activeMistakes[t.id]?.mcq || 0} Trắc nghiệm & ${activeMistakes[t.id]?.tf || 0} Đúng/Sai</span>
                        </div>
                        <button class="btn btn-primary" onclick="MTKL_Components.startTopicReview('${t.id}')" ${!activeMistakes[t.id] || activeMistakes[t.id].total === 0 ? 'disabled' : ''}>Review Ngay</button>
                    </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('goToUploadBtn').addEventListener('click', () => {
            window.location.hash = '#upload';
        });

        document.getElementById('practiceCustomBtn').addEventListener('click', () => {
            // Ôn tập các câu hỏi tự upload
            app.practiceConfig = { topic: 'custom_upload', type: 'all', limit: 'all', time: 0 };
            window.location.hash = '#practice';
        });

        const manageCustomBtn = document.getElementById('manageCustomBtn');
        if (manageCustomBtn) {
            manageCustomBtn.addEventListener('click', () => {
                window.location.hash = '#manage-custom';
            });
        }
    },

    startTopicReview(topic) {
        app.practiceConfig = { topic, type: 'all', limit: 'all', time: 0 };
        localStorage.removeItem('mtkl_practice_session');
        window.location.hash = '#practice';
    },

    // -------------------------------------------------------------
    // 2.5 RENDER QUẢN LÝ CÂU HỎI (MANAGE CUSTOM)
    // -------------------------------------------------------------
    renderManageCustom(container) {
        const isLogged = app.state.isLogged;
        if (!isLogged) {
            window.location.hash = '#home';
            return;
        }

        const uploadedQuestions = MTKL_DB.getUploadedQuestions();

        container.innerHTML = `
            <div class="container" style="padding-top: 40px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid var(--border-dark); padding-bottom: 20px;">
                    <div>
                        <h2 style="font-size: 2.2rem; margin-bottom: 6px;">✏️ Quản lý Câu hỏi cá nhân</h2>
                        <p class="text-muted">Chỉnh sửa nội dung hoặc ghi chú của những câu hỏi bạn đã tải lên.</p>
                    </div>
                    <button class="btn btn-secondary" onclick="window.location.hash='#review-sets'">&larr; Quay lại</button>
                </div>

                ${uploadedQuestions.length === 0 ? `
                    <div class="text-center" style="padding: 40px 0;">
                        <span style="font-size:3rem;">📭</span>
                        <p>Bạn chưa tải lên câu hỏi nào.</p>
                    </div>
                ` : `
                    <div class="questions-list">
                        ${uploadedQuestions.map(q => `
                            <div class="question-list-item" style="background:var(--bg-secondary); padding: 16px; border: 2px solid var(--border-dark); border-radius: 8px; margin-bottom: 16px; display:flex; justify-content: space-between; align-items:center; box-shadow: 2px 2px 0 var(--border-dark);">
                                <div style="flex: 1; overflow: hidden; padding-right: 20px;">
                                    <div style="font-weight: 700; margin-bottom: 4px;">${q.examName} <span style="font-size:0.8rem; background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; border:1px solid var(--border-dark); margin-left: 8px;">${q.type === 'mcq' ? 'Trắc nghiệm ABCD' : 'Đúng/Sai THPTQG'}</span></div>
                                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-secondary); font-size: 0.95rem;">${MTKL_Components.utilEscapeHTML(q.questionText || 'Không có nội dung')}</div>
                                </div>
                                <div style="display:flex; gap: 8px;">
                                    <button class="btn btn-secondary edit-q-btn" data-id="${q.id}" style="padding: 8px 16px;">Sửa</button>
                                    <button class="btn btn-primary delete-q-btn" data-id="${q.id}" style="padding: 8px 16px; background-color: var(--error-color); border-color: #7f1d1d; color: white;">Xóa</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}

            </div>

            <!-- Modal Sửa Câu Hỏi -->
            <div class="modal-overlay" id="editQuestionModal">
                <div class="modal-card" style="max-width: 600px; padding: 24px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                        <h2 style="margin: 0; font-size: 1.5rem;">Sửa câu hỏi</h2>
                        <button class="close-modal-btn" id="closeEditModalBtn" style="background:none; border:none; font-size: 1.5rem; cursor:pointer;">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                            <div class="form-group" style="flex: 1;">
                                <label style="display:block; margin-bottom:8px; font-weight: 700;">Loại câu hỏi</label>
                                <select id="editQuestionType" class="form-control" style="width: 100%; padding: 10px; border-radius: 4px; border: 2px solid var(--border-dark); background-color: var(--bg-color); color: var(--text-primary);">
                                    <option value="mcq">Trắc nghiệm</option>
                                    <option value="tf">Đúng/Sai</option>
                                </select>
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label style="display:block; margin-bottom:8px; font-weight: 700;">Chủ đề</label>
                                <select id="editQuestionTopic" class="form-control" style="width: 100%; padding: 10px; border-radius: 4px; border: 2px solid var(--border-dark); background-color: var(--bg-color); color: var(--text-primary);">
                                    ${typeof TIN_HOC_TOPICS !== 'undefined' ? TIN_HOC_TOPICS.map(t => `<option value="${t.id}">${t.name}</option>`).join('') : ''}
                                </select>
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom: 16px;">
                            <label style="display:block; margin-bottom:8px; font-weight: 700;">Nội dung câu hỏi (đã OCR)</label>
                            <textarea id="editQuestionText" class="form-control form-textarea" rows="5" style="width:100%; border-radius:4px; border:2px solid var(--border-dark); padding:10px;"></textarea>
                        </div>
                        <div id="editMcqOptionsArea" style="display:none; margin-bottom: 16px;">
                            <label style="display:block; margin-bottom:8px; font-weight: 700;">Nội dung 4 đáp án</label>
                            <div class="tf-config-row" style="margin-bottom:8px; align-items: flex-start;"><span class="tf-sub-letter" style="margin-top: 8px;">A)</span><textarea id="editOptA" class="tf-sub-input" rows="2" style="flex:1; resize: vertical;"></textarea></div>
                            <div class="tf-config-row" style="margin-bottom:8px; align-items: flex-start;"><span class="tf-sub-letter" style="margin-top: 8px;">B)</span><textarea id="editOptB" class="tf-sub-input" rows="2" style="flex:1; resize: vertical;"></textarea></div>
                            <div class="tf-config-row" style="margin-bottom:8px; align-items: flex-start;"><span class="tf-sub-letter" style="margin-top: 8px;">C)</span><textarea id="editOptC" class="tf-sub-input" rows="2" style="flex:1; resize: vertical;"></textarea></div>
                            <div class="tf-config-row" style="margin-bottom:8px; align-items: flex-start;"><span class="tf-sub-letter" style="margin-top: 8px;">D)</span><textarea id="editOptD" class="tf-sub-input" rows="2" style="flex:1; resize: vertical;"></textarea></div>
                        </div>
                        <div class="form-group" style="margin-bottom: 24px;">
                            <label style="display:block; margin-bottom:8px; font-weight: 700;">Ghi chú sửa sai / Rút kinh nghiệm</label>
                            <textarea id="editQuestionNotes" class="form-control form-textarea" rows="3" style="width:100%; border-radius:4px; border:2px solid var(--border-dark); padding:10px;"></textarea>
                        </div>
                        <input type="hidden" id="editQuestionId">
                        <button class="btn btn-primary btn-block" id="saveEditBtn" style="width:100%; padding: 12px; font-size: 1.1rem;">💾 Lưu thay đổi</button>
                    </div>
                </div>
            </div>
        `;

        // Gắn sự kiện
        const editBtns = container.querySelectorAll('.edit-q-btn');
        const modal = document.getElementById('editQuestionModal');
        const closeBtn = document.getElementById('closeEditModalBtn');
        const saveBtn = document.getElementById('saveEditBtn');

        editBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const qId = btn.getAttribute('data-id');
                const q = uploadedQuestions.find(x => x.id === qId);
                if (q) {
                    document.getElementById('editQuestionId').value = q.id;
                    document.getElementById('editQuestionText').value = q.questionText || '';
                    document.getElementById('editQuestionNotes').value = q.explanation || '';
                    document.getElementById('editQuestionType').value = q.type || 'mcq';
                    document.getElementById('editQuestionTopic').value = q.topic || 'general';
                    
                    document.getElementById('editQuestionType').onchange = (e) => {
                        if (e.target.value === 'mcq') {
                            document.getElementById('editMcqOptionsArea').style.display = 'block';
                        } else {
                            document.getElementById('editMcqOptionsArea').style.display = 'none';
                        }
                    };
                    
                    if (q.type === 'mcq' && q.options) {
                        document.getElementById('editMcqOptionsArea').style.display = 'block';
                        document.getElementById('editOptA').value = q.options[0] ? q.options[0].substring(3) : '';
                        document.getElementById('editOptB').value = q.options[1] ? q.options[1].substring(3) : '';
                        document.getElementById('editOptC').value = q.options[2] ? q.options[2].substring(3) : '';
                        document.getElementById('editOptD').value = q.options[3] ? q.options[3].substring(3) : '';
                    } else {
                        document.getElementById('editMcqOptionsArea').style.display = 'none';
                    }
                    
                    modal.classList.add('show');
                }
            });
        });

        const deleteBtns = container.querySelectorAll('.delete-q-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const qId = btn.getAttribute('data-id');
                if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này không? Thao tác này không thể hoàn tác.')) {
                    btn.innerText = 'Đang xóa...';
                    btn.disabled = true;
                    const success = await MTKL_DB.deleteQuestion(qId);
                    if (success) {
                        app.showToast('Đã xóa câu hỏi!', 'success');
                    } else {
                        btn.innerText = 'Xóa';
                        btn.disabled = false;
                        app.showToast('Xóa thất bại', 'error');
                    }
                }
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                const qId = document.getElementById('editQuestionId').value;
                const text = document.getElementById('editQuestionText').value;
                const notes = document.getElementById('editQuestionNotes').value;
                const qType = document.getElementById('editQuestionType').value;
                const qTopic = document.getElementById('editQuestionTopic').value;
                
                let updateData = {
                    questionText: text,
                    explanation: notes,
                    type: qType,
                    topic: qTopic
                };
                
                if (document.getElementById('editMcqOptionsArea').style.display !== 'none') {
                    updateData.options = [
                        'A. ' + document.getElementById('editOptA').value,
                        'B. ' + document.getElementById('editOptB').value,
                        'C. ' + document.getElementById('editOptC').value,
                        'D. ' + document.getElementById('editOptD').value
                    ];
                }
                
                saveBtn.disabled = true;
                saveBtn.innerText = 'Đang lưu...';
                
                const success = await MTKL_DB.updateQuestion(qId, updateData);
                
                if (success) {
                    app.showToast('Đã cập nhật câu hỏi!', 'success');
                    modal.classList.remove('show');
                    this.renderManageCustom(container); // reload UI
                } else {
                    saveBtn.disabled = false;
                    saveBtn.innerText = 'Lưu thay đổi';
                }
            });
        }
    },

    // -------------------------------------------------------------
    // 3. RENDER TRANG UPLOAD CÂU HỎI SAI (UPLOAD & OCR)
    // -------------------------------------------------------------
    renderUpload(container) {
        // Kiểm tra xem đã đăng nhập chưa
        const isLogged = localStorage.getItem('mtkl_user_logged') === 'true';
        if (!isLogged) {
            container.innerHTML = `
                <div class="container text-center" style="padding: 100px 0;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
                    <h2>Vui lòng đăng nhập để sử dụng tính năng này</h2>
                    <p class="text-muted" style="margin-bottom: 30px;">Bạn cần đăng nhập để đăng tải câu hỏi sai.</p>
                    <button class="btn btn-primary" onclick="app.openAuthModal('login')">Đăng nhập ngay</button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="container" style="padding-top: 40px;">
                <h2 style="font-size: 2.2rem; margin-bottom: 6px; border-bottom: 2px solid var(--border-dark); padding-bottom: 20px;">📸 Số Hóa Câu Hỏi Lỗi Sai</h2>
                
                <div class="upload-layout">
                    <!-- Cột bên trái: Drag & Drop và Trình Xem xử lý hình ảnh -->
                    <div class="upload-left">
                        <div class="dropzone-card" id="uploadDropzone">
                            <span class="dropzone-icon">📤</span>
                            <h3>Kéo thả ảnh đề thi vào đây</h3>
                            <p>Hỗ trợ định dạng PNG, JPG, JPEG. Dung lượng tối đa 10MB.</p>
                            <div style="margin-top: 16px;">
                                <button type="button" class="btn btn-secondary" style="pointer-events: none;">Chọn tệp từ thiết bị</button>
                            </div>
                            <input type="file" class="file-input-hidden" id="fileInput" accept="image/*">
                        </div>

                        <!-- Khung Preview & Làm nét ảnh -->
                        <div class="preview-card" id="imagePreviewCard" style="display: none;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <h4 style="font-size: 1.1rem;">Khung xử lý hình ảnh</h4>
                                <span class="sharpen-badge" id="sharpenBadge">Độ phân giải gốc</span>
                            </div>
                            <div class="image-enhance-viewport">
                                <img src="" class="enhance-canvas-image blurred" id="previewImage">
                                <div class="scanner-beam" id="scannerBeam"></div>
                            </div>
                            <div class="enhance-controls">
                                <span class="text-muted" id="enhanceStatus" style="font-size: 0.85rem;">Ảnh thô chụp từ camera...</span>
                                <button type="button" class="btn btn-primary" style="padding: 6px 14px; font-size: 0.85rem;" id="enhanceBtn">✨ Làm nét tự động</button>
                            </div>
                        </div>

                        <!-- Khung Mô phỏng AI OCR -->
                        <div class="ocr-result-card" id="ocrCard" style="display: none;">
                            <h4 style="font-size: 1.1rem;">Trích xuất chữ viết (AI OCR)</h4>
                            <div class="ocr-text-area" id="ocrTextOutput">
                                <span class="text-muted">Đang chờ xử lý hình ảnh...</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-secondary);">
                                <span>*Bạn có thể chỉnh sửa nội dung văn bản ở form bên cạnh nếu có lỗi chính tả.</span>
                            </div>
                        </div>
                    </div>

                    <!-- Cột bên phải: Form Metadata & Cấu hình đáp án -->
                    <div class="upload-right">
                        <form id="uploadQuestionForm" class="metadata-form-card">
                            <h3 style="font-size: 1.3rem; border-bottom: 2px solid var(--border-dark); padding-bottom: 8px;">Thông tin đề thi & Đáp án</h3>
                            
                            <div class="form-group">
                                <label for="uploadExamName">Tên đề thi / Mã đề</label>
                                <input type="text" id="uploadExamName" class="form-control" placeholder="Đề khảo sát THPTQG Chuyên Hùng Vương - Mã 101" required>
                            </div>

                            <div class="form-row-2col">
                                <div class="form-group">
                                    <label for="uploadTopic">Chủ đề kiến thức</label>
                                    <select id="uploadTopic" class="form-control" required>
                                        ${TIN_HOC_TOPICS.map(t => `<option value="${t.id}">${t.name} (${t.grade})</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="uploadType">Loại câu hỏi</label>
                                    <select id="uploadType" class="form-control" required>
                                        <option value="mcq">Trắc nghiệm ABCD</option>
                                        <option value="tf">Đúng / Sai THPTQG</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="uploadQuestionText">Nội dung văn bản câu hỏi</label>
                                <textarea id="uploadQuestionText" class="form-control form-textarea" rows="10" placeholder="Nhập câu hỏi tại đây hoặc đợi hệ thống tự động quét AI OCR từ ảnh..." required></textarea>
                            </div>

                            <!-- Cấu hình đáp án động -->
                            <div class="answer-config-area">
                                <div class="answer-config-title" id="answerConfigTitle">Điền đáp án chính xác của câu hỏi:</div>
                                
                                <!-- Container cho MCQ -->
                                <div id="mcqAnswerConfig">
                                    <p style="font-size: 0.9rem; margin-bottom: 8px; color: var(--text-secondary);">Chọn đáp án đúng (màu xanh) và điền nội dung 4 đáp án:</p>
                                    <div class="mcq-selector" id="mcqSelectorGroup" style="margin-bottom: 16px;">
                                        <button type="button" class="mcq-option-btn selected" data-val="A">A</button>
                                        <button type="button" class="mcq-option-btn" data-val="B">B</button>
                                        <button type="button" class="mcq-option-btn" data-val="C">C</button>
                                        <button type="button" class="mcq-option-btn" data-val="D">D</button>
                                    </div>
                                    <div class="tf-config-grid">
                                        <div class="tf-config-row" style="align-items: flex-start;">
                                            <span class="tf-sub-letter" style="margin-top: 8px;">A)</span>
                                            <textarea class="tf-sub-input" id="mcqOptA" placeholder="Nhập nội dung đáp án A..." rows="2" style="resize: vertical;"></textarea>
                                        </div>
                                        <div class="tf-config-row" style="align-items: flex-start;">
                                            <span class="tf-sub-letter" style="margin-top: 8px;">B)</span>
                                            <textarea class="tf-sub-input" id="mcqOptB" placeholder="Nhập nội dung đáp án B..." rows="2" style="resize: vertical;"></textarea>
                                        </div>
                                        <div class="tf-config-row" style="align-items: flex-start;">
                                            <span class="tf-sub-letter" style="margin-top: 8px;">C)</span>
                                            <textarea class="tf-sub-input" id="mcqOptC" placeholder="Nhập nội dung đáp án C..." rows="2" style="resize: vertical;"></textarea>
                                        </div>
                                        <div class="tf-config-row" style="align-items: flex-start;">
                                            <span class="tf-sub-letter" style="margin-top: 8px;">D)</span>
                                            <textarea class="tf-sub-input" id="mcqOptD" placeholder="Nhập nội dung đáp án D..." rows="2" style="resize: vertical;"></textarea>
                                        </div>
                                    </div>
                                    <input type="hidden" id="selectedMcqAnswer" value="A" required>
                                </div>

                                <!-- Container cho True/False -->
                                <div id="tfAnswerConfig" style="display: none;">
                                    <div class="tf-config-grid">
                                        <!-- Ý a -->
                                        <div class="tf-config-row" style="align-items: flex-start;">
                                            <span class="tf-sub-letter" style="margin-top: 8px;">a)</span>
                                            <textarea class="tf-sub-input" id="tfSubA" placeholder="Nhập phát biểu ý a..." rows="2" style="resize: vertical; flex: 1;">Phát biểu ý a...</textarea>
                                            <div class="tf-switch-group" id="tfSwitchGroupA" style="margin-left: 10px;">
                                                <button type="button" class="tf-switch-btn selected-true" data-val="true">Đúng</button>
                                                <button type="button" class="tf-switch-btn" data-val="false">Sai</button>
                                            </div>
                                        </div>
                                        <!-- Ý b -->
                                        <div class="tf-config-row" style="align-items: flex-start;">
                                            <span class="tf-sub-letter" style="margin-top: 8px;">b)</span>
                                            <textarea class="tf-sub-input" id="tfSubB" placeholder="Nhập phát biểu ý b..." rows="2" style="resize: vertical; flex: 1;">Phát biểu ý b...</textarea>
                                            <div class="tf-switch-group" id="tfSwitchGroupB" style="margin-left: 10px;">
                                                <button type="button" class="tf-switch-btn selected-true" data-val="true">Đúng</button>
                                                <button type="button" class="tf-switch-btn" data-val="false">Sai</button>
                                            </div>
                                        </div>
                                        <!-- Ý c -->
                                        <div class="tf-config-row" style="align-items: flex-start;">
                                            <span class="tf-sub-letter" style="margin-top: 8px;">c)</span>
                                            <textarea class="tf-sub-input" id="tfSubC" placeholder="Nhập phát biểu ý c..." rows="2" style="resize: vertical; flex: 1;">Phát biểu ý c...</textarea>
                                            <div class="tf-switch-group" id="tfSwitchGroupC" style="margin-left: 10px;">
                                                <button type="button" class="tf-switch-btn selected-true" data-val="true">Đúng</button>
                                                <button type="button" class="tf-switch-btn" data-val="false">Sai</button>
                                            </div>
                                        </div>
                                        <!-- Ý d -->
                                        <div class="tf-config-row" style="align-items: flex-start;">
                                            <span class="tf-sub-letter" style="margin-top: 8px;">d)</span>
                                            <textarea class="tf-sub-input" id="tfSubD" placeholder="Nhập phát biểu ý d..." rows="2" style="resize: vertical; flex: 1;">Phát biểu ý d...</textarea>
                                            <div class="tf-switch-group" id="tfSwitchGroupD" style="margin-left: 10px;">
                                                <button type="button" class="tf-switch-btn selected-true" data-val="true">Đúng</button>
                                                <button type="button" class="tf-switch-btn" data-val="false">Sai</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="uploadNotes">Ghi chú sửa sai (Tại sao bạn làm sai? Cần lưu ý những gì?)</label>
                                <textarea id="uploadNotes" class="form-control form-textarea" placeholder="Ví dụ: Hay nhầm lẫn cú pháp. Cần nhớ từ khóa DISTINCT viết ngay sau SELECT..."></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block" style="padding: 12px;" id="uploadSubmitBtn" disabled>💾 Lưu câu hỏi vào kho ôn tập</button>
                        </form>
                    </div>
                </div>
            </div>
            
            <!-- Modal thành công sau khi upload -->
            <div class="modal-overlay" id="successUploadModal">
                <div class="modal-card text-center" style="padding: 40px 30px;">
                    <div style="font-size: 4rem; margin-bottom: 16px;">🎉</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Đã lưu câu hỏi thành công!</h3>
                    <p class="text-muted" style="margin-bottom: 20px;">Câu hỏi lỗi sai của bạn đã được số hóa và đưa vào danh sách ôn tập lặp lại.</p>
                    <div class="spinner" style="margin: 0 auto;"></div>
                </div>
            </div>
        `;

        this.registerUploadEvents();
    },

    registerUploadEvents() {
        const fileInput = document.getElementById('fileInput');
        const dropzone = document.getElementById('uploadDropzone');
        const previewCard = document.getElementById('imagePreviewCard');
        const previewImg = document.getElementById('previewImage');
        const enhanceBtn = document.getElementById('enhanceBtn');
        const sharpenBadge = document.getElementById('sharpenBadge');
        const scannerBeam = document.getElementById('scannerBeam');
        const ocrCard = document.getElementById('ocrCard');
        const ocrTextOutput = document.getElementById('ocrTextOutput');
        const uploadType = document.getElementById('uploadType');
        const mcqAnswerConfig = document.getElementById('mcqAnswerConfig');
        const tfAnswerConfig = document.getElementById('tfAnswerConfig');
        const submitBtn = document.getElementById('uploadSubmitBtn');
        const uploadQuestionText = document.getElementById('uploadQuestionText');

        if (uploadQuestionText && ocrTextOutput && ocrCard) {
            uploadQuestionText.addEventListener('input', () => {
                ocrTextOutput.classList.remove('ocr-typing');
                ocrTextOutput.innerHTML = MTKL_Components.utilFormatText(uploadQuestionText.value) || '<span class="text-muted">Chưa có nội dung...</span>';
                if (ocrCard.style.display === 'none' && uploadQuestionText.value.trim() !== '') {
                    ocrCard.style.display = 'block';
                }
            });
        }
        
        // Demo Images Base64 Mockup (để chạy giả lập cho thật sắc nét)
        const mockImages = {
            sql: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%23f8fafc"/><text x="10" y="30" font-family="monospace" font-size="12" fill="%231e293b">-- DE THI TIN HOC THPTQG</text><text x="10" y="50" font-family="monospace" font-size="12" fill="%231e293b">SELECT HoTen, DTB FROM HOC_SINH</text><text x="10" y="70" font-family="monospace" font-size="12" fill="%231e293b">WHERE DTB >= 8.5 ORDER BY DTB DESC;</text><rect x="10" y="90" width="280" height="80" fill="none" stroke="%23cbd5e1" stroke-width="2"/><line x1="10" y1="110" x2="290" y2="110" stroke="%23cbd5e1" stroke-width="2"/><text x="15" y="105" font-family="monospace" font-size="10">MaHS | HoTen | DTB</text><text x="15" y="125" font-family="monospace" font-size="10">HS01 | Nguyen Van An | 8.5</text><text x="15" y="145" font-family="monospace" font-size="10">HS03 | Tran Hoang Cuong | 9.2</text></svg>`,
            tf: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%23f8fafc"/><text x="10" y="30" font-family="monospace" font-size="12" fill="%231e293b">Cau 1: Xet CSDL Thuvien</text><text x="10" y="55" font-family="monospace" font-size="11" fill="%231e293b">a) MaSach la khoa ngoai.</text><text x="10" y="80" font-family="monospace" font-size="11" fill="%231e293b">b) Khoa chinh co the NULL.</text><text x="10" y="105" font-family="monospace" font-size="11" fill="%231e293b">c) Tac gia khong the xoa khi...</text><text x="10" y="130" font-family="monospace" font-size="11" fill="%231e293b">d) MaTG la duy nhat trong NXB.</text></svg>`
        };

        // File upload handling
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                this.handleSelectedFile(e.dataTransfer.files[0], mockImages, previewImg, previewCard, dropzone, ocrCard, ocrTextOutput);
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                this.handleSelectedFile(fileInput.files[0], mockImages, previewImg, previewCard, dropzone, ocrCard, ocrTextOutput);
            }
        });

        // Nút bấm làm nét ảnh (Enhancer)
        enhanceBtn.addEventListener('click', () => {
            enhanceBtn.disabled = true;
            document.getElementById('enhanceStatus').innerText = 'Đang tự động làm nét hình ảnh...';
            
            // Hiện beam quét
            scannerBeam.classList.add('scanning');
            
            setTimeout(() => {
                // Đổi filter từ mờ sang nét
                previewImg.classList.remove('blurred');
                previewImg.classList.add('sharpened');
                
                sharpenBadge.innerText = 'Độ phân giải cao (Đã làm nét)';
                sharpenBadge.classList.add('active');
                document.getElementById('enhanceStatus').innerText = 'Hình ảnh đã được làm nét sắc sảo!';
                scannerBeam.classList.remove('scanning');
                
                // Mở khóa AI OCR quét chữ
                this.runAI_OCR(ocrCard, ocrTextOutput, submitBtn, previewImg);
            }, 2200);
        });

        // Chuyển đổi loại câu hỏi
        uploadType.addEventListener('change', () => {
            const selectedType = uploadType.value;
            if (selectedType === 'mcq') {
                mcqAnswerConfig.style.display = 'block';
                tfAnswerConfig.style.display = 'none';
                document.getElementById('answerConfigTitle').innerText = 'Điền đáp án chính xác của câu hỏi:';
            } else {
                mcqAnswerConfig.style.display = 'none';
                tfAnswerConfig.style.display = 'block';
                document.getElementById('answerConfigTitle').innerText = 'Điền phát biểu và chọn Đúng/Sai cho từng ý:';
            }
        });

        // Thiết lập MCQ Selector
        const mcqBtns = document.querySelectorAll('.mcq-option-btn');
        mcqBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                mcqBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('selectedMcqAnswer').value = btn.getAttribute('data-val');
            });
        });

        // Thiết lập TF Switchers
        const setupTfSwitchGroup = (groupId) => {
            const container = document.getElementById(groupId);
            if (!container) return;
            const buttons = container.querySelectorAll('.tf-switch-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    buttons.forEach(b => {
                        b.classList.remove('selected-true', 'selected-false');
                    });
                    const val = btn.getAttribute('data-val');
                    if (val === 'true') {
                        btn.classList.add('selected-true');
                    } else {
                        btn.classList.add('selected-false');
                    }
                });
            });
        };
        setupTfSwitchGroup('tfSwitchGroupA');
        setupTfSwitchGroup('tfSwitchGroupB');
        setupTfSwitchGroup('tfSwitchGroupC');
        setupTfSwitchGroup('tfSwitchGroupD');

        // Form Submit
        document.getElementById('uploadQuestionForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('uploadSubmitBtn');
            submitBtn.disabled = true;
            submitBtn.innerText = '⏳ Đang lưu trữ dữ liệu...';

            // Thu thập dữ liệu
            const examName = document.getElementById('uploadExamName').value;
            const topic = document.getElementById('uploadTopic').value;
            const type = document.getElementById('uploadType').value;
            const questionText = document.getElementById('uploadQuestionText').value;
            const notes = document.getElementById('uploadNotes').value;

            // Lưu ảnh dưới dạng field riêng biệt (nhỏ gọn hơn cho Firestore)
            const imageData = previewImg.src || '';

            let newQuestion = {
                type,
                topic,
                examName,
                questionText,
                explanation: notes || 'Học sinh chưa thêm lời giải thích chi tiết.',
                imageData: imageData // Lưu base64 ảnh đã nén riêng biệt
            };

            if (type === 'mcq') {
                newQuestion.correctAnswer = document.getElementById('selectedMcqAnswer').value || 'A';
                newQuestion.options = [
                    'A. ' + document.getElementById('mcqOptA').value,
                    'B. ' + document.getElementById('mcqOptB').value,
                    'C. ' + document.getElementById('mcqOptC').value,
                    'D. ' + document.getElementById('mcqOptD').value
                ];
            } else {
                newQuestion.subQuestions = [
                    {
                        id: 'a',
                        statement: document.getElementById('tfSubA').value,
                        correctAnswer: document.getElementById('tfSwitchGroupA').querySelector('.selected-true') !== null
                    },
                    {
                        id: 'b',
                        statement: document.getElementById('tfSubB').value,
                        correctAnswer: document.getElementById('tfSwitchGroupB').querySelector('.selected-true') !== null
                    },
                    {
                        id: 'c',
                        statement: document.getElementById('tfSubC').value,
                        correctAnswer: document.getElementById('tfSwitchGroupC').querySelector('.selected-true') !== null
                    },
                    {
                        id: 'd',
                        statement: document.getElementById('tfSubD').value,
                        correctAnswer: document.getElementById('tfSwitchGroupD').querySelector('.selected-true') !== null
                    }
                ];
            }

            // Await Firebase save để nhận ID thật
            const saved = await MTKL_DB.saveQuestion(newQuestion);
            
            if (saved) {
                // Tạo imageMock từ imageData cho hiển thị
                saved.imageMock = `<div class="mock-svg-image-container" style="background:var(--bg-color);border:2px solid var(--border-dark);text-align:center; padding: 10px;"><img src="${saved.imageData || ''}" class="zoomable-img" style="max-height:260px; max-width:100%; object-fit:contain; cursor:zoom-in; margin:0 auto; display:block;" title="Click để phóng to ảnh"></div>`;
                
                // Tự động đẩy vào danh sách lỗi sai với ID thật từ Firebase
                await MTKL_DB.addMistake(saved.id, type === 'mcq' ? 'X' : { a: null, b: null, c: null, d: null });

                // Hiển thị modal thành công
                const successModal = document.getElementById('successUploadModal');
                successModal.classList.add('show');
                
                submitBtn.innerText = '✅ Đã lưu thành công!';

                setTimeout(() => {
                    successModal.classList.remove('show');
                    window.location.hash = '#review-sets';
                }, 1200);
            } else {
                // Lưu thất bại - cho phép thử lại
                submitBtn.disabled = false;
                submitBtn.innerText = '💾 Lưu câu hỏi sai';
            }
        });
    },
    handleSelectedFile(file, mockImages, previewImg, previewCard, dropzone, ocrCard, ocrTextOutput) {
        if (!file.type.startsWith('image/')) {
            app.showToast('Vui lòng tải tệp tin định dạng hình ảnh!', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            // Nén ảnh bằng Canvas để tránh vượt quá giới hạn 1MB của Firestore
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_SIZE = 800; // Chiều dài tối đa 800px

                if (width > height && width > MAX_SIZE) {
                    height = Math.floor(height * (MAX_SIZE / width));
                    width = MAX_SIZE;
                } else if (height > MAX_SIZE) {
                    width = Math.floor(width * (MAX_SIZE / height));
                    height = MAX_SIZE;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = 'var(--bg-color)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, width, height);
                
                // Chuyển sang dạng JPEG chất lượng 70% (dung lượng rất nhẹ < 150kb)
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

                previewImg.src = compressedDataUrl;
                previewImg.className = 'enhance-canvas-image blurred';
                document.getElementById('sharpenBadge').innerText = 'Độ phân giải gốc (Đang mờ)';
                document.getElementById('sharpenBadge').classList.remove('active');
                
                dropzone.style.display = 'none';
                previewCard.style.display = 'flex';
                document.getElementById('enhanceStatus').innerText = 'Hình ảnh đã tải lên. Hãy nhấn Làm nét để số hóa.';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    async runAI_OCR(ocrCard, ocrTextOutput, submitBtn, previewImg) {
        ocrCard.style.display = 'flex';
        ocrTextOutput.innerHTML = '<div class="spinner" style="margin: 0 auto;"></div><p class="text-center" style="margin-top:10px; font-size: 0.9rem;">Đang xử lý ảnh nền và tải mô hình AI OCR... (Sẽ mất vài giây)</p>';
        submitBtn.disabled = true;

        try {
            // Tiền xử lý hình ảnh qua Canvas để tăng độ nét cho AI
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = previewImg.naturalWidth || previewImg.width;
            canvas.height = previewImg.naturalHeight || previewImg.height;
            
            // Bộ lọc nâng cao: Chuyển trắng đen, đẩy mạnh tương phản
            ctx.filter = 'contrast(200%) grayscale(100%)';
            ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
            
            // Trích xuất lại Data URL đã xử lý
            const processedImage = canvas.toDataURL('image/jpeg', 1.0);

            let ocrText = "";
            const geminiKey = localStorage.getItem('mtkl_gemini_api_key');

            let useTesseract = true;
            if (geminiKey && geminiKey.trim() !== '') {
                useTesseract = false;
                ocrTextOutput.innerHTML = '<div class="spinner" style="margin: 0 auto;"></div><p class="text-center" style="margin-top:10px; font-size: 0.9rem; color: var(--primary-color);">⏳ Đang gửi ảnh cho Google Gemini Vision AI phân tích...</p>';
                try {
                    const base64Data = processedImage.split(',')[1];
                    const apiKey = geminiKey.trim();
                    
                    // Lấy danh sách model khả dụng
                    let targetModel = 'gemini-1.5-flash';
                    try {
                        const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                        if (modelsRes.ok) {
                            const data = await modelsRes.json();
                            const models = data.models.map(m => m.name.replace('models/', ''));
                            // Ưu tiên các model vision
                            if (models.includes('gemini-1.5-flash')) targetModel = 'gemini-1.5-flash';
                            else if (models.includes('gemini-1.5-flash-latest')) targetModel = 'gemini-1.5-flash-latest';
                            else if (models.includes('gemini-1.5-pro')) targetModel = 'gemini-1.5-pro';
                            else if (models.includes('gemini-1.5-pro-latest')) targetModel = 'gemini-1.5-pro-latest';
                            else if (models.includes('gemini-1.0-pro-vision-latest')) targetModel = 'gemini-1.0-pro-vision-latest';
                            else if (models.includes('gemini-pro-vision')) targetModel = 'gemini-pro-vision';
                            else if (models.length > 0) targetModel = models[0]; // fallback
                        }
                    } catch (e) {
                        console.warn('Lỗi khi lấy danh sách models:', e);
                    }

                    let data = null;
                    let retryCount = 0;
                    while (retryCount < 2) {
                        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [
                                    { text: "Hãy trích xuất chính xác văn bản trong ảnh. Nếu hình ảnh có chứa các phương án trắc nghiệm (A, B, C, D) hoặc các ý phụ (a, b, c, d) - kể cả khi chúng nằm trong khung, hộp hoặc hình tròn, BẮT BUỘC bạn phải nhận diện và chuẩn hóa chúng về định dạng danh sách chuẩn, bắt đầu bằng chữ cái và dấu chấm. Ví dụ: 'A. [nội dung]', 'B. [nội dung]' hoặc 'a. [nội dung]'. ĐỐI VỚI CÁC CÂU HỎI ĐÚNG/SAI, TUYỆT ĐỐI BỎ QUA VÀ KHÔNG TRÍCH XUẤT CÁC CHỮ 'Đúng', 'Sai' NẰM TRONG CÁC Ô CHỌN Ở CUỐI MỖI Ý. Nếu có bảng biểu, hãy định dạng tự động thành Markdown Table (dùng dấu |). Tuyệt đối KHÔNG định dạng in đậm (**), in nghiêng (*), KHÔNG dùng gạch đầu dòng (-), KHÔNG sử dụng dấu backtick để bọc chữ. Không bình luận gì thêm, chỉ xuất kết quả văn bản thuần túy." },
                                    { inline_data: { mime_type: "image/jpeg", data: base64Data } }
                                ]
                            }]
                        })
                    });
                        data = await response.json();
                        if (data.error) {
                            if (data.error.code === 503 || (data.error.message && data.error.message.includes("demand"))) {
                                retryCount++;
                                await new Promise(r => setTimeout(r, 2000));
                                continue;
                            }
                            throw new Error(data.error.message);
                        }
                        break;
                    }
                    if (data && data.error) throw new Error(data.error.message);
                    ocrText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Không tìm thấy chữ trong ảnh.";
                } catch (err) {
                    console.error('Gemini API Error:', err);
                    if (err.message && (err.message.includes('demand') || err.message.includes('503'))) {
                        app.showToast("Gemini đang quá tải, tự động chuyển sang AI dự phòng Tesseract...", "warning");
                        useTesseract = true;
                    } else {
                        ocrText = "Lỗi Gemini: " + err.message;
                    }
                }
            }
            
            if (useTesseract) {
                const result = await Tesseract.recognize(
                    processedImage,
                    'vie+eng', 
                    {
                        logger: m => {
                            if (m.status === 'recognizing text') {
                                ocrTextOutput.innerHTML = `<p class="text-center" style="margin-top:10px;">Tiến trình trích xuất (Tesseract): <strong>${Math.round(m.progress * 100)}%</strong></p>`;
                            }
                        }
                    }
                );
                ocrText = result.data.text || "Không tìm thấy chữ.";
            }

            ocrTextOutput.innerHTML = '';

            // Tự động bóc tách các phương án A B C D nếu có
            if (ocrText) {
                const regex = /(?:^|\n)\s*([A-D])[\.\:\)]\s*(.*?)(?=(?:\n\s*[A-D][\.\:\)])|$)/gis;
                let match;
                while ((match = regex.exec(ocrText)) !== null) {
                    const letter = match[1].toUpperCase();
                    const optionText = match[2].trim();
                    const optInput = document.getElementById(`mcqOpt${letter}`);
                    if (optInput) {
                        optInput.value = optionText;
                    }
                    const tfInput = document.getElementById(`tfSub${letter}`);
                    if (tfInput) {
                        tfInput.value = optionText;
                    }
                }
            }

            // Tạo hiệu ứng typing
            let idx = 0;
            ocrTextOutput.classList.add('ocr-typing');
            
            const timer = setInterval(() => {
                if (idx < ocrText.length) {
                    ocrTextOutput.innerHTML += (ocrText.charAt(idx) === '\n' ? '<br>' : ocrText.charAt(idx));
                    idx++;
                } else {
                    clearInterval(timer);
                    ocrTextOutput.classList.remove('ocr-typing');
                    
                    // Đồng bộ nội dung đã quét vào Textarea
                    document.getElementById('uploadQuestionText').value = ocrText;
                    
                    // Kích hoạt nút Lưu
                    submitBtn.disabled = false;
                    app.showToast('AI OCR trích xuất hoàn tất!', 'success');
                }
            }, 5);

        } catch (error) {
            console.error('OCR Error:', error);
            ocrTextOutput.innerHTML = '<span class="text-danger">Đã có lỗi xảy ra khi quét OCR. Vui lòng nhập thủ công.</span>';
            submitBtn.disabled = false;
        }
    },

    // -------------------------------------------------------------
    // 4. RENDER PHÒNG THI / LUYỆN TẬP CÂU SAI (PRACTICE)
    // -------------------------------------------------------------
    renderPractice(container, config) {
        const isLogged = localStorage.getItem('mtkl_user_logged') === 'true';
        if (!isLogged) {
            container.innerHTML = `
                <div class="container text-center" style="padding: 100px 0;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
                    <h2>Vui lòng đăng nhập để bắt đầu luyện tập</h2>
                    <p class="text-muted" style="margin-bottom: 30px;">Bạn cần lưu trữ tài khoản để đồng bộ kết quả lỗi sai.</p>
                    <button class="btn btn-primary" onclick="app.openAuthModal('login')">Đăng nhập</button>
                </div>
            `;
            return;
        }

        // Lấy danh sách câu hỏi phù hợp với cấu hình (config)
        const allQuestions = MTKL_DB.getAllQuestions();
        const mistakes = MTKL_DB.getMistakes();

        let filteredQuestions = [];

        if (config.topic === 'custom_upload') {
            // Chỉ làm các câu do người dùng upload
            filteredQuestions = MTKL_DB.getUploadedQuestions();
        } else {
            // Lọc các câu hỏi đang bị làm sai (chưa sửa)
            const activeMistakesIds = mistakes.filter(m => !m.isResolved).map(m => m.questionId);
            
            // Ưu tiên các câu sai của người dùng trong hệ thống
            filteredQuestions = allQuestions.filter(q => activeMistakesIds.includes(q.id));

            // Nếu lọc theo chủ đề
            if (config.topic !== 'all') {
                filteredQuestions = filteredQuestions.filter(q => q.topic === config.topic);
            }

            // Nếu lọc theo loại câu hỏi
            if (config.type !== 'all') {
                filteredQuestions = filteredQuestions.filter(q => q.type === config.type);
            }
        }

        // Tránh tình trạng không có câu hỏi nào bị sai
        if (filteredQuestions.length === 0) {
            // Nếu không có câu sai, hệ thống sẽ khích lệ bằng cách cho phép luyện tập 5 câu hỏi mẫu bất kỳ của chủ đề
            let fallbackPool = allQuestions;
            if (config.topic !== 'all' && config.topic !== 'custom_upload') {
                fallbackPool = fallbackPool.filter(q => q.topic === config.topic);
            }
            if (config.type !== 'all') {
                fallbackPool = fallbackPool.filter(q => q.type === config.type);
            }
            
            filteredQuestions = fallbackPool.slice(0, 5);

            if (filteredQuestions.length === 0) {
                // Nếu chủ đề tự upload trống hoàn toàn
                container.innerHTML = `
                    <div class="container text-center" style="padding: 100px 0;">
                        <div style="font-size: 4rem; margin-bottom: 20px;">🎓</div>
                        <h2>Hộp câu hỏi sai của bạn đang trống!</h2>
                        <p class="text-muted" style="margin-bottom: 30px; max-width:500px; margin-left:auto; margin-right:auto;">Tuyệt vời, bạn chưa có câu hỏi nào bị làm sai trong chuyên đề này, hoặc bạn chưa tải lên câu nào. Hãy tải thêm câu hỏi hoặc luyện các môn khác.</p>
                        <div style="display:flex; justify-content:center; gap:16px;">
                            <button class="btn btn-secondary" onclick="window.location.hash='#review-sets'">Quay lại Bộ ôn tập</button>
                            <button class="btn btn-primary" onclick="window.location.hash='#upload'">Tải câu sai mới</button>
                        </div>
                    </div>
                `;
                return;
            }
            
            app.showToast('Bạn chưa có câu sai, hệ thống cung cấp các câu hỏi thi mẫu!', 'warning');
        }

        // Đảo ngược mảng để ưu tiên hiển thị các câu hỏi mới nhất (ví dụ câu vừa upload) lên đầu
        filteredQuestions.reverse();

        // Giới hạn số câu theo config
        if (config.limit !== 'all') {
            const limitNum = parseInt(config.limit);
            filteredQuestions = filteredQuestions.slice(0, limitNum);
        }

        // Ưu tiên hiển thị Trắc nghiệm trước, Đúng/Sai sau
        filteredQuestions.sort((a, b) => {
            if (a.type === 'mcq' && b.type !== 'mcq') return -1;
            if (a.type !== 'mcq' && b.type === 'mcq') return 1;
            return 0;
        });

        // Khởi tạo trạng thái buổi làm bài
        const savedSession = localStorage.getItem('mtkl_practice_session');
        if (savedSession) {
            try {
                this.sessionState = JSON.parse(savedSession);
                this.sessionState.timerInterval = null;
                this.renderPracticeArena(container);
                return;
            } catch (e) {
                console.error(e);
            }
        }

        this.sessionState = {
            questions: filteredQuestions,
            currentIndex: 0,
            userResponses: new Array(filteredQuestions.length).fill(null), // Lưu câu trả lời học sinh
            timeRemaining: config.time, // giây
            timerInterval: null,
            isSubmitted: new Array(filteredQuestions.length).fill(false), // Trạng thái nộp bài từng câu
            isCorrectList: new Array(filteredQuestions.length).fill(null), // Kết quả đúng sai của từng câu
            correctCount: 0
        };

        this.savePracticeSession();
        this.renderPracticeArena(container);
    },

    savePracticeSession() {
        if (!this.sessionState) return;
        const stateToSave = { ...this.sessionState };
        delete stateToSave.timerInterval;
        localStorage.setItem('mtkl_practice_session', JSON.stringify(stateToSave));
    },

    renderPracticeArena(container) {
        const state = this.sessionState;
        const q = state.questions[state.currentIndex];
        const questionNo = state.currentIndex + 1;
        const totalQuestions = state.questions.length;

        // Bản ghi lỗi cũ (nếu có) để xem ghi chú cá nhân học sinh
        const oldMistake = MTKL_DB.getMistakes().find(m => m.questionId === q.id);

        container.innerHTML = `
            <div class="container" style="padding-top: 40px; max-width: 1280px;">
                <div class="practice-layout" style="display: flex; gap: 32px; align-items: flex-start; flex-direction: row-reverse;">
                    
                    <!-- Main Practice Area (bên phải do row-reverse) -->
                    <div class="practice-arena" style="flex: 1; max-width: calc(100% - 312px);">
                        <!-- Practice Header -->
                        <div class="practice-header">
                            <div style="font-weight: 800; font-size:1.1rem;">📝 ÔN TẬP TIN HỌC THPTQG</div>
                            
                            <!-- Status progress bar dots -->
                            <div class="question-status-bar" id="practiceStatusBar">
                                ${state.questions.map((_, i) => `
                                    <div class="status-dot ${i === state.currentIndex ? 'active' : ''} ${state.isSubmitted[i] ? (state.isCorrectList[i] ? 'done-correct' : 'done-wrong') : ''}" id="dot_${i}"></div>
                                `).join('')}
                            </div>

                            <!-- Timer -->
                            <div class="timer-box" id="practiceTimerBox">
                                <span>⏱️</span>
                                <span id="practiceTimeText">--:--</span>
                            </div>
                        </div>

                        <!-- Question Card container -->
                        <div class="question-card" id="currentQuestionCard">
                            <div class="question-meta">
                                ${(() => {
                                    let localNo = 1;
                                    let partName = '';
                                    if (q.type === 'tf') {
                                        partName = 'Phần II';
                                        localNo = state.questions.filter((_q, i) => _q.type === 'tf' && i <= state.currentIndex).length;
                                    } else {
                                        partName = 'Phần I';
                                        localNo = state.questions.filter((_q, i) => _q.type !== 'tf' && i <= state.currentIndex).length;
                                    }
                                    return `<span class="question-index-label">${partName} - Câu ${localNo} <span style="opacity:0.7; font-size:0.9em; font-weight:normal;">(Tổng: ${questionNo}/${totalQuestions})</span></span>`;
                                })()}
                                <span class="question-tag">${q.examName || 'Đề thi thử'}</span>
                            </div>

                            <!-- Hiển thị đề gốc (mock SVG hoặc HTML hoặc ảnh upload) -->
                            <div class="question-image-container">
                                ${q.imageMock ? q.imageMock : (q.imageData ? `<div class="mock-svg-image-container" style="background:var(--bg-color);border:2px solid var(--border-dark);text-align:center; padding: 10px;"><img src="${q.imageData}" class="zoomable-img" style="max-width:100%; max-height:800px; height:auto; display:block; margin:0 auto; cursor:zoom-in;" title="Click để phóng to ảnh"></div>` : '')}
                            </div>

                            <!-- Nội dung Text câu hỏi -->
                            <div class="question-text" ${q.imageData ? 'style="display:none;"' : ''}>${MTKL_Components.utilFormatText(q.questionText)}</div>

                            <!-- Khu vực nhập đáp án -->
                            <div class="answer-input-area" id="quizInputArea">
                                <!-- Sẽ render động dựa vào loại câu hỏi mcq hay tf -->
                            </div>
                        </div>

                        <!-- Sticky Note hiển thị ghi chú sai cũ nếu có -->
                        ${q.explanation && state.isSubmitted[state.currentIndex] ? `
                            <div class="sticky-note" style="margin-bottom: 30px; background: var(--warning-bg); border-left: 4px solid var(--warning-color); padding: 16px; border-radius: 4px; color: var(--text-primary);">
                                <div class="sticky-note-title" style="font-weight: 700; margin-bottom: 8px;">💡 Giải thích / Lưu ý sửa sai:</div>
                                <div class="sticky-note-body" style="white-space: pre-wrap;">"${MTKL_Components.utilEscapeHTML(q.explanation)}"</div>
                            </div>
                        ` : ''}

                        <!-- Navigation Actions -->
                        <div class="practice-actions">
                            <button class="btn btn-secondary" id="quizPrevBtn" ${state.currentIndex === 0 ? 'disabled' : ''}>&larr; Câu trước</button>
                            <button class="btn btn-primary" id="quizSubmitBtn">Nộp câu trả lời</button>
                            <button class="btn btn-secondary" id="quizNextBtn" ${state.currentIndex === totalQuestions - 1 ? 'disabled' : ''}>Câu tiếp &rarr;</button>
                        </div>
                    </div>
                    <!-- Left Sidebar (hiển thị bên trái do row-reverse) -->
                    <div class="practice-sidebar" style="width: 280px; background: var(--bg-secondary); border: 2px solid var(--border-dark); border-radius: 8px; padding: 20px; position: sticky; top: 90px; box-shadow: 4px 4px 0 var(--border-dark); flex-shrink: 0;">
                        <h3 style="margin-bottom: 16px; font-size: 1.2rem; border-bottom: 2px solid var(--border-dark); padding-bottom: 8px;">📑 Danh sách câu hỏi</h3>
                        
                        <!-- Search & Filter Area -->
                        <div style="margin-bottom: 16px;">
                            <input type="text" class="form-control" placeholder="🔍 Tìm kiếm câu hỏi..." style="width: 100%; margin-bottom: 8px;">
                        </div>

                        <!-- Grid Câu hỏi -->
                        <div class="sidebar-question-grid" style="max-height: 400px; overflow-y: auto; padding-right: 5px;">
                            ${(() => {
                                const renderBtn = (idx, localIdx) => {
                                    let statusBg = 'var(--bg-tertiary)';
                                    let statusColor = 'var(--text-primary)';
                                    if (state.isSubmitted[idx]) {
                                        if (state.isCorrectList[idx]) {
                                            statusBg = 'var(--success-bg)';
                                            statusColor = 'var(--success-color)';
                                        } else {
                                            statusBg = 'var(--error-bg)';
                                            statusColor = 'var(--error-color)';
                                        }
                                    }
                                    return `
                                        <button class="btn sidebar-q-btn" data-idx="${idx}" style="padding: 8px 0; text-align: center; font-weight: bold; border-radius: 4px; border: 2px solid ${idx === state.currentIndex ? 'var(--primary-color)' : 'var(--border-dark)'}; background: ${statusBg}; color: ${statusColor};">
                                            ${localIdx}
                                        </button>
                                    `;
                                };

                                const mcqIndices = [];
                                const tfIndices = [];
                                state.questions.forEach((q, idx) => {
                                    if (q.type === 'tf') tfIndices.push(idx);
                                    else mcqIndices.push(idx);
                                });

                                let html = '';
                                if (mcqIndices.length > 0) {
                                    html += `<div style="font-weight: 700; font-size: 0.85rem; margin: 0 0 8px 0; color: var(--text-secondary); text-transform: uppercase;">Phần I - Trắc nghiệm</div>`;
                                    html += `<div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 16px;">`;
                                    html += mcqIndices.map((idx, i) => renderBtn(idx, i + 1)).join('');
                                    html += `</div>`;
                                }
                                if (tfIndices.length > 0) {
                                    html += `<div style="font-weight: 700; font-size: 0.85rem; margin: 0 0 8px 0; color: var(--text-secondary); text-transform: uppercase;">Phần II - Đúng / Sai</div>`;
                                    html += `<div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 8px;">`;
                                    html += tfIndices.map((idx, i) => renderBtn(idx, i + 1)).join('');
                                    html += `</div>`;
                                }
                                return html;
                            })()}
                        </div>
                        <div style="margin-top: 20px;">
                            <button class="btn btn-primary" style="width: 100%; padding: 12px;" id="sidebarSubmitAllBtn">Kết thúc buổi học</button>
                        </div>
                    </div>

                </div>
            </div>
        `;

        this.renderQuestionAnswers(q);
        this.startSessionTimer();
        this.registerPracticeEvents();
    },

    renderQuestionAnswers(q) {
        const state = this.sessionState;
        const inputArea = document.getElementById('quizInputArea');
        const response = state.userResponses[state.currentIndex];
        const submitted = state.isSubmitted[state.currentIndex];

        if (q.type === 'mcq') {
            // Render 4 đáp án dạng nút lớn
            const optionLetters = ['A', 'B', 'C', 'D'];
            inputArea.innerHTML = `
                <div class="mcq-options-list">
                    ${q.options.map((optionText, idx) => {
                        const letter = optionLetters[idx];
                        let statusClass = '';
                        if (submitted) {
                            if (letter === q.correctAnswer) statusClass = 'correct';
                            else if (letter === response) statusClass = 'wrong';
                        } else if (response === letter) {
                            statusClass = 'selected';
                        }
                        
                        return `
                            <div class="mcq-option-row ${statusClass}" data-letter="${letter}">
                                <div class="mcq-option-letter">${letter}</div>
                                <div class="mcq-option-text">${MTKL_Components.utilFormatText(optionText.replace(/^[A-D][\.\:\)]\s*/i, ''))}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            // Đăng ký sự kiện chọn cho MCQ
            if (!submitted) {
                const rows = inputArea.querySelectorAll('.mcq-option-row');
                rows.forEach(row => {
                    row.addEventListener('click', () => {
                        rows.forEach(r => r.classList.remove('selected'));
                        row.classList.add('selected');
                        state.userResponses[state.currentIndex] = row.getAttribute('data-letter');
                        this.savePracticeSession();
                    });
                });
            }
        } else {
            // Render định dạng câu hỏi Đúng/Sai (THPTQG)
            const subAnswers = response || { a: null, b: null, c: null, d: null };

            inputArea.innerHTML = `
                <table class="tf-quiz-table">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align:center;">Ý</th>
                            <th>Nội dung phát biểu</th>
                            <th style="width: 160px; text-align:center;">Lựa chọn</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${q.subQuestions.map((sub, idx) => {
                            const subId = sub.id;
                            const choice = subAnswers[subId];
                            
                            let btnTrueClass = '';
                            let btnFalseClass = '';

                            if (submitted) {
                                // Nếu đã nộp bài, hiện xanh đỏ
                                if (sub.correctAnswer === true) {
                                    btnTrueClass = 'correct-val';
                                    if (choice === false) btnFalseClass = 'wrong-val';
                                } else {
                                    btnFalseClass = 'correct-val';
                                    if (choice === true) btnTrueClass = 'wrong-val';
                                }
                            } else {
                                // Chưa nộp, hiện lựa chọn hiện tại
                                if (choice === true) btnTrueClass = 'selected-true';
                                if (choice === false) btnFalseClass = 'selected-false';
                            }

                            return `
                                <tr>
                                    <td style="font-weight: 800; text-align:center; vertical-align:middle;">${subId})</td>
                                    <td class="tf-quiz-statement">${MTKL_Components.utilFormatText(sub.statement)}</td>
                                    <td>
                                        <div class="tf-quiz-actions" data-subid="${subId}">
                                            <button type="button" class="tf-quiz-btn ${btnTrueClass}" data-val="true" ${submitted ? 'disabled' : ''}>Đúng</button>
                                            <button type="button" class="tf-quiz-btn ${btnFalseClass}" data-val="false" ${submitted ? 'disabled' : ''}>Sai</button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;

            // Đăng ký sự kiện chọn cho True/False
            if (!submitted) {
                const actionGroups = inputArea.querySelectorAll('.tf-quiz-actions');
                actionGroups.forEach(group => {
                    const subId = group.getAttribute('data-subid');
                    const btns = group.querySelectorAll('.tf-quiz-btn');
                    btns.forEach(btn => {
                        btn.addEventListener('click', () => {
                            btns.forEach(b => b.classList.remove('selected-true', 'selected-false'));
                            const val = btn.getAttribute('data-val') === 'true';
                            if (val) {
                                btn.classList.add('selected-true');
                            } else {
                                btn.classList.add('selected-false');
                            }
                            // Lưu vào responses
                            if (!state.userResponses[state.currentIndex]) {
                                state.userResponses[state.currentIndex] = { a: null, b: null, c: null, d: null };
                            }
                            state.userResponses[state.currentIndex][subId] = val;
                            this.savePracticeSession();
                        });
                    });
                });
            }
        }

        // Tùy biến hiển thị nút Nộp bài
        const submitBtn = document.getElementById('quizSubmitBtn');
        if (submitted) {
            submitBtn.innerText = 'Đã nộp bài';
            submitBtn.disabled = true;
            // Hiển thị giải thích / ghi chú nếu có
            if (q.explanation) {
                // Kiểm tra xem đã có sticky note chưa để tránh trùng
                if (!document.querySelector('.sticky-note')) {
                    const inputArea = document.getElementById('quizInputArea');
                    const noteDiv = document.createElement('div');
                    noteDiv.className = 'sticky-note';
                    noteDiv.style = 'margin-top: 20px; background: var(--warning-bg); border-left: 4px solid var(--warning-color); padding: 16px; border-radius: 4px; color: var(--text-primary);';
                    noteDiv.innerHTML = `
                        <div class="sticky-note-title" style="font-weight: 700; margin-bottom: 8px;">💡 Giải thích / Lưu ý sửa sai:</div>
                        <div class="sticky-note-body" style="white-space: pre-wrap;">${q.explanation}</div>
                    `;
                    // Chèn sau vùng nhập đáp án
                    inputArea.parentNode.insertBefore(noteDiv, inputArea.nextSibling);
                }
            }
        } else {
            submitBtn.innerText = 'Nộp câu trả lời';
            submitBtn.disabled = false;
        }
    },

    startSessionTimer() {
        const state = this.sessionState;
        const timeText = document.getElementById('practiceTimeText');
        const timerBox = document.getElementById('practiceTimerBox');

        if (state.timeRemaining === 0) {
            timerBox.style.display = 'none';
            return;
        }

        // Reset timer cũ nếu có
        if (state.timerInterval) clearInterval(state.timerInterval);

        const updateTimerDisplay = () => {
            const min = Math.floor(state.timeRemaining / 60);
            const sec = state.timeRemaining % 60;
            timeText.innerText = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
        };

        updateTimerDisplay();

        state.timerInterval = setInterval(() => {
            state.timeRemaining--;
            if (state.timeRemaining <= 0) {
                clearInterval(state.timerInterval);
                app.showToast('Hết thời gian làm bài!', 'error');
                this.forceSubmitAll();
            } else {
                updateTimerDisplay();
            }
        }, 1000);
    },

    registerPracticeEvents() {
        const state = this.sessionState;
        const container = document.getElementById('appContent');

        document.getElementById('quizPrevBtn').addEventListener('click', () => {
            if (state.currentIndex > 0) {
                state.currentIndex--;
                this.renderPracticeArena(container);
            }
        });

        document.getElementById('quizNextBtn').addEventListener('click', () => {
            if (state.currentIndex < state.questions.length - 1) {
                state.currentIndex++;
                this.renderPracticeArena(container);
            }
        });

        document.getElementById('quizSubmitBtn').addEventListener('click', () => {
            this.submitCurrentQuestion();
        });

        // Sự kiện click trên Sidebar để nhảy câu
        const sidebarBtns = container.querySelectorAll('.sidebar-q-btn');
        sidebarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                state.currentIndex = idx;
                this.renderPracticeArena(container);
            });
        });

        // Nút kết thúc buổi học sớm
        const submitAllBtn = document.getElementById('sidebarSubmitAllBtn');
        if (submitAllBtn) {
            submitAllBtn.addEventListener('click', () => {
                if (confirm('Bạn có chắc chắn muốn kết thúc buổi luyện tập ngay bây giờ?')) {
                    if (state.timerInterval) clearInterval(state.timerInterval);
                    this.renderPracticeFinished(container);
                }
            });
        }
    },

    submitCurrentQuestion() {
        const state = this.sessionState;
        const q = state.questions[state.currentIndex];
        const response = state.userResponses[state.currentIndex];
        const dot = document.getElementById(`dot_${state.currentIndex}`);

        if (response === null || response === undefined) {
            app.showToast('Vui lòng chọn câu trả lời trước khi nộp!', 'warning');
            return;
        }

        // Kiểm tra đúng sai
        let isCorrect = false;

        if (q.type === 'mcq') {
            isCorrect = (response === q.correctAnswer);
        } else {
            // Đúng/sai phải so khớp tất cả 4 ý a, b, c, d
            if (response.a === null || response.b === null || response.c === null || response.d === null) {
                app.showToast('Vui lòng chọn ĐÚNG hoặc SAI cho cả 4 ý!', 'warning');
                return;
            }

            isCorrect = (
                response.a === q.subQuestions.find(s => s.id === 'a').correctAnswer &&
                response.b === q.subQuestions.find(s => s.id === 'b').correctAnswer &&
                response.c === q.subQuestions.find(s => s.id === 'c').correctAnswer &&
                response.d === q.subQuestions.find(s => s.id === 'd').correctAnswer
            );
        }

        // Lưu kết quả làm bài vào localStorage
        state.isSubmitted[state.currentIndex] = true;
        state.isCorrectList[state.currentIndex] = isCorrect;
        
        if (isCorrect) {
            state.correctCount++;
            dot.className = 'status-dot done-correct';
            app.showToast('Chúc mừng! Câu trả lời chính xác.', 'success');
        } else {
            dot.className = 'status-dot done-wrong';
            app.showToast('Rất tiếc! Câu trả lời chưa chính xác.', 'error');
            // Lưu câu sai vào hàng đợi ôn tập
            MTKL_DB.addMistake(q.id, response, false);
        }

        // Cập nhật trạng thái Sidebar (không cần re-render cả layout)
        const sidebarStatus = document.getElementById(`sidebar-status-${state.currentIndex}`);
        if (sidebarStatus) {
            sidebarStatus.innerText = isCorrect ? '✅' : '❌';
        }

        // Render lại giao diện hiển thị kết quả cho câu này
        this.renderQuestionAnswers(q);

        // Kiểm tra xem đã hoàn thành toàn bộ buổi học chưa
        const allDone = state.isSubmitted.every(s => s === true);
        if (allDone) {
            if (state.timerInterval) clearInterval(state.timerInterval);
            setTimeout(() => {
                this.renderPracticeFinished(document.getElementById('appContent'));
            }, 1500);
        }
    },

    forceSubmitAll() {
        const state = this.sessionState;
        state.questions.forEach((q, idx) => {
            if (!state.isSubmitted[idx]) {
                state.isSubmitted[idx] = true;
                const dot = document.getElementById(`dot_${idx}`);
                if (dot) dot.className = 'status-dot done-wrong';
                // Đánh dấu sai do hết giờ
                MTKL_DB.addMistake(q.id, q.type === 'mcq' ? 'X' : { a: null, b: null, c: null, d: null }, false);
            }
        });
        
        this.renderPracticeFinished(document.getElementById('appContent'));
    },

    renderPracticeFinished(container) {
        const state = this.sessionState;
        const total = state.questions.length;
        const correct = state.correctCount;
        
        let totalScore = 0;
        state.questions.forEach((q, idx) => {
            const resp = state.userResponses[idx];
            if (state.isSubmitted[idx] && resp !== null && resp !== undefined) {
                if (q.type === 'mcq') {
                    if (resp === q.correctAnswer) totalScore += 1;
                } else {
                    let subCorrectCount = 0;
                    if (resp.a !== null && resp.a !== undefined) {
                        if (resp.a === q.subQuestions.find(s => s.id === 'a').correctAnswer) subCorrectCount++;
                        if (resp.b === q.subQuestions.find(s => s.id === 'b').correctAnswer) subCorrectCount++;
                        if (resp.c === q.subQuestions.find(s => s.id === 'c').correctAnswer) subCorrectCount++;
                        if (resp.d === q.subQuestions.find(s => s.id === 'd').correctAnswer) subCorrectCount++;
                    }
                    if (subCorrectCount === 1) totalScore += 0.1;
                    else if (subCorrectCount === 2) totalScore += 0.25;
                    else if (subCorrectCount === 3) totalScore += 0.5;
                    else if (subCorrectCount === 4) totalScore += 1.0;
                }
            }
        });

        const scoreVal = Math.round((totalScore / total) * 10 * 100) / 100;
        
        // Lưu lịch sử ôn tập
        MTKL_DB.addHistoryRecord(
            app.practiceConfig.topic,
            app.practiceConfig.type,
            `${totalScore}/${total}`,
            total - correct
        );

        container.innerHTML = `
            <div class="container" style="padding-top: 60px;">
                <div class="quiz-finished-card">
                    <div class="badge-spark">✨</div>
                    <h2 style="font-size: 2.2rem;">Hoàn thành buổi ôn tập!</h2>
                    <p class="text-muted" style="max-width: 500px;">Bạn đã hoàn thành việc ôn luyện các câu hỏi lỗi sai. Hệ thống đã lưu lại tiến độ học tập.</p>
                    
                    <div class="score-display" style="display: flex; gap: 16px; justify-content: center; align-items: center;">
                        <span style="font-weight: bold; font-size: 1.1rem;">Điểm thô: ${totalScore} / ${total}</span>
                        <span style="font-size: 1.1rem; font-weight: bold; background:var(--primary-color); color: white; padding: 4px 16px; border-radius: 99px; display: inline-block;">Hệ số 10: ${scoreVal}/10</span>
                    </div>

                    <p style="font-size:0.95rem; font-weight:600; color:var(--success-color); margin-top: 24px;">
                        Đã trả lời đúng hoàn toàn (đúng 4/4 ý): ${correct} câu.
                    </p>

                    <div class="finished-actions">
                        <button class="btn btn-secondary" onclick="window.location.hash='#review-sets'">Về Bộ Ôn Tập</button>
                        <button class="btn btn-primary" onclick="window.location.hash='#progress'">Xem biểu đồ tiến độ</button>
                    </div>
                </div>
            </div>
        `;
    },

    // -------------------------------------------------------------
    // 5. RENDER TIẾN ĐỘ HỌC TẬP (PROGRESS)
    // -------------------------------------------------------------
    renderProgress(container) {
        const isLogged = localStorage.getItem('mtkl_user_logged') === 'true';
        if (!isLogged) {
            container.innerHTML = `
                <div class="container text-center" style="padding: 100px 0;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
                    <h2>Vui lòng đăng nhập để xem tiến trình cá nhân</h2>
                    <button class="btn btn-primary" onclick="app.openAuthModal('login')">Đăng nhập</button>
                </div>
            `;
            return;
        }

        const mistakes = MTKL_DB.getMistakes();
        const totalMistakesCount = mistakes.length;
        const resolvedCount = mistakes.filter(m => m.isResolved).length;
        const activeMistakesCount = totalMistakesCount - resolvedCount;
        
        // Tính toán tỷ lệ phần trăm yếu theo chủ đề
        const activePerTopic = MTKL_DB.getActiveMistakesCount();
        const getPercentWeak = (count) => {
            if (activeMistakesCount === 0) return 0;
            return Math.round((count / activeMistakesCount) * 100);
        };

        const colorClasses = ['fill-red', 'fill-yellow', 'fill-green', 'fill-blue'];
        const weakTopics = TIN_HOC_TOPICS.map((t, idx) => ({
            id: t.id,
            name: t.name,
            count: activePerTopic[t.id] || 0,
            pct: getPercentWeak(activePerTopic[t.id] || 0),
            colorClass: colorClasses[idx % colorClasses.length]
        }));

        // Sắp xếp chủ đề yếu nhất lên đầu (nhiều câu sai nhất)
        weakTopics.sort((a, b) => b.count - a.count);

        const history = MTKL_DB.getHistory();

        container.innerHTML = `
            <div class="container" style="padding-top: 40px;">
                <h2 style="font-size: 2.2rem; margin-bottom: 6px; border-bottom: 2px solid var(--border-dark); padding-bottom: 20px;">📊 Phân Tích Tiến Độ Học Tập</h2>
                
                <div class="progress-grid">
                    <!-- Cột bên trái: Thống kê & Biểu đồ SVG tự vẽ -->
                    <div class="progress-left">
                        <div class="progress-card">
                            <h3 style="font-size:1.3rem; margin-bottom:20px;">Tổng quan kết quả</h3>
                            <div class="progress-stats-summary">
                                <div class="summary-tile">
                                    <div class="summary-tile-num" style="color: var(--text-primary);">${totalMistakesCount}</div>
                                    <div class="summary-tile-label">Câu sai đã lưu</div>
                                </div>
                                <div class="summary-tile">
                                    <div class="summary-tile-num" style="color: var(--success-color);">${resolvedCount}</div>
                                    <div class="summary-tile-label">Câu đã sửa đúng</div>
                                </div>
                                <div class="summary-tile">
                                    <div class="summary-tile-num" style="color: var(--error-color);">${activeMistakesCount}</div>
                                    <div class="summary-tile-label">Câu cần ôn tập</div>
                                </div>
                                <div class="summary-tile">
                                    <div class="summary-tile-num" style="color: var(--primary-color);">${totalMistakesCount > 0 ? Math.round((resolvedCount / totalMistakesCount) * 100) : 0}%</div>
                                    <div class="summary-tile-label">Hiệu quả sửa lỗi</div>
                                </div>
                            </div>

                            <h3 style="font-size:1.3rem; margin-bottom:10px;">Biểu đồ cải thiện điểm số</h3>
                            <p class="text-muted" style="font-size:0.85rem;">Thể hiện mức độ tiến bộ điểm số qua 5 bài kiểm tra gần nhất.</p>
                            
                            <!-- Vẽ biểu đồ SVG tuyệt đẹp và tương tác -->
                            <div class="chart-container">
                                <svg class="chart-svg" viewBox="0 0 500 240">
                                    <!-- Grid lines dọc và ngang -->
                                    <line x1="40" y1="20" x2="40" y2="200" stroke="var(--text-primary)" stroke-width="2"/>
                                    <line x1="40" y1="200" x2="480" y2="200" stroke="var(--text-primary)" stroke-width="2"/>
                                    
                                    <line x1="40" y1="155" x2="480" y2="155" class="chart-grid-line" stroke-dasharray="4"/>
                                    <line x1="40" y1="110" x2="480" y2="110" class="chart-grid-line" stroke-dasharray="4"/>
                                    <line x1="40" y1="65" x2="480" y2="65" class="chart-grid-line" stroke-dasharray="4"/>
                                    <line x1="40" y1="20" x2="480" y2="20" class="chart-grid-line" stroke-dasharray="4"/>

                                    <!-- Y-Axis Labels -->
                                    <text x="15" y="205" class="chart-axis-text">0đ</text>
                                    <text x="15" y="160" class="chart-axis-text">2.5đ</text>
                                    <text x="15" y="115" class="chart-axis-text">5.0đ</text>
                                    <text x="15" y="70" class="chart-axis-text">7.5đ</text>
                                    <text x="15" y="25" class="chart-axis-text">10đ</text>

                                    <!-- X-Axis Labels -->
                                    <text x="100" y="220" class="chart-axis-text">Bài 1</text>
                                    <text x="180" y="220" class="chart-axis-text">Bài 2</text>
                                    <text x="260" y="220" class="chart-axis-text">Bài 3</text>
                                    <text x="340" y="220" class="chart-axis-text">Bài 4</text>
                                    <text x="420" y="220" class="chart-axis-text">Hiện tại</text>

                                    <!-- Path Line của biểu đồ vẽ động -->
                                    <!-- Đố điểm: 1: 4.0đ (y=128), 2: 5.5đ (y=101), 3: 7.0đ (y=74), 4: 8.5đ (y=47), 5: 9.0đ (y=38) -->
                                    <path d="M 110 128 L 190 101 L 270 74 L 350 47 L 430 38" class="chart-line"/>
                                    
                                    <!-- Các chấm tròn dữ liệu -->
                                    <circle cx="110" cy="128" r="5" class="chart-dot"/>
                                    <circle cx="190" cy="101" r="5" class="chart-dot"/>
                                    <circle cx="270" cy="74" r="5" class="chart-dot"/>
                                    <circle cx="350" cy="47" r="5" class="chart-dot"/>
                                    <circle cx="430" cy="38" r="5" class="chart-dot"/>
                                </svg>
                            </div>
                        </div>

                        <!-- Lịch sử luyện tập gần đây -->
                        <div class="progress-card">
                            <h3 style="font-size:1.3rem;">Lịch sử làm bài gần đây</h3>
                            <div class="history-table-wrapper">
                                <table class="history-table">
                                    <thead>
                                        <tr>
                                            <th>Ngày làm</th>
                                            <th>Chủ đề</th>
                                            <th>Định dạng</th>
                                            <th>Điểm số</th>
                                            <th>Câu sai mới</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${history.length > 0 ? history.map(h => `
                                            <tr>
                                                <td>${h.date}</td>
                                                <td style="font-weight:700;">${TIN_HOC_TOPICS.find(t => t.id === h.topic)?.name || 'Tất cả'}</td>
                                                <td>${h.type === 'mcq' ? 'Trắc nghiệm' : h.type === 'tf' ? 'Đúng/Sai' : 'Hỗn hợp'}</td>
                                                <td style="font-weight:800; color: var(--primary-color);">${h.score}</td>
                                                <td class="text-danger" style="font-weight:700;">+${h.mistakesCount} câu</td>
                                            </tr>
                                        `).join('') : `
                                            <tr>
                                                <td colspan="5" style="text-align:center; color: var(--text-secondary); padding: 20px 0;">Bạn chưa có lịch sử làm bài nào.</td>
                                            </tr>
                                        `}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Cột bên phải: Phân tích vùng yếu -->
                    <div class="progress-right">
                        <div class="progress-card" style="height: 100%;">
                            <h3 style="font-size:1.3rem; margin-bottom:12px;">Chỉ số kiến thức yếu</h3>
                            <p class="text-muted" style="font-size:0.85rem; margin-bottom:20px;">Tỷ lệ lỗi sai phân bổ theo chuyên đề. Chuyên đề càng đỏ là vùng bạn cần ưu tiên luyện tập lại nhiều nhất.</p>
                            
                            <div class="weak-topics-list">
                                ${weakTopics.map(t => `
                                    <div class="weak-topic-row">
                                        <div class="weak-topic-name">${t.name}</div>
                                        <div class="progress-bar-track">
                                            <div class="progress-bar-fill ${t.colorClass}" style="width: ${t.pct === 0 && t.count > 0 ? '15%' : t.pct + '%'}"></div>
                                        </div>
                                        <div class="weak-topic-rate">${t.count} câu sai</div>
                                    </div>
                                `).join('')}
                            </div>

                            <div style="margin-top: 40px; background-color: var(--primary-light); border: 2px solid var(--border-dark); padding: 16px; border-radius: var(--radius-md); text-align:center; box-shadow: 2px 2px 0 var(--border-dark);">
                                <h4 style="font-size:0.95rem; margin-bottom:6px;">💡 Đề xuất ôn luyện:</h4>
                                <p style="font-size:0.85rem; color: var(--text-secondary); margin-bottom:12px;">Hãy tập trung làm bộ câu hỏi sai của chuyên đề <strong>"${weakTopics[0].name}"</strong> để nhanh chóng xóa bỏ lỗ hổng lớn nhất.</p>
                                <button class="btn btn-primary" style="padding:6px 16px; font-size:0.85rem;" onclick="MTKL_Components.startTopicReview('${weakTopics[0].id}')">Ôn Tập Ngay</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // -------------------------------------------------------------
    // 6. RENDER BẢNG XẾP HẠNG & HUY HIỆU (LEADERBOARD)
    // -------------------------------------------------------------
    renderLeaderboard(container) {
        const isLogged = localStorage.getItem('mtkl_user_logged') === 'true';
        const userName = localStorage.getItem('mtkl_user_name') || 'Học sinh';
        const resolvedCount = parseInt(localStorage.getItem('mtkl_stat_resolved') || '0');
        const streakCount = localStorage.getItem('mtkl_streak') || '3';

        // Danh sách học sinh xếp hạng giả lập
        const leaderData = [
            { rank: 1, name: 'Lê Hoàng Hải', avatar: 'LH', streak: 12, score: 85, isCur: false },
            { rank: 2, name: 'Nguyễn Diệp Chi', avatar: 'DC', streak: 9, score: 72, isCur: false },
            { rank: 3, name: 'Phạm Minh Quân', avatar: 'MQ', streak: 7, score: 68, isCur: false },
            { rank: 4, name: 'Trần Thu Thảo', avatar: 'TT', streak: 5, score: 54, isCur: false },
            { rank: 5, name: userName, avatar: userName.substring(0, 2).toUpperCase(), streak: parseInt(streakCount), score: resolvedCount * 10, isCur: true },
            { rank: 6, name: 'Vũ Quốc Anh', avatar: 'QA', streak: 2, score: 25, isCur: false }
        ];

        // Sắp xếp lại dựa vào điểm thực tế của user
        leaderData.sort((a, b) => b.score - a.score);
        leaderData.forEach((d, idx) => {
            d.rank = idx + 1;
        });

        // Top 3 cho Podium
        const top1 = leaderData.find(d => d.rank === 1) || leaderData[0];
        const top2 = leaderData.find(d => d.rank === 2) || leaderData[1];
        const top3 = leaderData.find(d => d.rank === 3) || leaderData[2];

        // Huy hiệu thành tích mở khóa động
        const badges = [
            { icon: '🌱', title: 'First Step', desc: 'Tải lên câu hỏi làm sai đầu tiên.', unlocked: totalResolved() >= 0 },
            { icon: '🔥', title: 'Streak Maker', desc: 'Duy trì chuỗi học 3 ngày liên tiếp.', unlocked: parseInt(streakCount) >= 3 },
            { icon: '💻', title: 'HTML Coder', desc: 'Sửa đúng 2 câu sai chuyên đề Web.', unlocked: resolvedCount >= 2 },
            { icon: '🛡️', title: 'SQL Master', desc: 'Hoàn thành ôn tập 5 câu hỏi CSDL.', unlocked: resolvedCount >= 5 }
        ];

        function totalResolved() {
            return MTKL_DB.getMistakes().length;
        }

        container.innerHTML = `
            <div class="container" style="padding-top: 40px;">
                <h2 style="font-size: 2.2rem; margin-bottom: 6px; border-bottom: 2px solid var(--border-dark); padding-bottom: 20px;">🏆 Bảng Vàng Tuyên Dương</h2>
                
                <div class="leaderboard-wrapper">
                    <!-- Podium Top 3 -->
                    <div class="podium-container">
                        <!-- Rank 2 -->
                        <div class="podium-column second">
                            <div class="podium-avatar">${top2.avatar}</div>
                            <div class="podium-name">${top2.name}</div>
                            <div class="podium-score">${top2.score} điểm</div>
                            <div class="podium-rank">2</div>
                        </div>

                        <!-- Rank 1 -->
                        <div class="podium-column first">
                            <div class="podium-crown">👑</div>
                            <div class="podium-avatar" style="border-color:#F59E0B; width:56px; height:56px; margin-top:-28px;">${top1.avatar}</div>
                            <div class="podium-name" style="font-weight:800;">${top1.name}</div>
                            <div class="podium-score" style="font-size:1.1rem; color:#D97706;">${top1.score} điểm</div>
                            <div class="podium-rank" style="color:#D97706;">1</div>
                        </div>

                        <!-- Rank 3 -->
                        <div class="podium-column third">
                            <div class="podium-avatar">${top3.avatar}</div>
                            <div class="podium-name">${top3.name}</div>
                            <div class="podium-score">${top3.score} điểm</div>
                            <div class="podium-rank">3</div>
                        </div>
                    </div>

                    <!-- Rank List Card -->
                    <div class="rank-list-card">
                        ${leaderData.map(d => `
                            <div class="rank-row ${d.isCur ? 'current-user' : ''}">
                                <div class="rank-num">#${d.rank}</div>
                                <div class="rank-avatar">${d.avatar}</div>
                                <div class="rank-name">${d.name} ${d.isCur ? '<strong>(Bạn)</strong>' : ''}</div>
                                <div class="rank-streak">🔥 ${d.streak} ngày</div>
                                <div class="rank-score">${d.score} XP</div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Achievements Section -->
                    <h3 style="font-size:1.5rem; margin-top:60px; margin-bottom:20px; text-align:center;">🎖️ Huy Hiệu Thành Tích Đạt Được</h3>
                    <div class="badges-container">
                        ${badges.map(b => `
                            <div class="badge-card ${b.unlocked ? 'unlocked' : ''}">
                                <div class="badge-icon">${b.icon}</div>
                                <div class="badge-title">${b.title}</div>
                                <div class="badge-desc">${b.desc}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // -------------------------------------------------------------
    // 7. RENDER GIỚI THIỆU PHƯƠNG PHÁP (ABOUT)
    // -------------------------------------------------------------
    
    
    renderFeedback(container) {
        container.innerHTML = `
            <div class="container" style="padding-top: 40px; padding-bottom: 60px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 12px;">Góp ý & Phát triển</h2>
                    <p class="text-muted" style="max-width: 600px; margin: 0 auto;">Đóng góp ý kiến của bạn sẽ giúp ứng dụng ngày càng hoàn thiện hơn. Hãy cho chúng mình biết bạn thích điều gì và muốn cải thiện gì nhé!</p>
                </div>
                
                <div style="max-width: 700px; margin: 0 auto; background: var(--bg-secondary); border: 2px solid var(--border-dark); padding: 40px; border-radius: var(--radius-lg); box-shadow: 4px 4px 0 var(--border-dark);">
                    <form id="feedbackForm" style="display: flex; flex-direction: column; gap: 20px;">
                        
                        <div class="form-group">
                            <label style="font-weight: 700; margin-bottom: 8px; display: block;">Địa chỉ Email của bạn</label>
                            <input type="email" id="fbEmail" required placeholder="Nhập email để chúng mình có thể phản hồi lại..." class="form-control" style="width: 100%; padding: 12px; border: 2px solid var(--border-dark); border-radius: 8px; background: var(--bg-color); color: var(--text-primary); outline: none;">
                        </div>
                        
                        <div class="form-group">
                            <label style="font-weight: 700; margin-bottom: 8px; display: block;">😍 Điểm bạn yêu thích về trang web</label>
                            <textarea id="fbLikes" rows="3" placeholder="Giao diện đẹp, dễ sử dụng, hay tính năng đếm ngược..." class="form-control" style="width: 100%; padding: 12px; border: 2px solid var(--border-dark); border-radius: 8px; background: var(--bg-color); color: var(--text-primary); resize: vertical; outline: none;"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label style="font-weight: 700; margin-bottom: 8px; display: block;">🛠️ Những điểm cần cải thiện/thay đổi</label>
                            <textarea id="fbImprovements" rows="3" placeholder="Tôi nghĩ phần ôn tập cần thêm tính năng..." class="form-control" style="width: 100%; padding: 12px; border: 2px solid var(--border-dark); border-radius: 8px; background: var(--bg-color); color: var(--text-primary); resize: vertical; outline: none;"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label style="font-weight: 700; margin-bottom: 8px; display: block;">💬 Nội dung góp ý khác (nếu có)</label>
                            <textarea id="fbMessage" rows="4" placeholder="Nhập nội dung góp ý..." required class="form-control" style="width: 100%; padding: 12px; border: 2px solid var(--border-dark); border-radius: 8px; background: var(--bg-color); color: var(--text-primary); resize: vertical; outline: none;"></textarea>
                        </div>
                        
                        <button type="submit" id="fbSubmitBtn" class="btn btn-primary" style="padding: 16px; font-size: 1.1rem; width: 100%; margin-top: 10px; cursor: pointer;">Gửi Feedback Ngay 🚀</button>
                    </form>
                </div>
            </div>
        `;

        const form = document.getElementById('feedbackForm');
        const submitBtn = document.getElementById('fbSubmitBtn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.innerText = 'Đang gửi...';
            submitBtn.disabled = true;

            const payload = {
                _subject: "Góp ý mới từ người dùng MTKL On thi THPTQG",
                email: document.getElementById('fbEmail').value,
                likes: document.getElementById('fbLikes').value,
                improvements: document.getElementById('fbImprovements').value,
                message: document.getElementById('fbMessage').value
            };

            try {
                const response = await fetch("https://formsubmit.co/ajax/ngango010172@gmail.com", {
                    method: "POST",
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    app.showToast('Cảm ơn bạn! Feedback đã được gửi thành công.', 'success');
                    form.reset();
                } else {
                    app.showToast('Đã có lỗi xảy ra. Vui lòng thử lại!', 'error');
                }
            } catch (error) {
                app.showToast('Lỗi kết nối. Vui lòng thử lại!', 'error');
            } finally {
                submitBtn.innerText = 'Gửi Feedback Ngay 🚀';
                submitBtn.disabled = false;
            }
        });
    },

    renderAbout(container) {
        container.innerHTML = `
            <div class="container" style="padding-top: 40px;">
                <div class="about-hero">
                    <h2 style="font-size: 2.5rem; margin-bottom: 12px;">🧠 Phương Pháp Học Tập Cốt Lõi</h2>
                    <p class="text-muted" style="max-width: 600px; margin: 0 auto;">Lý do vì sao việc ôn luyện lỗi sai liên tục mang lại hiệu quả vượt bậc cho học sinh thi THPTQG.</p>
                </div>

                <div class="about-grid">
                    <div class="about-card">
                        <h3>🔄 Spaced Repetition (Lặp lại ngắt quãng)</h3>
                        <p>Trí nhớ của con người tuân theo một "Đường cong quên lãng" (Forgetting Curve). Nếu không được ôn tập, thông tin sẽ biến mất nhanh chóng.</p>
                        <p>MTKL giúp phân bổ thời gian nhắc nhở làm lại các câu bị sai vào những thời điểm khoa học, giúp chuyển hóa kiến thức từ trí nhớ ngắn hạn sang trí nhớ dài hạn vĩnh viễn.</p>
                    </div>

                    <div class="about-card">
                        <h3>🎯 Active Recall (Chủ động gợi nhớ)</h3>
                        <p>Đọc đi đọc lại lý thuyết là một phương pháp học tập thụ động, mang lại hiệu quả cực kỳ thấp.</p>
                        <p>Bằng cách buộc học sinh phải trực tiếp trả lời câu hỏi, lựa chọn Đúng/Sai cho từng ý và so khớp với ghi chú cá nhân, não bộ phải hoạt động tích cực để lục tìm thông tin, củng cố sợi liên kết thần kinh mạnh mẽ.</p>
                    </div>
                </div>

                <div style="background-color: var(--primary-light); border: 3px solid var(--border-dark); border-radius: var(--radius-lg); box-shadow: 4px 4px 0 var(--border-dark); padding: 40px; margin-top: 60px; text-align: center;">
                    <h3 style="font-size: 1.6rem; margin-bottom: 16px;">Sẵn sàng ứng dụng phương pháp khoa học?</h3>
                    <p style="margin-bottom: 24px; max-width: 600px; margin-left:auto; margin-right:auto;">Hãy tải lên câu hỏi sai đầu tiên của bạn để xây dựng kho tri thức cá nhân và theo dõi điểm số bứt phá từng ngày.</p>
                    <button class="btn btn-primary" onclick="window.location.hash='#review-sets'">Bắt đầu tạo Hộp câu sai</button>
                </div>
            </div>
        `;
    }
};
