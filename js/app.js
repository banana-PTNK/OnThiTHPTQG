// MTKL Application - Core Router, State Management, and Auth Flow Controller

const app = {
    // Trạng thái ứng dụng
    state: {
        isLogged: false,
        userName: '',
        userEmail: '',
        streak: 0,
        activePage: 'home'
    },

    // Cấu hình buổi luyện tập tạm thời
    practiceConfig: {
        topic: 'all',
        type: 'all',
        limit: '5',
        time: 300
    },

    // Mã OTP giả lập để kiểm tra
    currentGeneratedOtp: '',

    // Khởi tạo ứng dụng
    init() {
        // Khởi tạo dữ liệu mẫu trong LocalStorage nếu chạy lần đầu
        MTKL_DB.initMockDataIfFirstTime();
        
        // Bật Firestore offline persistence để dữ liệu được cache cục bộ
        MTKL_DB.enableOfflinePersistence();
        
        // Khôi phục trạng thái từ LocalStorage
        this.restoreState();

        // Đăng ký bộ lắng nghe Router Hash
        window.addEventListener('hashchange', () => this.handleRouting());
        
        // Lắng nghe sự kiện kéo cuộn để đổi style Header
        window.addEventListener('scroll', () => {
            const header = document.getElementById('appHeader');
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Thiết lập sự kiện tương tác chung (Header, Modals)
        this.registerGlobalEvents();

        // Kích hoạt định tuyến trang ban đầu
        this.handleRouting();
    },

    // Khôi phục trạng thái người dùng bằng Firebase
    restoreState() {
        // Setup Firebase Auth Listener
        if (window.MTKL_Firebase && window.MTKL_Firebase.auth) {
            window.MTKL_Firebase.auth.onAuthStateChanged(user => {
                if (user) {
                    this.state.isLogged = true;
                    this.state.userName = user.displayName || 'Học sinh';
                    this.state.userEmail = user.email || '';
                    this.state.uid = user.uid;
                    this.state.streak = parseInt(localStorage.getItem('mtkl_streak') || '3');
                    
                    // Đồng bộ cờ login vào localStorage để các component check được
                    localStorage.setItem('mtkl_user_logged', 'true');
                    
                    // Tải dữ liệu từ Firestore
                    MTKL_DB.loadUserDataFromFirebase(user.uid);
                } else {
                    this.state.isLogged = false;
                    this.state.userName = '';
                    this.state.userEmail = '';
                    this.state.uid = null;
                    
                    // Xóa cờ login
                    localStorage.removeItem('mtkl_user_logged');
                    
                    // Reset cache
                    MTKL_DB.cache.uploadedQuestions = [];
                    MTKL_DB.cache.mistakes = [];
                    MTKL_DB.cache.initialized = false;
                }
                this.updateHeaderUI();
                
                // Cập nhật lại UI sau khi Firebase xác thực
                this.handleRouting();
            });
        }
        
        // Khôi phục Dark Mode
        const isDarkMode = localStorage.getItem('mtkl_theme_dark') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            const themeToggleBtn = document.getElementById('themeToggleBtn');
            if (themeToggleBtn) themeToggleBtn.innerText = '☀️';
        }
        
        this.updateHeaderUI();
    },

    // Cập nhật giao diện Header dựa vào trạng thái đăng nhập
    updateHeaderUI() {
        const loginBtn = document.getElementById('headerLoginBtn');
        const startBtn = document.getElementById('headerStartBtn');
        const profileMenu = document.getElementById('userProfileMenu');
        const streakBadge = document.getElementById('streakBadgeWrapper');
        
        if (this.state.isLogged) {
            loginBtn.style.display = 'none';
            profileMenu.style.display = 'block';
            streakBadge.style.display = 'flex';
            
            document.getElementById('streakCount').innerText = this.state.streak;
            document.getElementById('userAvatar').innerText = this.state.userName.substring(0, 1).toUpperCase();
            document.getElementById('userDropdownName').innerText = this.state.userName;
            document.getElementById('userDropdownEmail').innerText = this.state.userEmail;
        } else {
            loginBtn.style.display = 'block';
            profileMenu.style.display = 'none';
            streakBadge.style.display = 'none';
        }
    },

    // Bộ định tuyến SPA (Client-side Routing)
    handleRouting() {
        const hash = window.location.hash || '#home';
        const pageName = hash.substring(1);
        const basePath = pageName.split('?')[0];
        this.state.activePage = basePath;

        // Cập nhật trạng thái active trên Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-page') === basePath) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const appContent = document.getElementById('appContent');
        appContent.innerHTML = `
            <div class="page-loading">
                <div class="spinner"></div>
                <p>Đang tải nội dung...</p>
            </div>
        `;

        // Đóng menu di động nếu đang mở
        document.getElementById('mainNav').classList.remove('show');

        // Render trang dựa vào hash ngay lập tức (không có độ trễ)
        switch (basePath) {
            case 'home':
                MTKL_Components.renderHome(appContent);
                break;
            case 'review-sets':
                MTKL_Components.renderReviewSets(appContent);
                break;
            case 'upload':
                MTKL_Components.renderUpload(appContent);
                break;
            case 'practice':
                MTKL_Components.renderPractice(appContent, this.practiceConfig);
                break;
            case 'manage-custom':
                MTKL_Components.renderManageCustom(appContent);
                break;
            case 'progress':
                MTKL_Components.renderProgress(appContent);
                break;
            case 'leaderboard':
                MTKL_Components.renderLeaderboard(appContent);
                break;
            case 'about':
                MTKL_Components.renderAbout(appContent);
                break;
            case 'feedback':
                MTKL_Components.renderFeedback(appContent);
                break;
            default:
                window.location.hash = '#home';
        }
        window.scrollTo(0, 0);
    },

    // Sự kiện tương tác trên toàn hệ thống
    registerGlobalEvents() {
        const authModal = document.getElementById('authModal');
        const loginBtn = document.getElementById('headerLoginBtn');
        const startBtn = document.getElementById('headerStartBtn');
        const closeAuthModal = document.getElementById('closeAuthModal');
        const userAvatar = document.getElementById('userAvatar');
        const profileDropdown = document.querySelector('.profile-dropdown');
        const logoutBtn = document.getElementById('logoutBtn');
        
        // Mở Modal Auth Đăng nhập
        loginBtn.addEventListener('click', () => {
            this.openAuthModal('login');
        });

        // Dark Mode Toggle
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                localStorage.setItem('mtkl_theme_dark', isDark);
                themeToggleBtn.innerText = isDark ? '☀️' : '🌙';
            });
        }

        // Bắt đầu ôn tập từ Header
        startBtn.addEventListener('click', () => {
            if (this.state.isLogged) {
                window.location.hash = '#review-sets';
            } else {
                this.openAuthModal('login');
            }
        });

        // Đóng modal
        closeAuthModal.addEventListener('click', () => {
            authModal.classList.remove('show');
        });

        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.remove('show');
            }
        });

        // Toggle dropdown profile
        if (userAvatar) {
            userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('show');
            });
        }

        document.addEventListener('click', () => {
            if (profileDropdown) profileDropdown.classList.remove('show');
        });

        // Đăng xuất
        logoutBtn.addEventListener('click', () => {
            this.handleLogout();
        });

        // AI Settings
        const aiSettingsBtn = document.getElementById('aiSettingsBtn');
        const aiSettingsModal = document.getElementById('aiSettingsModal');
        const closeAiSettingsModal = document.getElementById('closeAiSettingsModal');
        const cancelAiSettingsBtn = document.getElementById('cancelAiSettingsBtn');
        const saveAiSettingsBtn = document.getElementById('saveAiSettingsBtn');
        const geminiApiKeyInput = document.getElementById('geminiApiKey');

        const openAiModal = () => {
            const currentKey = localStorage.getItem('mtkl_gemini_api_key') || '';
            geminiApiKeyInput.value = currentKey;
            aiSettingsModal.classList.add('show');
            if (profileDropdown) profileDropdown.classList.remove('show');
        };

        const closeAiModal = () => {
            aiSettingsModal.classList.remove('show');
        };

        if (aiSettingsBtn) aiSettingsBtn.addEventListener('click', openAiModal);
        if (closeAiSettingsModal) closeAiSettingsModal.addEventListener('click', closeAiModal);
        if (cancelAiSettingsBtn) cancelAiSettingsBtn.addEventListener('click', closeAiModal);
        if (saveAiSettingsBtn) {
            saveAiSettingsBtn.addEventListener('click', () => {
                const key = geminiApiKeyInput.value.trim();
                if (key) {
                    localStorage.setItem('mtkl_gemini_api_key', key);
                    this.showToast('Đã lưu Gemini API Key thành công!', 'success');
                } else {
                    localStorage.removeItem('mtkl_gemini_api_key');
                    this.showToast('Đã xóa Gemini API Key.', 'info');
                }
                closeAiModal();
            });
        }

        // Reset dữ liệu
        const resetDataBtn = document.getElementById('resetDataBtn');
        if (resetDataBtn) {
            resetDataBtn.addEventListener('click', async () => {
                if (confirm('BẠN CÓ CHẮC CHẮN MUỐN XÓA TOÀN BỘ DỮ LIỆU CỦA MÌNH? Hành động này không thể hoàn tác!')) {
                    this.showToast('Đang tiến hành xóa dữ liệu...', 'warning');
                    await MTKL_DB.resetAllUserData();
                    this.showToast('Đã khôi phục dữ liệu gốc!', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                }
            });
        }

        // Thiết lập tabs cho Auth Modal (Đăng nhập / Đăng ký)
        const tabLoginBtn = document.getElementById('tabLoginBtn');
        const tabRegisterBtn = document.getElementById('tabRegisterBtn');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        tabLoginBtn.addEventListener('click', () => {
            tabLoginBtn.classList.add('active');
            tabRegisterBtn.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });

        tabRegisterBtn.addEventListener('click', () => {
            tabRegisterBtn.classList.add('active');
            tabLoginBtn.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        });

        // Xử lý nộp Form Đăng nhập
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLocalLogin();
        });

        // Xử lý nộp Form Đăng ký
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLocalRegister();
        });

        // Xử lý nộp Form OTP
        document.getElementById('otpForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleOtpVerification();
        });

        // OTP inputs auto focus transition
        const otpFields = document.querySelectorAll('.otp-field');
        otpFields.forEach((field, idx) => {
            field.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value.length === 1 && idx < otpFields.length - 1) {
                    otpFields[idx + 1].disabled = false;
                    otpFields[idx + 1].focus();
                }
            });

            field.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && field.value === '' && idx > 0) {
                    otpFields[idx - 1].focus();
                }
            });
        });

        // Đăng nhập nhanh Google / Facebook
        document.getElementById('googleLoginBtn').addEventListener('click', () => this.handleSocialLogin('Google'));
        document.getElementById('facebookLoginBtn').addEventListener('click', () => this.handleSocialLogin('Facebook'));

        // Toggle menu di động
        const mobileToggle = document.getElementById('mobileNavToggle');
        const mainNav = document.getElementById('mainNav');
        
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('show');
        });
    },

    // Mở Auth modal ở chế độ chỉ định (login hoặc register)
    openAuthModal(mode) {
        const authModal = document.getElementById('authModal');
        const tabLoginBtn = document.getElementById('tabLoginBtn');
        const tabRegisterBtn = document.getElementById('tabRegisterBtn');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        authModal.classList.add('show');
        
        if (mode === 'login') {
            tabLoginBtn.classList.add('active');
            tabRegisterBtn.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            tabRegisterBtn.classList.add('active');
            tabLoginBtn.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    },

    // Đăng ký tài khoản (Firebase Auth)
    handleLocalRegister() {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPassword').value;
        const submitBtn = document.getElementById('registerSubmitBtn');
        
        // Reset errors
        document.getElementById('regNameError').innerText = '';
        document.getElementById('regEmailError').innerText = '';
        document.getElementById('regPasswordError').innerText = '';

        if (pass.length < 6) {
            document.getElementById('regPasswordError').innerText = 'Mật khẩu phải tối thiểu 6 ký tự!';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = 'Đang tạo tài khoản...';

        window.MTKL_Firebase.auth.createUserWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                const user = userCredential.user;
                return user.updateProfile({
                    displayName: name
                });
            })
            .then(() => {
                document.getElementById('authModal').classList.remove('show');
                this.showToast('Đăng ký thành công! Chào mừng bạn đến với MTKL.', 'success');
                window.location.hash = '#review-sets';
                submitBtn.disabled = false;
                submitBtn.innerText = 'Đăng ký tài khoản';
            })
            .catch((error) => {
                document.getElementById('regPasswordError').innerText = error.message;
                submitBtn.disabled = false;
                submitBtn.innerText = 'Đăng ký tài khoản';
            });
    },

    // Bộ đếm ngược gửi lại mã OTP (Đã thay thế bằng Firebase)
    startOtpCountdown() {
        // Obsolete
    },

    // Kiểm tra và xác thực OTP
    handleOtpVerification() {
        // Obsolete
    },

    // Đăng nhập truyền thống (Firebase Auth)
    handleLocalLogin() {
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPassword').value;
        const submitBtn = document.getElementById('loginSubmitBtn');
        
        submitBtn.disabled = true;
        submitBtn.innerText = 'Đang đăng nhập...';

        window.MTKL_Firebase.auth.signInWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                document.getElementById('authModal').classList.remove('show');
                this.showToast('Đăng nhập thành công! Rất vui được gặp lại bạn.', 'success');
                submitBtn.disabled = false;
                submitBtn.innerText = 'Đăng nhập';
                window.location.hash = '#review-sets';
            })
            .catch((error) => {
                document.getElementById('loginPasswordError').innerText = 'Email hoặc mật khẩu không chính xác!';
                submitBtn.disabled = false;
                submitBtn.innerText = 'Đăng nhập';
            });
    },

    // Đăng nhập nhanh Google / Facebook (Firebase Auth)
    handleSocialLogin(providerName) {
        const loginForm = document.getElementById('loginForm');
        const btns = loginForm.querySelectorAll('.btn-social');
        
        btns.forEach(b => b.disabled = true);
        this.showToast(`Đang kết nối tài khoản ${providerName}...`, 'info');

        const provider = providerName === 'Google' ? window.MTKL_Firebase.googleProvider : window.MTKL_Firebase.facebookProvider;

        window.MTKL_Firebase.auth.signInWithPopup(provider)
            .then((result) => {
                document.getElementById('authModal').classList.remove('show');
                this.showToast(`Liên kết tài khoản ${providerName} thành công!`, 'success');
                btns.forEach(b => b.disabled = false);
                window.location.hash = '#review-sets';
            })
            .catch((error) => {
                this.showToast(`Lỗi đăng nhập ${providerName}: ${error.message}`, 'error');
                btns.forEach(b => b.disabled = false);
            });
    },

    // Đăng xuất tài khoản (Firebase)
    handleLogout() {
        window.MTKL_Firebase.auth.signOut().then(() => {
            this.showToast('Bạn đã đăng xuất tài khoản thành công.', 'info');
            window.location.hash = '#home';
        });
    },

    // Bộ hiển thị Toast thông báo trạng thái nổi góc màn hình
    showToast(message, type = 'success', duration = 4000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = '🔔';
        if (type === 'success') icon = '✅';
        else if (type === 'error') icon = '❌';
        else if (type === 'warning') icon = '⚠️';
        else if (type === 'info') icon = 'ℹ️';

        toast.innerHTML = `
            <span style="font-size:1.15rem;">${icon}</span>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        // Hủy toast sau thời gian duration
        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, duration);
    }
};

// Khởi chạy ứng dụng khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Global listener for image lightbox zoom
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('zoomable-img')) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
        overlay.style.zIndex = '99999';
        overlay.style.overflow = 'auto';
        overlay.style.textAlign = 'center';
        overlay.style.cursor = 'zoom-out';
        
        const spacer = document.createElement('span');
        spacer.style.display = 'inline-block';
        spacer.style.height = '100%';
        spacer.style.verticalAlign = 'middle';
        overlay.appendChild(spacer);
        
        const img = document.createElement('img');
        img.src = e.target.src;
        img.style.display = 'inline-block';
        img.style.verticalAlign = 'middle';
        img.style.maxWidth = '90vw';
        img.style.maxHeight = '90vh';
        img.style.border = '4px solid white';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
        img.style.cursor = 'zoom-in';
        img.style.transition = 'max-width 0.3s ease, max-height 0.3s ease';
        img.style.margin = '20px';
        
        let isZoomed = false;
        
        img.onclick = function(event) {
            event.stopPropagation();
            if (!isZoomed) {
                // Ép kích thước hiển thị tăng gấp đôi để đảm bảo luôn luôn zoom to
                const currentWidth = img.clientWidth || window.innerWidth * 0.8;
                img.style.width = (currentWidth * 2) + 'px';
                img.style.maxWidth = 'none';
                img.style.maxHeight = 'none';
                img.style.cursor = 'zoom-out';
                img.style.verticalAlign = 'top';
                img.style.marginTop = '40px';
                spacer.style.display = 'none';
                overlay.scrollTop = 0;
                isZoomed = true;
            } else {
                // Trả về vừa vặn màn hình
                img.style.width = 'auto';
                img.style.maxWidth = '90vw';
                img.style.maxHeight = '90vh';
                img.style.cursor = 'zoom-in';
                img.style.verticalAlign = 'middle';
                img.style.marginTop = '0';
                spacer.style.display = 'inline-block';
                isZoomed = false;
            }
        };
        
        overlay.appendChild(img);
        
        overlay.onclick = function() {
            document.body.removeChild(overlay);
        };
        
        document.body.appendChild(overlay);
    }
});
// Global listener for Keyboard Shortcuts in Practice Arena
document.addEventListener('keydown', function(e) {
    const arena = document.querySelector('.practice-layout');
    if (!arena) return;
    
    // Ignore if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

    if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        const nextBtn = document.getElementById('quizNextBtn');
        if (nextBtn && !nextBtn.disabled) {
            nextBtn.click();
        }
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevBtn = document.getElementById('quizPrevBtn');
        if (prevBtn && !prevBtn.disabled) {
            prevBtn.click();
        }
    } else if (['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        
        // MCQ Questions (in Practice screen the class is .mcq-option-row)
        const mcqRows = document.querySelectorAll('.mcq-option-row');
        if (mcqRows.length > 0) {
            if (mcqRows[index]) {
                mcqRows[index].click();
            }
            return;
        }
        
        // TF Questions
        const tfRows = document.querySelectorAll('.tf-quiz-table tbody tr');
        if (tfRows.length === 4) {
            const row = tfRows[index];
            const trueBtn = row.querySelector('.tf-quiz-btn[data-val="true"]');
            const falseBtn = row.querySelector('.tf-quiz-btn[data-val="false"]');
            
            if (trueBtn && falseBtn && !trueBtn.disabled) {
                if (trueBtn.classList.contains('selected-true')) {
                    falseBtn.click();
                } else {
                    trueBtn.click();
                }
            }
        }
    }
});