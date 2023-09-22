"use client"

import {CreateServerModal} from "@/components/modules/create-server-modal";
import {useEffect, useState} from "react";
import {InviteModal} from "@/components/modules/invite-modal";
import {EditServerModal} from "@/components/modules/edit-server-modal";
import {MembersModal} from "@/components/modules/members-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <>
            <CreateServerModal/>
            <InviteModal/>
            <EditServerModal/>
            <MembersModal/>
        </>
    )
}