import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { useEffect, useRef } from "react"
import { toast } from "react-toastify"
import { authStore } from "../store/authStore"



const EmailVerify = () => {

    const navigate = useNavigate()

    const inputRefs = useRef<(HTMLInputElement|null)[]>([])

    const { verifyEmail,status } = authStore()
    
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

    const onSubmitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const otp = inputRefs.current.map(input => input!.value).join('')
             
            const resp = await verifyEmail(otp)

            if(resp.success) {
                toast.success(resp.message)
                navigate('/')
            } else {
                toast.error(resp.message)
            }

        } catch (error) {
            console.log(error)
            toast.error('Error al verificar el email')
        }
    }

    useEffect(() => {
        if(status === 'unauthenticated') {
            navigate('/login')
        }
    }, [status, navigate])
    
  return (
    <div className='flex flex-col items-center justify-center min-h-screen  bg-gradient-to-br from-blue-300 to-blue-500'>
        <img onClick={()=>navigate('/')} src={assets.logo} alt="Sign-Up" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
        <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm" onSubmit={onSubmitHandle}>
            <h1 className="text-white text-2xl font-semibold text-center mb-4">Verificacion de email OTP</h1>
            <p className="text-center mb-6 text-indigo-300">Ingresa el codigo de verificacion que te enviamos a tu correo electronico</p>
            <div className="flex justify-between mb-8" onPaste={handlePaste}>
                {Array(6).fill(0).map((_, i) => (
                    <input key={i} type="text" className="w-12 h-12 text-center text-white bg-[#333A5C] rounded-lg outline-none" maxLength={1} required 
                    ref={(el) => inputRefs.current[i] = el}
                    onInput={(e) => handleInput(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    />
                ))}
            </div>
            <button className="w-full bg-indigo-500 rounded-full py-2 text-white hover:bg-indigo-600 transition-all">
                Verificar email</button>
        </form>
    </div>
  )
}

export default EmailVerify
