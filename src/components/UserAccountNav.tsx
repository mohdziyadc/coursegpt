"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Avatar } from "./ui/avatar";
import UserAvatar from "./UserAvatar";

type Props = {
  user: User;
};
const UserAccountNav = ({ user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1">
            {user.name && <p className="font-medium truncate">{user.name}</p>}
            {user.email && (
              <p className="text-sm truncate text-secondary-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            signOut();
          }}
          className="text-red-600 cursor-pointer"
        >
          Sign out <LogOut className="w-4 h-4 ml-2" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
