import { createUser } from "../controllers/userController";
import { queueRequest } from "../interface/request";

export const processRequests = async (request: any) => {
  console.log("im outside");
  console.log(request);
  console.log(request.payload);

  console.log(request.method);

  if (!request.method) {
    console.log("nothing inside");
  }

  if (request.method === "createUser") {
    console.log("im inside");

    await createUser(request.payload);
  }
};
