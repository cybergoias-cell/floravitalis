import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, Plus, Minus, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useStore from '../store/useStore'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  
  const { products, addToCart } = useStore()
  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
        <Link to="/produtos">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Produtos
          </Button>
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    // Aqui você pode adicionar um toast de confirmação
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // Imagens do produto (simuladas)
  const productImages = [
    `https://via.placeholder.com/600x600/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`,
    `https://via.placeholder.com/600x600/e5e7eb/6b7280?text=Verso`,
    `https://via.placeholder.com/600x600/f9fafb/6b7280?text=Lateral`,
    `https://via.placeholder.com/600x600/f3f4f6/6b7280?text=Detalhes`
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary">Início</Link>
        <span>/</span>
        <Link to="/produtos" className="hover:text-primary">Produtos</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-4 left-4 bg-red-500">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Badge>
            {product.stock <= 5 && (
              <Badge variant="destructive" className="absolute top-4 right-4">
                Últimas {product.stock} unidades
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-border'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary">{product.brand}</Badge>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {product.rating} ({product.reviews} avaliações)
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </span>
              <span className="text-lg text-muted-foreground line-through">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-green-600 font-medium">
              Economia de R$ {(product.originalPrice - product.price).toFixed(2)}
            </p>
          </div>

          {/* Description */}
          <div>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3">Características:</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Quantidade:</label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  ({product.stock} disponíveis)
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Adicionar ao Carrinho
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="mr-2 h-4 w-4" />
                Favoritar
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </div>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Frete Grátis</p>
                  <p className="text-sm text-muted-foreground">Para compras acima de R$ 99</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Compra Garantida</p>
                  <p className="text-sm text-muted-foreground">Produto original e lacrado</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Troca Fácil</p>
                  <p className="text-sm text-muted-foreground">7 dias para trocar</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="nutrition">Informações Nutricionais</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Descrição Detalhada</h3>
                <div className="prose max-w-none">
                  <p className="mb-4">{product.description}</p>
                  <p className="mb-4">
                    Este produto foi desenvolvido com os mais altos padrões de qualidade, 
                    utilizando ingredientes premium para garantir máxima eficácia e segurança.
                  </p>
                  <h4 className="text-lg font-semibold mb-2">Modo de Uso:</h4>
                  <p className="mb-4">
                    Misture uma dose (conforme tabela nutricional) em 200ml de água ou 
                    bebida de sua preferência. Consuma conforme orientação de um profissional.
                  </p>
                  <h4 className="text-lg font-semibold mb-2">Advertências:</h4>
                  <p>
                    Este produto não deve ser consumido por crianças, gestantes, idosos e 
                    portadores de enfermidades. Consulte sempre um médico ou nutricionista.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nutrition" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Informações Nutricionais</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left">Nutriente</th>
                        <th className="border border-border p-3 text-left">Por Porção ({product.nutritionalInfo.serving})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(product.nutritionalInfo).map(([key, value]) => {
                        if (key === 'serving') return null
                        const labels = {
                          protein: 'Proteínas',
                          carbs: 'Carboidratos',
                          fat: 'Gorduras',
                          calories: 'Calorias',
                          creatine: 'Creatina',
                          leucine: 'Leucina',
                          isoleucine: 'Isoleucina',
                          valine: 'Valina'
                        }
                        return (
                          <tr key={key}>
                            <td className="border border-border p-3">{labels[key] || key}</td>
                            <td className="border border-border p-3 font-medium">{value}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Avaliações dos Clientes ({product.reviews})
                </h3>
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{product.rating}</div>
                      <div className="flex items-center justify-center">
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
                      <div className="text-sm text-muted-foreground">
                        {product.reviews} avaliações
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Sample Reviews */}
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="font-medium">Carlos M.</span>
                        <span className="text-sm text-muted-foreground">há 2 dias</span>
                      </div>
                      <p className="text-sm">
                        Excelente produto! Notei resultados já na primeira semana. 
                        Recomendo para quem busca qualidade.
                      </p>
                    </div>

                    <div className="border-b pb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <span className="font-medium">Ana S.</span>
                        <span className="text-sm text-muted-foreground">há 1 semana</span>
                      </div>
                      <p className="text-sm">
                        Produto de boa qualidade, entrega rápida. O sabor poderia ser melhor, 
                        mas cumpre o que promete.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ProductDetailPage
