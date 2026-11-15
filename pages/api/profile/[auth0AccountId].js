import { prisma } from "../../../config";
import { getApiUser, isStaff } from "../../../utils/apiAuth";

const profileHandler = async (req, res) => {
   const { auth0AccountId } = req.query;

   try {
      const user = await getApiUser(req);

      if (!user || (user.sub !== auth0AccountId && !isStaff(user))) {
         return res.status(200).json(null);
      }

      const profile = await prisma.players.findFirst({ where: { auth0AccountId } });

      return res.status(200).json(profile);
   } catch (error) {
      console.log("error", error);
      return res.status(400).json(error);
   }
};

export default profileHandler;
