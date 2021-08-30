import Link from "next/link";

const Navbar = () => {
   return (
      <ul>
         <li>
            <Link href="/">
               <a>Home</a>
            </Link>
         </li>
         <li>
            <Link href="/profile">
               <a>Profile</a>
            </Link>
         </li>
         <li>
            <Link href="/roster">
               <a>Roster</a>
            </Link>
         </li>
         <li>
            <Link href="/schedule">
               <a>Schedule</a>
            </Link>
         </li>
      </ul>
   );
};

export default Navbar;
