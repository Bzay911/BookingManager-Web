import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, Clock, MoreHorizontal, CheckCircle2 } from "lucide-react";

// Fake data to populate our queue list
const fakeQueue = [
  { id: 1, name: "Michael Chen", service: "Standard Cut", waitTime: "12 mins", status: "Next up" },
  { id: 2, name: "Sarah Jenkins", service: "Consultation", waitTime: "25 mins", status: "Waiting" },
  { id: 3, name: "David Miller", service: "Haircut & Beard", waitTime: "35 mins", status: "Waiting" },
  { id: 4, name: "Emma Thompson", service: "Styling", waitTime: "45 mins", status: "Waiting" },
];

export default function QueuePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Top Header / Stats Card */}
      <Card className="border border-gray-100 shadow-sm rounded-3xl bg-white overflow-hidden relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0be48d] opacity-[0.05] blur-[80px] rounded-full pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <CardContent className="flex flex-col md:flex-row items-center justify-between p-10 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-[#0be48d]/10 rounded-2xl flex items-center justify-center border border-[#0be48d]/20 shadow-sm">
              <Users size={36} className="text-[#0be48d]" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-black tracking-tight mb-1">
                Live Queue
              </h2>
              <p className="text-gray-500 font-medium">
                Manage your currently waiting customers
              </p>
            </div>
          </div>

          {/* THE BIG GREEN NUMBER */}
          <div className="text-center md:text-right flex flex-col items-center md:items-end">
            <span className="text-7xl font-black text-[#0be48d] leading-none tracking-tighter drop-shadow-sm">
              {fakeQueue.length}
            </span>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">
              People Waiting
            </span>
          </div>
        </CardContent>
      </Card>

      {/* The Queue List */}
      <Card className="border border-gray-100 shadow-sm rounded-3xl bg-white">
        <CardHeader className="border-b border-gray-50 px-8 py-6 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-black">Up Next</CardTitle>
          <button className="text-sm font-bold text-white bg-black hover:bg-gray-800 px-5 py-2.5 rounded-full transition-colors">
            + Add to Queue
          </button>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {fakeQueue.map((person, index) => (
              <div key={person.id} className="flex items-center justify-between px-8 py-5 hover:bg-gray-50/50 transition-colors group">
                
                {/* Left side: Avatar and Name */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border ${
                    index === 0 
                      ? "bg-[#0be48d]/10 text-[#0be48d] border-[#0be48d]/20" 
                      : "bg-gray-50 text-gray-500 border-gray-100"
                  }`}>
                    {person.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-base font-bold text-black">{person.name}</p>
                    <p className="text-sm text-gray-500 font-medium">{person.service}</p>
                  </div>
                </div>

                {/* Right side: Status and Actions */}
                <div className="flex items-center gap-8">
                  <div className="hidden md:flex flex-col items-end">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full mb-1 ${
                      index === 0 
                        ? "bg-[#0be48d] text-black shadow-sm" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {person.status}
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                      <Clock size={12} />
                      Waiting {person.waitTime}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <button className="w-10 h-10 rounded-full bg-[#0be48d]/10 text-[#0be48d] hover:bg-[#0be48d] hover:text-black flex items-center justify-center transition-all title='Mark Complete'">
                        <CheckCircle2 size={20} />
                      </button>
                    )}
                    <button className="w-10 h-10 rounded-full text-gray-400 hover:bg-gray-100 hover:text-black flex items-center justify-center transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}