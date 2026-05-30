// Ngân hàng câu hỏi mẫu môn Tin học THPTQG - MTKL Platform

const TIN_HOC_TOPICS = [
    { id: 'sql', name: 'Cơ sở dữ liệu & SQL', grade: 'Lớp 11', desc: 'Chương trình Tin học lớp 11 (Cánh Diều, Kết Nối Tri Thức, Chân Trời). Bao gồm kiến thức lý thuyết hệ CSDL quan hệ, truy vấn SQL (SELECT, INSERT, UPDATE, khóa chính, khóa ngoại).' },
    { id: 'html-css', name: 'Thiết kế Web (HTML/CSS)', grade: 'Lớp 12', desc: 'Kiến thức xây dựng giao diện tĩnh, các thẻ HTML cơ bản và định dạng CSS (selector, box model, flexbox). Chuyên đề Tin học ứng dụng.' },
    { id: 'python', name: 'Lập trình Python', grade: 'Lớp 10/Chuyên đề', desc: 'Lập trình cơ bản với Python: Biến, kiểu dữ liệu, vòng lặp, cấu trúc rẽ nhánh, hàm, list, và xử lý chuỗi cơ bản.' },
    { id: 'network', name: 'Mạng máy tính & Internet', grade: 'Lớp 12', desc: 'Mạng LAN, WAN, Internet. Giao thức TCP/IP, IP tĩnh/động, các thiết bị mạng cơ bản (Router, Switch).' },
    { id: 'general', name: 'Tin học đại cương & Hệ điều hành', grade: 'Lớp 10/11', desc: 'Cấu trúc máy tính, Hệ điều hành Windows/Linux cơ bản, mã hóa thông tin, hệ nhị phân.' },
    { id: 'ethics', name: 'Đạo đức, pháp luật và văn hóa trong môi trường số', grade: 'Lớp 10/11/12', desc: 'Tôn trọng bản quyền, bảo vệ dữ liệu cá nhân, an toàn thông tin và văn hóa ứng xử trên mạng.' },
    { id: 'career', name: 'Hướng nghiệp với Tin học', grade: 'Lớp 10/11/12', desc: 'Giới thiệu các ngành nghề thuộc lĩnh vực CNTT, yêu cầu kỹ năng và cơ hội việc làm.' },
    { id: 'ai_iot', name: 'Trí tuệ nhân tạo (AI) và Internet vạn vật (IoT)', grade: 'Lớp 11/12', desc: 'Tổng quan về AI, Machine Learning, thiết bị thông minh, và ứng dụng của IoT trong đời sống.' },
    { id: 'software_hardware', name: 'Phần cứng và Phần mềm máy tính', grade: 'Lớp 10/11', desc: 'Lịch sử phát triển máy tính, phân loại phần mềm, kiến trúc Von Neumann.' }
];

