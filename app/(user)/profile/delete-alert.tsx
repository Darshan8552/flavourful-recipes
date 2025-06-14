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
        <Button 
          variant="destructive" 
          className="bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white font-medium"
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900 dark:text-zinc-100">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 dark:text-zinc-400">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-zinc-100 hover:bg-gray-100 dark:hover:bg-neutral-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteAccount}
            className="bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}