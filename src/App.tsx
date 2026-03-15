import { Landing } from './components/Landing'
import { LanguageProvider } from './i18n'

export default function App() {
  return (
    <LanguageProvider>
      <div className="noise-bg">
        <Landing />
      </div>
    </LanguageProvider>
  )
}
