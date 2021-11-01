const SortTable = () => {
   return (
      <TableContainer>
         <Table aria-label="Team">
            <TableHead>
               <PlayerTableHeader>
                  <StatHeaderCell order={order} orderBy={orderBy} type="lastName">
                     Player
                  </StatHeaderCell>
                  <StatHeaderCell
                     order={order}
                     orderBy={orderBy}
                     type="gamesPlayed"
                     onClick={() => handleClick("gamesPlayed")}
                  >
                     GP
                  </StatHeaderCell>
                  <StatHeaderCell
                     order={order}
                     orderBy={orderBy}
                     type="goals"
                     onClick={() => handleClick("goals")}
                  >
                     {desktop ? "Goals" : "G"}
                  </StatHeaderCell>
                  <StatHeaderCell
                     order={order}
                     orderBy={orderBy}
                     type="assists"
                     onClick={() => handleClick("assists")}
                  >
                     {desktop ? "Assists" : "A"}
                  </StatHeaderCell>
                  <StatHeaderCell
                     order={order}
                     orderBy={orderBy}
                     type="points"
                     onClick={() => handleClick("points")}
                  >
                     {desktop ? "Points" : "P"}
                  </StatHeaderCell>
                  <StatHeaderCell
                     order={order}
                     orderBy={orderBy}
                     type="penaltyMinutes"
                     onClick={() => handleClick("penaltyMinutes")}
                  >
                     PIM
                  </StatHeaderCell>
               </PlayerTableHeader>
            </TableHead>
            <PlayerTableBody>
               {seasonStats?.stats
                  ?.sort((a, b) =>
                     order === "asc" ? a?.[orderBy] - b?.[orderBy] : b?.[orderBy] - a?.[orderBy]
                  )
                  ?.map((player) => (
                     <Link
                        href={`/player/${player.playerId}`}
                        key={player?.id || `${player?.firstName}${player?.lastName}`}
                        passHref
                     >
                        <TableRow>
                           <StatBodyCell component="th" scope="row">
                              <PlayerName>
                                 <Typography variant="caption">{` ${
                                    desktop
                                       ? `${player?.firstName} ${
                                            player?.nickname ? `"${player?.nickname}"` : ""
                                         } ${player?.lastName}`
                                       : `${player?.firstName.split("")[0]}. ${player?.lastName}`
                                 }`}</Typography>
                                 <Typography
                                    variant="caption"
                                    sx={{ marginLeft: "5px", color: "grey.main" }}
                                 >
                                    {player?.position}
                                 </Typography>
                              </PlayerName>
                           </StatBodyCell>
                           <StatBodyCell align="center">{player?.gamesPlayed}</StatBodyCell>
                           <StatBodyCell align="center">{player?.goals}</StatBodyCell>
                           <StatBodyCell align="center">{player?.assists}</StatBodyCell>
                           <StatBodyCell align="center">{player?.points}</StatBodyCell>
                           <StatBodyCell align="center">{player?.penaltyMinutes}</StatBodyCell>
                        </TableRow>
                     </Link>
                  ))}
            </PlayerTableBody>
         </Table>
      </TableContainer>
   );
};

export default SortTable;
