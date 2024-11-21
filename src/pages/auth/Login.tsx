import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wallet, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { IS_DEMO } from '../../utils/constants';
import { toast } from 'sonner';

const loginSchema = z.object({
  identifier: z.string()
    .email('E-mail inválido')
    .min(1, 'E-mail é obrigatório'),
  password: z.string()
    .min(1, 'A senha é obrigatória')
    .min(4, 'A senha deve ter pelo menos 4 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: IS_DEMO ? {
      identifier: 'wanderley@agilegestao.com',
      password: '4321',
    } : undefined,
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      await signIn(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error) {
        // Handle specific error messages
        if (error.message.includes('Credenciais')) {
          setError('identifier', { message: 'Credenciais inválidas' });
          setError('password', { message: 'Credenciais inválidas' });
          toast.error('E-mail ou senha incorretos');
        } else if (error.message.includes('conexão')) {
          toast.error('Erro de conexão. Verifique sua internet e tente novamente');
        } else if (error.message.includes('servidor')) {
          toast.error('O servidor está indisponível. Tente novamente mais tarde');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Erro ao realizar login. Por favor, tente novamente');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-3 rounded-full shadow-lg">
                <Wallet className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Agile Finance
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sua gestão financeira inteligente
            </p>
            {IS_DEMO && (
              <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/50 p-2 rounded">
                Modo demonstração - Use as credenciais pré-preenchidas
              </p>
            )}
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 rounded-md">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  E-mail
                </label>
                <input
                  {...register('identifier')}
                  id="identifier"
                  type="email"
                  autoComplete="email"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 transition-all duration-200"
                  placeholder="seu@email.com"
                />
                {errors.identifier && (
                  <p className="mt-1 text-sm text-red-600">{errors.identifier.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Senha
                </label>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 transition-all duration-200"
                  placeholder="Sua senha"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Entrar'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2426&q=80"
          alt="Financial management"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/50 to-blue-500/50 mix-blend-multiply" />
      </div>
    </div>
  );
}