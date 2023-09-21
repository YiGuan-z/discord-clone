"use client"

import {useEffect, useState} from "react";
import {useAlert} from "@/hooks/use-alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

export const AlertProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, []);

    if (!isMounted) return null

    return (
        <>
            <Alert/>
        </>
    )
}

const Alert = () => {
    const {isOpen, onClose, settings} = useAlert()

    if (!settings){
        return null
    }

    const {
        title,
        message,
        okButtonText,
        cancelButtonText,
        onOk,
        onCancel
    } = settings

    const handleClose = () => {
        if (onCancel) onCancel()
        onClose()
    }

    const handleOk =() =>{
        if (onOk) onOk()
        onClose()
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="dark:bg-[#f5f6f4] text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <Button variant="primary" onClick={handleOk}>
                        {okButtonText}
                    </Button>
                    {onCancel&&
                        <Button variant="cancel" onClick={handleClose}>
                            {cancelButtonText}
                        </Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}