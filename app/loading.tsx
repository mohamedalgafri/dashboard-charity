import { BeatLoader } from "react-spinners"


const loading = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <BeatLoader color="#8b5cf6" />
    </div>
  )
}

export default loading
