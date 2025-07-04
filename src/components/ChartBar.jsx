import { BarChart } from '@mui/x-charts/BarChart';
import { RadarChart } from '@mui/x-charts/RadarChart';

const chartSetting = {
  height: 400,
};

export default function ChartBar({ type, dataset, width, yDataKey, sDataKey, barColor, sDataLabel, xAxisConfig, countMax }) {
  // 移除外層多餘的 div，直接回傳 BarChart 元件
  // 讓父元件 Home.jsx 來決定圖表的容器和佈局

  // --- 為 RadarChart 準備資料 ---
  const MIN_RADAR_POINTS = 5;
  let radarDataset = [...dataset]; // 複製一份原始資料

  // 1. 當資料點在 1 到 4 之間時，補上空值到 5 個點
  if (radarDataset.length > 0 && radarDataset.length < MIN_RADAR_POINTS) {
    const placeholdersNeeded = MIN_RADAR_POINTS - radarDataset.length;
    for (let i = 0; i < placeholdersNeeded; i++) {
      // 補上空的佔位資料，count 使用 null 才不會在圖上畫出 0 的點
      radarDataset.push({ name: '', count: null });
    }
  }

  // 2. 根據處理過的 radarDataset 產生 RadarChart 需要的資料格式
  const radarMetrics = radarDataset.map((item) => ({ label: item.name }));
  const radarCounts = radarDataset.map((item) => item.count);

  return (
    <>
      <div className='chartOuter'>
        <div className={`chart ${type}`}>
          <BarChart dataset={dataset} xAxis={xAxisConfig} yAxis={[{ width: width, scaleType: 'band', dataKey: yDataKey }]} series={[{ dataKey: sDataKey, label: sDataLabel, color: barColor }]} layout='horizontal' {...chartSetting} />
        </div>
        <div className={`chart ${type}`}>
          <RadarChart
            height={300}
            divisions={5}
            stripeColor={null}
            series={[{ label: sDataLabel, data: radarCounts }]}
            radar={{
              // 3. 加上 labelFormatter 才能正確顯示軸標籤
              labelFormatter: (metric) => metric.label,
              labelGap: 15,
              max: countMax,
              metrics: radarMetrics,
            }}
          />
        </div>
      </div>
    </>
  );
}
