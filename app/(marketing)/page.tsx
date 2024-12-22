
import HeroLanding from "@/components/sections/hero-landing";
import PreviewLanding from "@/components/sections/preview-landing";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export const revalidate = 5;

export default function IndexPage() {
  return (
    <>
      <MaxWidthWrapper className="min-h-screen relative" >
        <div className="home-header">
          <div className="header-slider flex items-center w-full">
            <div className="rightHeader  ">
              <h1 className="text-4xl">مؤسسة </h1>
              <p className="text-xl mt-5">مؤسسة لتقديم المساعدات للمحتاجين</p>
            </div>
            <div className=" leftHeader">
              <h1>صور إسلايدر</h1>
            </div>
          </div>
        </div>

      </MaxWidthWrapper>


      {/* <HeroLanding /> */}
      {/* <PreviewLanding /> */}
    </>
  );
}
