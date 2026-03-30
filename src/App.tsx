import { AuthProvider } from "./hooks/useAuth"
import Index from "./pages/Index"

const App = () => (
  <AuthProvider>
    <Index />
  </AuthProvider>
)

export default App
