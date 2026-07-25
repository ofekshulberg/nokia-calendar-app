import '../styles/SettingsButton.css'

interface SettingsButtonProps {
  onClick: () => void
}

function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button className="settings-button" onClick={onClick} title="Settings">
      ⚙️
    </button>
  )
}

export default SettingsButton