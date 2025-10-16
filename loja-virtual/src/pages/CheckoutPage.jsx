import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, CreditCard, Truck, MapPin, User, Mail, Phone, Lock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import useStore from '../store/useStore'
import { api } from '../config/api'

// Schema de validação
const checkoutSchema = z.object({
  // Dados pessoais
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  
  // Endereço
  zipCode: z.string().min(8, 'CEP deve ter 8 dígitos'),
  street: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  
  // Pagamento
  paymentMethod: z.enum(['credit', 'pix', 'boleto']),
  
  // Termos
  acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos')
})

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  const {
    cart,
    getCartTotal,
    getCartItemsCount,
    clearCart
  } = useStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'credit',
      acceptTerms: false
    }
  })

  const total = getCartTotal()
  const itemsCount = getCartItemsCount()
  const hasDiscount = total > 150
  const discountAmount = hasDiscount ? total * 0.05 : 0
  const shipping = total >= 99 ? 0 : 15.90
  const finalTotal = total - discountAmount + shipping

  // Redirecionar se carrinho vazio
  if (cart.length === 0) {
    navigate('/carrinho')
    return null
  }

  const onSubmit = async (data) => {
    setIsProcessing(true)
    
    try {
      // Preparar dados do pedido
      const orderData = {
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          cpf: data.cpf
        },
        address: {
          zipCode: data.zipCode,
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state
        },
        items: cart.map(item => ({
          sku: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        payment: {
          method: data.paymentMethod,
          amount: finalTotal
        },
        totals: {
          subtotal: total,
          discount: discountAmount,
          shipping: shipping,
          total: finalTotal
        }
      }

      // Enviar pedido para o backend
      const response = await api.createOrder(orderData)
      
      if (response.success) {
        // Limpar carrinho
        clearCart()
        
        // Mostrar toast de sucesso
        toast({
          title: "Pedido realizado com sucesso!",
          description: `Seu pedido ${response.pedido_id} foi processado e você receberá um email de confirmação.`,
        })
        
        // Redirecionar para página de sucesso
        navigate('/pedido-confirmado', { 
          state: { 
            orderId: response.pedido_id,
            orderData,
            trackingCode: response.codigo_rastreamento
          } 
        })
      } else {
        throw new Error(response.error || 'Erro ao processar pedido')
      }
      
    } catch (error) {
      console.error('Erro ao processar pedido:', error)
      toast({
        title: "Erro ao processar pedido",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleZipCodeBlur = async (e) => {
    const zipCode = e.target.value.replace(/\D/g, '')
    if (zipCode.length === 8) {
      try {
        const data = await api.getAddressByZipCode(zipCode)
        
        if (!data.erro) {
          setValue('street', data.logradouro)
          setValue('neighborhood', data.bairro)
          setValue('city', data.localidade)
          setValue('state', data.uf)
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }
  }

  const steps = [
    { id: 1, title: 'Dados Pessoais', icon: User },
    { id: 2, title: 'Endereço', icon: MapPin },
    { id: 3, title: 'Pagamento', icon: CreditCard }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Finalizar Compra</h1>
          <p className="text-muted-foreground">
            {itemsCount} {itemsCount === 1 ? 'item' : 'itens'} • R$ {finalTotal.toFixed(2)}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/carrinho')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Carrinho
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'border-muted-foreground text-muted-foreground'
            }`}>
              {currentStep > step.id ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Dados Pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Seu nome completo"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      {...register('cpf')}
                      placeholder="000.000.000-00"
                      maxLength={11}
                    />
                    {errors.cpf && (
                      <p className="text-sm text-red-600 mt-1">{errors.cpf.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="(11) 99999-9999"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Endereço de Entrega</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="zipCode">CEP *</Label>
                    <Input
                      id="zipCode"
                      {...register('zipCode')}
                      placeholder="00000-000"
                      maxLength={8}
                      onBlur={handleZipCodeBlur}
                    />
                    {errors.zipCode && (
                      <p className="text-sm text-red-600 mt-1">{errors.zipCode.message}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Endereço *</Label>
                    <Input
                      id="street"
                      {...register('street')}
                      placeholder="Rua, Avenida, etc."
                    />
                    {errors.street && (
                      <p className="text-sm text-red-600 mt-1">{errors.street.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="number">Número *</Label>
                    <Input
                      id="number"
                      {...register('number')}
                      placeholder="123"
                    />
                    {errors.number && (
                      <p className="text-sm text-red-600 mt-1">{errors.number.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      {...register('complement')}
                      placeholder="Apto, Bloco, etc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input
                      id="neighborhood"
                      {...register('neighborhood')}
                      placeholder="Seu bairro"
                    />
                    {errors.neighborhood && (
                      <p className="text-sm text-red-600 mt-1">{errors.neighborhood.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      placeholder="Sua cidade"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      {...register('state')}
                      placeholder="SP"
                      maxLength={2}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Forma de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Forma de Pagamento</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={watch('paymentMethod')}
                  onValueChange={(value) => setValue('paymentMethod', value)}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Cartão de Crédito</span>
                        </div>
                        <Badge variant="secondary">Aprovação imediata</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Visa, Mastercard, Elo - Parcelamento em até 12x
                      </p>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-600 rounded" />
                          <span>PIX</span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          5% desconto
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pagamento instantâneo - Desconto de 5%
                      </p>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="boleto" id="boleto" />
                    <Label htmlFor="boleto" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-blue-600 rounded" />
                          <span>Boleto Bancário</span>
                        </div>
                        <Badge variant="outline">Vencimento em 3 dias</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pagamento via boleto bancário
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Termos */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptTerms"
                    checked={watch('acceptTerms')}
                    onCheckedChange={(checked) => setValue('acceptTerms', checked)}
                  />
                  <Label htmlFor="acceptTerms" className="text-sm cursor-pointer">
                    Eu li e aceito os{' '}
                    <a href="#" className="text-primary hover:underline">
                      termos de uso
                    </a>{' '}
                    e{' '}
                    <a href="#" className="text-primary hover:underline">
                      política de privacidade
                    </a>
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-600 mt-2">{errors.acceptTerms.message}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={`https://via.placeholder.com/60x60/f3f4f6/6b7280?text=${encodeURIComponent(item.name.slice(0, 3))}`}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity}x R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  
                  {hasDiscount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto</span>
                      <span>-R$ {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">R$ {finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Finalizar Compra
                    </>
                  )}
                </Button>

                {/* Security Info */}
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Pagamento 100% seguro</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Dados protegidos por SSL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage
