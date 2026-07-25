import { useSettings } from '../context/SettingsContext'
import '../styles/SettingsModal.css'

interface SettingsModalProps {
  onClose: () => void
}

function SettingsModal({ onClose }: SettingsModalProps) {
  const {
    isDarkMode,
    toggleDarkMode,
    enableVibration,
    setEnableVibration,
    ringtone,
    setRingtone,
  } = useSettings()

  const ringtoneOptions = ['none', 'default', 'bell', 'chime', 'digital']

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>

        <div className="settings-group">
          <label>Theme</label>
          <button
            className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
            onClick={toggleDarkMode}
          >
            {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>

        <div className="settings-group">
          <label>
            <input
              type="checkbox"
              checked={enableVibration}
              onChange={(e) => setEnableVibration(e.target.checked)}
            />
            Enable Vibration
          </label>
        </div>

        <div className="settings-group">
          <label htmlFor="ringtone">Notification Sound</label>
          <select
            id="ringtone"
            value={ringtone}
            onChange={(e) => setRingtone(e.target.value)}
          >
            {ringtoneOptions.map((tone) => (
              <option key={tone} value={tone}>
                {tone.charAt(0).toUpperCase() + tone.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default SettingsModal