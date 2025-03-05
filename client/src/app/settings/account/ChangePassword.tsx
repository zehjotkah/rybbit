import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { authClient } from "../../../lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";

export function ChangePassword() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit =
    currentPassword && newPassword && confirmPassword && passwordsMatch;

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!passwordsMatch) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authClient.changePassword({
        currentPassword,
        newPassword,
      });

      if (response.error) {
        toast.error(`Error: ${response.error.message}`);
        return;
      }

      toast.success("Password changed successfully");
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <KeyRound className="h-4 w-4 mr-2" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Update your password to keep your account secure
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              placeholder="Your current password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="Your new password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm your new password"
            />
            {!passwordsMatch && confirmPassword && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            variant="accent"
          >
            {isSubmitting ? "Changing..." : "Change Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
