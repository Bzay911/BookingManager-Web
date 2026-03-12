import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/Authcontext";

export default function BrowsePage() {
    const {  logout } = useAuth();
    return (
        <div>
            <h1>Browse Businesses</h1>
            {/* This page will list all businesses for customers to browse and join queues */}

               <button 
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" 
              onClick={logout}
              title="Log out"
            >
              <LogOut size={16} />
            </button>
        </div>
    )
}