import { FcGoogle } from "react-icons/fc"
import Button from "../ui/Button"

interface SigninWithGoogleProps {
  className?: string
}

const SigninWithGoogle = ({ className }: SigninWithGoogleProps) => {
  return (
    <Button variant="outline" className={`${className} gap-x-2`}>
      <FcGoogle size={20} /> Continue With Google
    </Button>
  )
}
export default SigninWithGoogle
