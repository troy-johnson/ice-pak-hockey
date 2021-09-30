import Link from "next/link";
import { getSeasons } from "../../utils";

const Seasons = () => {
   const { seasons, seasonsLoading, seasonsError } = getSeasons();

   return (
      <>
         <h1>Seasons</h1>
         {seasons
            ? seasons.map((season) => {
                 return (
                    <Link key={season.id} href={`/seasons/${season.id}`} passHref>
                       <div>
                          {season?.leagueName + ' ' + season?.name}
                       </div>
                    </Link>
                 );
              })
            : null}
      </>
   );
};

export default Seasons;
