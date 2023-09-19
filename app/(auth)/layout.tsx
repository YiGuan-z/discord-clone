const AuthLayout = ({children}:{children:React.ReactNode}) => {
    return ( 
        <div className="bg-[#f5f5f5] h-full flex items-center justify-center">
        {children}
        </div>
     );
}
 
export default AuthLayout;