import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import useStore from '../store/useStore'

const CartPage = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount
  } = useStore()

  const total = getCartTotal()
  const itemsCount = getCartItemsCount()
  const freeShippingThreshold = 99
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total)
  const hasDiscount = total > 150
  const discountAmount = hasDiscount ? total * 0.05 : 0
  const finalTotal = total - discountAmount

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground">
            Adicione alguns produtos incríveis ao seu carrinho e volte aqui para finalizar sua compra.
          </p>
          <Link to="/produtos">
            <Button size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
          <p className="text-muted-foreground">
            {itemsCount} {itemsCount === 1 ? 'item' : 'itens'} no seu carrinho
          </p>
        </div>
        <Link to="/produtos">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuar Comprando
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Shipping Progress */}
          {remainingForFreeShipping > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Faltam apenas R$ {remainingForFreeShipping.toFixed(2)} para o frete grátis!
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Discount Banner */}
          {hasDiscount && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-green-800">
                  🎉 Parabéns! Você ganhou 5% de desconto por comprar mais de R$ 150!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Cart Items List */}
          <div className="space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-24 flex-shrink-0">
                      <img
                        src={`https://via.placeholder.com/200x200/f3f4f6/6b7280?text=${encodeURIComponent(item.name)}`}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {item.brand}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              SKU: {item.id}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary">
                            R$ {item.price.toFixed(2)}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              R$ {item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-lg font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x R$ {item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Clear Cart */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar Carrinho
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Resumo do Pedido</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'itens'})</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>

                {hasDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto (5%)</span>
                    <span>-R$ {discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className={total >= freeShippingThreshold ? 'text-green-600' : ''}>
                    {total >= freeShippingThreshold ? 'Grátis' : 'R$ 15,90'}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    R$ {(finalTotal + (total >= freeShippingThreshold ? 0 : 15.90)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/checkout" className="block">
                  <Button size="lg" className="w-full">
                    Finalizar Compra
                  </Button>
                </Link>
                
                <Link to="/produtos" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    Continuar Comprando
                  </Button>
                </Link>
              </div>

              {/* Security Info */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Entrega garantida</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>7 dias para trocar</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CartPage
