"use client"

import {MemberRole} from "@prisma/client";
import {useCallback, useState} from "react";
import qs from "query-string"
import {
    Check,
    Crown,
    Gavel,
    Loader2,
    MoreVertical,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {useModal} from "@/hooks/use-modal-store";
import {ServerWithMemberWithProfiles} from "@/types";
import {ScrollArea} from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";
import {useRouter} from "next/navigation";

const roleIconMap = {
    ADMIN: <Crown className="h-4 w-4 ml-2 text-[#ef9c40]"/>,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    GUEST: <ShieldAlert className="h-4 w-4 text-rose-500"/>
}

export const MembersModal = () => {
    const router = useRouter()
    const {onOpen, isOpen, onClose, type, data} = useModal()
    const [loadingId, setLoadingId] = useState("")

    const isModalOpen = isOpen && type === "members"

    const {server} = data as { server: ServerWithMemberWithProfiles }

    const onKick = useCallback(async (memberId: string) => {
        try {
            setLoadingId(memberId)
            const url = qs.stringifyUrl({
                url:`/api/members/${memberId}`,
                query:{
                    serverId:server?.id,
                }
            })

            const response = await fetch(url,{method:"DELETE"})

            router.refresh()
            onOpen("members",{server:await response.json()})
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingId("")
        }
    }, [])

    const onRoleChange = useCallback(async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId)
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server.id,
                }
            })

            const response = await fetch(url, {
                method: "PATCH",
                body: JSON.stringify({role}),
            })
            router.refresh()
            onOpen("members", {server: await response.json()})
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingId("")
        }
    }, [])

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
                                            <p className="ml-2">
                                                {member.profileId === server.profileId && "Owner"}
                                            </p>
                                        </div>
                                        <p className="text-xs text-zinc-500">
                                            {member.profile.email}
                                        </p>
                                    </div>
                                    {server.profileId !== member.profile.id && loadingId != member.id && (
                                            <div className="ml-auto">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <MoreVertical className="h-4 w-4 text-zinc-500"/>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent side="left">
                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger
                                                                    className="flex items-center"
                                                            >
                                                                <ShieldQuestion
                                                                        className="w-4 h-4 mr-2"
                                                                />
                                                                <span>Role</span>
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuPortal>
                                                                <DropdownMenuSubContent>
                                                                    <DropdownMenuItem
                                                                            disabled={member.role === MemberRole.GUEST}
                                                                            onClick={() => onRoleChange(member.id, "GUEST")}>
                                                                        <Shield className="h-4 w-4 mr-2"/>
                                                                        Guest
                                                                        {member.role === MemberRole.GUEST && (
                                                                                <Check
                                                                                        className="h-4 w-4 ml-auto"
                                                                                />
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                            disabled={member.role === MemberRole.MODERATOR}
                                                                            onClick={() => onRoleChange(member.id, "MODERATOR")}>
                                                                        <ShieldCheck className="h-4 w-4 mr-2"/>
                                                                        Moderator
                                                                        {member.role === MemberRole.MODERATOR && (
                                                                                <Check
                                                                                        className="h-4 w-4 ml-auto"
                                                                                />
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                            disabled={member.role === MemberRole.ADMIN}
                                                                            onClick={() => onRoleChange(member.id, "ADMIN")}>
                                                                        <Crown className="h-4 w-4 mr-2"/>
                                                                        Admin
                                                                        {member.role === MemberRole.ADMIN && (
                                                                                <Check
                                                                                        className="h-4 w-4 ml-auto"
                                                                                />
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuPortal>
                                                        </DropdownMenuSub>
                                                        <DropdownMenuSeparator/>
                                                        <DropdownMenuItem onClick={()=>onKick(member.id)}>
                                                            <Gavel className="w-4 h-4 mr-2"/>
                                                            Kick
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                    )}
                                    {loadingId === member.id && (
                                            <Loader2
                                                    className="animate-spin text-zinc-500 ml-auto w-4 h-4"
                                            />

                                    )}
                                </div>
                        ))}

                    </ScrollArea>

                </DialogContent>
            </Dialog>
    )
}