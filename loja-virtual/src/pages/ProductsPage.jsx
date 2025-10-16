import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Filter, Grid, List, Star, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import useStore from '../store/useStore'

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  const {
    filters,
    setFilters,
    getFilteredProducts,
    addToCart
  } = useStore()

  const filteredProducts = getFilteredProducts()

  // Aplicar filtros da URL
  useEffect(() => {
    const category = searchParams.get('category')
    if (category && category !== filters.category) {
      setFilters({ category })
    }
  }, [searchParams, filters.category, setFilters])

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'proteinas', label: 'Proteínas' },
    { value: 'creatina', label: 'Creatina' },
    { value: 'aminoacidos', label: 'Aminoácidos' },
    { value: 'vitaminas', label: 'Vitaminas' },
    { value: 'queimadores', label: 'Queimadores' }
  ]

  const sortOptions = [
    { value: 'name', label: 'Nome A-Z' },
    { value: 'price-low', label: 'Menor Preço' },
    { value: 'price-high', label: 'Maior Preço' },
    { value: 'rating', label: 'Melhor Avaliado' }
  ]

  const handleCategoryChange = (category) => {
    setFilters({ category })
    if (category === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', category)
    }
    setSearchParams(searchParams)
  }

  const handlePriceRangeChange = (range) => {
    setFilters({ priceRange: range })
  }

  const handleSortChange = (sortBy) => {
    setFilters({ sortBy })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Filtros</h3>
            
            {/* Category Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={filters.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-6" />

            {/* Price Range Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Faixa de Preço</label>
              <div className="px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={200}
                  step={10}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>R$ {filters.priceRange[0]}</span>
                <span>R$ {filters.priceRange[1]}</span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Sort Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Ordenar por</label>
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        {/* Products Grid/List */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum produto encontrado</p>
              <Button onClick={() => setFilters({ category: 'all', priceRange: [0, 200] })}>
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                viewMode === 'grid' ? (
                  <ProductCard key={product.id} product={product} addToCart={addToCart} />
                ) : (
                  <ProductListItem key={product.id} product={product} addToCart={addToCart} />
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Product Card Component
const ProductCard = ({ product, addToCart }) => (
  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
    <div className="relative">
      <img
        src={`https://via.placeholder.com/400x300/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`}
        alt={product.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <Badge className="absolute top-3 left-3 bg-red-500">
        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
      </Badge>
      {product.stock <= 5 && (
        <Badge variant="destructive" className="absolute top-3 right-3">
          Últimas {product.stock}
        </Badge>
      )}
    </div>
    
    <CardContent className="p-4 space-y-3">
      <div>
        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          ({product.reviews})
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            R$ {product.originalPrice.toFixed(2)}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Link to={`/produto/${product.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Detalhes
            </Button>
          </Link>
          <Button 
            size="sm"
            onClick={() => addToCart(product)}
            className="flex-1"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Comprar
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
)

// Product List Item Component
const ProductListItem = ({ product, addToCart }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-32 h-32 flex-shrink-0">
          <img
            src={`https://via.placeholder.com/200x200/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            className="w-full h-full object-cover rounded"
          />
          <Badge className="absolute top-2 left-2 bg-red-500 text-xs">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </Badge>
        </div>
        
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews} avaliações)
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                R$ {product.originalPrice.toFixed(2)}
              </span>
              {product.stock <= 5 && (
                <Badge variant="destructive" className="text-xs">
                  Últimas {product.stock}
                </Badge>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Link to={`/produto/${product.id}`}>
                <Button variant="outline">
                  Ver Detalhes
                </Button>
              </Link>
              <Button onClick={() => addToCart(product)}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default ProductsPage
