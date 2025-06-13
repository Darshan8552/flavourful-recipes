import { deleteAccount } from "@/actions/profile-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/providers/auth-provider"

export function DeleteAlertDialog() {
    const { session } = useAuth()

    const handleDeleteAccount = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await deleteAccount(session?.user.id as string)
            console.log(response)
        } catch (error) {
            console.error("error while deleting account", error)
        }
    }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="customeDelete">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteAccount}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
