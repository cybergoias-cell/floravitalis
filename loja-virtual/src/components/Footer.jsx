import { Link } from 'react-router-dom'
import { Dumbbell, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold">SuplementsStore</h3>
                <p className="text-sm text-gray-400">Sua loja de suplementos</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Os melhores suplementos para potencializar seus resultados. 
              Qualidade garantida e entrega rápida em todo o Brasil.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Produtos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/produtos?category=proteinas" className="text-gray-400 hover:text-white transition-colors">
                  Proteínas
                </Link>
              </li>
              <li>
                <Link to="/produtos?category=creatina" className="text-gray-400 hover:text-white transition-colors">
                  Creatina
                </Link>
              </li>
              <li>
                <Link to="/produtos?category=aminoacidos" className="text-gray-400 hover:text-white transition-colors">
                  Aminoácidos
                </Link>
              </li>
              <li>
                <Link to="/produtos?category=vitaminas" className="text-gray-400 hover:text-white transition-colors">
                  Vitaminas
                </Link>
              </li>
              <li>
                <Link to="/produtos?category=queimadores" className="text-gray-400 hover:text-white transition-colors">
                  Queimadores
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Atendimento</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Como Comprar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Política de Troca
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Rastrear Pedido
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Fale Conosco
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-gray-400">(11) 99999-9999</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-gray-400">contato@suplementsstore.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-gray-400">
                  Rua dos Suplementos, 123<br />
                  São Paulo - SP, 01234-567
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 SuplementsStore. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
