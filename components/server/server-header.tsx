"use client"

import {MemberRole} from "@prisma/client";
import {ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ServerWithMemberWithProfiles} from "@/types";
import {cn, TODO} from "@/lib/utils";
import {useModal} from "@/hooks/use-modal-store";
import {useAlert} from "@/hooks/use-alert";

interface ServerHeaderProps {
    server: ServerWithMemberWithProfiles
    role?: MemberRole
}

export const ServerHeader = ({server, role}: ServerHeaderProps) => {
    const {onOpen} = useModal()
    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none" asChild>
                    <button className={cn(
                        "w-full text-md font-semibold px-3 flex items-center h-12",
                        "border-neutral-200 dark:border-neutral-800 border-b-2",
                        "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                    )}>
                        {server.name}
                        <ChevronDown className="h-5 w-5 ml-auto"/>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
                >
                    {isModerator && (
                        <DropdownMenuItem
                            className={cn(
                                "text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                            )}
                            onClick={() => {
                                onOpen("invite", {server})
                            }}
                        >
                            Invite People
                            <UserPlus className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )}

                    {isAdmin && (
                        <DropdownMenuItem
                            className="px-3 py-2 text-sm cursor-pointer"
                            onClick={() => {
                                onOpen("editServer", {server})
                            }}
                        >
                            Server setting
                            <Settings className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )}

                    {isAdmin && (
                        <DropdownMenuItem
                            className="px-3 py-2 text-sm cursor-pointer"
                            onClick={() => {
                                onOpen("members",{server})
                            }}
                        >
                            Manage members
                            <Users className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )}

                    {isModerator && (
                        <DropdownMenuItem
                            className="px-3 py-2 text-sm cursor-pointer"
                            onClick={() => {
                                TODO("Create Channel")
                            }}
                        >
                            Create Channel
                            <PlusCircle className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )}

                    {isModerator && (
                        <DropdownMenuSeparator/>
                    )}

                    {isAdmin && (
                        <DropdownMenuItem
                            className="px-3 py-2 text-sm cursor-pointer text-rose-700"
                            onClick={() => {
                                TODO("Delete Server")
                            }}
                        >
                            Delete Server
                            <Trash className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )}

                    {!isAdmin && (
                        <DropdownMenuItem
                            className="px-3 py-2 text-sm cursor-pointer text-rose-700"
                            onClick={() => {
                                TODO("Leave Server")
                            }}
                        >
                            Leave Server
                            <LogOut className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )}


                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
