const fs = require('fs');
let content = fs.readFileSync('js/components.js', 'utf8');

const oldDays = /<div class="time-box" style="background: rgba\(255,255,255,0\.15\); backdrop-filter: blur\(10px\); padding: 12px 16px; border-radius: 8px; text-align: center; border: 1px solid rgba\(255,255,255,0\.3\); min-width: 75px;">\s*<div id="cd-days" style="font-size: 1\.8rem; font-weight: 800; font-family: monospace; text-shadow: 1px 1px 2px rgba\(0,0,0,0\.3\);">--<\/div>\s*<div style="font-size: 0\.75rem; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; opacity: 0\.9;">Ngày<\/div>\s*<\/div>/;

const newDays = `<div class="time-box" style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); color: #e11d48; padding: 12px 24px; border-radius: 12px; text-align: center; border: 2px solid #fff; min-width: 90px; box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4); transform: scale(1.15); transform-origin: center right;">
                            <div id="cd-days" style="font-size: 2.8rem; font-weight: 900; font-family: monospace; text-shadow: 1px 1px 0 rgba(255,255,255,0.5); line-height: 1;">--</div>
                            <div style="font-size: 0.85rem; text-transform: uppercase; font-weight: 800; letter-spacing: 1.5px; margin-top: 6px;">Ngày</div>
                        </div>`;

content = content.replace(oldDays, newDays);
fs.writeFileSync('js/components.js', content, 'utf8');
console.log('Days block updated!');
