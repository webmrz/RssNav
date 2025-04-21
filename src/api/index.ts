import { get } from '@/utils/request';
import { setStore } from '@/stores';

// 声明 Chrome 类型
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        id?: string;
        sendMessage?: (message: any, callback?: (response: any) => void) => void;
      }
    }
  }
}

// 定义搜索建议响应类型
interface BaiduSuggestion {
  s: string[];
  q: string;
}

interface BingSuggestion {
  AS: {
    Results: Array<{
      Suggests: Array<{
        Txt: string;
      }>;
    }>;
  };
}

type GoogleSuggestion = [string, string[]];

// 搜索建议重试配置
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 5000,
} as const;

// 延迟函数
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// 计算重试延迟时间
const getRetryDelay = (retryCount: number): number => {
  const delay = Math.min(
    RETRY_CONFIG.initialDelay * Math.pow(2, retryCount),
    RETRY_CONFIG.maxDelay
  );
  return delay;
};

// 检查是否在 Chrome 扩展环境中运行
const isChromeExtension = window.chrome?.runtime?.id !== undefined;

// 获取基础 URL
const getBaseUrl = (engine: string) => {
  if (isChromeExtension) {
    switch (engine) {
      case 'baidu':
        return 'https://suggestion.baidu.com';
      case 'bing':
        return 'https://api.bing.com';
      case 'google':
        return 'https://suggestqueries.google.com';
      default:
        return '';
    }
  }
  return `/api/${engine}`;
};

// 获取请求头
const getHeaders = (engine: string) => {
  if (isChromeExtension) {
    switch (engine) {
      case 'baidu':
        return {
          'Referer': 'https://www.baidu.com/',
          'Accept': 'application/json',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
        };
      case 'bing':
        return {
          'Referer': 'https://www.bing.com/',
          'Origin': 'https://www.bing.com',
          'Accept': 'application/json',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
        };
      case 'google':
        return {
          'Referer': 'https://www.google.com/',
          'Origin': 'https://www.google.com',
          'Accept': 'application/json',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
        };
      default:
        return {};
    }
  }
  return {};
};

