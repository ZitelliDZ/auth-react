import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { useRef, useState } from "react"
import { toast } from "react-toastify"
import { authStore } from "../store/authStore"



const ResetPassword = () => {
    
        const navigate = useNavigate()

        const [email, setEmail] = useState('')
        const [newPassword, setNewPassword] = useState('')
        const [isEmailSend, setIsEmailSend] = useState('')
        const [otp, setOtp] = useState(0)
        const [isOtpSubmited, setIsOtpSubmited] = useState(false)


        //const onSubmitHandle = () => {}

        const inputRefs = useRef<(HTMLInputElement|null)[]>([])
    
        const { sendResetEmail, resetPassword } = authStore()
        
        const handleInput = (e: React.FormEvent<HTMLInputElement>, i: number) => {
            const target = e.target as HTMLInputElement
            if(target.value.length > 0 && i !== inputRefs.current.length - 1) {
                inputRefs.current[i + 1]?.focus()
            }
        }
   
        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
            const target = e.target as HTMLInputElement
            if(e.key === 'Backspace' && target.value === '' && i > 0) {
                inputRefs.current[i - 1]?.focus()
            }
        }
    
        const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault()
            const paste = e.clipboardData.getData('text')
            const pasteArray = paste.split('')
            pasteArray.forEach((char, i) => {
                if(inputRefs.current[i]) {
                    inputRefs.current[i]!.value = char
                }
            })
    
        }

        const onSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
         
                e.preventDefault()
                const resp = await sendResetEmail(email)
    
                if(resp.success) {
                    toast.success(resp.message)
                    setIsEmailSend('true')
                } else {
                    toast.error(resp.message)
                }  
            } 
    
        const onOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const otpArray = inputRefs.current.map((input) => input!.value).join('')
            try {
                setOtp(parseInt(otpArray))
            } catch (error) {
                console.log(error)
                toast.error('Invalid OTP')
                //limpiar otp
                inputRefs.current.forEach((input) => input!.value = '')
                return
            }
            setIsOtpSubmited(true)
        }

        const onSubmitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const stringOtp = otp.toString()
            const resp = await resetPassword(stringOtp, newPassword, email)
            if(resp.success) {
                toast.success(resp.message)
                navigate('/login')
            } else {
                toast.error(resp.message)
            }
        }
     
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-br from-blue-300 to-blue-500'>
        <img onClick={()=>navigate('/')} src={assets.logo} alt="Sign-Up" className='absolute cursor-pointer left-5 sm:left-20 top-5 w-28 sm:w-32' />
        {!isEmailSend && (
            <form className="p-8 text-sm rounded-lg shadow-lg bg-slate-900 w-96" onSubmit={onSendEmail}>
                <h1 className="mb-4 text-2xl font-semibold text-center text-white">Cambio de contraseña</h1>
                <p className="mb-6 text-center text-indigo-300">Ingrese el email asociado a su cuenta</p>
                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                    <img src={assets.mail_icon} alt="email-icon" />
                    <input type="email" placeholder='Email' required className='bg-transparent outline-none' onChange={(e) => setEmail(e.target.value)} value={email} />
                </div>
                <button className="w-full py-2 text-white transition-all bg-indigo-500 rounded-full hover:bg-indigo-600">
                    Enviar
                </button>
            </form>
        )}

        {!isOtpSubmited && isEmailSend && (
            <form className="p-8 text-sm rounded-lg shadow-lg bg-slate-900 w-96" onSubmit={onOtpSubmit}>
                <h1 className="mb-4 text-2xl font-semibold text-center text-white">Cambio de contraseña</h1>
                <p className="mb-6 text-center text-indigo-300">Ingresa el codigo de verificacion que te enviamos a tu correo electronico</p>
                <div className="flex justify-between mb-8" onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, i) => (
                        <input key={i} type="text" className="w-12 h-12 text-center text-white bg-[#333A5C] rounded-lg outline-none" maxLength={1} required 
                        ref={(el) => inputRefs.current[i] = el}
                        onInput={(e) => handleInput(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        />
                    ))}
                </div>
                <button className="w-full py-2 text-white transition-all bg-indigo-500 rounded-full hover:bg-indigo-600">
                    Verificar email</button>
            </form>
        )}
            
        {isOtpSubmited && isEmailSend && (
            <form className="p-8 text-sm rounded-lg shadow-lg bg-slate-900 w-96" onSubmit={onSubmitHandle}>
                <h1 className="mb-4 text-2xl font-semibold text-center text-white">Nueva contraseña</h1>
                <p className="mb-6 text-center text-indigo-300">Ingrese su nueva contraseña</p>
                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                    <img src={assets.lock_icon} alt="password-icon" />
                    <input type="password" placeholder='Contraseña' required className='bg-transparent outline-none' onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
                </div>
                <button className="w-full py-2 text-white transition-all bg-indigo-500 rounded-full hover:bg-indigo-600">
                    Enviar
                </button>
            </form>
        )}
            

        
    </div>
  )
}

export default ResetPassword
