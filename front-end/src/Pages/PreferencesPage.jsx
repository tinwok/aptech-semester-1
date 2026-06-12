import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function PreferencesPage() {
  const { user } = useAuth();

  const preferences = user?.customer?.preferences;
  const allergies = user?.customer?.allergies;

  if (!user) {
    return <div className="p-8 text-[#8A6A35]">Please sign in first.</div>;
  }

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
          <Heart className="h-10 w-10 text-[#B89555]" />

          <h1 className="mt-4 text-3xl font-bold text-[#2B2115]">
            Preferences
          </h1>

          <p className="mt-2 text-[#7B684A]">
            View your saved preferences and allergy notes.
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#2B2115]">
              Saved Preferences
            </h2>

            <p className="mt-4 whitespace-pre-line text-[#7B684A]">
              {preferences || "No preferences saved yet."}
            </p>
          </div>

          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#2B2115]">Allergies</h2>

            <p className="mt-4 whitespace-pre-line text-[#7B684A]">
              {allergies || "No allergies saved yet."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PreferencesPage;
