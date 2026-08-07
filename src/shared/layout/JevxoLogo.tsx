import Image from "next/image";
import logo from "../../../assets/logo0bg.png";

const JevxoLogo = () => {
  return (
    <div className="w-30 md:w-40 lg:w-50">
      <Image src={logo} alt="Jevxo icon" />
    </div>
  );
};
export default JevxoLogo;
