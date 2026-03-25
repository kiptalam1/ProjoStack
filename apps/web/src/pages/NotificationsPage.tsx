import WsInviteCard from "../components/cards/WsInviteCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useGetWsInvites from "../features/invites/hooks/useGetWsInvites";

export default function NotificationsPage() {
  const {
    data: invites,
    isPending: isFetching,
    isError,
    error,
  } = useGetWsInvites();

  if (isError) {
    return (
      <p className="text-center text-gray-700 text-sm">
        {error.message ?? "Failed to load!"}
      </p>
    );
  }

  if (isFetching) {
    return (
      <div className="w-full h-full flex items-center">
        <LoadingSpinner />;
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <h2 className="text-2xl font-bold">Invites</h2>
      {!isFetching && invites?.length === 0 && (
        <p className="text-sm text-muted italic">No invites</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
        {invites &&
          invites.length > 0 &&
          invites.filter((i) => i.status === "PENDING"
            && new Date(i.expiresAt) > new Date())
            .map((i) => (
              <WsInviteCard key={i.id} i={i} />
            )
            )}
      </div>
    </div>
  );
}
