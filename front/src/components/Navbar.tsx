import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { authStore } from "../store/authStore";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout, sendVerificationEmail } = authStore();

  const handleLogout = async () => {
    const resp = await logout();
    if (resp.success) {
      toast.success(resp.message);
      navigate("/");
    } else {
      toast.error(resp.message);
    }
    
  }

  const handleVerifyEmail = async () => {
    const resp = await sendVerificationEmail();
    if (resp.success) {
      toast.success(resp.message);
      navigate("/email-verify");
    } else {
      toast.error(resp.message);
    }
  }




  return (
    <div className="absolute top-0 flex items-center justify-between w-full p-4 sm:p-6 sm:px-24">
      <img src={assets.logo} alt="logo" className="w-28 sm:w-32" />
      {
        user ? (
          <div className="relative flex items-center justify-center w-8 h-8 text-white rounded-full bg-neutral-800 group">
            {user.name[0].toUpperCase()}
            <div className="absolute top-0 right-0 z-10 hidden pt-10 text-black rounded group-hover:block">
              <ul className="p-2 m-0 text-sm list-none bg-gray-100">
                {!user.isAccountVerified && (
                  <li onClick={() => handleVerifyEmail()}
                    className="px-2 py-1 cursor-pointer hover:bg-gray-200 text-nowrap">Verificar email</li>
                )}
                
                <li onClick={handleLogout} 
                className="px-2 py-1 pr-10 cursor-pointer hover:bg-gray-200 " 
                >Salir</li>
              </ul>
            </div> 
          </div>
        )
      :(<button
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 px-6 py-2 transition-all border border-gray-500 rounded-full hover:border-gray-500 textgr hover:bg-gray-300"
      >
        Login <img src={assets.arrow_icon} alt="arrow-icon" />
      </button>)}
    </div>
  );
};

export default Navbar;
