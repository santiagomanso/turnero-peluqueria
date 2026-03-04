import { Container } from "@/components/ui/container";
import Navbar from "@/components/navbar";
import LoginForm from "./_components/login-form";

export default function AdminLoginPage() {
  return (
    <Container.wrapper>
      <Container.content className="max-w-2xl">
        <div className="flex flex-col h-full">
          <Navbar title="Admin" />
          <div className="flex-1 min-h-0 mt-3">
            <LoginForm />
          </div>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
