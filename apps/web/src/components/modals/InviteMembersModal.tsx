import { SignalZero, X } from "lucide-react";
import { useState, type Dispatch, type KeyboardEvent, type SetStateAction } from "react";

type ModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>
}
export default function InviteMembersModal({ open, setOpen }: ModalProps) {
  const [input, setInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      event.preventDefault();
      const value = input.trim();

      if (!value) return;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isvalid = new RegExp()
      setEmails(prev => [...prev, value]);
      setInput("")
    }
  }

  function removeEmail(email: string) {
    setEmails((prev) => prev.filter(e => e !== email));
  }

  if (!open) {
    return null;
  }
  return (
    <div
      onClick={() => setOpen(false)}
      className="fixed inset-0 bg-black/50 z-50 backdrop-blur-md flex items-center justify-center w-full h-full p-4">
      <form
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col gap-2 p-4 bg-card rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Invite members</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}>
            <X className="hover:scale-110 transition-transform duration-150 cursor-pointer" size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 p-2 ">
          {
            emails.map((email) => (
              <span className="text-sm font-jetbrains flex items-center gap-1 rounded-2xl px-2 py-0.5 bg-gray-200">{email}
                <button
                  type="button"
                  onClick={() => removeEmail(email)}>
                  <X size={16} />
                </button>
              </span>
            ))
          }
          <input
            type="email"
            onKeyDown={handleKeyDown}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Separate emails with commas or spaces..."
            className="w-full border-2 border-border my-1 rounded-lg outline-none focus:ring ring-primary p-2 text-sm placeholder:text-xs placeholder:font-jetbrains placeholder:italic placeholder:text-gray-500 font-light "></input>
          <button className="bg-primary rounded-lg px-2 py-1 text-sm text-white w-full my-2 hover:opacity-80 cursor-pointer transition-opacity duration-150">Invite</button>
        </div>
      </form>
    </div>
  )
}
