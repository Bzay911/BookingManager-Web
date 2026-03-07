import { Card, CardContent } from "../../components/ui/card";
import { Users } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="h-full min-h-[60vh] flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg border border-gray-100 shadow-sm rounded-3xl bg-white text-center py-16">
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-2 border border-gray-100 shadow-sm">
            {/* You can swap this icon out for Calendar, Settings, etc. */}
            <Users size={36} className="text-[#0be48d]" />
          </div>
          <h2 className="text-3xl font-extrabold text-black tracking-tight">
            Settings Page
          </h2>
          <p className="text-gray-500 text-base font-medium">
            I am the Settings page. I rendered perfectly inside the Layout Outlet! 🚀
          </p>
        </CardContent>
      </Card>
    </div>
  );
}