import * as React from "react"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image";

const navigationItems = [
    {
        title: "POINT SOURCE",
        href: "/point-source",
    },
    {
        title: "WATER QUALITY",
        href: "/water-quality",
    },
    {
        title: "CONTACT",
        href: "/contact",
    }
]

const Navbar = () => {
    return (
        <header className="border-b bg-blue-400">
            <div className="container flex h-20 items-center justify-between">
                {/* Logo and Title */}
                <div className="flex items-center gap-3">
                    <Image
                        src="/IL_NRS_LOGO.png"
                        alt="Illinois Nutrient Loss Reduction Strategy Logo"
                        width={80}
                        height={80}
                        />
                    <h1 className="text-base font-normal tracking-wide text-black">
                        Illinois Nutrient Loss Reduction Strategy
                    </h1>
                </div>

                {/* Desktop Navigation */}
                <NavigationMenu className="hidden md:block">
                    <NavigationMenuList className="gap-8">
                        {navigationItems.map((item) => (
                            <NavigationMenuItem key={item.title}>
                                <NavigationMenuLink
                                    href={item.href}
                                    className={navigationMenuTriggerStyle() + " text-sm font-normal text-black hover:bg-transparent hover:text-black/70"}
                                >
                                    {item.title}
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Mobile Navigation */}
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <nav className="mt-6">
                            <ul className="grid gap-4">
                                {navigationItems.map((item) => (
                                    <li key={item.title}>
                                        <a
                                            href={item.href}
                                            className="block rounded-md p-3 text-sm text-black hover:bg-gray-100"
                                        >
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}

export default Navbar
