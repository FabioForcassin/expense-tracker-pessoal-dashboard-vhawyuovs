import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <div className="space-y-6 max-w-md">
        <h1 className="text-7xl font-bold tracking-tighter text-primary">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground">
            A página que você está procurando pode ter sido removida, renomeada ou está
            temporariamente indisponível.
          </p>
        </div>
        <Button asChild size="lg" className="mt-4">
          <Link to="/">Voltar ao Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
