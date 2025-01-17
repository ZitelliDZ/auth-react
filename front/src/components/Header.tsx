import { assets } from "../assets/assets"
import { authStore } from "../store/authStore"

const Header = () => {

    const { user } = authStore()

console.log('user', user);
  return (
    <div className="flex flex-col items-center px-4 mt-20 text-center " >
      {/* <img src={assets.header_img} alt="Header-icon"  className="mb-6 rounded-full w-36 h-36" /> */}
      <h1 className="flex items-center gap-2 mb-2 text-xl font-medium sm:text-3xl">Hola {user ? user.name : 'Desarrollador'} <img src={assets.hand_wave} alt="hand-icon" className="w-8 aspect-square" /></h1>
      <h2 className="mb-4 text-3xl font-semibold sm:text-5xl">Bienvenido a la app</h2>
      <p className="max-w-md mb-8">Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus nostrum a est autem! Quidem, neque vel molestiae magnam laboriosam, laudantium nemo quos rerum dolor, itaque officia ea incidunt alias. Porro.</p>
      <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-300 transition-all hover:border-gray-500">Comenzar</button>
    </div>
  )
}

export default Header
