import Link from "next/link";

const Navbar = () => {
   return (
      <nav>
         <ul>
            <li>
               <Link href="/team">
                  <a>Team</a>
               </Link>
            </li>
            <li>
               <Link href="/schedule">
                  <a>Schedule</a>
               </Link>
            </li>
            <li>
               <Link href="/stats">
                  <a>Stats</a>
               </Link>
            </li>
            <li>
               <Link href="/news">
                  <a>News</a>
               </Link>
            </li>
            <li>
               <Link href="/standings">
                  <a>Standings</a>
               </Link>
            </li>
            <li>
               <Link href="/shop">
                  <a>Shop</a>
               </Link>
            </li>
         </ul>
      </nav>
   );
};

export default Navbar;
