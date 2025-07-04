import ReaderInformation from '../components/ReaderInformation';
import ChartBar from '../components/ChartBar';
import '../scss/home.scss';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/zh-tw';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { zhTW } from '@mui/x-date-pickers/locales';
import Button from '@mui/material/Button';

import rawData from '../assets/date.json'; // 從 JSON 檔案匯入資料

// 這是我們的原始資料來源，模擬從資料庫或 API 取得的資料
// const rawData = [
//   {
//     date: 20250620,
//     book: [
//       {
//         name: '書名書名書名書名書名1',
//         type: 'a',
//         count: 15,
//       },
//       {
//         name: '書名書名書名書名書名2',
//         type: 'a',
//         count: 50,
//       },
//     ],
//   },
//   {
//     date: 20250630,
//     book: [
//       {
//         name: '書名書名書名書名書名1',
//         type: 'b',
//         count: 1,
//       },
//       {
//         name: '書名書名書名書名書名2',
//         type: 'a',
//         count: 10,
//       },
//       {
//         name: '書名書名書名書名書名2',
//         type: 'b',
//         count: 10,
//       },
//     ],
//   },
//   {
//     date: 20250702,
//     book: [
//       {
//         name: '書名書名書名書名書名1',
//         type: 'a',
//         count: 2,
//       },
//       {
//         name: '書名書名書名書名書名2',
//         type: 'b',
//         count: 10,
//       },
//     ],
//   },
//   {
//     date: 20250704,
//     book: [
//       {
//         name: '書名書名書名書名書名1',
//         type: 'a',
//         count: 4,
//       },
//       {
//         name: '書名書名書名書名書名2',
//         type: 'b',
//         count: 5,
//       },
//     ],
//   },
// ];

const Home = () => {
  // 1. 為兩種圖表分別建立 state，並加上載入狀態
  const [chartAData, setChartAData] = useState([]);
  const [chartBData, setChartBData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // 使用 useMemo 動態計算 xAxis 的設定，只有在 dataset 改變時才會重新計算
  const xAxisConfig = useMemo(() => {
    // 2. 為了讓兩張圖表比例一致，從兩份資料中共同找出最大值
    const allCounts = [...chartAData.map((item) => item.count), ...chartBData.map((item) => item.count)];
    const dataMax = Math.max(...allCounts, 0);

    // 當沒有資料時，提供一個預設的座標軸
    if (dataMax === 0) {
      return [{ max: 20, tickValues: [0, 5, 10, 15, 20], label: '閱讀次數' }];
    }
    // 2. 決定座標軸的最大值。至少為 20，並向上取到最接近的 10 的倍數
    const axisMax = Math.ceil(Math.max(20, dataMax) / 10) * 10;

    // 3. 動態產生刻度值 (例如，我們希望有 5 個區間)
    const tickIncrement = axisMax / 5;
    const tickValues = Array.from({ length: 6 }, (_, i) => i * tickIncrement);

    // 4. 回傳完整的設定物件
    return [
      {
        max: axisMax,
        tickValues: tickValues,
        label: '閱讀次數', // 為 X 軸加上標籤
      },
    ];
  }, [chartAData, chartBData]); // 依賴兩份圖表資料

  // 3. 將核心資料處理邏輯封裝在 useCallback 中，以便重用並優化效能
  const processData = useCallback((start, end) => {
    setIsLoading(true);

    // 使用 setTimeout 模擬非同步操作 (例如 API 請求)
    setTimeout(() => {
      // 步驟 1: 根據日期範圍篩選原始資料
      const startDateNum = start ? parseInt(start.format('YYYYMMDD'), 10) : null;
      const endDateNum = end ? parseInt(end.format('YYYYMMDD'), 10) : null;

      const filteredByDate = rawData.filter((entry) => {
        if (!startDateNum || !endDateNum) return true; // 如果沒有選擇日期，則處理所有資料
        return entry.date >= startDateNum && entry.date <= endDateNum;
      });

      // 步驟 2: 匯總每本書的閱讀次數
      const aggregated = {};
      filteredByDate.forEach((day) => {
        day.book.forEach((book) => {
          // 使用 name 和 type 作為複合鍵，確保不同類型的同一本書被分開計算
          const key = `${book.name}|${book.type}`;
          if (aggregated[key]) {
            aggregated[key].count += book.count;
          } else {
            aggregated[key] = { ...book }; // 複製 book 物件以避免修改原始資料
          }
        });
      });

      // 將匯總後的物件轉回陣列
      const aggregatedList = Object.values(aggregated);

      // 步驟 3: 過濾掉 count 為 0 的項目
      const nonZeroCountList = aggregatedList.filter((book) => book.count > 0);

      // 步驟 4: 根據 type 分類
      const dataForA = nonZeroCountList.filter((book) => book.type === '專業能力指標').slice(0, 9);
      const dataForB = nonZeroCountList.filter((book) => book.type === '共同職能指標').slice(0, 9);

      // 步驟 5: 更新 state
      setChartAData(dataForA);
      setChartBData(dataForB);
      setIsLoading(false);
    }, 500); // 模擬 0.5 秒延遲
  }, []); // 依賴項為空，因為此函式不依賴任何 props 或 state

  // 4. 使用 useEffect 在元件首次載入時，處理一次所有資料
  useEffect(() => {
    processData(null, null);
  }, [processData]);

  // 5. 查詢按鈕的事件處理函式現在只負責觸發資料處理
  const handleQuery = () => processData(startDate, endDate);

  return (
    <>
      <aside>
        <ReaderInformation />
        <div className='search'>
          <div className='infoTitle'>查詢設定</div>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='zh-tw' localeText={zhTW.components.MuiLocalizationProvider.defaultProps.localeText}>
            <ul>
              <li>
                <div className='title'>起始日期</div>
                <div className='content'>
                  <DatePicker
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    maxDate={endDate} // 限制：不能晚於結束日期
                  />
                </div>
              </li>
              <li>
                <div className='title'>結束日期</div>
                <div className='content'>
                  <DatePicker
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    minDate={startDate} // 限制：不能早於起始日期
                  />
                </div>
              </li>
            </ul>
          </LocalizationProvider>
        </div>

        <Button variant='contained' onClick={handleQuery} disabled={isLoading}>
          {isLoading ? '查詢中...' : '查詢'}
        </Button>
      </aside>
      {isLoading ? (
        <div className='loading-container'>圖表載入中...</div>
      ) : (
        <div className='chartBox'>
          <div className='container'>
            <ChartBar type='typeA' dataset={chartAData} width={100} yDataKey='name' sDataKey='count' sDataLabel='專業能力指標' barColor='#2ca02c' xAxisConfig={xAxisConfig} countMax={xAxisConfig[0].max} />
            <ChartBar type='typeB' dataset={chartBData} width={100} yDataKey='name' sDataKey='count' sDataLabel='共同職能指標' barColor='#1f77b4' xAxisConfig={xAxisConfig} countMax={xAxisConfig[0].max} />
          </div>
        </div>
      )}
    </>
  );
};
export default Home;
