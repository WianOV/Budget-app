import React, { useState } from 'react'
import styled from 'styled-components'

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`

const SelectButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.2s;
  color: #2c3e50;

  &:focus {
    outline: none;
    border-color: #2ecc71;
  }

  /* Chevron icon */
  &::after {
    content: '';
    width: 0.8em;
    height: 0.8em;
    border-right: 2px solid #2c3e50;
    border-bottom: 2px solid #2c3e50;
    transform: rotate(45deg) translateY(-25%);
  }
`

const OptionsOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const OptionsList = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 1rem;
  z-index: 2001;
  animation: slideUp 0.3s ease-out;
  max-height: ${props => props.isDateSelect ? '50vh' : '85vh'};
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  /* Safe area padding for iOS */
  padding-bottom: env(safe-area-inset-bottom, 1rem);

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  /* Improve scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  /* Add drag handle */
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
  }
`

const Title = styled.div`
  padding: 1rem 1rem 1rem;
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #7f8c8d;
  text-align: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 0.5rem;
`

const Option = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  background: none;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
  color: #2c3e50;

  &:hover {
    background-color: #f5f6fa;
  }

  &:active {
    background-color: #e8e9ed;
  }
`

function CustomSelect({ value, onChange, options, placeholder = "Select an option", label = "Select an option" }) {
  const [isOpen, setIsOpen] = useState(false)

  // Check if this is a date select by looking at the options format
  const isDateSelect = options.length === 31 && options.every(opt => 
    opt.label.toLowerCase().includes('day')
  )

  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
  }

  const selectedOption = options.find(opt => 
    typeof opt === 'object' ? opt.value === value : opt === value
  )

  const displayValue = selectedOption
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : placeholder

  return (
    <SelectContainer>
      <SelectButton type="button" onClick={() => setIsOpen(true)}>
        {displayValue}
      </SelectButton>
      
      <OptionsOverlay isOpen={isOpen} onClick={() => setIsOpen(false)}>
        <OptionsList isDateSelect={isDateSelect} onClick={e => e.stopPropagation()}>
          <Title>{label}</Title>
          {options.map((option, index) => (
            <Option
              key={index}
              onClick={() => handleSelect(typeof option === 'object' ? option.value : option)}
            >
              {typeof option === 'object' ? option.label : option}
            </Option>
          ))}
        </OptionsList>
      </OptionsOverlay>
    </SelectContainer>
  )
}

export default CustomSelect
