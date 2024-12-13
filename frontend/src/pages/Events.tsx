import { useRecoilValue } from "recoil";
import Eventbody from "../components/ui/Eventbody";
import EventNavbar from "../components/ui/EventNavbar";
import { authSelector } from "../recoil/atom";
import AlertFunction from "../components/ui/alert";
import Loading from "../components/ui/loading";

export default function Events() {
  const user = useRecoilValue(authSelector);
  console.log(user, "pawan is here");

  if (!user) {
    console.log("alsmost insidfe");
    return (
      <div className=" flex flex-col justify-center items-center space-y-8  rounded-xl max-w-xl mx-auto mt-60">
        <AlertFunction />
        <Loading />
      </div>
    );
  }
  return (
    <div className="">
      <EventNavbar />
      <Eventbody />
    </div>
  );
}
