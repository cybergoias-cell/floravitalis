import { Link } from 'react-router-dom'
import { ArrowRight, Star, Truck, Shield, Headphones, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useStore from '../store/useStore'
import BannerCarousel from '../components/BannerCarousel'

const HomePage = () => {
  const { products, addToCart } = useStore()
  
  // Produtos em destaque (primeiros 3)
  const featuredProducts = products.slice(0, 3)

  return (
    <div className="space-y-16">
      {/* Banner Carousel */}
      <BannerCarousel apiUrl="http://localhost:3000" />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Potencialize Seus
                <span className="block text-yellow-300">Resultados</span>
              </h1>
              <p className="text-xl text-primary-foreground/90">
                Os melhores suplementos para alcançar seus objetivos. 
                Qualidade garantida, entrega rápida e preços imbatíveis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/produtos">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Ver Produtos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  Ofertas do Dia
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold">🏆</div>
                  <h3 className="text-xl font-semibold">Melhor Loja 2024</h3>
                  <p className="text-primary-foreground/80">
                    Reconhecida pela qualidade e atendimento excepcional
                  </p>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Entrega Rápida</h3>
              <p className="text-sm text-muted-foreground">
                Receba em até 2 dias úteis em todo o Brasil
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Qualidade Garantida</h3>
              <p className="text-sm text-muted-foreground">
                Produtos testados e aprovados por especialistas
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Headphones className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Suporte 24/7</h3>
              <p className="text-sm text-muted-foreground">
                Atendimento especializado sempre disponível
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold">Melhor Preço</h3>
              <p className="text-sm text-muted-foreground">
                Preços competitivos e promoções exclusivas
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Selecionamos os melhores suplementos para você alcançar seus objetivos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={`https://via.placeholder.com/400x300/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-red-500">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
                {product.stock <= 5 && (
                  <Badge variant="destructive" className="absolute top-4 right-4">
                    Últimas unidades
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
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
                    ({product.reviews})
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link to={`/produto/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Ver Detalhes
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => addToCart(product)}
                      className="flex-1"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/produtos">
            <Button size="lg">
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-muted">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Fique por dentro das novidades</h2>
            <p className="text-muted-foreground">
              Receba ofertas exclusivas, dicas de treino e lançamentos em primeira mão
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-2 rounded-md border border-border bg-background"
              />
              <Button>Inscrever-se</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Não enviamos spam. Cancele quando quiser.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
