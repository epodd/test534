import Papa from 'papaparse'

export const DEFAULT_FILTER = '--'

export const fetchFile = (path) => {
  return new Promise((resolve, reject) => {
    fetch(path)
      .then((response) => response.text())
      .then((text) => {
        Papa.parse(text, {
          header: true, // Учитывать заголовки CSV
          skipEmptyLines: true,
          complete: res => resolve(res.data),
          error: err => reject(err)
        });
      });
  })
}

export const getFormatDataToChart = (data) => {
  return data?.reduce((acc, [key, value]) => {
    acc.labels.push(key)
    acc.datasets[0].data.push(Number(value.total))
    return acc
  }, { labels: [], datasets: [{ data: [], backgroundColor: '#5f8aff' }] })
}

export const setFilterWithDefaultValue = (method, data) => {
  method([DEFAULT_FILTER, ...data])
}


export const excludeDefaultOption = (options, filter, name) => options.filter(el => !filter[name] ? el !== DEFAULT_FILTER : true)