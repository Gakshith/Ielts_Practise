import { ProfileForm } from "./ProfileForm";

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl font-bold">Your profile</h1>
      <p className="mt-3 text-lg text-text-muted">
        Everything here lives in this browser. Nothing is uploaded anywhere.
      </p>
      <ProfileForm />
    </div>
  );
}
