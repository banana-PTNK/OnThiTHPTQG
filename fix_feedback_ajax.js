const fs = require('fs');
let content = fs.readFileSync('js/components.js', 'utf8');

const oldFeedbackFuncRegex = /renderFeedback\(container\) \{[\s\S]*?\}\s*,\s*renderAbout\(container\) \{/;

const newFeedbackFunc = `
    renderFeedback(container) {
        container.innerHTML = \`
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
        \`;

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

    renderAbout(container) {`;

content = content.replace(oldFeedbackFuncRegex, newFeedbackFunc);
fs.writeFileSync('js/components.js', content, 'utf8');
console.log('Feedback page updated for AJAX submission!');
