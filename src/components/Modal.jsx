import React from 'react'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.2s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`

const Title = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: #2c3e50;
  text-align: center;
`

const Content = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
  color: #34495e;
  font-size: 1rem;
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }

  background: ${props => props.variant === 'danger' 
    ? '#ff4444' 
    : props.variant === 'secondary' 
      ? '#f5f6fa' 
      : '#2ecc71'};
  color: ${props => props.variant === 'secondary' ? '#2c3e50' : 'white'};

  &:hover {
    background: ${props => props.variant === 'danger' 
      ? '#cc0000' 
      : props.variant === 'secondary' 
        ? '#e8e9ed' 
        : '#27ae60'};
  }
`

function Modal({ isOpen, onClose, title, children, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, variant = 'danger' }) {
  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer>
        <Title>{title}</Title>
        <Content>{children}</Content>
        <ButtonContainer>
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  )
}

export default Modal
