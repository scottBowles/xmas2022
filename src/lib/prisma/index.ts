import prisma from './prismaClient';
import { challenge, Challenge } from './models/challenge';
import { challengeResponse, ChallengeResponse } from './models/challengeResponse';
import { challengeSetResponse, ChallengeSetResponse } from './models/challengeSetResponse';
import { option, Option } from './models/option';
import { user, User, jwtUserFactory } from './models/user';

/**
 * Models
 *
 * After retrieving an object from the database, we can use these to create a class that has
 * the same properties as the object, but can also have custom methods and properties.
 * Unfortunately, this is not possible to do in `schema.prisma`, so we have to do it manually,
 * by creating these classes and using them as below:
 *    ```
 *    const dbUser = await prisma.user.findUnique({ where: { id: 1 } });
 *    const user = new User(dbUser);
 *    ```
 * Tbh I'm not thrilled with this solution, so if you have other ideas by all means say so.
 */
export { Challenge, ChallengeResponse, ChallengeSetResponse, Option, User, jwtUserFactory };

/**
 * Extended Prisma Client
 *
 * This is the Prisma Client but with custom methods added. Typically, we'll import the prisma
 * client directly from this file, which will work as in the prisma docs, but with any custom
 * methods we add. These are basically equivalent to Django querysets. So we can do
 *    ```
 *    import prisma from '$lib/prisma';
 *    const users = await prisma.user.findMany();
 *    ```
 * as normal. But we could also add, for example, a custom `findCreatedToday` method to the user
 * client and use it like this:
 *    ```
 *    import prisma from '$lib/prisma';
 *    const users = await prisma.user.findCreatedToday();
 *    ```
 */
const client = {
	...prisma,
	challenge,
	challengeResponse,
	challengeSetResponse,
	option,
	user
};

export default client;
