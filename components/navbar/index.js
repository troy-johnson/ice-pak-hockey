import Link from "next/link";

const Navbar = () => {
   return (
      <nav>
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
               <Link href="/players">
                  <a>Roster</a>
               </Link>
            </li>
            <li>
               <Link href="/games">
                  <a>Games</a>
               </Link>
            </li>
            <li>
               <Link href="/seasons">
                  <a>Seasons</a>
               </Link>
            </li>
         </ul>
      </nav>
   );
};

export default Navbar;
