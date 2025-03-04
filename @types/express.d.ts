// import { Request } from 'express';

// declare global {
//   namespace Express {
//     interface Request {
//       user: any;
//       deviceToken: any;
//       file: any;
//     }
//   }
// }

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      file: Express.Multer.File;
      user: any;
    }
  }
}
