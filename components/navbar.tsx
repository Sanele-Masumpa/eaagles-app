'use client';

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons"; // Removed TwitterIcon and GithubIcon
import { SignInButton, SignedIn, SignedOut, UserButton, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from 'next/image';
import eagleSvg from '@/public/images/Eagle.png'; // Update with the correct path to your SVG file
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch('/api/get-user-role');
        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error('Failed to fetch user role', error);
        setRole(null);
      }
    }

    fetchUserRole();
  }, []);

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  const roleBasedOptions = (role: string | null) => {
    switch (role) {
      case 'INVESTOR':
        return (
          <>
            <NavbarMenuItem>
              <Link className="text-sm" color="foreground" href="/">
                Dashboard
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className="text-sm" color="foreground" href="/opportunities">
                Opportunities
              </Link>
            </NavbarMenuItem>
          </>
        );
      case 'ENTREPRENEUR':
        return (
          <>
            <NavbarMenuItem>
              <Link className="text-sm" color="foreground" href="/">
                Dashboard
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link className="text-sm" color="foreground" href="/pitches">
                Pitches
              </Link>
            </NavbarMenuItem>
          </>
        );
      default:
        return null;
    }
  };

  const commonLinks = (
    <>
      <NavbarMenuItem>
        <Link className="text-sm" color="foreground" href="/about">
          About
        </Link>
      </NavbarMenuItem>
      <NavbarMenuItem>
        <Link className="text-sm" color="foreground" href="/pricing">
          Pricing
        </Link>
      </NavbarMenuItem>
    </>
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      {/* Brand and Logo */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Link className="flex justify-start items-center gap-1" href="/">
            <Image 
              src={eagleSvg} 
              alt="Eagle Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8 invert-on-dark" 
            />
            <p className="font-bold text-2xl text-inherit">Eagles Ring</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden lg:flex basis-3/5" justify="center">
        <ul className="flex gap-3">
          <SignedIn>
            {roleBasedOptions(role)}
          </SignedIn>
          <SignedOut>
            {commonLinks}
          </SignedOut>
        </ul>
      </NavbarContent>

      {/* Desktop Actions */}
      <NavbarContent className="hidden lg:flex basis-1/5 justify-end">
        <NavbarItem className="flex gap-2 items-center">
          <ThemeSwitch />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <NavbarItem className="hidden lg:flex">
            {searchInput}
          </NavbarItem>
          <SignedIn>
            <SignOutButton>
              Log Out
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              Sign In
            </SignInButton>
          </SignedOut>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Navigation */}
      <NavbarContent className="sm:hidden flex basis-1/5 justify-end items-center">
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        <div className="p-4">
          <SignedIn>
            {roleBasedOptions(role)}
            <NavbarMenuItem>
              <SignOutButton>
                Log Out
              </SignOutButton>
            </NavbarMenuItem>
          </SignedIn>
          <SignedOut>
            {commonLinks}
            <NavbarMenuItem>
              <SignInButton>
                Sign In
              </SignInButton>
            </NavbarMenuItem>
          </SignedOut>
          <div className="mt-4">
            {searchInput}
          </div>
          <div className="mt-4">
            <ThemeSwitch />
          </div>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
