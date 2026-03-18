import { X } from "lucide-react";
import {
	useState,
	type ClipboardEvent,
	type Dispatch,
	type KeyboardEvent,
	type SetStateAction,
	type SyntheticEvent,
} from "react";
import useSendWsInvite from "../../features/invites/hooks/useSendWsInvite";
import { useParams } from "react-router";

type ModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>
}
export default function InviteMembersModal({ open, setOpen }: ModalProps) {
  const [input, setInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const MAX_INVITES = 20;
  const { workspaceId } = useParams();
	const { mutate: sendInvite, isPending: isSendingInvite } = useSendWsInvite();

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      event.preventDefault();
      if (emails.length >= MAX_INVITES) return;

      const value = input.trim().toLowerCase();
      if (!value) return;

      if (!(emailRegex.test(value))) return;
      setEmails(prev => {
        if (prev.includes(value)) return prev;
        return [...prev, value]
      });
      setInput("")
    }
  }

  function handlePasteEmails(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pasted = event.clipboardData.getData("text");
    const candidates = pasted
      .split(/[,\s]+/)
      .map(e => e.trim())
      .filter(Boolean);

    const validEmails = candidates
      .filter(email => emailRegex.test(email));

    setEmails((prev) => {
      const remaining = MAX_INVITES - prev.length;
      if (remaining <= 0) return prev;

      const unique = validEmails
        .filter(email => !prev.includes(email))
        .slice(0, remaining);

      return [...prev, ...unique];
    })
  }

  function removeEmail(email: string) {
    setEmails((prev) => prev.filter(e => e !== email));
  }

  function handleWsInvite(event: SyntheticEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!workspaceId) return;
		sendInvite(
			{ workspaceId, emails },
			{
				onSuccess: () => {
					setInput("");
					setEmails([]);
					setOpen(false);
				},
			},
		);
	}

  if (!open) {
    return null;
  }
  return (
		<div
			onClick={() => setOpen(false)}
			className="fixed inset-0 bg-black/50 z-50 backdrop-blur-md flex items-center justify-center w-full h-full p-4">
			<form
				onSubmit={handleWsInvite}
				onClick={(e) => e.stopPropagation()}
				className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col gap-2 p-4 bg-card rounded-xl shadow-[0_-6px_12px_-6px_rgba(255,255,255,0.25)]">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Invite members</h2>
					<button
						type="button"
						aria-label="close form"
						onClick={() => setOpen(false)}>
						<X
							className="hover:scale-110 transition-transform duration-150 cursor-pointer"
							size={20}
						/>
					</button>
				</div>
				<p className="text-xs text-muted italic">
					{emails.length}/{MAX_INVITES} invites
				</p>
				<div className="flex flex-wrap gap-2 p-2 max-h-60 overflow-y-auto ">
					{emails.map((email) => (
						<span
							key={email}
							className="text-xs sm:text-sm font-jetbrains flex items-center gap-1 rounded-2xl px-2 py-0.5 bg-gray-200 max-w-full">
							<span className="truncate wrap-break-word max-w-35 sm:max-w-50">
								{email}
							</span>
							<button
								type="button"
								aria-label="remove email"
								className="shrink-0 cursor-pointer"
								onClick={() => removeEmail(email)}>
								<X size={16} />
							</button>
						</span>
					))}
					<input
						type="email"
						disabled={emails.length >= MAX_INVITES}
						onKeyDown={handleKeyDown}
						onPaste={handlePasteEmails}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Separate emails with commas or spaces..."
						className="flex-1 min-w-full w-full border-2 border-border my-1 rounded-lg outline-none focus:ring ring-primary p-2 text-sm placeholder:text-xs placeholder:font-jetbrains placeholder:italic placeholder:text-gray-500 font-light "></input>
					<button
						type="submit"
						disabled={emails.length === 0}
						className="bg-primary rounded-lg px-2 py-1 text-sm text-white w-full my-2 hover:opacity-80 cursor-pointer transition-opacity duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
						{isSendingInvite ? "Inviting..." : "Invite"}
					</button>
				</div>
			</form>
		</div>
	);
}
