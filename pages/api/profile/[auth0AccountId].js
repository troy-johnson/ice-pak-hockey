import { prisma } from "../../../config";

const profileHandler = async (req, res) => {
   const { auth0AccountId } = req.query;

   try {
      const profile = prisma.players.findUnique({ where: { auth0AccountId } });

      return res.status(200).json(profile);
   } catch (error) {
      return res.status(400).json(error);
   }
};

export default profileHandler;
