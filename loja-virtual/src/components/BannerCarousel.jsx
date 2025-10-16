import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerCarousel = ({ apiUrl }) => {
  const [configuracoes, setConfiguracoes] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Carregar configurações visuais
  useEffect(() => {
    const carregarConfiguracoes = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/configuracoes-visuais`);
        if (response.ok) {
          const data = await response.json();
          setConfiguracoes(data.configuracoes);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarConfiguracoes();
  }, [apiUrl]);

  // Auto-play do carrossel
  useEffect(() => {
    if (!configuracoes?.banners?.enabled || !configuracoes?.banners?.autoplay) return;
    
    const bannersAtivos = configuracoes.banners.items.filter(banner => banner.active);
    if (bannersAtivos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannersAtivos.length);
    }, configuracoes.banners.interval || 5000);

    return () => clearInterval(interval);
  }, [configuracoes]);

  // Navegação manual
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    const bannersAtivos = configuracoes.banners.items.filter(banner => banner.active);
    setCurrentSlide(prev => (prev + 1) % bannersAtivos.length);
  };

  const prevSlide = () => {
    const bannersAtivos = configuracoes.banners.items.filter(banner => banner.active);
    setCurrentSlide(prev => (prev - 1 + bannersAtivos.length) % bannersAtivos.length);
  };

  // Não renderizar se carregando ou carrossel desabilitado
  if (loading || !configuracoes?.banners?.enabled) {
    return null;
  }

  const bannersAtivos = configuracoes.banners.items.filter(banner => banner.active);
  
  // Não renderizar se não há banners ativos
  if (bannersAtivos.length === 0) {
    return null;
  }

  const currentBanner = bannersAtivos[currentSlide];

  return (
    <div className="relative w-full h-64 md:h-96 lg:h-[400px] overflow-hidden rounded-lg shadow-lg mb-8">
      {/* Banner atual */}
      <div className="relative w-full h-full">
        <img
          src={`${apiUrl}${currentBanner.url}`}
          alt={currentBanner.alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/1200/400?text=Banner';
          }}
        />
        
        {/* Overlay com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        
        {/* Conteúdo do banner */}
        {(currentBanner.title || currentBanner.subtitle) && (
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-lg">
                {currentBanner.title && (
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                    {currentBanner.title}
                  </h2>
                )}
                {currentBanner.subtitle && (
                  <p className="text-lg md:text-xl text-white/90 mb-4 drop-shadow-lg">
                    {currentBanner.subtitle}
                  </p>
                )}
                {currentBanner.link && (
                  <a
                    href={currentBanner.link}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
                  >
                    Saiba Mais
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Setas de navegação (apenas se houver mais de 1 banner) */}
      {bannersAtivos.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
            aria-label="Próximo banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicadores (apenas se houver mais de 1 banner) */}
      {bannersAtivos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannersAtivos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentSlide 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir para banner ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Contador de slides */}
      {bannersAtivos.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/30 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {currentSlide + 1} / {bannersAtivos.length}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
