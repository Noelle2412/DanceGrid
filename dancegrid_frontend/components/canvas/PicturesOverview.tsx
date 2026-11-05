"use client";
import usePictures from "@/stores/usePictures";

const PicturesOverview = () => {
  const { pictures, addPicture } = usePictures();
  return (
    <div>
      <button
        className="bg-accent text-white p-2 rounded cursor-pointer"
        onClick={() => {
          addPicture([]);
        }}>
        Add Picture
      </button>
      <p>Here I want to display an overview of all pictures</p>
      <p>
        A user should be able to reorder the pictures and scroll through them,
        upon clicking on a picture, the editor for said picture should open.
      </p>
    </div>
  );
};

export default PicturesOverview;
