import { prisma } from "../../../config";

const profileHandler = async (req, res) => {
   const { auth0AccountId } = req.query;

   console.log("auth0", auth0AccountId);

   try {
      const profile = await prisma.players.findFirst({ where: { auth0AccountId } });

      return res.status(200).json(profile);
   } catch (error) {
      console.log("error", error);
      return res.status(400).json(error);
   }
};

export default profileHandler;
