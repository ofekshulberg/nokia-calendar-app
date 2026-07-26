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
    overrideSilentMode,
    setOverrideSilentMode,
    showForegroundIndicator,
    setShowForegroundIndicator,
  } = useSettings()

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>

        {/* Theme */}
        <div className="settings-group">
          <label>Theme</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`theme-toggle ${isDarkMode ? '' : 'light'}`}
              onClick={toggleDarkMode}
            >
              ☀️ Light
            </button>
            <button
              className={`theme-toggle ${isDarkMode ? 'dark' : ''}`}
              onClick={toggleDarkMode}
            >
              🌙 Dark
            </button>
          </div>
        </div>

        {/* Vibration */}
        <div className="settings-group">
          <label>
            <input
              type="checkbox"
              checked={enableVibration}
              onChange={(e) => setEnableVibration(e.target.checked)}
            />
            Enable Vibration on Notifications
          </label>
        </div>

        {/* Ringtone */}
        <div className="settings-group">
          <label htmlFor="ringtone-select">Notification Ringtone</label>
          <select
            id="ringtone-select"
            value={ringtone}
            onChange={(e) => setRingtone(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="bell">Bell</option>
            <option value="chime">Chime</option>
          </select>
        </div>

        {/* Override Silent Mode */}
        <div className="settings-group">
          <label>
            <input
              type="checkbox"
              checked={overrideSilentMode}
              onChange={(e) => setOverrideSilentMode(e.target.checked)}
            />
            Override Silent Mode (play notifications even on silent)
          </label>
        </div>

        {/* Show Foreground Indicator */}
        <div className="settings-group">
          <label>
            <input
              type="checkbox"
              checked={showForegroundIndicator}
              onChange={(e) => setShowForegroundIndicator(e.target.checked)}
            />
            Show Running Indicator (small icon in status bar)
          </label>
        </div>

        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default SettingsModal
