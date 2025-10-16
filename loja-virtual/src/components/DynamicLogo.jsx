import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

const DynamicLogo = ({ apiUrl }) => {
  const [logoConfig, setLogoConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarLogo = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/configuracoes-visuais`);
        if (response.ok) {
          const data = await response.json();
          setLogoConfig(data.configuracoes.logo);
        }
      } catch (error) {
        console.error('Erro ao carregar logo:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarLogo();
  }, [apiUrl]);

  if (loading) {
    return (
      <Link to="/" className="flex items-center space-x-2">
        <div className="bg-primary p-2 rounded-lg">
          <Dumbbell className="h-6 w-6 text-primary-foreground animate-pulse" />
        </div>
        <div>
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mt-1"></div>
        </div>
      </Link>
    );
  }

  // Fallback para logo padrão se não conseguir carregar
  if (!logoConfig) {
    return (
      <Link to="/" className="flex items-center space-x-2">
        <div className="bg-primary p-2 rounded-lg">
          <Dumbbell className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">SuplementsStore</h1>
          <p className="text-xs text-muted-foreground">Sua loja de suplementos</p>
        </div>
      </Link>
    );
  }

  return (
    <Link to="/" className="flex items-center space-x-2">
      <img
        src={`${apiUrl}${logoConfig.url}`}
        alt={logoConfig.alt}
        width={logoConfig.width}
        height={logoConfig.height}
        className="max-h-12 w-auto object-contain"
        onError={(e) => {
          // Fallback para logo padrão em caso de erro
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      {/* Fallback logo (oculto por padrão) */}
      <div className="hidden items-center space-x-2">
        <div className="bg-primary p-2 rounded-lg">
          <Dumbbell className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">SuplementsStore</h1>
          <p className="text-xs text-muted-foreground">Sua loja de suplementos</p>
        </div>
      </div>
    </Link>
  );
};

export default DynamicLogo;
