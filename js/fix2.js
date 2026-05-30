                    window.location.hash = '#review-sets';
                }, 1200);
            } else {
                // Lưu thất bại - cho phép thử lại
                submitBtn.disabled = false;
                submitBtn.innerText = '💾 Lưu câu hỏi sai';
            }
        });
    },
