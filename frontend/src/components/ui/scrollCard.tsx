export default function ScrollCard() {
  return (
    <div className="flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5  ">
      <img
        height="60px"
        width="60px"
        src="https://probo.in/_next/image?url=https%3A%2F%2Fgumlet-images-bucket.s3.ap-south-1.amazonaws.com%2Fprobo_product_images%2FIMAGE_f19f81af-fdf7-47da-b360-c990246b148f.png&w=128&q=75"
        alt=""
      />
      <div className="flex ">
        <img
          height="20px"
          width="20px"
          src="https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FBar_Chart.png&w=32&q=75"
          alt=""
        />{" "}
        <h1 className="text-xs text-[#545454] font-work-sans">
          123210 traders
        </h1>
      </div>

      <p className="mt-1 text-xs font-medium uppercase text-[#262626] font-work-sans">
        Centre to constitute the 8th pay commission?
      </p>
      <div className="flex justify-between mx-auto mt-7">
        <button
          type="button"
          className="text-white bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-100 dark:focus:ring-blue-300 font-medium rounded-md text-sm px-6 py-1 text-center me-2 mb-2"
        >
          Yes ₹ 2
        </button>

        <button
          type="button"
          className="text-white bg-gradient-to-r from-red-300 via-red-400 to-red-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-300 font-medium rounded-md text-sm px-6 py-2.5 text-center me-2 mb-2"
        >
          No ₹ 8
        </button>
      </div>
    </div>
  );
}
