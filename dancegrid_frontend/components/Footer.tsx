import Link from "next/link";
const Footer = () => {
  return (
    <footer className="bg-accent text-white p-2 text-sm flex flex-row items-center justify-between relative bottom-0 w-full">
      <p>Built and maintained by Aischa.</p>
      <p>
        Did something go wrong?
        <Link href="mailto:aischa.amrhein@gmail.com"> Contact me!</Link>
      </p>
      <p> DanceGrid &copy; 2026 </p>
    </footer>
  );
};

export default Footer;
