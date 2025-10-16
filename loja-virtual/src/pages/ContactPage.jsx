import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { api } from '../config/api'

const contactSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  assunto: z.string().min(1, 'Selecione um assunto'),
  mensagem: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres')
})

const ContactPage = () => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      const response = await api.sendContactMessage(data)
      
      if (response.success) {
        toast({
          title: "Mensagem enviada!",
          description: "Recebemos sua mensagem e responderemos em breve.",
        })
        reset()
      } else {
        throw new Error(response.error || 'Erro ao enviar mensagem')
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefone',
      content: '(11) 99999-9999',
      description: 'Segunda a Sexta, 8h às 18h'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contato@suplementsstore.com',
      description: 'Respondemos em até 24h'
    },
    {
      icon: MapPin,
      title: 'Endereço',
      content: 'Rua dos Suplementos, 123',
      description: 'São Paulo - SP, 01234-567'
    },
    {
      icon: Clock,
      title: 'Horário de Atendimento',
      content: 'Segunda a Sexta: 8h às 18h',
      description: 'Sábado: 8h às 14h'
    }
  ]

  const faqItems = [
    {
      question: 'Como posso rastrear meu pedido?',
      answer: 'Após a confirmação do pagamento, você receberá um código de rastreamento via WhatsApp e email.'
    },
    {
      question: 'Qual o prazo de entrega?',
      answer: 'O prazo varia de 2-5 dias úteis dependendo da região e modalidade de frete escolhida.'
    },
    {
      question: 'Posso trocar ou devolver um produto?',
      answer: 'Sim, aceitamos trocas e devoluções em até 30 dias, desde que o produto esteja lacrado.'
    },
    {
      question: 'Como funciona o frete grátis?',
      answer: 'Oferecemos frete grátis para compras acima de R$ 99,00 para todo o Brasil.'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo 
          ou envie uma mensagem diretamente pelo formulário.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Envie sua Mensagem</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      {...register('nome')}
                      placeholder="Seu nome completo"
                    />
                    {errors.nome && (
                      <p className="text-sm text-red-600 mt-1">{errors.nome.message}</p>
                    )}
                  </div>
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
                </div>

                <div>
                  <Label htmlFor="assunto">Assunto *</Label>
                  <Select onValueChange={(value) => setValue('assunto', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o assunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="duvida-produto">Dúvida sobre Produto</SelectItem>
                      <SelectItem value="pedido">Pedido</SelectItem>
                      <SelectItem value="entrega">Entrega</SelectItem>
                      <SelectItem value="pagamento">Pagamento</SelectItem>
                      <SelectItem value="troca-devolucao">Troca/Devolução</SelectItem>
                      <SelectItem value="sugestao">Sugestão</SelectItem>
                      <SelectItem value="reclamacao">Reclamação</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.assunto && (
                    <p className="text-sm text-red-600 mt-1">{errors.assunto.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="mensagem">Mensagem *</Label>
                  <Textarea
                    id="mensagem"
                    {...register('mensagem')}
                    placeholder="Descreva sua dúvida ou mensagem..."
                    rows={6}
                  />
                  {errors.mensagem && (
                    <p className="text-sm text-red-600 mt-1">{errors.mensagem.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
            <div className="grid grid-cols-1 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-primary font-medium">{info.content}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Siga-nos nas redes sociais para dicas, promoções e novidades!
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">
                  Instagram
                </Button>
                <Button variant="outline" size="sm">
                  Facebook
                </Button>
                <Button variant="outline" size="sm">
                  YouTube
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
          <p className="text-muted-foreground">
            Confira as respostas para as dúvidas mais comuns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqItems.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Nossa Localização</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Mapa interativo será carregado aqui
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Rua dos Suplementos, 123 - São Paulo, SP
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ContactPage
