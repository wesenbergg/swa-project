import { Ticket } from "lucide-react"

const GetTicketCTA = ({ event }: { event: any }) => {
  return (
    <>
      {/* Fixed Bottom CTA */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-4 z-50">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <div className="flex flex-col shrink-0">
            <span className="text-[9px] font-black uppercase tracking-widest">
              Admission
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black italic">
                ${event.paid && event.price ? event.price : "0"}
              </span>
              {!event.paid && (
                <span className="text-sm font-black uppercase bg-yellow-400 px-1 border border-black">
                  Free
                </span>
              )}
            </div>
          </div>
          <button className="flex-1 bg-yellow-400 neo-border-thick h-16 font-black text-2xl uppercase tracking-tighter neo-shadow-lg neo-button-active flex items-center justify-center gap-2">
            Get Ticket
            <Ticket className="w-6 h-6" strokeWidth={3} />
          </button>
        </div>
      </footer>
    </>
  )
}

export default GetTicketCTA
