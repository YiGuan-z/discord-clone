"use client";

import {X} from "lucide-react"
import Image from "next/image"
import {UploadDropzone} from "@/lib/uploadthing";

interface FileUploadProps {
    onChange: (url?: string) => void
    value: string
    endpoint: "serverImage" | "messageFile"
}

export const FileUpload = ({
                               onChange,
                               value,
                               endpoint
                           }: FileUploadProps) => {
    const fileType = value?.split(".").pop()

    if (value && fileType !="pdf"){
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    sizes={"200px"}
                    src={value}
                    alt="uploaded file"
                    className="rounded-full"
                />
                <button
                    onClick={()=>onChange("")}
                    className="bg-rose-500 text-white p-1
                    rounded-full absolute top-0 right-0
                    shadow-sm
                    "
                    type="button"
                >
                    <X className="h-4 w-4"/>
                </button>
            </div>
        )
    }

    return (
            <UploadDropzone
                endpoint={endpoint}
                onClientUploadComplete={(res)=>{
                    onChange(res?.[0].url)
                }}
                onUploadError={(err)=>{
                    console.log(err)
                }}
            />
    )
}