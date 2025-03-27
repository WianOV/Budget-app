import styled from 'styled-components'

const SettingsContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 1.5rem;
  
  h1 {
    font-size: 1.5rem;
    color: #2c3e50;
  }
`

const SettingsCard = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
`

const SettingItem = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 1rem;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 0.85rem;
  }
`

const Toggle = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem 0;
`

const ToggleInput = styled.input`
  appearance: none;
  width: 51px;
  height: 31px;
  background: #ddd;
  border-radius: 31px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
  flex-shrink: 0;
  margin-left: 1rem;

  &:checked {
    background: #4CAF50;
  }

  &:before {
    content: '';
    position: absolute;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: 2px;
    transition: transform 0.3s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  &:checked:before {
    transform: translateX(20px);
  }

  &:active:before {
    transform: scale(0.9);
  }
`

function Settings() {
  return (
    <SettingsContainer>
      <Header>
        <h1>Settings</h1>
      </Header>

      <SettingsCard>
        <SettingItem>
          <Toggle>
            <div>
              <h3>Dark Mode</h3>
              <p>Enable dark mode for better viewing at night</p>
            </div>
            <ToggleInput type="checkbox" />
          </Toggle>
        </SettingItem>

        <SettingItem>
          <Toggle>
            <div>
              <h3>Notifications</h3>
              <p>Receive notifications for new transactions</p>
            </div>
            <ToggleInput type="checkbox" />
          </Toggle>
        </SettingItem>

        <SettingItem>
          <Toggle>
            <div>
              <h3>Monthly Reports</h3>
              <p>Get monthly spending reports via email</p>
            </div>
            <ToggleInput type="checkbox" />
          </Toggle>
        </SettingItem>
      </SettingsCard>
    </SettingsContainer>
  )
}

export default Settings
