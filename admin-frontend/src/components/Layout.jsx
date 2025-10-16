import { useState } from 'react'
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  BarChart3, 
  Menu,
  X,
  Home,
  Users,
  LogOut,
  User,
  Monitor,
  Box,
  Palette
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const Layout = ({ children, currentPage, onPageChange, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
    { id: 'estoque', label: 'Estoque', icon: Package },
    { id: 'produtos', label: 'Produtos', icon: Box },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'sessoes', label: 'Sessões', icon: Monitor },
    { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'personalizacao', label: 'Personalização', icon: Palette }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id)
                  setSidebarOpen(false)
                }}
                className={`
                  w-full flex items-center px-6 py-3 text-left transition-colors duration-200
                  ${currentPage === item.id 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b h-16 flex items-center px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{user.name || user.username}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sair do sistema"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </div>
            )}
            <div className="text-sm text-gray-500">
              Sistema de Automação de Entrega
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
