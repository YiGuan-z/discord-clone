"use client"

import {useState} from "react";
import {Crown, LucideMail, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldX} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {useModal} from "@/hooks/use-modal-store";
import {ServerWithMemberWithProfiles} from "@/types";
import {ScrollArea} from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";

const roleIconMap = {
    ADMIN: <Crown className="h-4 w-4 ml-2 text-[#ef9c40]"/>,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    GUEST: <ShieldAlert className="h-4 w-4 text-rose-500"/>
}

export const MembersModal = () => {
    const {onOpen, isOpen, onClose, type, data} = useModal()
    const [loadingId, setLoadingId] = useState("")

    const isModalOpen = isOpen && type === "members"

    const {server} = data as { server: ServerWithMemberWithProfiles }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#f5f6f4] text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map((member) => (
                        <div className="flex items-center gap-x-2 mb-6 ml-5" key={member.id}>
                            <UserAvatar src={member.profile.imageUrl}/>
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !== member.profile.id && loadingId != member.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical/>
                                        </DropdownMenuTrigger>
                                    </DropdownMenu>
                                </div>
                            )}
                        </div>
                    ))}

                </ScrollArea>

            </DialogContent>
        </Dialog>
    )
}