const TIN_HOC_MOCK_QUESTIONS = [
    {
        id: 'q_mock_001',
        type: 'mcq',
        topic: 'sql',
        grade: 11,
        book: 'Kết nối tri thức',
        examName: 'Đề thi thử THPTQG Sở GD&ĐT Hà Nội - Mã 102',
        questionText: 'Cho bảng dữ liệu HOC_SINH trong một cơ sở dữ liệu quan hệ như hình bên dưới. Để tìm danh sách các học sinh có điểm trung bình (DTB) từ 8.0 trở lên và sắp xếp giảm dần theo điểm trung bình, câu lệnh SQL nào sau đây là chính xác nhất?',
        imageMock: `
            <div class="mock-svg-image-container">
                <p style="font-weight: 700; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary);">[ẢNH ĐỀ THI - BẢNG HOC_SINH]</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                    <thead>
                        <tr style="background-color: var(--bg-tertiary); border: 1.5px solid var(--text-primary);">
                            <th style="padding: 6px; border: 1.5px solid var(--text-primary);">MaHS</th>
                            <th style="padding: 6px; border: 1.5px solid var(--text-primary);">HoTen</th>
                            <th style="padding: 6px; border: 1.5px solid var(--text-primary);">Lop</th>
                            <th style="padding: 6px; border: 1.5px solid var(--text-primary);">DTB</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border: 1.5px solid var(--text-primary);">
                            <td style="padding: 6px; border: 1.5px solid var(--text-primary);">HS01</td>
                            <td style="padding: 6px; border: 1.5px solid var(--text-primary);">Nguyễn Văn An</td>
                            <td style="padding: 6px; border: 1.5px solid var(--text-primary);">11A1</td>
                            <td style="padding: 6px; border: 1.5px solid var(--text-primary);">8.5</td>
                        </tr>
                        <tr style="border: 1.5px solid var(--text-primary);">
                            <td style="padding: 6px; border: 1.5px solid var(--text-primary);">HS02</td>
                            <td style="padding: 6px; border: 1.5px solid var(--text-primary);">Lê Thị Bình</td>
                            <td style="padding: 6px; border: 1.5px solid var(--text-primary);">11A2</td>
                            <td style="padding: 6px; border: 1.5px solid var(--text-primary);">7.8</td>
                        </tr>
                        <tr style="border: 1.5px solid var(--text-primary);">
                            <td style="padding: 6px; border: 1.5px solid var(--text-primary);">HS03</td>
                            <td style="padding: 6px; border: 1.5px solid var(--text-primary);">Trần Hoàng Cường</td>
                            <td style="padding: 6px; border: 1.5px solid var(--text-primary);">11A1</td>
                            <td style="padding: 6px; border: 1.5px solid var(--text-primary);">9.2</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `,
        options: [
            'SELECT * FROM HOC_SINH WHERE DTB >= 8.0 ORDER BY DTB ASC;',
            'SELECT * FROM HOC_SINH WHERE DTB > 8.0 ORDER BY DTB DESC;',
            'SELECT * FROM HOC_SINH WHERE DTB >= 8.0 ORDER BY DTB DESC;',
            'SELECT HoTen, DTB FROM HOC_SINH WHERE DTB >= 8.0;'
        ],
        correctAnswer: 'C',
        explanation: 'Đáp án đúng là C. Đề bài yêu cầu lấy điểm từ 8.0 trở lên (DTB >= 8.0) và sắp xếp giảm dần (ORDER BY DTB DESC). Phương án A sai vì sắp xếp tăng dần (ASC), phương án B sai vì thiếu dấu bằng (>= 8.0), phương án D không thực hiện sắp xếp và chỉ lấy hai cột.'
    },
    {
        id: 'q_mock_002',
        type: 'mcq',
        topic: 'html-css',
        grade: 12,
        book: 'Cánh diều',
        examName: 'Đề kiểm tra học kỳ II lớp 12 - THPT Chuyên Nguyễn Huệ',
        questionText: 'Trong CSS, để thiết lập khoảng cách lề bên ngoài (margin) của một hộp CSS sao cho lề trên là 10px, lề phải là 20px, lề dưới là 15px và lề trái là 30px, ta sử dụng cú pháp rút gọn nào sau đây?',
        imageMock: `
            <div class="mock-svg-image-container">
                <p style="font-weight: 700; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary);">[ẢNH ĐỀ THI - MÔ HÌNH HỘP CSS BOX MODEL]</p>
                <div style="border: 2px solid var(--text-primary); padding: 20px; text-align: center; background-color: var(--bg-secondary); font-weight: 600; font-size: 0.8rem;">
                    Margin (Trực quan: Trên -> Phải -> Dưới -> Trái)
                    <div style="margin: 10px 20px 15px 30px; border: 2px dashed #EF4444; padding: 10px; background-color: var(--bg-tertiary);">
                        Border / Padding / Content
                    </div>
                </div>
            </div>
        `,
        options: [
            'margin: 10px 20px 15px 30px;',
            'margin: 10px 30px 15px 20px;',
            'margin: 30px 15px 20px 10px;',
            'margin: 10px 15px 20px 30px;'
        ],
        correctAnswer: 'A',
        explanation: 'Đáp án đúng là A. Thuộc tính rút gọn margin áp dụng quy tắc theo chiều kim đồng hồ bắt đầu từ phía trên: Trên (Top) -> Phải (Right) -> Dưới (Bottom) -> Trái (Left). Do đó margin: 10px (trên) 20px (phải) 15px (dưới) 30px (trái) là chính xác.'
    },
    {
        id: 'q_mock_003',
        type: 'mcq',
        topic: 'python',
        grade: 10,
        book: 'Chân trời sáng tạo',
        examName: 'Chuyên đề Lập trình Python lớp 10',
        questionText: 'Cho đoạn mã chương trình Python dưới đây. Giá trị của biến s hiển thị ra màn hình là bao nhiêu?',
        imageMock: `
            <div class="mock-svg-image-container">
                <p style="font-weight: 700; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary);">[ẢNH CHỤP ĐỀ - ĐOẠN CODE PYTHON]</p>
                <div class="code-snippet">
s = 0
for i in range(1, 6):
    if i % 2 != 0:
        s += i
print(s)
                </div>
            </div>
        `,
        options: [
            '15',
            '9',
            '6',
            '5'
        ],
        correctAnswer: 'B',
        explanation: 'Đáp án đúng là B. Vòng lặp range(1, 6) sẽ tạo ra các giá trị i từ 1 đến 5 (1, 2, 3, 4, 5). Điều kiện i % 2 != 0 kiểm tra i là số lẻ. Các số lẻ trong dãy là 1, 3, 5. Biến s cộng dồn các số lẻ này: s = 1 + 3 + 5 = 9.'
    },
    {
        id: 'q_mock_004',
        type: 'mcq',
        topic: 'network',
        grade: 12,
        book: 'Kết nối tri thức',
        examName: 'Đề kiểm tra chuyên đề Mạng máy tính THPTQG 2025',
        questionText: 'Giao thức nào dưới đây chịu trách nhiệm định tuyến các gói tin qua các mạng khác nhau trên Internet bằng cách sử dụng địa chỉ IP làm cơ sở?',
        imageMock: `
            <div class="mock-svg-image-container">
                <p style="font-weight: 700; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary);">[ẢNH ĐỀ THI - MÔ HÌNH TRUYỀN DỮ LIỆU]</p>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1.5px solid var(--text-primary); background-color: var(--bg-color);">
                    <span style="border: 2px solid var(--text-primary); padding: 4px; border-radius: 4px;">Thiết bị gửi</span>
                    <span style="font-weight: bold; color: #3B82F6;">-----[ Gói tin IP ]-----></span>
                    <span style="border: 2px solid var(--text-primary); padding: 4px; border-radius: 4px;">Router</span>
                    <span style="font-weight: bold; color: #3B82F6;">-----></span>
                    <span style="border: 2px solid var(--text-primary); padding: 4px; border-radius: 4px;">Thiết bị nhận</span>
                </div>
            </div>
        `,
        options: [
            'TCP (Transmission Control Protocol)',
            'HTTP (Hypertext Transfer Protocol)',
            'IP (Internet Protocol)',
            'FTP (File Transfer Protocol)'
        ],
        correctAnswer: 'C',
        explanation: 'Đáp án đúng là C. Giao thức IP (Internet Protocol) là giao thức cốt lõi ở tầng mạng, định nghĩa địa chỉ IP và thực hiện chức năng định tuyến, chuyển phát gói tin từ nguồn tới đích thông qua các bộ định tuyến (Router).'
    },
    {
        id: 'q_mock_005',
        type: 'mcq',
        topic: 'general',
        grade: 10,
        book: 'Kết nối tri thức',
        examName: 'Đề thi chọn học sinh giỏi lớp 10 môn Tin học',
        questionText: 'Hệ điều hành thực hiện chức năng nào dưới đây để quản lý việc phân phối và sử dụng CPU giữa các tiến trình đang chạy đồng thời?',
        imageMock: `
            <div class="mock-svg-image-container">
                <p style="font-weight: 700; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary);">[ẢNH MINH HỌA - CHU KỲ CPU]</p>
                <div style="border: 2px solid var(--text-primary); padding: 12px; text-align: center; background-color: var(--bg-secondary);">
                    <strong>CPU Scheduler</strong> (Bộ lập lịch) <br>
                    [Tiến trình A] ⇄ [Tiến trình B] ⇄ [Tiến trình C]
                </div>
            </div>
        `,
        options: [
            'Quản lý tệp tin và thư mục',
            'Định cấu hình phần cứng ngoại vi',
            'Quản lý và điều phối tiến trình (Process Management)',
            'Sao lưu dữ liệu tự động'
        ],
        correctAnswer: 'C',
        explanation: 'Đáp án đúng là C. Quản lý và điều phối tiến trình là nhiệm vụ quan trọng của hệ điều hành, chịu trách nhiệm cấp phát CPU cho các tiến trình sử dụng thuật toán lập lịch để đảm bảo tính đa nhiệm.'
    },
    // Câu hỏi Đúng/Sai cấu trúc mới THPTQG
    {
        id: 'q_mock_006',
        type: 'tf',
        topic: 'sql',
        grade: 11,
        book: 'Cánh diều',
        examName: 'Đề thi minh họa THPT Quốc gia môn Tin học - Bộ GD&ĐT',
        questionText: 'Cho sơ đồ quan hệ của một cơ sở dữ liệu quản lý thư viện trường học gồm hai bảng: <br><b>SACH</b>(<u>MaSach</u>, TenSach, NamXB, MaNXB)<br><b>NHA_XUAT_BAN</b>(<u>MaNXB</u>, TenNXB, DiaChi)<br>Trong đó các trường gạch chân là khóa chính. Xét tính đúng/sai của các phát biểu sau đây:',
        imageMock: `
            <div class="mock-svg-image-container">
                <p style="font-weight: 700; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary);">[ẢNH ĐỀ THI - SƠ ĐỒ LIÊN KẾT KHÓA NGOẠI]</p>
                <div style="border: 2px solid var(--text-primary); padding: 16px; background-color: var(--bg-color); font-family: monospace;">
                    bảng SACH [MaNXB] ----(Khóa ngoại)----> bảng NHA_XUAT_BAN [MaNXB] (Khóa chính)
                </div>
            </div>
        `,
        subQuestions: [
            {
                id: 'a',
                statement: 'Trường MaNXB trong bảng SACH đóng vai trò là khóa ngoại tham chiếu đến bảng NHA_XUAT_BAN.',
                correctAnswer: true
            },
            {
                id: 'b',
                statement: 'Ta có thể nhập một dòng mới vào bảng SACH với giá trị MaNXB không tồn tại trong bảng NHA_XUAT_BAN.',
                correctAnswer: false
            },
            {
                id: 'c',
                statement: 'Khóa chính MaSach của bảng SACH có thể chứa các giá trị trùng nhau nếu các cuốn sách đó thuộc cùng một nhà xuất bản.',
                correctAnswer: false
            },
            {
                id: 'd',
                statement: 'Việc liên kết giữa hai bảng trên thông qua MaNXB giúp ngăn ngừa hiện tượng không nhất quán dữ liệu khi cập nhật thông tin nhà xuất bản.',
                correctAnswer: true
            }
        ],
        explanation: 'a) Đúng, MaNXB liên kết hai bảng là khóa ngoại của bảng SACH. b) Sai, ràng buộc toàn vẹn khóa ngoại không cho phép nhập giá trị khóa ngoại chưa có ở bảng được tham chiếu. c) Sai, khóa chính bắt buộc phải là duy nhất và không được trùng lặp. d) Đúng, việc chuẩn hóa cơ sở dữ liệu giúp tránh dư thừa và không nhất quán.'
    },
    {
        id: 'q_mock_007',
        type: 'tf',
        topic: 'html-css',
        grade: 12,
        book: 'Chân trời sáng tạo',
        examName: 'Đề thi khảo sát chất lượng THPTQG lần 1',
        questionText: 'Một học sinh thiết kế cấu trúc trang web bán hàng bằng ngôn ngữ HTML và trang trí giao diện bằng CSS. Học sinh đó viết đoạn mã sau: <br>Xét tính đúng/sai của các nhận định liên quan đến đoạn mã CSS này:',
        imageMock: `
            <div class="mock-svg-image-container">
                <p style="font-weight: 700; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary);">[ẢNH ĐỀ THI - ĐOẠN CODE HTML/CSS]</p>
                <div class="code-snippet">
&lt;!-- HTML --&gt;
&lt;div class="container-box"&gt;
    &lt;p class="title-text"&gt;Sản phẩm nổi bật&lt;/p&gt;
&lt;/div&gt;

/* CSS */
.container-box {
    background-color: #89BDB2;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
}
.title-text {
    color: var(--text-primary);
    font-size: 20px;
}
                </div>
            </div>
        `,
        subQuestions: [
            {
                id: 'a',
                statement: 'Đoạn mã HTML sử dụng thẻ div để tạo khối chứa và thẻ p để tạo đoạn văn bản tiêu đề.',
                correctAnswer: true
            },
            {
                id: 'b',
                statement: 'Thuộc tính display: flex kết hợp justify-content: center sẽ căn chỉnh phần tử con p nằm giữa khối container-box theo cả chiều dọc và ngang.',
                correctAnswer: false
            },
            {
                id: 'c',
                statement: 'Màu nền của container-box được thiết lập có giá trị hex là #89BDB2, đây là một tông màu xanh Teal nhạt.',
                correctAnswer: true
            },
            {
                id: 'd',
                statement: 'Nếu thay đổi height: 100px thành height: auto, phần tử con sẽ luôn luôn nằm chính giữa màn hình trình duyệt theo chiều dọc.',
                correctAnswer: false
            }
        ],
        explanation: 'a) Đúng, cấu trúc HTML sử dụng div và p chuẩn xác. b) Sai, justify-content: center chỉ căn giữa theo chiều ngang (trục chính flex-direction mặc định là row). Căn giữa chiều dọc là nhờ align-items: center. c) Đúng, #89BDB2 là mã hex xanh Teal. d) Sai, height: auto làm chiều cao co lại theo nội dung, không thể tự căn giữa dọc màn hình nếu không có thiết lập chiều cao cụ thể.'
    },
    {
        id: 'q_mock_008',
        type: 'tf',
        topic: 'python',
        grade: 11,
        book: 'Kết nối tri thức',
        examName: 'Đề kiểm tra 1 tiết học kỳ I môn Tin học 11',
        questionText: 'Cho đoạn mã chương trình Python thực hiện việc sắp xếp một danh sách các số nguyên theo thứ tự tăng dần bằng thuật toán sắp xếp nổi bọt (Bubble Sort). Xét tính đúng/sai của các phát biểu sau:',
        imageMock: `
            <div class="mock-svg-image-container">
                <p style="font-weight: 700; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary);">[ẢNH ĐỀ THI - THUẬT TOÁN SẮP XẾP PYTHON]</p>
                <div class="code-snippet">
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr
                </div>
            </div>
        `,
        subQuestions: [
            {
                id: 'a',
                statement: 'Đoạn mã chương trình sử dụng 2 vòng lặp lồng nhau để so sánh và đổi chỗ các phần tử kề nhau.',
                correctAnswer: true
            },
            {
                id: 'b',
                statement: 'Nếu danh sách đầu vào là [5, 1, 4, 2], sau lượt chạy đầu tiên của vòng lặp ngoài (i = 0), phần tử lớn nhất là 5 sẽ được đưa về cuối danh sách.',
                correctAnswer: true
            },
            {
                id: 'c',
                statement: 'Phép gán arr[j], arr[j+1] = arr[j+1], arr[j] trong Python đòi hỏi phải sử dụng thêm một biến trung gian để hoán đổi giá trị.',
                correctAnswer: false
            },
            {
                id: 'd',
                statement: 'Nếu muốn thay đổi thuật toán để sắp xếp giảm dần, học sinh chỉ cần đổi điều kiện so sánh thành arr[j] < arr[j+1].',
                correctAnswer: true
            }
        ],
        explanation: 'a) Đúng, có 2 vòng lặp for i và for j. b) Đúng, nguyên lý nổi bọt đẩy phần tử lớn nhất xuống cuối sau mỗi lượt duyệt. c) Sai, Python hỗ trợ gán đa biến song song để hoán đổi mà không cần biến tạm tường minh. d) Đúng, đổi dấu so sánh sẽ thay đổi chiều sắp xếp.'
    },
    {
        id: 'q_mock_009',
        type: 'tf',
        topic: 'network',
        grade: 12,
        book: 'Cánh diều',
        examName: 'Đề thi thử Tốt nghiệp THPTQG 2026 trường THPT Chu Văn An',
        questionText: 'Địa chỉ IP (Internet Protocol) và Hệ thống phân giải tên miền DNS là hai thành phần thiết yếu của hạ tầng mạng Internet. Đánh giá tính đúng/sai của các nhận định dưới đây:',
        imageMock: `
            <div class="mock-svg-image-container">
                <p style="font-weight: 700; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary);">[ẢNH ĐỀ THI - DỊCH VỤ PHÂN GIẢI TÊN MIỀN DNS]</p>
                <div style="border: 2px solid var(--text-primary); padding: 12px; background-color: var(--bg-color); text-align: center;">
                    Trình duyệt ➜ [ "google.com" ] ➜ Máy chủ DNS ➜ [ 142.250.190.46 ] ➜ Máy chủ Google
                </div>
            </div>
        `,
        subQuestions: [
            {
                id: 'a',
                statement: 'IPv4 sử dụng 32 bit để biểu diễn địa chỉ, chia thành 4 nhóm số thập phân ngăn cách bởi dấu chấm (ví dụ: 192.168.1.1).',
                correctAnswer: true
            },
            {
                id: 'b',
                statement: 'Dịch vụ DNS (Domain Name System) giúp chuyển đổi các địa chỉ IP khó nhớ của máy chủ thành các tên miền thân thiện dễ nhớ với con người.',
                correctAnswer: true
            },
            {
                id: 'c',
                statement: 'IPv6 được phát triển để thay thế IPv4 vì không gian địa chỉ IPv4 đã cạn kiệt, IPv6 sử dụng 64 bit để đánh địa chỉ.',
                correctAnswer: false
            },
            {
                id: 'd',
                statement: 'Mỗi tên miền trên Internet chỉ có thể trỏ duy nhất tới một địa chỉ IP tĩnh vào mọi thời điểm.',
                correctAnswer: false
            }
        ],
        explanation: 'a) Đúng, IPv4 là 32 bit. b) Đúng, DNS ánh xạ tên miền sang IP. c) Sai, IPv6 sử dụng 128 bit chứ không phải 64 bit. d) Sai, một tên miền có thể ánh xạ tới nhiều địa chỉ IP (cân bằng tải) hoặc dùng IP động.'
    },
    {
        id: 'q_mock_010',
        type: 'tf',
        topic: 'general',
        grade: 11,
        book: 'Chân trời sáng tạo',
        examName: 'Đề kiểm tra định kỳ Tin học lớp 11',
        questionText: 'Trong kiến trúc máy tính Von Neumann, phần cứng bao gồm các khối chức năng chính: Bộ xử lý trung tâm (CPU), Bộ nhớ (Memory) và Thiết bị ngoại vi (Input/Output devices). Xét tính đúng/sai của các nhận định dưới đây:',
        imageMock: `
            <div class="mock-svg-image-container">
                <p style="font-weight: 700; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary);">[ẢNH ĐỀ THI - SƠ ĐỒ KIẾN TRÚC VON NEUMANN]</p>
                <div style="border: 2px dashed var(--text-primary); padding: 12px; background-color: var(--bg-secondary); text-align: center;">
                    [Thiết bị vào] ➜ [ CPU (ALU + CU + Registers) ⇄ Bộ nhớ trong ] ➜ [Thiết bị ra]
                </div>
            </div>
        `,
        subQuestions: [
            {
                id: 'a',
                statement: 'Bộ xử lý trung tâm (CPU) chứa hai bộ phận chính là bộ điều khiển (CU) và bộ tính toán số học/logic (ALU).',
                correctAnswer: true
            },
            {
                id: 'b',
                statement: 'Bộ nhớ RAM (Random Access Memory) thuộc bộ nhớ ngoài, giúp lưu trữ dữ liệu lâu dài ngay cả khi máy tính đã tắt nguồn điện.',
                correctAnswer: false
            },
            {
                id: 'c',
                statement: 'Nguyên lý lưu trữ chương trình phát biểu rằng cả dữ liệu và lệnh của chương trình đều được lưu trữ trong cùng một bộ nhớ dưới dạng các bit nhị phân.',
                correctAnswer: true
            },
            {
                id: 'd',
                statement: 'Thiết bị vào (Input) bao gồm bàn phím, chuột, màn hình máy tính và loa.',
                correctAnswer: false
            }
        ],
        explanation: 'a) Đúng, CPU gồm CU và ALU cùng các thanh ghi. b) Sai, RAM là bộ nhớ trong và mất dữ liệu khi mất điện (bộ nhớ tạm thời). c) Đúng, đây là đặc trưng kiến trúc Von Neumann. d) Sai, màn hình và loa là thiết bị ra (Output).'
    }
];

