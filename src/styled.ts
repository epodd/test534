import styled from 'styled-components'
import Dropdown from 'react-dropdown';

export const DropdownStyled = styled(Dropdown)`
  width: 250px;
`

export const Title = styled.p`
  text-align: center;
  font-weight: 700;
  font-family: Arial;
  font-size: 30px;
`

export const Box = styled.div`
  display: flex;
  margin-bottom: 24px;
  
  & > div:first-child {
    margin-right: 16px;
  }
`

export const Wrapper = styled.div`
 padding: 20px 20px;
 max-height: 300px;
`
