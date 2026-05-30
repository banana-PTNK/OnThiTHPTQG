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