// Helper functions to manage Database (Firebase Firestore & Local Cache)
const MTKL_DB = {
    // Enable Firestore offline persistence as soon as the module loads
    enableOfflinePersistence() {
        if (window.MTKL_Firebase && window.MTKL_Firebase.db) {
            window.MTKL_Firebase.db.enablePersistence()
                .catch(err => console.warn('Offline persistence enable error:', err));
        }
    },
    // Bộ đệm (Cache) để các hàm render chạy đồng bộ không bị lỗi
    cache: {
        uploadedQuestions: [],
        mistakes: [],
        history: [],
        initialized: false
    },

    // Bật Firestore offline persistence để dữ liệu cache ngay cả khi mạng chậm
    enableOfflinePersistence() {
        try {
            if (window.MTKL_Firebase && window.MTKL_Firebase.db) {
                window.MTKL_Firebase.db.enablePersistence({ synchronizeTabs: true })
                    .catch(err => {
                        if (err.code === 'failed-precondition') {
                            console.warn('Firestore persistence: nhiều tab đang mở');
                        } else if (err.code === 'unimplemented') {
                            console.warn('Firestore persistence: trình duyệt không hỗ trợ');
                        }
                    });
            }
        } catch (e) {
            console.warn('Firestore persistence already enabled or error:', e);
        }
    },

    // Helper đồng bộ cache xuống LocalStorage để tải tức thì khi refresh
    syncLocalCache() {
        const uid = app?.state?.uid;
        if (!uid) return;
        localStorage.setItem('mtkl_questions_' + uid, JSON.stringify(this.cache.uploadedQuestions));
        localStorage.setItem('mtkl_mistakes_' + uid, JSON.stringify(this.cache.mistakes));
    },

    // Tải dữ liệu từ Firebase về Cache khi User đăng nhập
    async loadUserDataFromFirebase(uid) {
        try {
            // 1. Tải TỨC THÌ từ LocalStorage để trải nghiệm mượt mà, không bị mất/delay
            const localQ = localStorage.getItem('mtkl_questions_' + uid);
            if (localQ) this.cache.uploadedQuestions = JSON.parse(localQ);
            
            const localM = localStorage.getItem('mtkl_mistakes_' + uid);
            if (localM) this.cache.mistakes = JSON.parse(localM);
            
            this.cache.initialized = true;
            this.updateStatistics();
            
            // Trigger render lại màn hình hiện tại ngay lập tức với dữ liệu local
            const page = app.state.activePage;
            if (page === 'review-sets' || page === 'manage-custom' || page === 'upload') {
                app.handleRouting();
            }

            // 2. Lắng nghe NỀN từ Firebase (onSnapshot) để tự động xử lý cập nhật thời gian thực & bù đắp độ trễ (Latency Compensation)
            if (!window.MTKL_Firebase || !window.MTKL_Firebase.db) return;
            const db = window.MTKL_Firebase.db;
            
            // Hủy listener cũ nếu có
            if (this.unsubscribeQuestions) this.unsubscribeQuestions();
            if (this.unsubscribeMistakes) this.unsubscribeMistakes();
            
            this.unsubscribeQuestions = db.collection('questions').where('userId', '==', uid).onSnapshot(qSnapshot => {
                this.cache.uploadedQuestions = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sắp xếp mới nhất lên đầu
                this.cache.uploadedQuestions.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                this.syncLocalCache();
                if (['review-sets', 'manage-custom', 'upload'].includes(app.state.activePage)) app.handleRouting();
            }, e => console.warn('Lỗi đồng bộ Firebase (Questions):', e));

            this.unsubscribeMistakes = db.collection('mistakes').where('userId', '==', uid).onSnapshot(mSnapshot => {
                this.cache.mistakes = mSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                this.syncLocalCache();
                this.updateStatistics();
                if (['review-sets', 'manage-custom', 'upload'].includes(app.state.activePage)) app.handleRouting();
            }, e => console.warn('Lỗi đồng bộ Firebase (Mistakes):', e));

        } catch (error) {
            console.error("Error loading user data:", error);
            this.cache.initialized = true;
        }
    },

    // Get all custom uploaded questions (Từ Cache)
    getUploadedQuestions() {
        return this.cache.uploadedQuestions;
    },

    // Save custom uploaded question - AWAIT Firebase để đảm bảo lưu thật sự
    async saveQuestion(question) {
        if (!app.state.isLogged || !app.state.uid) {
            app.showToast("Lỗi: Bạn cần đăng nhập để lưu câu hỏi!", "error");
            return null;
        }

        try {
            const dataToSave = {
                ...question,
                userId: app.state.uid,
                createdAt: new Date().toISOString()
            };
            
            // Tạo ID thực ngay lập tức thông qua Firebase SDK (offline-first)
            const docRef = window.MTKL_Firebase.db.collection('questions').doc();
            const savedQuestion = { ...dataToSave, id: docRef.id };
            
            // Đẩy lên Firebase chạy ngầm (không await). onSnapshot sẽ tự động kích hoạt và cập nhật mảng cache.
            docRef.set(dataToSave).catch(err => console.warn('Lỗi Firebase:', err));
            
            window.dispatchEvent(new CustomEvent('questionSaved', { detail: savedQuestion }));
            
            console.log('✅ Câu hỏi đã xử lý xong:', docRef.id);
            return savedQuestion;
        } catch (error) {
            console.error("Lỗi xử lý câu hỏi:", error);
            app.showToast("Lỗi xử lý câu hỏi! " + error.message, "error");
            return null;
        }
    },

    // Update custom uploaded question
    async updateQuestion(id, updatedData) {
        if (!app.state.isLogged || !app.state.uid) return false;

        try {
            // Chạy ngầm, onSnapshot sẽ tự động lo cập nhật lại cache
            window.MTKL_Firebase.db.collection('questions').doc(id).update(updatedData)
                .catch(err => console.warn("Lỗi Firebase update:", err));
            return true;
        } catch (error) {
            console.error("Lỗi cập nhật câu hỏi:", error);
            app.showToast("Lỗi cập nhật câu hỏi!", "error");
            return false;
        }
    },

    // Delete a question
    async deleteQuestion(id) {
        if (!app.state.isLogged || !app.state.uid) return false;

        try {
            // Chạy ngầm, onSnapshot sẽ lo
            window.MTKL_Firebase.db.collection('questions').doc(id).delete()
                .catch(err => console.warn("Lỗi Firebase delete Q:", err));
            
            const mIdx = this.cache.mistakes.findIndex(m => m.questionId === id);
            if (mIdx !== -1) {
                const mDocId = this.cache.mistakes[mIdx].id;
                window.MTKL_Firebase.db.collection('mistakes').doc(mDocId).delete().catch(e => console.warn(e));
            }
            return true;
        } catch (error) {
            console.error("Lỗi xóa câu hỏi:", error);
            return false;
        }
    },

    // Get combined pool of questions (mock + uploaded)
    getAllQuestions() {
        return [...TIN_HOC_MOCK_QUESTIONS, ...this.getUploadedQuestions()];
    },

    // Get all user mistake records
    getMistakes() {
        return this.cache.mistakes;
    },

    // Save mistake record
    async addMistake(questionId, userAnswers, isResolved = false) {
        if (!app.state.isLogged || !app.state.uid) return;

        const existingIdx = this.cache.mistakes.findIndex(m => m.questionId === questionId);
        
        const recordData = {
            questionId,
            userAnswers, 
            isResolved,
            timestamp: new Date().toISOString(),
            userId: app.state.uid
        };

        try {
            if (existingIdx >= 0) {
                const docId = this.cache.mistakes[existingIdx].id;
                window.MTKL_Firebase.db.collection('mistakes').doc(docId).update(recordData)
                    .catch(err => console.warn("Error syncing mistake update:", err));
            } else {
                const docRef = window.MTKL_Firebase.db.collection('mistakes').doc();
                docRef.set(recordData).catch(err => console.warn("Error syncing mistake add:", err));
            }
        } catch (error) {
            console.error("Error saving mistake:", error);
        }
    },

    // Mark a mistake as resolved (mastered)
    async resolveMistake(questionId) {
        if (!app.state.isLogged || !app.state.uid) return false;

        const existingIdx = this.cache.mistakes.findIndex(m => m.questionId === questionId);
        if (existingIdx >= 0) {
            const docId = this.cache.mistakes[existingIdx].id;
            try {
                window.MTKL_Firebase.db.collection('mistakes').doc(docId).update({
                    isResolved: true,
                    resolvedAt: new Date().toISOString()
                }).catch(e => console.warn("Lỗi update resolved:", e));
                return true;
            } catch (error) {
                console.error("Error resolving mistake:", error);
                return false;
            }
        }
        return false;
    },

    getActiveMistakesCount() {
        const mistakes = this.getMistakes().filter(m => !m.isResolved);
        const questions = this.getAllQuestions();
        
        const counts = {};
        TIN_HOC_TOPICS.forEach(t => counts[t.id] = { total: 0, mcq: 0, tf: 0 });
        
        const processedQIds = new Set();
        
        mistakes.forEach(m => {
            if (!processedQIds.has(m.questionId)) {
                processedQIds.add(m.questionId);
                const q = questions.find(question => question.id === m.questionId);
                if (q && counts[q.topic] !== undefined) {
                    counts[q.topic].total++;
                    if (q.type === 'mcq') {
                        counts[q.topic].mcq++;
                    } else {
                        counts[q.topic].tf++;
                    }
                }
            }
        });
        
        return counts;
    },

    // Lần đầu vào web nếu muốn đổ mock data thì có thể chạy
    initMockDataIfFirstTime() {
        if (!localStorage.getItem('mtkl_initialized')) {
            localStorage.setItem('mtkl_streak', '3');
            localStorage.setItem('mtkl_initialized', 'true');
        }
    },

    // Lịch sử (Tạm lưu local cho tốc độ)
    getHistory() {
        const data = localStorage.getItem('mtkl_history');
        return data ? JSON.parse(data) : [];
    },

    addHistoryRecord(topic, type, scoreText, mistakesCount) {
        const history = this.getHistory();
        history.unshift({
            id: 'h_' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            topic,
            type,
            score: scoreText,
            mistakesCount
        });
        localStorage.setItem('mtkl_history', JSON.stringify(history.slice(0, 10)));
    },

    // Update Statistics
    updateStatistics() {
        const mistakes = this.getMistakes();
        const totalReviewed = mistakes.length;
        const resolved = mistakes.filter(m => m.isResolved).length;
        
        localStorage.setItem('mtkl_stat_reviewed', totalReviewed);
        localStorage.setItem('mtkl_stat_resolved', resolved);
        
        // Luôn đồng bộ dữ liệu vào LocalStorage để khi refresh không bị mất
        this.syncLocalCache();
    },

    // Reset toàn bộ dữ liệu của người dùng
    async resetAllUserData() {
        if (!app.state.isLogged || !app.state.uid) return;
        const uid = app.state.uid;
        
        try {
            const batch = window.MTKL_Firebase.db.batch();
            
            // Xóa câu hỏi
            const qSnap = await window.MTKL_Firebase.db.collection('questions').where('userId', '==', uid).get();
            qSnap.forEach(doc => batch.delete(doc.ref));
            
            // Xóa lỗi sai
            const mSnap = await window.MTKL_Firebase.db.collection('mistakes').where('userId', '==', uid).get();
            mSnap.forEach(doc => batch.delete(doc.ref));
            
            // Commit batch xóa
            await batch.commit();
            
            // Xóa local stats
            localStorage.removeItem('mtkl_stat_reviewed');
            localStorage.removeItem('mtkl_stat_resolved');
            localStorage.setItem('mtkl_streak', '0');
            
            this.cache.uploadedQuestions = [];
            this.cache.mistakes = [];
            this.syncLocalCache();
        } catch (error) {
            console.error("Lỗi khi xóa dữ liệu:", error);
        }
    }
};
