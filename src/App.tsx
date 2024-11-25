import { useEffect, useState } from 'react'
import moment from 'moment'
import 'react-dropdown/style.css';
import {
  DEFAULT_FILTER,
  excludeDefaultOption,
  fetchFile,
  getFormatDataToChart,
  setFilterWithDefaultValue
} from './helpers'
import { Wrapper, DropdownStyled, Title, Box } from './styled'
import { BarChart } from './Chart'

function App() {
  const [models, setModels] = useState([])
  const [types, setTypes] = useState([])
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filter, setFilter] = useState({})
  
  useEffect(() => {
    (async () => {
      try {
        const costsUrl = new URL('./assets/costs.csv', import.meta.url).href
        const usagesUrl = new URL('./assets/usages.csv', import.meta.url).href
  
        const costsRes = await fetchFile(costsUrl)
        const usagesRes = await fetchFile(usagesUrl)
  
        if (costsRes.length && usagesRes.length) {
          const types = {}
          const models = {}
    
          const costsFormatted = costsRes?.reduce((acc, cur) => {
            if (!models[cur.model]) models[cur.model] = 1
      
            acc[cur.model] = {input: cur.input, output: cur.output}
            return acc
          }, {})
    
    
          const usagesFormatted = usagesRes?.reduce((acc, el) => {
            const model = costsFormatted[el.model]
      
            if (!types[el.type]) types[el.type] = 1
      
            const total = (model.input * el.usage_input + model.output * el.usage_output)
      
            const [day, month, year] = el.created_at.split('.')
            const date = `${year}-${month}-${day}`
      
            if (acc[date]) {
              acc[date].total += total
              acc[date].model = el.model
              acc[date].type = el.type
            } else {
              acc[date] = {}
              acc[date].total = total
              acc[date].model = el.model
              acc[date].type = el.type
            }
      
            return acc
          }, {})
    
    
          const formData = Object.entries(usagesFormatted).sort((a,b) => {
            return moment(a[0]).valueOf() - moment(b[0]).valueOf()
          })
    
          setFilterWithDefaultValue(setTypes, Object.keys(types))
          setFilterWithDefaultValue(setModels, Object.keys(models))
    
          setData(formData)
        }
        
      } catch (e) {
        console.error(e)
      }
    })()
    
  }, [])
  
  
  useEffect(() => {
    const keys = Object.keys(filter).filter(el => el !== DEFAULT_FILTER)
    
    if (keys?.length) {
      let result = [...data]
      const filterNames = [...keys]
  
      while (filterNames.length) {
        const filterName = filterNames.shift()
        result = result.filter(([_, value]) => value[filterName] === filter[filterName].value)
      }
  
      setFilteredData(result)
    } else {
      setFilteredData(data)
    }
  }, [filter, data])
  
  
  const handleChangeFilter = (name) => (res) => {
    setFilter(prev => {
      const mut = {...prev}
      
      if (res.value === DEFAULT_FILTER) {
        delete mut[name]
      } else {
        mut[name] = res
      }
      
      return mut
    })
  }
  
  
  const typeOptions = excludeDefaultOption(types, filter, 'type')
  const modelOptions = excludeDefaultOption(models, filter, 'model')
  
  return (
    <Wrapper>
      <Title>Usages Chart</Title>
      <Box>
        <DropdownStyled options={typeOptions} onChange={handleChangeFilter('type')} value={filter['type']} placeholder="Select a type" />
        <DropdownStyled options={modelOptions} onChange={handleChangeFilter('model')} value={filter['model'] } placeholder="Select a model" />
      </Box>
      <BarChart chartData={getFormatDataToChart(filteredData)}/>
    </Wrapper>
  )
}

export default App
