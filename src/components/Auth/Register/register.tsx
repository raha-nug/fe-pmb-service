import Link from "next/link";
import SignUp from "../SignUp";

export default function Register() {
  return (
    <>
      <div>
        <SignUp />
      </div>

      <div className="mt-6 text-center">
        <p>
          Sudah punya akun?{" "}
          <Link href="/auth/sign-in" className="text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
