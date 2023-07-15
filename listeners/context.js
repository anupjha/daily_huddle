
// export const addTimezoneContext = async ({ body, context, next }) => {
//   const user = (await app.client.users.info({
//     token: context.botToken,
//     user: body.user_id || body.user.id,
//     include_locale: true,
//   }));

//   context.tz_offset = user.user.tz_offset;
//   await next();
// };