// 处理百度响应
const handleBaiduResponse = (response: any) => {
  try {
    console.log('百度原始响应数据:', response);
    // 尝试直接解析 JSON
    if (typeof response === 'string') {
      const jsonMatch = response.match(/\{.*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const data = JSON.parse(jsonStr);
        return data.s || [];
      }
    }
    // 如果已经是对象，直接返回 s 字段
    if (response && response.s) {
      return response.s;
    }
    return [];
  } catch (error) {
    console.error('处理百度响应时出错:', error);
    return [];
  }
};

// 处理必应响应
const handleBingResponse = (response: any) => {
  try {
    console.log('必应原始响应数据:', response);
    if (typeof response === 'string') {
      const jsonMatch = response.match(/\{.*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const data = JSON.parse(jsonStr);
        return data.AS?.Results?.[0]?.Suggests?.map((item: any) => item.Txt) || [];
      }
    }
    return [];
  } catch (error) {
    console.error('处理必应响应时出错:', error);
    return [];
  }
};

// 处理谷歌响应
const handleGoogleResponse = (response: any) => {
  try {
    console.log('谷歌原始响应数据:', response);
    if (Array.isArray(response) && response.length > 1) {
      return response[1];
    }
    return [];
  } catch (error) {
    console.error('处理谷歌响应时出错:', error);
    return [];
  }
};

// 获取搜索建议
export const getSearchSuggestions = (keyword: string) => {
  const encodedKeyword = encodeURIComponent(keyword);
  const engine = localStorage.getItem("searchEngine") || "baidu";
  const baseUrl = getBaseUrl(engine);
  const headers = getHeaders(engine);

  let url = '';
  switch (engine) {
    case 'baidu':
      url = isChromeExtension 
        ? `https://suggestion.baidu.com/su?wd=${encodedKeyword}&json=1`
        : `${baseUrl}/su?wd=${encodedKeyword}&json=1`;
      break;
    case 'bing':
      url = isChromeExtension 
        ? `https://api.bing.com/qsonhs.aspx?type=cb&q=${encodedKeyword}`
        : `${baseUrl}/qsonhs.aspx?type=cb&q=${encodedKeyword}`;
      break;
    case 'google':
      url = isChromeExtension 
        ? `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodedKeyword}`
        : `${baseUrl}/complete/search?client=chrome&q=${encodedKeyword}`;
      break;
  }

  console.log('请求 URL:', url);
  console.log('当前环境:', isChromeExtension ? 'Chrome 扩展' : '普通环境');
  console.log('请求头:', headers);

  // 在 Chrome 扩展环境中使用 background.js 处理跨域请求
  if (isChromeExtension) {
    console.log('准备发送消息到 background.js');
    return new Promise((resolve) => {
      if (!window.chrome?.runtime?.sendMessage) {
        console.error('chrome.runtime.sendMessage 不存在');
        resolve([]);
        return;
      }

      console.log('调用 chrome.runtime.sendMessage');
      window.chrome.runtime.sendMessage(
        {
          type: 'fetch',
          url: url,
          headers: headers,
          method: 'GET'
        },
        (response: FetchResponse) => {
          console.log('收到 background.js 的响应:', response);
          if (!response) {
            console.error('未收到响应');
            resolve([]);
            return;
          }
          if (response.error) {
            console.error('请求失败:', response.error);
            resolve([]);
            return;
          }
          if (!response.data) {
            console.error('响应数据为空');
            resolve([]);
            return;
          }
          console.log('响应数据:', response.data);
          switch (engine) {
            case 'baidu':
              resolve(handleBaiduResponse(response.data));
              break;
            case 'bing':
              resolve(handleBingResponse(response.data));
              break;
            case 'google':
              resolve(handleGoogleResponse(response.data));
              break;
            default:
              resolve([]);
          }
        }
      );
    });
  }

  // 正常环境使用 axios
  return get(url, { headers }).then((response) => {
    switch (engine) {
      case 'baidu':
        return handleBaiduResponse(response);
      case 'bing':
        return handleBingResponse(response);
      case 'google':
        return handleGoogleResponse(response);
      default:
        return [];
    }
  });
};

// 定义接口类型
interface BingImageResponse {
  images: Array<{
    url: string;
    copyright: string;
  }>;
}

interface HitokotoResponse {
  hitokoto: string;
  from: string;
  from_who: string;
  creator: string;
  creator_uid: number;
  reviewer: number;
  uuid: string;
  created_at: string;
  length: number;
}

interface BilibiliResponse {
  code: number;
  data: {
    image_url: string;
    title: string;
  };
}

// 获取每日风景图片
export const getDailyLandscape = async (): Promise<string> => {
  try {
    // 使用必应每日图片 API
    const response = await get<BingImageResponse>('https://cn.bing.com/HPImageArchive.aspx', {
      params: {
        format: 'js',
        idx: 0,
        n: 1,
        mkt: 'zh-CN'
      }
    });
    return `https://cn.bing.com${response.data.images[0].url}`;
  } catch (error) {
    console.error('获取必应每日图片失败:', error);
    try {
      // 使用一言 API 的图片接口作为备用
      const response = await get<HitokotoResponse>('https://v1.hitokoto.cn/');
      return `https://api.ixiaowai.cn/api/api.php?type=json`;
    } catch (backupError) {
      console.error('获取一言图片失败:', backupError);
      return '/default-landscape.jpg';
    }
  }
};

// 获取每日动漫图片
export const getDailyAnime = async (): Promise<string> => {
  try {
    // 使用哔哩哔哩 API 获取随机动漫图片
    const response = await get<BilibiliResponse>('https://api.bilibili.com/x/web-interface/ranking/region', {
      params: {
        rid: 1, // 1 表示动画分区
        day: 3, // 3 表示三日排行
        type: 1, // 1 表示原创
        jsonp: 'jsonp'
      }
    });
    return response.data.image_url;
  } catch (error) {
    console.error('获取哔哩哔哩动漫图片失败:', error);
    try {
      // 使用樱花动漫 API 作为备用
      return 'https://api.yurikoto.com/api/random';
    } catch (backupError) {
      console.error('获取樱花动漫图片失败:', backupError);
      return '/default-anime.jpg';
    }
  }
}; 