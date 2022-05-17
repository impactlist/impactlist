import { loginHandler } from "@storyofams/next-password-protect";

export default loginHandler(process.env.ENTRYPOINT_PASSWORD as string);
