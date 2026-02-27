import useWorkspaces from "../features/workspaces/hooks/useWorkspaces"

export default function WorkspacesPage() {

  const { isPending, data, isError, error } = useWorkspaces()
  //  console.log(data)
  return (
    <div className="w-full">
      {
        data && (
          data.map((w) => (
            <li key={w.id}>{w.name}</li>
          ))
        )
      }
    </div>
  )
}
