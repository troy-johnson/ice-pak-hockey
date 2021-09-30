import Link from "next/link";
import { useGetSeasons } from "../../utils";

const Seasons = () => {
   const { seasons, seasonsLoading, seasonsError } = useGetSeasons();

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
