import { passwordCheckHandler } from "@storyofams/next-password-protect";

export default passwordCheckHandler(process.env.ENTRYPOINT_PASSWORD as string);
