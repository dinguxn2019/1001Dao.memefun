// 监听来自 localStorage 的数据
function checkAndFill() {
    const privateKey = localStorage.getItem('tempPrivateKey');
    if (privateKey) {
        // 查找输入框
        const inputs = Array.from(document.getElementsByTagName('input'));
        const input = inputs.find(input => 
            input.placeholder && 
            input.placeholder.includes('SOL')
        );
        
        if (input) {
            // 设置值
            input.value = privateKey;
            
            // 触发 React 的 change 事件
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
            
            // 查找登录按钮
            const buttons = Array.from(document.getElementsByTagName('button'));
            const loginButton = buttons.find(button => 
                button.textContent.includes('登录')
            );
            
            if (loginButton) {
                setTimeout(() => {
                    loginButton.click();
                }, 500);
            }
            
            // 清除存储的私钥
            localStorage.removeItem('tempPrivateKey');
        }
    }
}

// 每隔一段时间检查一次
setInterval(checkAndFill, 1000); 