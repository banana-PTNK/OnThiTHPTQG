const fs = require('fs');
let content = fs.readFileSync('js/components.js', 'utf8');

const newHtml = `
            </section>

            <!-- Countdown Section -->
            <section class="container" style="margin-top: -20px; margin-bottom: 20px; position: relative; z-index: 5;">
                <div class="countdown-wrapper" style="background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); padding: 24px 32px; border-radius: var(--radius-lg); box-shadow: 4px 4px 0 var(--border-dark); border: 2px solid var(--border-dark); display: flex; justify-content: space-between; align-items: center; color: white; flex-wrap: wrap; gap: 20px;">
                    <div class="countdown-info">
                        <h3 style="margin-bottom: 8px; font-size: 1.5rem; text-shadow: 1px 1px 0 rgba(0,0,0,0.2);">⏰ Đếm ngược kì thi THPTQG 2026</h3>
                        <p style="opacity: 0.9; margin: 0; font-size: 0.95rem; font-weight: 600;" id="currentDateTime">Hôm nay: --/--/---- --:--:--</p>
                    </div>
                    <div class="countdown-timer" style="display: flex; gap: 12px;">
                        <div class="time-box" style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 12px 16px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.3); min-width: 75px;">
                            <div id="cd-days" style="font-size: 1.8rem; font-weight: 800; font-family: monospace; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">--</div>
                            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; opacity: 0.9;">Ngày</div>
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
`;

content = content.replace(/<\/section>\s*<!-- Social Proof Section -->\s*<section class="trust-stats"/, newHtml);

const newJs = `
        const featuresBtn = document.getElementById('heroSeeDemoBtn');
        if (featuresBtn) {
            featuresBtn.addEventListener('click', () => {
                document.querySelector('.features-section').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Start Countdown Timer
        if (app.homeCountdownInterval) {
            clearInterval(app.homeCountdownInterval);
        }
        const targetDate = new Date('2026-06-11T07:00:00').getTime();
        
        const updateCountdown = () => {
            const now = new Date();
            
            const d = String(now.getDate()).padStart(2, '0');
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const y = now.getFullYear();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            
            const currText = document.getElementById('currentDateTime');
            if (currText) {
                currText.innerText = 'Hôm nay: ' + d + '/' + m + '/' + y + ' ' + hh + ':' + mm + ':' + ss;
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
    },
`;

content = content.replace(/const featuresBtn = document\.getElementById\('heroSeeDemoBtn'\);[\s\S]*?\}\s*\},/, newJs);

fs.writeFileSync('js/components.js', content, 'utf8');
console.log('Update successful!');
