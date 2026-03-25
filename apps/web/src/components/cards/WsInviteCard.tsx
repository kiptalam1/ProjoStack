import type { InviteTypes } from "../../features/invites/api/invites.types";
import { useAcceptWsInvite } from "../../features/invites/hooks/useAcceptWsInvite";
import { useDeclineWsInvite } from "../../features/invites/hooks/useDeclineWsInvite";

export default function WsInviteCard({ i }: { i: InviteTypes }) {

  const { mutate: acceptInvite, isPending: isAccepting } = useAcceptWsInvite();
  const { mutate: rejectInvite, isPending: isRejecting } = useDeclineWsInvite();


  const statusStyles = {
    PENDING: "text-yellow-500",
    ACCEPTED: "text-green-500",
    DECLINED: "text-red-500",
  };

  // accept ws-invite;
  function handleAcceptInvite(token: string) {
    acceptInvite(token)
  }

  // reject ws-invite;
  function handleDeclineInvite(token: string) {
    rejectInvite(token);
  }




  return (
    <div
      className="bg-card rounded-lg p-4 flex flex-col gap-2 shadow-md">
      <div className="flex items-baseline gap-2 justify-between">
        <p className="text-muted text-xs">Workspace:</p>
        <h3 className="text-sm font-semibold wrap-anywhere">
          {i.workspace.name}
        </h3>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-muted text-xs">By:</span>
        <p className="text-xs wrap-anywhere break-all">
          {i.sentBy.username} - {i.sentBy.email}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted">On:</span>
        <p className="text-xs font-jetbrains break-after-all">
          {new Intl.DateTimeFormat("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(i.createdAt))}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted">Status:</span>
        <p className={`text-xs font-light ${statusStyles[i.status]}`}>
          {i.status}
        </p>
      </div>
      <div className="ml-auto space-x-5 mt-4">
        <button
          type="button"
          onClick={() => handleDeclineInvite(i.token)}
          className="bg-inherit border border-border rounded-lg px-2 py-1 text-sm font-light cursor-pointer hover:opacity-60 transition-opacity duration-150">
          {isRejecting ? "Declining..." : "Decline"}
        </button>
        <button
          type="button"
          onClick={() => handleAcceptInvite(i.token)}
          className="bg-primary text-white px-2 py-1 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-70 duration-150">
          {isAccepting ? "Accepting..." : "Accept"}
        </button>
      </div>
    </div>

  )
}
