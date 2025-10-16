import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Menu, X, Dumbbell, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import useStore from '../store/useStore'
import AuthPage from '../pages/AuthPage'
import DynamicLogo from './DynamicLogo'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const navigate = useNavigate()
  
  const { 
    cart, 
    searchQuery, 
    setSearchQuery, 
    getCartItemsCount,
    user,
    isAuthenticated,
    logout
  } = useStore()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate('/produtos')
    }
  }

  const cartItemsCount = getCartItemsCount()

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <DynamicLogo apiUrl="http://localhost:3000" />

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* User Authentication */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Olá, {user?.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="hidden md:flex"
              >
                <User className="h-4 w-4 mr-1" />
                Entrar
              </Button>
            )}

            {/* Cart */}
            <Link to="/carrinho">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
                <span className="hidden sm:inline ml-2">Carrinho</span>
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8 py-3 border-t">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Início
          </Link>
          <Link to="/produtos" className="text-sm font-medium hover:text-primary transition-colors">
            Todos os Produtos
          </Link>
          <Link to="/produtos?category=proteinas" className="text-sm font-medium hover:text-primary transition-colors">
            Proteínas
          </Link>
          <Link to="/produtos?category=creatina" className="text-sm font-medium hover:text-primary transition-colors">
            Creatina
          </Link>
          <Link to="/produtos?category=aminoacidos" className="text-sm font-medium hover:text-primary transition-colors">
            Aminoácidos
          </Link>
          <Link to="/produtos?category=vitaminas" className="text-sm font-medium hover:text-primary transition-colors">
            Vitaminas
          </Link>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/produtos" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Todos os Produtos
              </Link>
              <Link 
                to="/produtos?category=proteinas" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Proteínas
              </Link>
              <Link 
                to="/produtos?category=creatina" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Creatina
              </Link>
              <Link 
                to="/produtos?category=aminoacidos" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Aminoácidos
              </Link>
              <Link 
                to="/produtos?category=vitaminas" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Vitaminas
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthPage onClose={() => setShowAuthModal(false)} />
      )}
    </header>
  )
}

export default Header
