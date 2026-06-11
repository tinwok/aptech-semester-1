import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";
import UserDropdown from "./UserDropdown";

function AuthButtons() {
  const { user, isAuthenticated, isLoadingUser } = useAuth();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  if (isLoadingUser) {
    return (
      <Button disabled className="bg-[#C2A26A] text-white hover:bg-[#C2A26A]">
        Đang tải...
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return <UserDropdown />;
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setIsLoginOpen(true)}
          className="border-[#C2A26A] text-[#9B7A3F] hover:bg-[#FFF7E6]"
        >
          Đăng nhập
        </Button>

        <Button
          onClick={() => setIsRegisterOpen(true)}
          className="bg-[#C2A26A] text-white hover:bg-[#9B7A3F]"
        >
          Đăng ký
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
