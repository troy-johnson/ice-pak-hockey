import { getToken } from "next-auth/jwt";

const STAFF_ROLES = ["Admins", "Manager", "Assistant Manager"];
const WRITE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];
const PRIVATE_PLAYER_FIELDS = [
   "email",
   "preferredEmail",
   "phoneNumber",
   "preferredPhone",
   "auth0AccountId",
   "notifications",
   "gameDayNotifications",
];

export const getApiUser = (req) => getToken({ req, secret: process.env.NEXTAUTH_SECRET });

export const isStaff = (user) => STAFF_ROLES.some((role) => user?.groups?.includes(role));

export const isOwnPlayer = (user, player) =>
   !!user &&
   !!player &&
   ((!!player.auth0AccountId && player.auth0AccountId === user.sub) ||
      (!!player.email && player.email === user.email));

export const publicPlayer = (player) => {
   if (!player) return player;

   const result = { ...player };
   PRIVATE_PLAYER_FIELDS.forEach((field) => delete result[field]);

   return result;
};

export const playerForUser = (user, player) =>
   isStaff(user) || isOwnPlayer(user, player) ? player : publicPlayer(player);

// Pass `methods: null` to protect every method of a route.
const protect = (handler, allow, methods) => async (req, res) => {
   if (!methods || methods.includes(req.method)) {
      const user = await getApiUser(req);

      if (!user) return res.status(401).json({ message: "Sign in required." });
      if (!allow(user)) return res.status(403).json({ message: "Not allowed." });
   }

   return handler(req, res);
};

export const requireStaff = (handler, { methods = WRITE_METHODS } = {}) =>
   protect(handler, isStaff, methods);

export const requireSignIn = (handler, { methods = WRITE_METHODS } = {}) =>
   protect(handler, () => true, methods);
