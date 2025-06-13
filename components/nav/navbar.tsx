import { neuFontBlackItalic } from "@/lib/font";
import Link from "next/link";
import NavbarAuth from "@/components/nav/nav-auth-buttons";
import NavLinks from "@/components/nav/nav-links";
import { getSession } from "@/lib/auth/auth";
import { getProfileImage } from "@/actions/profile-actions";

export async function Navbar() {
  const session = await getSession();
  const profile = await getProfileImage(session?.user?.id as string);

  return (
    <nav className="w-full h-16 items-center justify-between px-8 py-4 flex border-b">
      <div>
        <Link href="/">
          <h1
            className={`${neuFontBlackItalic.className} text-xl sm:text-2xl md:text-3xl`}
          >
            FlavourFul Recipes
          </h1>
        </Link>
      </div>
      <NavLinks />
      <NavbarAuth image={profile?.image} />
    </nav>
  );
}
