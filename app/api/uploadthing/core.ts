import {auth} from "@clerk/nextjs";
import {createUploadthing, type FileRouter} from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
    const {userId} = auth()
    if (!userId) {
        throw new Error("You must be logged in to upload files")
    }
    return {userId}
}


export const ourFileRouter = {
    //服务器头像
    serverImage: f({
        image: {maxFileSize: "4MB", maxFileCount: 1}
    })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {
        }),
    //聊天内容
    messageFile: f(["image", "pdf","video","audio"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;