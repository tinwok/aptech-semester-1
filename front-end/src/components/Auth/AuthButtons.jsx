import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";
import UserDropdown from "./UserDropdown";
import NotificationBell from "@/components/NotificationBell";

function AuthButtons() {
  const { user, isAuthenticated, isLoadingUser } = useAuth();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  if (isLoadingUser) {
    return (
      <Button disabled className="bg-[#C2A26A] text-white">
        Loading...
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <NotificationBell />
        <UserDropdown />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setIsLoginOpen(true)}
          className="bg-[#C2A26A] text-white hover:bg-[#9B7A3F]"
        >
          Sign In / Sign Up
        </Button>
      </div>

      <LoginDialog
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterDialog
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onOpenLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
}

export default AuthButtons;
