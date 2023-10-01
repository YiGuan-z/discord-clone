import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";

export async function DELETE(
	req: Request,
	{ params }: { params: { memberId: string } }
) {
	try {
		const profile = await currentProfile();
		const { searchParams } = new URL( req.url )
		const serverId = searchParams.get( "serverId" );
		
		if ( !profile ) {
			return new NextResponse( "Unauthorized", { status: 401 } )
		}
		
		if ( !params.memberId ) {
			return new NextResponse( "Member ID missing", { status: 400 } )
		}
		
		if ( !serverId ) {
			return new NextResponse( "Server ID missing", { status: 400 } )
		}
		const server = await db.server.update({
			where:{
				id:serverId,
				profileId:profile.id
			},
			data:{
				members:{
					deleteMany:{
						id:params.memberId,
						profileId:{
							not:profile.id
						}
					}
				}
			},
			include:{
				members:{
					include: {
						profile:true
					},
					orderBy: {
						role:"asc"
					}
				}
			}
		});
		return NextResponse.json(server)
	}catch ( e ){
		console.error("[MEMBER]_ID_DELETE",e)
		return new NextResponse("Internal Error",{status:500})
	}
	
	
}

export async function PATCH(
	req: Request,
	{ params }: { params: { memberId: string } }
) {
	//Only the owner can give it to the admin
	
	//admin can be set guest and moderator
	try {
		const profile = await currentProfile()
		const { searchParams } = new URL( req.url )
		const { role } = await req.json()
		const serverId = searchParams.get( "serverId" )
		
		if ( !profile ) {
			return new NextResponse( "Unauthorized", { status: 401 } )
		}
		
		if ( !serverId ) {
			return new NextResponse( "Server ID missing", { status: 400 } )
		}
		
		if ( !params.memberId ) {
			return new NextResponse( "Member ID missing", { status: 400 } )
		}
		
		const currentServerProfile = await db.member.findFirst( {
			where: {
				profileId: profile.id,
				serverId: serverId
			}
		} )
		
		if ( currentServerProfile === null ) {
			return new NextResponse( "Unauthorized", { status: 401 } )
		}
		//Cannot be Guest and Moderator
		if ( currentServerProfile.role !== MemberRole.GUEST && currentServerProfile.role !== MemberRole.MODERATOR ) {
			//if the request requires a change to the admin role,then well we need owner role
			if ( role === MemberRole.ADMIN ) {
				const server = await db.server.findUnique( {
					where: {
						id: serverId,
						profileId: profile.id
					}
				} )
				if ( !server ) {
					return new NextResponse( "Unauthorized because not owner", { status: 401 } )
				}
			}
			if ( profile.id === currentServerProfile.profileId ) {
				//owner
				// return new NextResponse("Can't be change yourself", {status: 401})
				const server = await changeRole( {
					memberId: params.memberId,
					serverId,
					id: profile.id,
					role
				} );
				return NextResponse.json( server )
			} else {
				//other...
				if ( role === MemberRole.ADMIN ) {
					//admin
					const server = await changeRole( {
						memberId: params.memberId,
						serverId,
						id: profile.id,
						role
					} );
					return NextResponse.json( server )
				}
			}
		} else {
			return new NextResponse( "Unauthorized", { status: 401 } )
		}
		
	} catch ( e ) {
		console.error( "[MEMBERS_ID_PATCH]", e )
		return new NextResponse( "Internal Error", { status: 500 } )
	}
}

async function changeRole( { memberId, serverId, id, role }: {
	memberId: string,
	serverId: string,
	id: string,
	role: MemberRole
} ) {
	return db.server.update( {
		where: {
			id: serverId,
		},
		data: {
			members: {
				update: {
					where: {
						id: memberId,
						profileId: {
							//不能更改自己
							not: id
						}
					},
					data: {
						role
					}
				}
			}
		},
		include: {
			members: {
				include: {
					profile: true
				},
				orderBy: {
					role: "asc"
				}
			}
		}
	} );
}