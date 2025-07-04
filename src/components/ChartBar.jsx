import { BarChart } from '@mui/x-charts/BarChart';
import { RadarChart } from '@mui/x-charts/RadarChart';

const chartSetting = {
  height: 400,
};

export default function ChartBar({ type, dataset, width, yDataKey, sDataKey, barColor, sDataLabel, xAxisConfig, countMax }) {
  // 移除外層多餘的 div，直接回傳 BarChart 元件
  // 讓父元件 Home.jsx 來決定圖表的容器和佈局

  // 為 RadarChart 準備正確格式的資料
  const radarMetrics = dataset.map((item) => item.name);
  const radarCounts = dataset.map((item) => item.count);

  return (
    <>
      <div className='chartOuter'>
        <div className={`chart ${type}`}>
          <BarChart dataset={dataset} xAxis={xAxisConfig} yAxis={[{ width: width, scaleType: 'band', dataKey: yDataKey }]} series={[{ dataKey: sDataKey, label: sDataLabel, color: barColor }]} layout='horizontal' {...chartSetting} />
        </div>
        {/* 1. 只有當資料筆數大於等於 3 筆時，才渲染雷達圖 */}
        {dataset.length >= 3 && (
          <div className={`chart ${type}`}>
            <RadarChart
              height={300}
              divisions={5}
              stripeColor={null}
              series={[{ label: sDataLabel, data: radarCounts }]}
              radar={{
                labelGap: 10,
                max: countMax,
                metrics: radarMetrics,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
