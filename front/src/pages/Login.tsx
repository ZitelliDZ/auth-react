import { useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../store/authStore';
import { toast } from 'react-toastify';


const Login = () => {

    const navigate = useNavigate()
    
    const [state, setState] = useState('Register')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const { register, login, getUser } = authStore()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const resp = await login(email, password)
        if (resp.success) {
            getUser()
            navigate('/')
            toast.success(resp.message)
        } else {
            toast.error(resp.message)
        }
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const resp = await register({email, password, name})
        if (resp.success) {
            navigate('/') 
            toast.success(resp.message)
        } else {
            toast.error(resp.message)
        }
    }

    const handleSubmit = state === 'Register' ? handleRegister : handleLogin

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-300 to-blue-500'>
        <img onClick={()=>navigate('/')} src={assets.logo} alt="Sign-Up" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
        <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm' >
            <h2 className='text-3xl font-semibold text-center text-white mb-3'>{state === 'Register' ? 'Registrarse' : 'Inicia sesión'}</h2>
            <p className='text-center text-sm mb-6'>{state === 'Register' ? 'Crea tu cuenta' : 'Ingresa a tu cuenta'}</p>

            <form onSubmit={handleSubmit}>
                {state === 'Register' && 
                    (<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.person_icon} alt="person-icon" />
                        <input type="text" placeholder='Nombre completo' required className='bg-transparent outline-none' onChange={(e) => setName(e.target.value)} value={name} />
                    </div>)
                }
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <img src={assets.mail_icon} alt="email-icon" />
                    <input type="email" placeholder='Email' required className='bg-transparent outline-none' onChange={(e) => setEmail(e.target.value)} value={email} />

                </div>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <img src={assets.lock_icon} alt="password-icon" />
                    <input type="password" placeholder='Contraseña' required className='bg-transparent outline-none' onChange={(e) => setPassword(e.target.value)} value={password} />

                </div>
                {state === 'Login' && 
                    (<p onClick={()=>navigate('/reset-password')}
                        className='mb-4 text-indigo-500 cursor-pointer'>Has olvidado tu contraseña?</p>)
                }
                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state === 'Register' ? 'Registrarse' : 'Iniciar sesión'}</button>
            </form>
            
            {state === 'Register' && (<p className='mt-4 flex w-full justify-center items-center gap-3'>Ya tienes una cuenta? <span onClick={() => setState('Login')} className='text-indigo-500 cursor-pointer'>Inicia sesión</span></p>) }
            {state === 'Login' && (<p className='mt-4 flex w-full justify-center items-center gap-3'>No tienes una cuenta? <span onClick={() => setState('Register')} className='text-indigo-500 cursor-pointer'>Regístrate</span></p>) }
        </div>
    </div>
  )
}

export default Login
