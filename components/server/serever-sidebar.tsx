import {redirect} from "next/navigation";
import {ChannelType} from "@prisma/client";

import {db} from "@/lib/db";
import {currentProfile} from "@/lib/current-profile";
import {ServerHeader} from "@/components/server/server-header";

interface ServerSidebarProps {
    serverId: string
}


const ServerSidebar = async ({serverId}: ServerSidebarProps) => {
    const profile = await currentProfile()

    if (profile == null) {
        return redirect("/")
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }

            }
        },
    })


    const textChannel = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)

    const audioChannel = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)

    const videoChannel = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)

    const members = server?.members.filter((member) => member.profileId !== profile.id)

    if (!server) {
        return redirect("/")
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-white">
            Server Sidebar Component by:
            {serverId}
            <ServerHeader
                server={server}
                role={role}
            />
        </div>
    )
}

export default ServerSidebar