import { User } from "next-auth";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";

type Props = {
  user: User;
};

const UserAvatar = ({ user }: Props) => {
  return (
    <Avatar>
      {user.image ? (
        <div className="w-full h-full aspect-square">
          <Image src={user.image} alt="user profile" fill />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
