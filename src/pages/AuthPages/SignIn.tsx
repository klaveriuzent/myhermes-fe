import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Hermes AI | Login"
        description="Login to manage Hermes AI agents and workflows."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
