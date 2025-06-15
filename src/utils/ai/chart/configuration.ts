
export function shouldShowScales(chartType: string): boolean {
  const noScalesTypes = ['pie', 'donut', 'funnel', 'card', 'gauge', 'multi-row-card', 'table'];
  return !noScalesTypes.includes(chartType);
}

export function formatValue(value: any): string {
  if (typeof value !== 'number') return String(value);
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else if (value % 1 === 0) {
    return value.toLocaleString();
  } else {
    return value.toFixed(1);
  }
}

export function truncateLabel(label: string, maxLength: number): string {
  if (!label || typeof label !== 'string') return 'N/A';
  return label.length > maxLength ? label.substring(0, maxLength - 3) + '...' : label;
}

export function createChartOptions(chartType: string, title: string, validatedColumns: string[]) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: !['card', 'gauge', 'table', 'multi-row-card'].includes(chartType),
        position: 'top',
        labels: {
          font: {
            size: 11,
            weight: 'normal'
          },
          padding: 15,
          usePointStyle: true,
          boxWidth: 10,
          generateLabels: (chart: any) => {
            const original = chart.data.datasets.map((dataset: any, i: number) => ({
              text: dataset.label || `Series ${i + 1}`,
              fillStyle: dataset.backgroundColor || dataset.borderColor,
              hidden: false,
              index: i
            }));
            return original;
          }
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 14,
          weight: 'bold'
        },
        color: '#1f2937',
        padding: {
          top: 15,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: any) => {
            return context[0]?.label || 'Data Point';
          },
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y ?? context.parsed;
            return `${label}: ${formatValue(value)}`;
          }
        }
      }
    },
    scales: shouldShowScales(chartType) ? {
      x: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.06)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 10
          },
          color: '#6b7280',
          maxRotation: 45,
          minRotation: 0,
          callback: function(value: any, index: number) {
            const label = this.getLabelForValue(value);
            return truncateLabel(label, 12);
          }
        },
        title: {
          display: validatedColumns.length > 0,
          text: validatedColumns[0] || '',
          font: {
            size: 11,
            weight: 'bold'
          },
          color: '#374151'
        }
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.06)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 10
          },
          color: '#6b7280',
          callback: function(value: any) {
            return formatValue(value);
          }
        },
        title: {
          display: validatedColumns.length > 1,
          text: validatedColumns[1] || '',
          font: {
            size: 11,
            weight: 'bold'
          },
          color: '#374151'
        }
      }
    } : undefined
  };
}
