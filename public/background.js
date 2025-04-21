console.log('background.js 已加载');

// 监听扩展安装或更新事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('扩展已安装或更新');
});

// 监听来自内容脚本的请求
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background.js 收到消息:', request);
  
  if (request.type === 'fetch') {
    console.log('开始处理 fetch 请求');
    console.log('请求 URL:', request.url);
    
    fetch(request.url, {
      method: request.method || 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ...request.headers
      }
    })
      .then(response => {
        // 对于百度搜索建议，强制使用 GBK 编码
        if (request.url.includes('suggestion.baidu.com')) {
          return response.arrayBuffer().then(buffer => {
            // 使用 GBK 解码
            const decoder = new TextDecoder('gbk');
            return decoder.decode(buffer);
          });
        }
        
        // 对于其他请求，使用响应的字符集
        const contentType = response.headers.get('content-type');
        const charset = contentType?.match(/charset=([^;]+)/)?.[1] || 'utf-8';
        return response.arrayBuffer().then(buffer => {
          const decoder = new TextDecoder(charset);
          return decoder.decode(buffer);
        });
      })
      .then(text => {
        console.log('请求成功:', text);
        sendResponse({ data: text });
      })
      .catch(error => {
        console.error('请求失败:', error);
        sendResponse({ error: error.message });
      });
    
    return true; // 保持消息通道开放
  }
}); 