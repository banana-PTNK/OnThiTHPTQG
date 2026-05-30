const fs = require('fs');

// 1. UPDATE index.html
let indexContent = fs.readFileSync('index.html', 'utf8');
// Add link in header
indexContent = indexContent.replace(
    /<a href="#about" class="nav-item" data-page="about">Giới thiệu<\/a>/,
    '<a href="#about" class="nav-item" data-page="about">Giới thiệu</a>\n                <a href="#feedback" class="nav-item" data-page="feedback">Góp ý</a>'
);
// Bump JS version
indexContent = indexContent.replace(/\?v=54/g, '?v=55');
fs.writeFileSync('index.html', indexContent, 'utf8');

// 2. UPDATE js/app.js
let appContent = fs.readFileSync('js/app.js', 'utf8');
appContent = appContent.replace(
    /const pageName = hash\.substring\(1\);\s*this\.state\.activePage = pageName;/,
    `const pageName = hash.substring(1);\n        const basePath = pageName.split('?')[0];\n        this.state.activePage = basePath;`
);

appContent = appContent.replace(
    /if \(item\.getAttribute\('data-page'\) === pageName\) \{/,
    `if (item.getAttribute('data-page') === basePath) {`
);

appContent = appContent.replace(
    /switch \(pageName\) \{/,
    `switch (basePath) {`
);

appContent = appContent.replace(
    /case 'about':\s*MTKL_Components\.renderAbout\(appContent\);\s*break;/,
    `case 'about':\n                MTKL_Components.renderAbout(appContent);\n                break;\n            case 'feedback':\n                MTKL_Components.renderFeedback(appContent);\n                break;`
);
fs.writeFileSync('js/app.js', appContent, 'utf8');

// 3. UPDATE js/components.js
let compContent = fs.readFileSync('js/components.js', 'utf8');
const feedbackFunc = `
    renderFeedback(container) {
        container.innerHTML = \`
            <div class="container" style="padding-top: 40px; padding-bottom: 60px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 12px;">Góp ý & Phát triển</h2>
                    <p class="text-muted" style="max-width: 600px; margin: 0 auto;">Đóng góp ý kiến của bạn sẽ giúp ứng dụng ngày càng hoàn thiện hơn. Hãy cho chúng mình biết bạn thích điều gì và muốn cải thiện gì nhé!</p>
                </div>
                
                <div style="max-width: 700px; margin: 0 auto; background: var(--bg-secondary); border: 2px solid var(--border-dark); padding: 40px; border-radius: var(--radius-lg); box-shadow: 4px 4px 0 var(--border-dark);">
                    <!-- We use FormSubmit.co for sending emails straight to the owner's Gmail -->
                    <form action="https://formsubmit.co/ngango010172@gmail.com" method="POST" style="display: flex; flex-direction: column; gap: 20px;">
                        
                        <!-- Disable Captcha and default Thanks page for better UX -->
                        <input type="hidden" name="_captcha" value="false">
                        <input type="hidden" name="_subject" value="Góp ý mới từ người dùng MTKL On thi THPTQG">
                        <!-- Redirect back to feedback with success parameter -->
                        <input type="hidden" name="_next" value="https://on-thi-thptqg.vercel.app/#feedback?success=true">
                        
                        <div class="form-group">
                            <label style="font-weight: 700; margin-bottom: 8px; display: block;">Địa chỉ Email của bạn</label>
                            <input type="email" name="email" required placeholder="Nhập email để chúng mình có thể phản hồi lại..." class="form-control" style="width: 100%; padding: 12px; border: 2px solid var(--border-dark); border-radius: 8px; background: var(--bg-color); color: var(--text-primary); outline: none;">
                        </div>
                        
                        <div class="form-group">
                            <label style="font-weight: 700; margin-bottom: 8px; display: block;">😍 Điểm bạn yêu thích về trang web</label>
                            <textarea name="likes" rows="3" placeholder="Giao diện đẹp, dễ sử dụng, hay tính năng đếm ngược..." class="form-control" style="width: 100%; padding: 12px; border: 2px solid var(--border-dark); border-radius: 8px; background: var(--bg-color); color: var(--text-primary); resize: vertical; outline: none;"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label style="font-weight: 700; margin-bottom: 8px; display: block;">🛠️ Những điểm cần cải thiện/thay đổi</label>
                            <textarea name="improvements" rows="3" placeholder="Tôi nghĩ phần ôn tập cần thêm tính năng..." class="form-control" style="width: 100%; padding: 12px; border: 2px solid var(--border-dark); border-radius: 8px; background: var(--bg-color); color: var(--text-primary); resize: vertical; outline: none;"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label style="font-weight: 700; margin-bottom: 8px; display: block;">💬 Nội dung góp ý khác (nếu có)</label>
                            <textarea name="message" rows="4" placeholder="Nhập nội dung góp ý..." required class="form-control" style="width: 100%; padding: 12px; border: 2px solid var(--border-dark); border-radius: 8px; background: var(--bg-color); color: var(--text-primary); resize: vertical; outline: none;"></textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" style="padding: 16px; font-size: 1.1rem; width: 100%; margin-top: 10px; cursor: pointer;">Gửi Feedback Ngay 🚀</button>
                    </form>
                </div>
            </div>
        \`;
        
        // Check if just successfully submitted
        if (window.location.hash.includes('success=true')) {
            app.showToast('Cảm ơn bạn! Feedback đã được gửi thành công.', 'success');
            // Remove the param from URL
            setTimeout(() => { window.location.hash = '#feedback'; }, 100);
        }
    },
`;

compContent = compContent.replace(
    /renderAbout\(container\) \{/,
    feedbackFunc + '\n    renderAbout(container) {'
);
fs.writeFileSync('js/components.js', compContent, 'utf8');

console.log('Update completed successfully.');
