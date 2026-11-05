"use client";
import ChoreoSettings from "@/components/canvas/ChoreoSettings";
import usePictures from "@/stores/usePictures";
import PicturesOverview from "@/components/canvas/PicturesOverview";
import Picture from "../../components/canvas/Picture";

const NewChoreoPage = () => {
  const { pictures } = usePictures();
  return (
    <div>
      <ChoreoSettings />
      <PicturesOverview />
      {pictures.length > 0 && <Picture />}
    </div>
  );
};

export default NewChoreoPage;
