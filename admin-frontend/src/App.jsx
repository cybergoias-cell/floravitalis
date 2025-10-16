import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Pedidos from './components/Pedidos'
import Estoque from './components/Estoque'
import Alertas from './components/Alertas'
import Relatorios from './components/Relatorios'
import Usuarios from './components/Usuarios'
import Produtos from './components/Produtos'
import Sessoes from './components/Sessoes'
import Personalizacao from './components/Personalizacao'
import LoginPage from './pages/LoginPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // URL da API do backend - ajustar conforme necessário
  const apiUrl = 'http://localhost:3000'

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('admin_token')
      const savedUser = localStorage.getItem('admin_user')

      if (savedToken && savedUser) {
        try {
          // Verificar se o token ainda é válido
          const response = await fetch(`${apiUrl}/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            setUser(JSON.parse(savedUser))
            setToken(savedToken)
            setIsAuthenticated(true)
          } else {
            // Token inválido, limpar dados
            localStorage.removeItem('admin_token')
            localStorage.removeItem('admin_user')
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error)
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [apiUrl])

  const handleLogin = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    setCurrentPage('dashboard')
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard apiUrl={apiUrl} token={token} />
      case 'pedidos':
        return <Pedidos apiUrl={apiUrl} token={token} />
      case 'estoque':
        return <Estoque apiUrl={apiUrl} token={token} />
      case 'alertas':
        return <Alertas apiUrl={apiUrl} token={token} />
      case 'relatorios':
        return <Relatorios apiUrl={apiUrl} token={token} />
      case 'usuarios':
        return <Usuarios apiUrl={apiUrl} token={token} />
      case 'produtos':
        return <Produtos apiUrl={apiUrl} token={token} />
      case 'sessoes':
        return <Sessoes apiUrl={apiUrl} token={token} />
      case 'personalizacao':
        return <Personalizacao apiUrl={apiUrl} token={token} />
      default:
        return <Dashboard apiUrl={apiUrl} token={token} />
    }
  }

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Mostrar página de login se não autenticado
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  // Mostrar painel admin se autenticado
  return (
    <Layout 
      currentPage={currentPage} 
      onPageChange={setCurrentPage}
      user={user}
      onLogout={handleLogout}
    >
      {renderCurrentPage()}
    </Layout>
  )
}

export default App
