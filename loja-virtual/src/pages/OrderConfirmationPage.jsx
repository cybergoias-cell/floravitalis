import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { CheckCircle, Package, Truck, Mail, Phone, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const OrderConfirmationPage = () => {
  const location = useLocation()
  const { orderId, orderData, trackingCode } = location.state || {}

  // Redirecionar se não há dados do pedido
  useEffect(() => {
    if (!orderId || !orderData) {
      // Redirecionar para home se não há dados
      window.location.href = '/'
    }
  }, [orderId, orderData])

  if (!orderId || !orderData) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-muted-foreground text-lg">
            Seu pedido foi processado com sucesso e você receberá um email de confirmação.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Detalhes do Pedido</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Número do Pedido:</span>
                  <span className="text-primary font-bold">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Data:</span>
                  <span>{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge className="bg-green-100 text-green-800">Confirmado</Badge>
                </div>
                {trackingCode && (
                  <div className="flex justify-between">
                    <span className="font-medium">Rastreamento:</span>
                    <span className="text-primary font-mono">{trackingCode}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Forma de Pagamento:</span>
                  <span className="capitalize">
                    {orderData.payment.method === 'credit' && 'Cartão de Crédito'}
                    {orderData.payment.method === 'pix' && 'PIX'}
                    {orderData.payment.method === 'boleto' && 'Boleto Bancário'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Informações de Entrega</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Entregar para:</p>
                  <p className="text-sm">{orderData.customer.name}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Endereço:</p>
                  <div className="text-sm space-y-1">
                    <p>{orderData.address.street}, {orderData.address.number}</p>
                    {orderData.address.complement && (
                      <p>{orderData.address.complement}</p>
                    )}
                    <p>{orderData.address.neighborhood}</p>
                    <p>{orderData.address.city} - {orderData.address.state}</p>
                    <p>CEP: {orderData.address.zipCode}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Prazo de Entrega:</p>
                  <p className="text-sm">
                    {orderData.totals.shipping === 0 ? '2-3 dias úteis' : '3-5 dias úteis'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Contato</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{orderData.customer.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{orderData.customer.phone}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={`https://via.placeholder.com/60x60/f3f4f6/6b7280?text=${encodeURIComponent(item.name.slice(0, 3))}`}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {item.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {item.quantity}x R$ {item.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Totals */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>R$ {orderData.totals.subtotal.toFixed(2)}</span>
                </div>
                
                {orderData.totals.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto:</span>
                    <span>-R$ {orderData.totals.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span>Frete:</span>
                  <span className={orderData.totals.shipping === 0 ? 'text-green-600' : ''}>
                    {orderData.totals.shipping === 0 ? 'Grátis' : `R$ ${orderData.totals.shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Pago:</span>
                  <span className="text-primary">R$ {orderData.totals.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Passos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Confirmação por Email</p>
                      <p className="text-sm text-muted-foreground">
                        Você receberá um email com todos os detalhes do pedido
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Processamento</p>
                      <p className="text-sm text-muted-foreground">
                        Seu pedido será processado e preparado para envio
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Envio e Rastreamento</p>
                      <p className="text-sm text-muted-foreground">
                        Você receberá o código de rastreamento por WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Link to="/produtos" className="block">
                <Button className="w-full">
                  <Package className="mr-2 h-4 w-4" />
                  Continuar Comprando
                </Button>
              </Link>
              
              <Link to="/" className="block">
                <Button variant="outline" className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <Card className="mt-12">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Precisa de Ajuda?</h3>
              <p className="text-muted-foreground">
                Nossa equipe está pronta para ajudar você com qualquer dúvida sobre seu pedido.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">contato@suplementsstore.com</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
